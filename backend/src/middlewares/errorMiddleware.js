import { ZodError } from 'zod';
import multer from 'multer';
import { config } from '../config/index.js';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `We could not find ${req.method} ${req.path}.`,
    error: { code: 'ROUTE_NOT_FOUND' },
  });
}

function describe(error) {
  if (error instanceof AppError) {
    return { status: error.statusCode, message: error.message, code: error.code, details: error.details };
  }

  if (error instanceof ZodError) {
    const fields = Object.fromEntries(
      error.issues.map((issue) => [issue.path.join('.') || 'request', issue.message]),
    );
    return { status: 422, message: 'Some fields need your attention.', code: 'VALIDATION_FAILED', details: fields };
  }

  if (error instanceof multer.MulterError) {
    const tooLarge = error.code === 'LIMIT_FILE_SIZE';
    return {
      status: tooLarge ? 413 : 400,
      message: tooLarge ? 'That file is larger than the allowed size.' : 'The upload could not be read. Check the file and try again.',
      code: 'UPLOAD_REJECTED',
    };
  }

  if (error?.name === 'PrismaClientKnownRequestError') {
    if (error.code === 'P2002') return { status: 409, message: 'That record already exists.', code: 'DUPLICATE' };
    if (error.code === 'P2025') return { status: 404, message: 'We could not find that record.', code: 'NOT_FOUND' };
  }

  if (error?.type === 'entity.parse.failed') {
    return { status: 400, message: 'The request body is not valid JSON.', code: 'INVALID_JSON' };
  }
  if (error?.type === 'entity.too.large') {
    return { status: 413, message: 'The request is too large.', code: 'PAYLOAD_TOO_LARGE' };
  }

  return { status: 500, message: 'Something went wrong on our side. Please try again.', code: 'INTERNAL' };
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, _next) {
  const { status, message, code, details } = describe(error);

  if (status >= 500) {
    logger.error(`${req.method} ${req.originalUrl} failed`, error);
  } else {
    logger.debug(`${req.method} ${req.originalUrl} rejected: ${message}`);
  }

  // Once an SSE stream has started, headers are gone; report in-band instead.
  if (res.headersSent) {
    if (!res.writableEnded) res.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`);
    return res.end();
  }

  const body = { success: false, message, error: { code, ...(details && { details }) } };
  if (!config.isProduction && status >= 500) body.error.stack = error.stack;
  return res.status(status).json(body);
}
