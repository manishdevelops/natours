const { query } = require('express');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is ${val}`);
//     // console.log(req.params);
//     if (req.params.id * 1 > tours.length) {
//         // `return` because we are not allowed to send header after the response had already sent and this type of error we can run into if we don't have this `return` statement
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//         // after sending this response the function will return and finish and it will never call the `next() ` 
//     }
//     next();
// }

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         });
//     }
//     next();
// }

exports.getAllTours = async (req, res) => {
    try {
        // console.log(req.query);  //logs object with key-value pairs

        //Builds query
        // 1A) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        // console.log(req.query, queryObj);
        // const query = Tour.find(queryObj);

        //1B) Advance filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));  // logs returns
        let query = Tour.find(JSON.parse(queryStr));

        // 2)
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            // console.log(sortBy);
            query.sort(req.query.sort);
        } else {
            query = query.sort('-createdAt');
        }

        //executes query
        const tours = await query;
        //                  or
        // const tours = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // });
        //                          OR
        // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

        // send response
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res) => {
    try {

        const tour = await Tour.findById(req.params.id);
        //                OR
        // Tour.findOne({_id: req.params.id});


        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }

}

exports.createTour = async (req, res) => {
    // console.log(req.body);
    //req.body contains the JSON data sent by the client in the request body
    //when we create new object we never specify the id of the object. The database usually takes care of it 
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);
    // tours.push(newTour);
    // // inside callback so we asynchronously write the file 
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         // 201 writen data successfully
    //         status: 'success',
    //         data: {
    //             tour: newTour
    //         }
    //     });
    // });
    // // res.end('Done');
    // //we always have to send something to finish the request/response cycle


    //earlier we used to use this method
    // const newTour = new Tour({});
    // newTour..save()

    try {
        //now we will use async await 
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            // 201 writen data successfully
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    };

}

exports.updateTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            //if true, return the modified document rather than the original
            runValidators: true
            //if true, runs update validators on this command. Update validators validate the update operation against the model's schema
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }


};

exports.deleteTour = async (req, res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};