const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour', // Tour Model
            required: [true, 'Review must belong to a tour.']
        }
    ],
    user: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User', //User Model
            required: [true, 'Review must belong to a user.']
        }
    ]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false // no duplicate id in query op
    }
);

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo' // name and photo
    // });

    this.populate({
        path: 'user',
        select: 'name photo' // only name and photo in query op
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;