const { query } = require('express');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is ${val}`);
// console.log(req.params);
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

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();  // so that next middleware can be called
}

exports.getAllTours = factory.getAll(Tour);
// catchAsync taking an async function which returns promises and when there is error the promise gets rejected (see in catchAsync file)
// exports.getAllTours = catchAsync(async (req, res, next) => {
//     // try {
//     // console.log(req.query);  //logs object with key-value pairs

//     //Builds query
//     // // 1A) Filtering
//     // const queryObj = { ...req.query };
//     // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     // excludedFields.forEach(el => delete queryObj[el]);
//     // // console.log(req.query, queryObj);
//     // // const query = Tour.find(queryObj);

//     // //1B) Advance filtering
//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//     // // console.log(JSON.parse(queryStr));  // logs returns
//     // let query = Tour.find(JSON.parse(queryStr));

//     // 2) Sorting
//     // if (req.query.sort) {
//     //     const sortBy = req.query.sort.split(',').join(' ');
//     //     query.sort(req.query.sort);
//     // } else {
//     //     query = query.sort('_id');
//     // }

//     // 3)Field limiting
//     // if (req.query.fields) {
//     //     const fields = req.query.fields.split(',').join(' ');
//     //     query = query.select(fields); //whatever fields are there in the query will only be selected , rest not
//     // } else {
//     //     query = query.select('-__v');   // This __v will never be selected(excluded)

//     // }

//     // 4) Pagination
//     // const page = req.query.page * 1 || 1;  //default value 1
//     // const limit = req.query.limit * 1 || 100;  //default value 100
//     // const skip = (page - 1) * limit;
//     // // page=3&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3 and so on
//     // query = query.skip(skip).limit(limit);

//     // if (req.query.page) {
//     //     const numTours = await Tour.countDocuments();
//     //     if (skip >= numTours) throw new Error('This page does not exist');
//     // }

//     //Executes query
//     const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//     // console.log(features.query);
//     const tours = await features.query; // before this statement the pre query middleware is executed
//     //                  or
//     // const tours = await Tour.find({
//     //     duration: 5,
//     //     difficulty: 'easy'
//     // });
//     //                          OR
//     // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

//     // send response
//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours
//         }
//     });
//     // } 
//     // catch (err) {
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     });
//     // }
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// exports.getTour = catchAsync(async (req, res, next) => {
//     // try {

//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     //                OR
//     // Tour.findOne({_id: req.params.id});

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }


//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
//     // } 
//     // catch (err) {
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     });
//     // }

// });


exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
//     // console.log(req.body);
//     //req.body contains the JSON data sent by the client in the request body
//     //when we create new object we never specify the id of the object. The database usually takes care of it 
//     // const newId = tours[tours.length - 1].id + 1;
//     // const newTour = Object.assign({ id: newId }, req.body);
//     // tours.push(newTour);
//     // // inside callback so we asynchronously write the file 
//     // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//     //     res.status(201).json({
//     //         // 201 writen data successfully
//     //         status: 'success',
//     //         data: {
//     //             tour: newTour
//     //         }
//     //     });
//     // });
//     // // res.end('Done');
//     // //we always have to send something to finish the request/response cycle


//     //earlier we used to use this method
//     // const newTour = new Tour({});
//     // newTour..save()

//     // try {
//     //     //now we will use async await 
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//         // 201 writen data successfully
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     });
//     // } catch (err) {
//     //     res.status(400).json({
//     //         status: 'fail',
//     //         message: err
//     //     })
//     // };
// });


exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync(async (req, res, next) => {
//     // try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,  //if true, return the modified document rather than the original
//         runValidators: true  //if true, runs update validators on this command. Update validators validate the update operation against the model's schema
//     });

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
//     // } catch (err) {
//     //     res.status(400).json({
//     //         status: 'fail',
//     //         message: err
//     //     });
//     // }
// });

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {

//     // try {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
//     // } catch (err) {
//     //     res.status(400).json({
//     //         status: 'fail',
//     //         message: err
//     //     });
//     // }
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
    // try {
    // aggregate pipeline is bit like a regular query and so using the aggregation pipeline is just a bit like doing a regular query. The difference is that in aggregrations, we can manipulate the data in a couple of different steps.we will pass in an array which will have lots of stages.Each element in this array will be one of the stages
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } } //select/filter docs which has gte 4.5
        },
        {
            $group: {
                //groupt -> allows to group docs together using accumulators, and an accumulator is for example, even calculating  an average. So, if we have five tours, each of them has a rating, we can then calculate the average rating using group.
                // _id: '$ratingsAverage',

                //we say null here beacuase we want to have everything in one group so that we caluculate the statistics  for all tours together and not separatedd by groups.
                // _id: null,

                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRatings: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
        // ,
        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // }


    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    // try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            // $unwind -> Deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                    //only documents that is 2021 yr
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' }, // grouping by month of the date
                numTourStarts: { $sum: 1 }, // counts the  documents of group 
                tours: { $push: '$name' } // created array with fieldname as element
            }
        },
        {
            $addFields: { month: '$_id' } // add field
        },
        {
            $project: {
                _id: 0 // removes id
            }
        },
        {
            $sort: { numTourStarts: -1 } // sort in desc
        },
        {
            $limit: 12  // total fields 
        }

    ]);
    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })

    // } catch (err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
});

// tours-within/:distance/center/:latlng/unit/:unit
// tours-within/233/center/34.111745,-118.11331/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng.', 404));
    }

    //mongoDB expects distance in radians
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit.trim() === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng.', 404));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
});
