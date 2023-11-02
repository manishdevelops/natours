const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

// router middleware -> excutes in order they are written 

//param middleware
//in this middleware we also get access to the fourth arg that is value
//this middleware function only executes for the tour router otherwise ignored and move on to the next middleware
// router.param('id', tourController.checkID);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;