const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup); // we need route for signup for only post data
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword); //sends email for reset password

router.patch('/resetPassword/:token', authController.resetPassword); //receive token via email as well as set new password

router.patch('/updatePassword', authController.protect, authController.updatePassword); //only works for logged in users

router.get('/me', authController.protect, userController.getMe, userController.getUser);

router.patch('/updateMe', authController.protect, userController.updateMe); // update user data of currently logged in user

router.delete('/deleteMe', authController.protect, userController.deleteMe); // delete the current user

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);



module.exports = router;