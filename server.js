const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1); //immediately aborts all requests
});


dotenv.config({ path: './config.env' });
// this command will read the env variables from the confg file and save them into NODE JS environment variables
// this is before `require app` because so that our environament variables will be read from the config file

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// CONNECTING WITH HOSTED DATABASE
mongoose.connect(DB, {
    useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true
}).then(con => {
    // console.log(con.connections);
    console.log('DB connection successfull...');
})
// .catch(err => {
//     console.log(err);
// });

// CONNECTING WITH LOCAL HOSTED DATABASE
// mongoose.connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false
// }).then(con => {
//     console.log(con.connections);
//     console.log('DB connection successfull...');
// }).catch(err => {
//     console.log(err);
// });


// for testing
// //CREATING INSTANCE OF THE Tour MODEL
// const testTour = new Tour({
//     name: 'The Park Camper',
//     rating: 4.7,
//     price: 497
// });

// //saving in the database
// //returns promise so we have to handle it
// //catch=> handle error if error occured while the doc
// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('ERROR :⚡⚡', err);
// });


// console.log(process.env);

// Express.js application to listen on a specific port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => { // giving some time for finishing requests that are still pending or being handled at the time
        process.exit(1); // only after that server is killed
    });
});
