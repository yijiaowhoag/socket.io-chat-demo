const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const registerMessageHandlers = require('./messageHandler');

const app = express();

const httpServer = createServer(app);

const io = new Server();

app.use(express.static('public'));

const onConnection = (socket) => {
  console.log('User connected');

  registerMessageHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
};

io.on('connection', onConnection);

httpServer.listen(8080, () => {
  console.log('🚀 Server listening on port 8080');
});
