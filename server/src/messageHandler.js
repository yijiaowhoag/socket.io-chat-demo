const { InMemoryMessageStore } = require('./messageStore');
const messageStore = new InMemoryMessageStore();

module.exports = (io, socket) => {
  const createMessage = ({ to, content }) => {
    const message = { from: socket.userID, to, content };

    // Forward the private message to the right recipient
    // (and to other tabs of sender)
    socket.to(to).to(socket.userID).emit('message:new', message);
    messageStore.saveMessage(message);
  };

  const readMessages = (room, cb) => {
    const messages = messageStore.findMessagesForUser(room);

    return cb({ messages });
  };

  socket.on('message:new', createMessage);
  socket.on('message:list', readMessages);
};
