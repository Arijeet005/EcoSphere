export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;

  if (err?.code === 'P2025') {
    statusCode = 404;
  }

  if (err?.code === 'P2002') {
    statusCode = 409;
  }

  const payload = {
    success: false,
    statusCode,
    message: err.message || 'Internal server error',
  };

  if (err.errors) {
    payload.errors = err.errors;
  }

  if (err?.code) {
    payload.code = err.code;
  }

  res.status(statusCode).json(payload);
};
