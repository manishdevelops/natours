const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// POST/tours/1312hdjhs/reviews
// GET/tours/1312hdjhs/reviews
// GET/tours/1312hdjhs/reviews/4376643dafg
// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

// for this specific route we want to use the reviewRouter
router.use('/:tourId/reviews', reviewRouter); // router is a middleware so we use can the use method on it.

// router middleware -> excutes in order they are written 

//param middleware
//in this middleware we also get access to the fourth arg that is value
//this middleware function only executes for the tour router otherwise ignored and move on to the next middleware
// router.param('id', tourController.checkID);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan); // /:year -> url parameter

router.route('/').get(tourController.getAllTours).post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router.route('/:id').get(tourController.getTour).patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour).delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;