const AppError = require('./../utils/appError');

const handleJWTError = () =>
  new AppError('Invalid token! Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401);

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  console.log(message);
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const message = `Duplicate field Value : ${err.keyValue.name} . Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  let allErrors = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');
  const message = `Invalid Input data. ${allErrors}`;
  return new AppError(message, 404);
};

const sendDevError = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      message: err.message,
    });
  }
};

const sendProdError = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    //Programming or unknown error
    console.log('Error', err);
    return res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went wrong',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      message: err.message,
    });
  }
  console.log('Error', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    message: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendProdError(error, req, res);
  }
};
