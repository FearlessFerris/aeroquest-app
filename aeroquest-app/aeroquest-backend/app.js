// Express Server Implementation 


// Dependencies 
const express = require( 'express' );
const cors = require( 'cors' );
const path = require('path');  
const app = express();
const ExpressError = require( './ExpressError' );
const port = process.env.PORT || 5000;
const db = require( './db' );
require( 'dotenv' ).config();


// Other Necessary Files 


// Middleware 
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );


// Routers 
const bookmarkRouter = require( './routes/bookmark' );
const searchRouter = require( './routes/search' );
const userRouter = require( './routes/users' );


// Route Prefix's 
app.use( '/bookmark', bookmarkRouter );
app.use( '/search', searchRouter );
app.use( '/users', userRouter );


// 404 Error Handler 
app.use(( req, res, next ) => {
    const err = new ExpressError( 'Not Found', 404 );
    next( err );
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Catch-all to send back the React index.html file for any unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Global Error Handler 
app.use(( err, req, res, next ) => {
    if( !err.status ){
        err = new ExpressError( `Internal Server Error`, 500 );
    }
    res.status( err.status || 500 ).json({ error: err.message });
});


// Start Server 
app.listen( port, () => { console.log( `Server is running on port: ${ port }` )});