// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const ExpressError = require('./ExpressError');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const pool = require( '../aeroquest-backend/db' );

// Middleware
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
// };
// app.use(cors( corsOptions ));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'build')));

// Database connection string
const connectionString = process.env.DATABASE_URL;

// Create a new pool using the connection string
const pool = new Pool({ connectionString });

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routers
const bookmarkRouter = require('./routes/bookmark' );
const searchRouter = require('./routes/search' );
const userRouter = require('./routes/user' );

// Route Prefixes
app.use('/bookmark', bookmarkRouter);
app.use('/search', searchRouter);
app.use('/user', userRouter);


app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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


module.exports = pool;
