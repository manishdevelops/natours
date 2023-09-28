const fs = require('fs');
const express = require('express');
//You are requiring the 'express' module, which is a popular Node.js module used to create web applications and APIs.
const app = express();
// "const app" => used as a convention to represent an instance of your Express.js application. This instance will be used to configure routes, middleware, and other settings for your web application.
// "express()" => This is a function call that creates a new instance of the Express application. When you call express(), it returns an Express application object, which you assign to the app variable. This object is the core of your web application and provides methods and settings for handling HTTP requests, defining routes, and more.

app.use(express.json());

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});

app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body);
    //req.body contains the JSON data sent by the client in the request body
    //when we create new object we never specify the id of the object. The database usually takes care of it 
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    // inside callback so we asynchronously write the file 
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            // 201 writen data successfully
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
    // res.end('Done');
    //we always have to send something to finish the request/response cycle
})



// Express.js application to listen on a specific port
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});