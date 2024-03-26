require('dotenv').config({path : '../.env'});
var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query(`CREATE DATABASE ${process.env.DB_NAME}`, function (err, result) {
        if (err) throw err;
        console.log("Database created");
        connection.end(function(err) {
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Closing the database connection.');
        });
    });
});