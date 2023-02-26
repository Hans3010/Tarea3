const AppError = require('../utils/app.Error');

const handleCastError22P02 = () => {
  return new AppError('Invalid DataType in your request', 400);
};
const handleCastError11000 = () => {
  return new AppError('Database Duplicated', 400);
};
const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTTokenExpiredError = () =>
  new AppError('Your token has expired, please login again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR ❌', err);
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong!',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (!error.parent?.code) {
      error = err;
    }
    if (error.parent?.code === '22P02') error = handleCastError22P02(error);
    if (error.parent?.code === '11000') error = handleCastError11000(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTTokenExpiredError(error);
    sendErrorProd(error, res);
  }
};
module.exports = globalErrorHandler;
