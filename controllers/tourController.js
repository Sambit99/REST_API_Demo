// const fs = require('fs');
// const { query } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   const id = +val;
//   if (id > tours.length || id < 0) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const { name, duration } = req.body;
//   if (!name || !duration) {
//     return res.status(400).json({
//       status: 'Failed',
//       message: 'Missing name or duration',
//     });
//   }
//   next();
// };

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,difficulty,ratingsAverage,summary';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //Building Query
  //1A. Filtering
  // console.log(req.query);
  // const queryObj = { ...req.query };
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // //1B. Advance Filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
  // queryStr = JSON.parse(queryStr);

  // let query = Tour.find(queryStr);

  //2. Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  //3. Field Limiting
  // if (req.query.fields) {
  //   const reqFields = req.query.fields.split(',').join(' ');
  //   // console.log(reqFields);
  //   query = query.select(reqFields);
  // } else {
  //   query = query.select('-__v');
  // }

  //4. Pagination
  // const page = +req.query.page || 1;
  // const limit = +req.query.limit || 10;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const numOfPages = await Tour.countDocuments();
  //   if (skip >= numOfPages) {
  //     throw new Error(`This Page doesn't exist`);
  //   }
  // }

  // const query = await Tour.find();
  // const query = await Tour.findOne({ _id: req.params.id });

  // const query = await Tour.find({
  //   duration: 5,
  //   difficulty: 'easy',
  // });

  // const query = await Tour.find()
  //   .where(`duration`)
  //   .equals(5)
  //   .where(`difficulty`)
  //   .equals('easy');

  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
});

exports.getTourByID = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(
      new AppError(`No tour found with the ID : ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save()
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // const id = +req.params.id;
  // const tour = tours.find((el) => el.id === id);
  // x = Object.assign(req.body);
  // for (const [key, value] of Object.entries(x)) {
  //   // console.log(key, value);
  //   tour[key] = value;
  // }

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 }, // 0 means to hide , 1 means to show
    },
    {
      $sort: { numOfTourStarts: -1 }, // 1 for Ascending, -1 for Desecending
    },
    {
      $limit: 12,
    },
  ]);

  res.status(400).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
