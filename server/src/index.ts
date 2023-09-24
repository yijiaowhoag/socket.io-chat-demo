import express from 'express';
import { createServer, Server as HttpServer } from 'http';

import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  User,
} from './types';
import crypto from 'crypto';
const randomId = () => crypto.randomBytes(8).toString('hex');

import { InMemorySessionStore } from './sessionStore';
const sessionStore = new InMemorySessionStore();

import { registerMessageHandlers } from './messageHandler';

const app = express();
app.use(express.static('dist'));

const httpServer = createServer(app);

const startIO = async (httpServer: HttpServer) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  const pubClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });
  await pubClient.connect();
  const subClient = pubClient.duplicate();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      const session = sessionStore.findSession(sessionID);
      if (session) {
        socket.data.sessionID = sessionID;
        socket.data.userID = session.userID;
        socket.data.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error('Invalid username'));
    }
    socket.data.sessionID = randomId();
    socket.data.userID = randomId();
    socket.data.username = username;
    next();
  });

  io.on('connection', (socket) => {
    registerMessageHandlers(socket);

    // Persist session
    sessionStore.saveSession(socket.data.sessionID, {
      userID: socket.data.userID,
      username: socket.data.username,
      connected: true,
    });

    // Emit session details
    socket.emit('session', {
      sessionID: socket.data.sessionID,
      userID: socket.data.userID,
    });

    // Join the `userID` room
    socket.join(socket.data.userID);

    // Fetch existing users
    const users: Array<User> = [];
    sessionStore.findAllSessions().forEach((session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
      });
    });
    socket.emit('users', users);

    // Notify existing users
    socket.broadcast.emit('user:connected', {
      userID: socket.data.userID,
      username: socket.data.username,
      connected: true,
    });

    // Notify users upon disconnection
    socket.on('disconnect', async () => {
      socket.broadcast.emit('user:disconnected', socket.data.userID);
    });
  });

  return io;
};

startIO(httpServer);

/*  Parse command-line arguments to get the port
 *  process.argv[0]: The path to the Node.js executable
 *  process.argv[1]: The path to the JavaScript file that is being executed
 *  process.argv[2] and onwards: Any additional command-line arguments passed
 */
const args = process.argv.slice(2);
const portArgIndex = args.indexOf('--port');
const port =
  portArgIndex !== -1 ? args[portArgIndex + 1] : process.env.PORT || 8080;

httpServer.listen(port, () => {
  const address = httpServer.address();
  const port = typeof address === 'string' ? address : address?.port;
  console.log(`🚀 Server listening on port ${port}`);
});
