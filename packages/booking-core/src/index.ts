import { createServer } from './api/server';
import { config } from './config';
import { logger } from './utils/logger';

const app = createServer();

app.listen(config.PORT, config.HOST, () => {
  logger.info(`AlzerBooking Core operational on http://${config.HOST}:${config.PORT}`, {
    port: config.PORT,
    environment: config.NODE_ENV,
  });
});
