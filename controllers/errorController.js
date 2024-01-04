const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;  // err.path & err.value comes from the error object
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    // comes from  error object
    const [errorField, errorValue] = Object.entries(err.keyValue).flat();
    const message = `Duplicate '${errorField}' value entered as '${errorValue}'.`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const error = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${error.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Please login again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please login again!', 401);

const sendErrorDev = (err, req, res) => {
    //API
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    //RENDERED WEBSITE
    else {
        console.error('ERROR ⚡⚡', err);
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
};

const sendErrorProd = (err, req, res) => {
    //API
    if (req.originalUrl.startsWith('/api')) {
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
    // RENDERED WEBSITE
    else {
        //Operational, trusted error: send message to client
        if (err.isOperational) {
            res.status(err.statusCode).render('error', {
                title: 'Something went wrong!',
                msg: err.message
            });
        }
        //Programming or other unknown error: don't leak eror details
        else {
            // 1) Log error
            console.error('ERROR ⚡⚡', err);

            //2) Send generic message
            res.status(err.statusCode).render('error', {
                title: 'Something went wrong!',
                message: 'Please try again later.'
            });
        }

    }
}

//global error controller middleware
module.exports = (err, req, res, next) => {
    // console.log(err.stack); // shows where the error has happened
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err, name: err.name };
        if (error.name === 'CastError') error = handleCastErrorDB(error); // invalid id
        if (error.code === 11000) error = handleDuplicateFieldsDB(error); // duplicate fields
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error); //validatinng fileds
        if (error.name === 'JsonWebTokenError') error = handleJWTError(); // handle token change
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(); // time expires
        error.message = err.message;
        sendErrorProd(error, req, res);
    }
}