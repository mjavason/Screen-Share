import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import socketIo from 'socket.io';
import 'express-async-errors';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

//#region app setup
const app = express();
app.use(express.json()); // Middleware to parse JSON or URL-encoded data
app.use(express.urlencoded({ extended: true })); // For complex form data
app.use(cors());
dotenv.config({ path: './.env' });
//#endregion

//#region keys and configs
const PORT = process.env.PORT || 3000;
const baseURL = 'https://httpbin.org';
const httpServer = http.createServer(app);
const io = new socketIo.Server(httpServer, {
  cors: {
    origin: '*', // Replace with your frontend URL
    // methods: ['GET', 'POST'],
  },
  // options
});
let users: any = {};
//#endregion

io.on('connection', (socket: any) => {
  console.log('A user connected:', socket.id);

  // Store the connected user's ID
  socket.on('register', (userId: string | number) => {
    users[userId] = socket.id;
    socket.userId = userId;
    console.log('User registered:', userId);
  });

  // Handle signaling messages
  socket.on('signal', (data: { to: string | number }) => {
    console.log('Signal received', data);
    const recipientSocketId = users[data.to];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('signal', data);
      console.log(`Forwarded signal to: ${data.to}`);
    } else {
      console.log(`Recipient not found for: ${data.to}`);
    }
  });

  // Handle call decline
  socket.on('message', (data: { to: string | number }) => {
    console.log('Message to: ', socket.userId);
    const recipientSocketId = users[data.to];
    io.to(recipientSocketId).emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.userId);
    delete users[socket.userId];
  });

  // Catch-all event listener
  socket.onAny((event: any, ...args: any) => {
    console.log(`Received event: ${event}`, args);
  });

  // Handle call decline
  socket.on('message', (data: { to: string | number }) => {
    console.log('Message to: ', socket.userId);
    const recipientSocketId = users[data.to];
    io.to(recipientSocketId).emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.userId);
    delete users[socket.userId];
  });

  // Error handling
  socket.on('error', (error: any) => {
    console.error('Socket error:', error);
  });
});

//#region Server setup

// default message
app.get('/api', async (req: Request, res: Response) => {
  const result = await axios.get(baseURL);
  console.log(result.status);
  return res.send({
    message: 'Demo API called (httpbin.org)',
    data: result.status,
  });
});

//default message
app.get('/', (req: Request, res: Response) => {
  return res.send({ message: 'API is Live!' });
});

httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // throw Error('This is a sample error');

  console.log(`${'\x1b[31m'}${err.message}${'\x1b][0m]'}`);
  return res
    .status(500)
    .send({ success: false, status: 500, message: err.message });
});
//#endregion
