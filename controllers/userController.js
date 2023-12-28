const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    //send response
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1)Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
    }
    // 2)Update user document

    // const user = await User.findById(req.user.id);
    // user.name = 'Mani';
    // await user.save();  // There will be error because passwordConfirm is a required field and we havn't provided passwordConfirm and validators and middlewares run on `save` so we will use findByIdAndUpdate

    const filterBody = filterObj(req.body, 'name', 'email'); // allowing only for name and email modification
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true, //ensures that the method returns the modified user rather than the original one.
        runValidators: true // instructs Mongoose to run validation on the fields specified in the update operation, since filterBody only contains the 'name' and 'email' fields, the validators will only run for those fields.
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'error',
        data: null
    });
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!'
    });
};

exports.createUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!'
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!'
    });
};

exports.deleteUser = factory.deleteOne(User);
// exports.deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet implemented!'
//     });
// };