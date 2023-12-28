const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });
// mergeParams: true  --> it means that the child router should inherit and merge the route parameters from its parent router and now can access parent parameters. This is done bcz each router has access to the parameters of their specific routes

// Protect all routes after this middleware
router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews).post(authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);

// here id is for logged in user id
router.route('/:id').get(reviewController.getReview).patch(authController.restrictTo('user', 'admin'), reviewController.updateReview).delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;

