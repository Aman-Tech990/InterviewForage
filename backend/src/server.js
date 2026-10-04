import { config } from './config/index.js';
import { createApp } from './app.js';
import { prisma } from './db/prisma.js';
import { logger } from './utils/logger.js';

const server = createApp().listen(config.port, () => logger.info(`API listening on port ${config.port}`));

async function shutdown(signal) {
  logger.info(`${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
