const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;  // err.path & err.value comes from the error object
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    //Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    //Programming or other unknown error: don't leak eror details
    else {
        // 1) Log error
        console.error('ERROR ⚡⚡', err);

        //2) Send generic message
        res.status(err.statusCode).json({
            status: 'error',
            message: 'Something went very wrong'
        });
    }

}

//global error controller middleware
module.exports = (err, req, res, next) => {
    // console.log(err.stack); // shows where the error has happened
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err, name: err.name };
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        };
        sendErrorProd(error, res);
    }
}