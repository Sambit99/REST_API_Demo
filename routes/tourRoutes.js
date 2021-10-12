const express = require('express');
const tourController = require('./../controllers/tourController');
const { getTourByID, updateTour, deleteTour } = tourController;
const authController = require('./../controllers/authController');

const router = express.Router();
// router.param('id', tourController.checkID);
// router.param('id', (req, res, next, val) => {
//   console.log(req.body);
//   console.log('Hii');
//   next();
// });

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.createTour);

router
  .route('/:id')
  .get(getTourByID)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
