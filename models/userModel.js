const crypto = require('crypto'); // generates random token
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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'], //specific to the app's domain
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 8,
        select: false
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

// executes between getting the data and saving it to DB. PERFECT TIME TO MANIPULATE DATA
// this middleware runs when there is modification and creation of the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // deleting the confirmPassword field because we need it only for validation although it was required field but it doesn't mean to be in the database 
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

// this is the instance method that is gonna be available to all the documents of a cretain collection
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword); // return true if matches otherwise false
}

// check if user has not changed password after token was issued
// JWTTimeStamp -> The time when token was issued
// this -> current doc
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(this.passwordChangedAt, JWTTimestamp);
        return JWTTimestamp < changedTimeStamp;  // 100 < 200
    }
    return false; // NOT changed
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex'); //sending this token to user to reset password
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // encrypting to protect from attackers
    console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);
// in DB -> By default, the collection name will be the lowercased and pluralized version of the model name

module.exports = User;