const mongoose = require('mongoose');
const slugify = require('slugify');

//CREATING SCHEMA
const tourSchema = new mongoose.Schema({
    // name: String
    name: {
        type: String,
        //required is validator
        required: [true, 'A tour must have a name'],
        unique: true
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
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
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
    // an array of number od Strings
    createdAt: {
        type: Date,
        default: Date.now,
        select: false //the createdAt will never be selected when accessing 
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    }
}, {
    toJSON: { virtuals: true },  // each time that the data is outputted as JSON, we want virtuals to be true. So basically virtuals to be the part of the output.
    toObject: { virtuals: true }
});


// this virtual data is not going to be saved in DB 
// durationWeeks -> virtual property name
// get -> getter function
// this -> pointing  current  document
// we cannot use this virtual property here in a query bcz they are technically not the part of the DB
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
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

// after execution of query
//docs -> all documents in the db
// tourSchema.post(/^find/, function (docs, next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds`);
//     console.log(docs);
//     next();
// });

//3) AGGREGATE MIDDLEWARE : executes before aggregation happens
tourSchema.pre('aggregate', function (next) {
    // console.log(this);
    // this-> current aggregate OBJECT
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //unshift -> adding stage -> .filter docs which should not be secreTour:true
    next();
});

//CREATING MODEL FOR tourSchema
//Model name of the first char should be capital
//(model name, schema)
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 