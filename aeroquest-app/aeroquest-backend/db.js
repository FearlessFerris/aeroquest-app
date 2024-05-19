
// const { Client } = require( 'pg' );
// const { connectionString } = require('pg/lib/defaults');

// let DB_URI;

// if( process.env.NODE_ENV === 'test' ){
//     DB_URI = 'postgresql:///aeroquest_test';
// }
// else{
//     DB_URI = 'postgresql:///aeroquest';
// }

// let db = new Client({
//     // connectionString: DB_URI,
//     username: 'marcus',
//     password: 'Civil392601*',
//     host: 'localhost',
//     database: 'aeroquest',
//     port: 5432
// });

// db.connect();
// module.exports = db;

const { Client } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

let DB_URI;

if (process.env.NODE_ENV === 'test') {
    DB_URI = 'postgresql:///aeroquest_test';
} else {
    DB_URI = process.env.DATABASE_URL || 'postgresql:///aeroquest';
}

// Create a new client with the connectionString option
let db = new Client({
    connectionString: DB_URI,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Connect to the database
db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error', err.stack));

module.exports = db;
