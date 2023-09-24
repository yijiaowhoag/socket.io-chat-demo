import { Socket as ClientSocket } from 'socket.io-client';

declare module 'socket.io-client' {
  export interface Socket extends ClientSocket {
    sessionID: string;
    userID: string;
    username: string;
  }
}

export interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: number;
}

export interface User {
  userID: string;
  username: string;
  connected: boolean;
}
