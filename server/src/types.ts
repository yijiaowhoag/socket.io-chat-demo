import { Server, Socket } from 'socket.io';
import { Handshake } from 'socket.io/dist/socket';

export interface User {
  userID: string;
  username: string;
  connected: boolean;
}

export interface ExistingUser extends User {
  messages: Array<Message>;
}

export interface Session extends User {
  sessionID: string;
}

export interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: number;
}

export interface SystemMessage {
  content: string;
  timestamp: number;
}

export interface ServerToClientEvents {
  session: ({
    sessionID,
    userID,
  }: {
    sessionID: string;
    userID: string;
  }) => void;
  users: (users: Array<User>) => void;
  'user:connected': (user: User) => void;
  'user:disconnected': (userID: string) => void;
  chat: (chat: Array<ExistingUser>) => void;
  'message:new': (message: Message) => void;
  'message:system': (message: SystemMessage) => void;
  typing: (typingUsers: string[]) => void;
}

export interface ClientToServerEvents {
  'user:join': (roomID: string) => void;
  'user:leave': (roomID: string) => void;
  'user:typing': (params: { room: string; isTyping: boolean }) => void;
  'message:new': (message: { to: string; content: string }) => void;
  'message:list': (room: string) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  sessionID: string;
  userID: string;
  username: string;
}
