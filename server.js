const app = require('./app');

// Express.js application to listen on a specific port
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});