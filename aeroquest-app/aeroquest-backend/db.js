// db.js

const { Pool } = require('pg');
require('dotenv').config();

// Database connection string
const connectionString = process.env.DATABASE_URL;

// 'postgres://marcus:Civil392601*@localhost:5432/aeroquest'
// Create a new pool using the connection string
const pool = new Pool({ connectionString });

module.exports = pool;
