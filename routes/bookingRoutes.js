const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();
// mergeParams: true  --> it means that the child router should inherit and merge the route parameters from its parent router and now can access parent parameters. This is done bcz each router has access to the parameters of their specific routes

router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession);

module.exports = router;

