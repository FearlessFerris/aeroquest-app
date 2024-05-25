// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const ExpressError = require('./ExpressError');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection string
const connectionString = process.env.DATABASE_URL;

// Create a new pool using the connection string
const pool = new Pool({ connectionString });

// Routers
const bookmarkRouter = require('./routes/bookmark' );
const searchRouter = require('./routes/search' );
const userRouter = require('./routes/user' );

// Route Prefixes
app.use('/bookmark', bookmarkRouter);
app.use('/search', searchRouter);
app.use('/user', userRouter);

// 404 Error Handler
app.use((req, res, next) => {
  const err = new ExpressError('Not Found', 404);
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (!err.status) {
    err = new ExpressError('Internal Server Error', 500);
  }
  res.status(err.status || 500).json({ error: err.message });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
