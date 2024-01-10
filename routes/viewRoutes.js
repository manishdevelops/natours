const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// RENDERING TEMPLATES
router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount); // if user is loggedin then only can get the dashboard
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

module.exports = router;