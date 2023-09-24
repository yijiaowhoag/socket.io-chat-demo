import { io, Socket } from 'socket.io-client';

// `autoConnect` is set to false so the connection is not established right away. We will manually call socket.connect() later, once the user has selected a username.

const socket: Socket = io(
  process.env.SOCKET_ENDPOINT || 'http://localhost:8080',
  {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
  }
);
export default socket;
