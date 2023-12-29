const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

// prevent duplicate review by a user to a particular tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//QUERY MIDDLEWARE
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

// STATIC METHOD
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    // this -> Model
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        // when no doc find so stats will be undefined
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }

};

//DOCUMENT MIDDLEWARE
//runs after creation and saving new review on tour
reviewSchema.post('save', function () {
    // this points to the current review doc
    // constructor -> it is the model who created that document
    this.constructor.calcAverageRatings(this.tour); // tour -> tour ID 
});

//findByIdAndUpdate
//findByIdAndDelete
// /^findOneAnd/ -> this is going to work for findByIdAndUpdate & findByIdAndDelete bcz behind the scenes they are just a shorthand for findOneAndUpdate & findOneAndDelete
// QUERY MIDDLEWARE
// runs before update and delete
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();// setting property to the query object
    // console.log(this.r);
    next();
});

// runs after update and delete
//Perfect time to calculate ratings average after update/delete of averageRatings field to the document
reviewSchema.post(/^findOneAnd/, async function (next) {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.tour);
});


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;