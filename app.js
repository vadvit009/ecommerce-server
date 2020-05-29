const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

// set up mysql connection
require('./src/database/mysql-connection');

// init express
const app = express();

// access cors (temporary)
app.use(cors());

// parse application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2mb' }));

// use routes
app.use('/api', require('./src/routes/products'));
app.use('/api', require('./src/routes/user'));
app.use('/api', require('./src/routes/role'));
app.use('/api', require('./src/routes/upload'));

// use static
app.use(express.static(path.resolve(__dirname, './public')));

// handle 404 (user errors)
app.use((req, res, next) => {
    res.status(404).send(`<h2>Oops 404</h2> <h3>We think you are lost!</h3>`);
});

// start listening
app.listen(process.env.PORT, () => console.log(`app started on ${process.env.PORT}`));