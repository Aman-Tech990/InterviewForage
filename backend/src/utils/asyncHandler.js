// Express 4 does not forward rejected promises to the error middleware on its own.
export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};
