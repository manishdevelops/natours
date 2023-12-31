//Path is a built-in module which is used to manipulate path names 
const path = require('path');
const express = require('express');
//You are requiring the 'express' module, which is a popular Node.js module used to create web applications and APIs.
const app = express();
// "const app" => used as a convention to represent an instance of your Express.js application. This instance will be used to configure routes, middleware, and other settings for your web application.
// "express()" => This is a function call that creates a new instance of the Express application. When you call express(), it returns an Express application object, which you assign to the app variable. This object is the core of your web application and provides methods and settings for handling HTTP requests, defining routes, and more.
const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); // counts request from same IP
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serving static files from a foler name public
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));


// 1) GLOBAL MIDDLEWARES
// all the middleware here 'app.use' are part of the middleware stack and are executed in order as they are written

//Set Security HTTP Headers
// app.use(helmet());

const scriptSrcUrls = [
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'https://cdnjs.cloudflare.com/',
    'https://*.stripe.com/',
    'https://js.stripe.com/',
];
const styleSrcUrls = [
    'https://api.mapbox.com/',
    'https://api.tiles.mapbox.com/',
    'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
    'https://api.mapbox.com/',
    'https://a.tiles.mapbox.com/',
    'https://b.tiles.mapbox.com/',
    'https://events.mapbox.com/',
    'https://bundle.js:*',
    'ws://127.0.0.1:*/',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// Merging the two sets of directives
const mergedDirectives = {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': ["'self'", 'https://unpkg.com', ...scriptSrcUrls],
    'img-src': ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
    connectSrc: ["'self'", ...connectSrcUrls],
    // scriptSrc: ["'self'", ...scriptSrcUrls],
    // styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    // workerSrc: ["'self'", 'blob:'],
    frameSrc: ["'self'", 'https://*.stripe.com'],
    // objectSrc: [],
    // imgSrc: ["'self'", 'blob:', 'data:'],
    // fontSrc: ["'self'", ...fontSrcUrls],
};

// Using the merged directives in the helmet.contentSecurityPolicy middleware
app.use(helmet.contentSecurityPolicy({ directives: mergedDirectives }));

// for turing off all CORS
// app.use(helmet({ contentSecurityPolicy: false }));

//accessing the env variable
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    // app.use(morgan('dev'));
    // `dev` -> The log entries typically include information such as the HTTP method, URL, status code, response time, and response size.
}

// Limits requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again in an hour!'
});
app.use('/api', limiter); // counts every request with route `/api`

// app.use(morgan('tiny'));
//used for logging HTTP request details

//Middleware to parse JSON request bodies, read data from body into req.body
app.use(express.json({ limit: '10kb' })); // limit size of data to be accepted. if data > 10 kb not accepted

app.use(express.urlencoded({ extended: true, limit: '10kb' })); // parsing form data


//pasrses data from the cookies
app.use(cookieParser());

// Data sanitization against NoSQL query middleware
app.use(mongoSanitize()); // mongoSanitize returns a middleware fn. This middleware look at the body, the request query string and also Request.params and then it will filter out all of the '$' signs and '.'

// Data sanitization
app.use(xss()); // imagine that an attacker would try to insert some malicious HTML code with some JavaScript code attached to it. If that would then later be injected into our HTML site, it could really create some damage then. Using this middleware we prevent that by converting all these HTML symbols

// Prevent paramater pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
})
);  // clears up the duplicate query string



// app.use((req, res, next) => {
//     console.log('Hello from the  middleware👋');
//     next();
//     //     //we need to call the 'next()', if we didnt call the 'next()' then the request, response cycle would be stuck at this point we wouldn't be move on and we would never ever send back a response to the client
// });


//Test middlewares
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

// // 'get' -> http method for the request
// app.get('/', (req, res) => {
//     //this response is only sent when a get method is sent to our  server  on this url -> '/'
//     res.status(200).json({ message: 'Hello from the server side!', app: 'Natours' });
//     // Here because of json function the content-type will automaticall will be Application/json. express do it for ourselves
//     // Express also sends a bunch of headers  such as powered-by, date, connection, etc
// });

// app.post('/', (req, res) => {
//     //default statuscode is 200 ok when we do not specify manually
//     res.send('You can  post to this  endpoit...');
// });


// 2) ROUTE HANDLERS




// 3) ROUTES
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
//            OR
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// If we are able to reach this point here it means that the request req res cycle was not yet finished at this point in our code 
app.all('*', (req, res, next) => { //the routes that are not handled by the above routes
    // * -> stands for all methods like get, post, put, patch etc
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    //     //req.original -> pathname that was requested
    // });

    //Creating an error
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail'; // error properties
    // err.statusCode = 404;
    // next(err); // when we pass anything into next, it will assume that it is an error, and It will then skip all the other middlewares in the middleware stack and sent the error that we passed into our global error handling middleware, which will then be executed.

    next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

//we have to give 4 arguments to this middleware fn and express will automatically recognize it as an error handling middleware and therefore , only call it when  there is an error
app.use(globalErrorController);


module.exports = app;
