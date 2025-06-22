import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { dev, port } from './utils/helpers';
import authRoutes from "./routes/auth.routes"

import { OK, INTERNAL_SERVER_ERROR } from './utils/http-status';
import { connectDB } from './config/dataBase';
import { Router } from 'express';
import * as authController from './controllers/auth.controller';
import weatherRoutes from './routes/weather.routes';
import historyRoutes from './routes/history.routes';

const authRouter = Router();



const router = Router();


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/history', historyRoutes);



// Basic route
app.get('/', (req: Request, res: Response) => {
  res
    .status(OK)
    .json({ message: 'Weather - Welcome!' });
});

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.message);
  res
    .status(INTERNAL_SERVER_ERROR)
    .json({
      success: false,
      message: 'Something went wrong!',
      error: dev ? err.message : undefined
   
    });
    
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  });