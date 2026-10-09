import { Router } from 'express';
import { healthRouter } from './health';

export const apiRouter = Router();

// Mount Health check at /api/v1/health
apiRouter.use('/v1', healthRouter);
