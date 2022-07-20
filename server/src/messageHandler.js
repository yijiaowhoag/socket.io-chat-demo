module.exports = (io, socket) => {
  const createMessage = (payload) => {
    console.log('createMessage:', payload);
  };

  const readMessage = (payload) => {
    console.log('readMessage:', payload);
  };

  socket.on('message:create', createMessage);
  socket.on('message:read', readMessage);
};
