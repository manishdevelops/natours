const mongoose = require('mongoose');

//CREATING SCHEMA
const tourSchema = new mongoose.Schema({
    // name: String
    name: {
        type: String,
        //required is validator
        required: [true, 'A tour must have a name'],
        unique: true
    },
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
    startDates: [Date]
}, {
    toJSON: { virtuals: true },  // each time that the data is outputted as JSON, we want virtuals tobe true. So basically virtuals to be the part of the output.
    toObject: { virtuals: true }
});


// this virtual data is not going to be saved in DB 
// durationWeeks -> virtual property name
// get -> getter function
// this -> pointing  current  document
// we cannot use this virtual property here in a query bcz they are technically not the part of the DB
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

//CREATING MODEL FOR tourSchema
//Model name of the first char should be capital
//(model name, schema)
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 