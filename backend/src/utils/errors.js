export class AppError extends Error {
  constructor(statusCode, message, { code, details } = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message, options) => new AppError(400, message, options);
export const unauthorized = (message = 'Please sign in to continue.', options) => new AppError(401, message, options);
export const forbidden = (message = 'You do not have access to this resource.', options) => new AppError(403, message, options);
export const notFound = (message = 'We could not find what you were looking for.', options) => new AppError(404, message, options);
export const conflict = (message, options) => new AppError(409, message, options);
export const unprocessable = (message, options) => new AppError(422, message, options);
export const tooManyRequests = (message = 'Too many requests. Please wait a moment and try again.', options) => new AppError(429, message, options);
export const badGateway = (message, options) => new AppError(502, message, options);
export const serviceUnavailable = (message, options) => new AppError(503, message, options);
