const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });
// mergeParams: true  --> it means that the child router should inherit and merge the route parameters from its parent router and now can access parent parameters. This is done bxz each router has access to the parameters of their specific routes

router.route('/').get(reviewController.getAllReviews).post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

module.exports = router;

