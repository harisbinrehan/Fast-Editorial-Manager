const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path'); // Add this line
const express = require('express'); // Add this line
const cors = require('cors');
const myEmitter = require('./utils/eventEmmiter');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
const app = require('./app');
app.use(cors({
  origin: 'http://localhost:3000', // Replace this with the origin of your frontend
  credentials: true,
}));

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});


// Start server
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connection successful');
  });

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  // console.log('User connected:', socket.id);
  // console.log('User ID:', userId);

  if (userId) {
    // Join the room with the user ID
    socket.join(userId);
    console.log('User joined room:', userId);
  }

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
myEmitter.on('notification', (notification, userId) => {
  // console.log('Emitting notification to user:', userId);
  io.to(userId).emit('notification', notification);
});
const port = process.env.PORT || 3000;
const server = http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
