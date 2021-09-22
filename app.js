const express = require('express');
const morgan = require('morgan');
// const exp = require('constants');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//1. MIDDLEWARES
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from Server Side');
//   res.status(200).json({ message: 'Hello from Server Side', app: 'natours' });
// });

//2. ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTourByID);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3. ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't Found ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't Found ${req.originalUrl} on this server`);
  // err.status = 'failed';
  // err.statusCode = 404;
  next(new AppError(`Can't Found ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// 4.START SERVER
module.exports = app;
