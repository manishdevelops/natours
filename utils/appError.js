class AppError extends Error {
    constructor(message, statusCode) {
        super(message); //Calls the constructor of the parent class (Error) with the provided message. This sets the error message for the instance.

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
        //  used to capture and customize the stack trace of an error. It is typically used in custom error classes to improve the clarity of error logs and to remove internal implementation details from the stack trace.
        //this -> current object
        //this.construtor -> AppError class itself
    }
}

module.exports = AppError;