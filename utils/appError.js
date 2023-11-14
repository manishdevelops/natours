class AppError extends Error {
    constructor(message, statusCode) {
        super(message); //Calls the constructor of the parent class (Error) with the provided message. This sets the error message for the instance.

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;