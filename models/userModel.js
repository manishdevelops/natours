const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
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
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on save
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not same!'
        }
    }
});

// executes between gatting the data and saving it to DB. PERFECT TIME TO MANIPULATE DATA
// this middleware runs when there is modification and creation of the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // deleting the confirmPassword field because we need it only for validation although it was required field but it doesn't mean to be in the database 
    next();
})

const User = mongoose.model('User', userSchema);
// in DB -> By default, the collection name will be the lowercased and pluralized version of the model name

module.exports = User;