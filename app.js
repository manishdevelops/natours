const express = require('express');
//You are requiring the 'express' module, which is a popular Node.js module used to create web applications and APIs.
const app = express();
// "const app" => used as a convention to represent an instance of your Express.js application. This instance will be used to configure routes, middleware, and other settings for your web application.
// "express()" => This is a function call that creates a new instance of the Express application. When you call express(), it returns an Express application object, which you assign to the app variable. This object is the core of your web application and provides methods and settings for handling HTTP requests, defining routes, and more.
const morgan = require('morgan');

app.use(express.static(`${__dirname}/public`));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) MIDDLEWARES
// all the middleware here ` app.use ` are part of the middleware stack and are executed in order as they are written
app.use(morgan('tiny'));
app.use(express.json());
// app.use((req, res, next) => {
//     console.log('Hello from the  middleware👋');
//     next();
//     //we need to call the 'next()', if we didnt call the 'next()' then the request, response cycle would be stuck at this point we wouldn't be move on and we would never ever send back a response to the client
// });

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
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

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
