import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { apiLimiter } from './middlewares/rateLimiters.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';

export function createApp() {
  const app = express();
  // Render terminates TLS in front of the app, so the client IP comes from the proxy header.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({
    origin: (origin, callback) => {
      // Requests without an Origin (health checks, curl) are not browser cross-origin calls.
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: false,
  }));
  app.use(express.json({ limit: '256kb' }));
  app.use('/api', apiLimiter);

  app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
