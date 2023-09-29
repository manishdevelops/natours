const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// this command will read the env variables from the confg file and save them into NODE JS environment variables
// this is before `require app` because so that our environament variables will be read from the config file

const app = require('./app');

// console.log(process.env);

// Express.js application to listen on a specific port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});