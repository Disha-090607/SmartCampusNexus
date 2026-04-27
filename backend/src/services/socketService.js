const { Server } = require('socket.io');
const Message = require('../models/Message');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {
    socket.on('join_room', (room) => {
      socket.join(room);
    });

    socket.on('send_message', async (payload) => {
      try {
        const saved = await Message.create(payload);
        io.to(payload.room).emit('receive_message', saved);
      } catch (error) {
        socket.emit('chat_error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      // Connection closed
    });
  });
};

const getIO = () => io;

module.exports = { initSocket, getIO };
