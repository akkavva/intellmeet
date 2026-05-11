const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a meeting room
    socket.on('join-meeting', (meetingId) => {
      socket.join(meetingId);
      console.log(`User ${socket.id} joined meeting ${meetingId}`);
      socket.to(meetingId).emit('user-joined', { socketId: socket.id });
    });

    // Leave a meeting room
    socket.on('leave-meeting', (meetingId) => {
      socket.leave(meetingId);
      console.log(`User ${socket.id} left meeting ${meetingId}`);
      socket.to(meetingId).emit('user-left', { socketId: socket.id });
    });

    // Handle chat messages
    socket.on('send-message', (data) => {
      io.to(data.meetingId).emit('receive-message', {
        message: data.message,
        sender: data.sender,
        timestamp: new Date()
      });
    });

    // WebRTC signaling
    socket.on('offer', (data) => {
      socket.to(data.meetingId).emit('offer', data);
    });

    socket.on('answer', (data) => {
      socket.to(data.meetingId).emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
      socket.to(data.meetingId).emit('ice-candidate', data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };