const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();
// mergeParams: true  --> it means that the child router should inherit and merge the route parameters from its parent router and now can access parent parameters. This is done bcz each router has access to the parameters of their specific routes

router.use(authController.protect);

router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router.route('/').get(bookingController.getAllBookings).post(bookingController.createBooking);

router.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking).delete(bookingController.deleteBooking);

module.exports = router;

