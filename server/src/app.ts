import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import router from './routes';
import notFound from './middlewares/notFound';
import { globalErrorHandler } from './middlewares/globalErrorhandler';
import { Server } from 'socket.io';

export const app: Application = express();
app.use(express.json());
app.use(cors());

export const server = http.createServer(app);

// socket.io integration
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this to your Next.js frontend URL for security
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log('new user connected');

  socket.on("message", (data) => {
    console.log(data);
    // Broadcast the message to other users
    io.emit('message', data);
  });

  socket.on("disconnect", () => {
    console.log('user disconnected');
  });
});

app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('SERVER RUNNING!');
});

app.use(globalErrorHandler);
app.use(notFound);
