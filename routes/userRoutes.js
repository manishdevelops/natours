const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup); // we need route for signup for only post data
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword); //receive email for reset password
router.patch('/resetPassword/:token', authController.resetPassword); //receive token as well as new password

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;