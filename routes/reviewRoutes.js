const express = require('express');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.addNewReviews
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );

// router.get(
//   '/allReviews',
//   authController.protect,
//   reviewController.getAllReviews
// );

// router.post(
//   '/addReviews',
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.addNewReviews
// );

module.exports = router;
