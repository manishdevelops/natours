const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const User = require('./userModel');

//CREATING SCHEMA
const tourSchema = new mongoose.Schema({
    // name: String
    name: {
        type: String,
        required: [true, 'A tour must have a name'], //a validator
        unique: true, // not a validator
        trim: true,
        maxLength: [40, 'A tour name must have less or equal than 40 characters'],
        minLength: [10, 'A tour name must have more or equal than 10 characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration!']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {  // only for strings
            values: ['easy', 'medium', 'difficult'], // this should be the values 
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Ratings must be above or equal 1.0'],
        max: [5, 'Ratings must be below or equal to 5'],
        set: val => Math.round(val * 10) / 10 // ex 4.66666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) { // priceDiscount val
                return val < this.price; // price value
                // 'this' only points to current doc or new doc creation 
            },
            message: 'Discount price {VALUE} should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        //trim-> removes white spaces from start and end of the string and this method works for string only
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    // an array of number of Strings
    createdAt: {
        type: Date,
        default: Date.now,
        select: false //the createdAt will never be selected when accessing 
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    },
    // schema type object/ not for schema type options like above
    startLocation: { // embedded object
        //GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
            coordinates: [Number],
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [ //always need to use this array for embedding doc. By specifying an array of objects, this will then create brand new documents inside of the parent document, which is tour 
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        //expect a type of each of the elements in the guides array to be a MongoDB ID
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User' // Now, don't need to import User explicitly, Mongoose will understand the reference and associate it with the "User" model.
        }
    ]
},
    {
        toJSON: { virtuals: true },  // each time that the data is outputted as JSON, we want virtuals to be true. So basically virtuals to be the part of the output.
        toObject: { virtuals: true },
        id: false  // no duplicate id in query op
    }
);

// Adding Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// this virtual data is not going to be saved in DB 
// durationWeeks -> virtual property name
// get -> getter function
// this -> pointing  current  document
// we cannot use this virtual property here in a query bcz they are technically not the part of the DB
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual('reviews', {
    ref: 'Review', // referencing Model name
    foreignField: 'tour', //'tour' field in the 'Review' model is used to associate reviews with tours.
    localField: '_id' // '_id' field in the 'Tour' model is used to associate tours with reviews.
});

//this is pre middleware that gonna run before an actual event and that event is 'save()' & 'create()' event. the callback fn will be called before saving a document in the DB and so we can perform some act on this data ebfore saving to the db.
//1) DOCUMENT MIDDLEWARE: runs before .save() and .create() not for insertOne insertMany like these events 
//next -> just like express, mongoose has next to call next middleware
tourSchema.pre('save', function (next) {
    // console.log(this);
    // this ->  currently processed document

    this.slug = slugify(this.name, { lower: true });
    next();
});


//EMBEDDING
// tourSchema.pre('save', async function (next) {
//     const guidesPromise = this.guides.map(async el => await User.findById(el)); // this will return promise of every single element
//     this.guides = await Promise.all(guidesPromise);
//     next();
// });
//   OR
// tourSchema.pre('save', async function (next) {
//     const ids = this.guides;
//     this.guides = await User.find({ _id: { $in: ids } });
//     next();
// });


// we can have multiple pre and post middlewares
// tourSchema.pre('save', function (next) {
//     console.log('will save document');
//     next();
// });

// This post middleware that gaonna run after saving the document in the db. on 'save' event. It has also accesed to the saved doc.
// tourSchema.post('save', function (doc, next) {
//     // here no longer has accessed to this keyword
//     console.log(doc);
//     next();
// });

//2) QUERY MIDDLEWARE
//executes before processing a query
// /^find/ -> this will trigger the methods that start with find like findOne, findByIdAndUpdate etc.
tourSchema.pre(/^find/, function (next) {
    //this -> query OBJECT
    this.find({ secretTour: { $ne: true } });
    // this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function (next) {
    //this -> query OBJECT
    //populates guides field with reference user
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt' // not want these in the query op
    });
    next();
});

// after execution of query
//docs -> all documents in the db
// tourSchema.post(/^find/, function (docs, next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds`);
//     console.log(docs);
//     next();
// });

//3) AGGREGATE MIDDLEWARE : executes before aggregation happens
// tourSchema.pre('aggregate', function (next) {
//     // console.log(this);
//     // this-> current aggregate OBJECT
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //unshift -> adding stage -> .filter docs which should not be secreTour:true
//     next();
// });
tourSchema.pre('aggregate', function (next) {
    const things = this.pipeline()[0];
    if (Object.keys(things)[0] !== '$geoNear') {
        this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    }
    next();
});

//CREATING MODEL FOR tourSchema
//Model name of the first char should be capital
//(model name, schema)
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 