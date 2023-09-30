import { Server } from 'http';
import app from './app';
import subscribeToEvents from './app/events';
import config from './config';
import { errorlogger, logger } from './shared/logger';
import { RedisClient } from './shared/redis';

async function bootstrap() {
  try {
    await RedisClient.connect().then(() => {
      subscribeToEvents();
    });

    const server: Server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
          RedisClient.disconnect(); // Close the Redis connection
        });
      }
      process.exit(0);
    };

    const unexpectedErrorHandler = (error: unknown) => {
      errorlogger.error(error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      exitHandler();
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received');
      exitHandler();
    });
  } catch (error) {
    errorlogger.error(error);
    process.exit(1);
  }
}

bootstrap();
