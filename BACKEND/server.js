import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // ✅ add this
import cookieParser from 'cookie-parser'; // ✅ add this

import connectDB from './src/config/db.js';
import appRoutes from './src/app.js';
import initSocket from './src/socket/socketIo.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', 
    credentials: true,           
}    
});

connectDB();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,               
}));

app.use(cookieParser()); 
app.use(express.json());

app.use('/api', appRoutes);

initSocket(io);

// Optional error handler
// import { errorHandler } from './src/middleware/errorMiddleware.js';
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
