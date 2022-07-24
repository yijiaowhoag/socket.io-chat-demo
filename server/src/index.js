const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const crypto = require('crypto');
const randomId = () => crypto.randomBytes(8).toString('hex');

const { InMemorySessionStore } = require('./sessionStore');
const sessionStore = new InMemorySessionStore();

const registerMessageHandlers = require('./messageHandler');

const app = express();
app.use(express.static('dist'));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

(async () => {
  const pubClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });
  await pubClient.connect();
  const subClient = pubClient.duplicate();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));
})();

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('Invalid username'));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

const onConnection = (socket) => {
  registerMessageHandlers(io, socket);

  // Persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // Emit session details
  socket.emit('session', {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // Join the `userID` room
  socket.join(socket.userID);

  // Fetch existing users
  const users = [];
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
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // Notify users upon disconnection
  socket.on('disconnect', async () => {
    socket.broadcast.emit('user:disconnected', socket.userID);
  });
};

io.on('connection', onConnection);

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
  console.log(`🚀 Server listening on port ${httpServer.address().port}`);
});
