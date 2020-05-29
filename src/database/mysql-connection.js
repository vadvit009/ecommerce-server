// get the client
const mysql = require('mysql');
const logger = require('../utils/logger');

// create the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function(err) {
    if (err) {
        logger.error('error connecting: ' + err.stack);
        return;
    }

    console.info('connected as id ' + connection.threadId);
});

module.exports = connection;
