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
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

//CREATING MODEL FOR tourSchema
//Model name of the first char should be capital
//(model name, schema)
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 