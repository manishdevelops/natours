const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    //201 -> the request has succeeded and has led to the creation of a resource.
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

