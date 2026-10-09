import express, { Express } from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';

export function createServer(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Root health endpoint
  app.use('/', healthRouter);

  // API router
  app.use('/api', apiRouter);

  // Global structured error handling
  app.use(errorHandler);

  return app;
}
