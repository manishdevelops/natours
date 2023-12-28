const catchAsync = require('./../utils/catchAsync.js');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory.js');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.setTourUserIds = (req, res, next) => {
    // Allow Nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id; // id is coming from logged in user in protect fn if not specified manually
    next();
}
exports.createReview = factory.createOne(Review);
// exports.createReview = catchAsync(async (req, res, next) => {
//     // Allow Nested routes
//     if (!req.body.tour) req.body.tour = req.params.tourId;
//     if (!req.body.user) req.body.user = req.user.id; // id is coming from logged in user in protect fn if not specified manually

//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     });
// });

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);