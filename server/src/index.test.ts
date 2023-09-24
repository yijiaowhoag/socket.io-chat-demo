import { createServer, Server as HttpServer } from 'http';
import { Server, Socket as ServerSocket } from 'socket.io';
import { io as ioClient, Socket as ClientSocket } from 'socket.io-client';
import crypto from 'crypto';

describe('socket.io server events', () => {
  let httpServer: HttpServer;
  let httpServerAddr: any;
  let io: Server;
  let serverSocket: ServerSocket;
  let clientSocket: ClientSocket;

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    const listener = httpServer.listen(() => {
      httpServerAddr = listener.address();
      const port =
        typeof httpServerAddr === 'string'
          ? httpServerAddr
          : httpServerAddr?.port;

      clientSocket = ioClient(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should emit user details when user connects', (done) => {
    const randomId = () => crypto.randomBytes(8).toString('hex');
    const user = {
      userID: randomId(),
      username: 'Guin Gorskey',
      connected: true,
    };
    clientSocket.on('user:connected', ({ userID }) => {
      expect(userID).toBe(user.userID);
      done();
    });
    serverSocket.emit('user:connected', user);
  });
});
