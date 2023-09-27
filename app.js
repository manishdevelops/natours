const express = require('express');

const app = express();

// 'get' -> http method for the request
app.get('/', (req, res) => {
    //this response is only sent when a get method is sent to our  server  on this url -> '/'
    res.status(200).json({ message: 'Hello from the server side!', app: 'Natours' });
    // Here because of json function the content-type will automaticall will be Application/json. express do it for ourselves
    // Express also sends a bunch of header  such as powered-by, date, connection, etc
});


app.post('/', (req, res) => {
    //default statuscode is 200 ok when we do not specify
    res.send('You can  post to this  endpoit...');
})

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});