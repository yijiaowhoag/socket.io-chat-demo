import type { Socket } from 'socket.io';
import { InMemoryMessageStore } from './messageStore';
const messageStore = new InMemoryMessageStore();

export const registerMessageHandlers = (socket: Socket) => {
  const createMessage = ({ to, content }: { to: string; content: string }) => {
    const message = {
      from: socket.data.userID,
      to,
      content,
      timestamp: Date.now(),
    };

    // Forward the private message to the right recipient
    // (and to other tabs of sender)
    socket.to(to).to(socket.data.userID).emit('message:new', message);
    console.log('message received', message);
    messageStore.saveMessage(message);
  };

  socket.on('message:new', createMessage);
};
