/**
 * Centralized Error Handler Middleware.
 * Must have exactly 4 arguments (err, req, res, next) for Express to treat it as error middleware.
 *
 * Status code mapping:
 *   ValidationError  → 400 Bad Request
 *   NotFoundError    → 404 Not Found
 *   Unknown / Other  → 500 Internal Server Error
 */
export function errorHandler(err, req, res, next) {
  // Determine HTTP status code from the error or fall back to 500
  const status = err.status || 500;

  const response = {
    success: false,
    error: {
      name: err.name || 'Error',
      message: err.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  };

  // Log server errors for debugging
  if (status === 500) {
    console.error('[ErrorHandler] Internal Server Error:', err);
  }

  res.status(status).json(response);
}
