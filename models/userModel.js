const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [, 'Please provide your email'],
        unique: true,
        lowercase: true,  // converts to lowercase
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,

    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;