// Users Routes 


// Dependencies 
const express = require( 'express' );
const router = express.Router();
const axios = require( 'axios' );
const bcrypt = require( 'bcrypt' );
const db = require( '../db' );
const ExpressError = require( '../ExpressError' );
const jwt = require( 'jsonwebtoken' );


// Necessary Files 
const { ACCESS_KEY, SECRET_KEY } = require( '../config' );
const authorizationMiddleware = require( '../middleware/authorization' );


// Routes 


// Login a User Account 
router.post( '/login', async ( req, res, next ) => {
    try{
        const { username, password } = req.body;
        if( !username || !password ){
            return res.status( 400 ).json({ message: 'Username and Password are required!' });
        }

        const query = `SELECT id, username, password, image_url FROM users WHERE username = $1`;
        const result = await db.query( query, [ username ] );
        console.log( `Result:`, result );

        if( result.rows.length === 0 ){
            return res.status( 404 ).json({ message: `Username: ${ username }, was not found` });
        }

        const user = result.rows[0];
        const correctPassword = await bcrypt.compare( password, user.password );

        if( !correctPassword ){
            return res.status( 401 ).json({ message: `Incorrect Username or Passowrd` });
        }

        const token = jwt.sign( { id: user.id, username: user.username, image_url: user.image_url }, SECRET_KEY, { expiresIn: '1hr' });
        return res.status( 200 ).json({ message: `Welcome back ${ user.username }`, token });
    } 
    catch( error ){
        console.error( 'Here is your error:', error );
        return res.status(500).json({ data: { message: 'An error occurred while processing your request' }});
    }
});


// Create New User Account 
router.post( '/create', async ( req, res, next ) => {
    try {
        const {
            username,
            password,
            email,
            dob,
            imageUrl,
            imageUpload
        } = req.body;

        if( password.length < 8 || !/\d/.test( password ) ){
            return res.status(400).json({ message: 'Password length must be 8 characters long and include at least one number' });
        }

        const hashedPassword = await bcrypt.hash( password, 12 );
        const hasImageUrl = imageUrl !== undefined && imageUrl.trim() !== '';
        const hasImageUpload = imageUpload !== undefined && imageUpload.trim() !== '';
        const values = [username, hashedPassword, email, dob];

        let query = `INSERT INTO users (username, password, email, dob`;
        if (hasImageUrl) {
            query += ', image_url';
            values.push(imageUrl);
        }
        if (hasImageUpload) {
            query += ', image_upload';
            values.push(imageUpload);
        }

        query += `) VALUES ($1, $2, $3, $4`;
        for (let i = 5; i <= values.length; i++) {
            query += `, $${i}`;
        }
        query += `) RETURNING *;`;
        
        console.log('Database insertion query:', query);
        console.log('Database insertion values:', values);
        
        const result = await db.query(query, values);
        if (result.rowCount > 0) {
            console.log('User created successfully:', result.rows[0]);
            res.status(201).json({
                message: `User ${username} was created successfully!`
            });
        } else {
            console.error('Failed to create user:', result);
            res.status(500).json({ error: 'Failed to create user. Please try again.' });
            next( error );
        }
        
    } catch (error) {
        console.error('Error creating user:', error);
        if( error instanceof ExpressError ){
            res.status( error.statusCode ).json({ error: error.message });
        }else {
            res.status(500).json({ error: 'An error occurred while creating the user.' });
        }
        next(error);
    }
});


// User Account Profile 
router.get( '/profile/:id', authorizationMiddleware, async ( req, res, next ) => {
    try{
        console.log( ACCESS_KEY );
        const userId = req.user.id;
        const query = `SELECT id, username, email, dob, image_url, image_upload FROM users WHERE id = $1`;
        const result = await db.query(query, [userId]);
        if( result.rows.length === 0 ){
            return res.status( 404 ).json({ message: 'User Not Found!' });
        }

        const data = result.rows[0];
        return res.status( 200 ).json({ data: data });
    }
    catch( error ){
        res.status( 500 ).json({ message: 'Internal Server Error' });
        next( error );
    }
});


// Update User Profile 
router.put( '/update/:userId', async ( req, res, next ) => {
    try {
        const userId = req.params.userId;
        const { username, password, confirmPassword, email, dob, imageUrl, imageUpload } = req.body;

        if ( !username || !email ) {
            return res.status( 400 ).json({ message: 'Username and email are required fields.' });
        }
        const query = `SELECT * FROM users WHERE id = $1`;
        const user = await db.query( query, [ userId ] );

        if ( !user ) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const foundUser = user.rows[0];
        foundUser.username = username;
        foundUser.email = email;
        foundUser.dob = dob;
        
        if( imageUrl ){
            foundUser.imageUrl = imageUrl;
        }

        if( imageUpload ){
            foundUser.imageUpload = imageUpload;
        }

        if ( password && confirmPassword && password === confirmPassword ) {
            foundUser.password = await bcrypt.hash(password, 10); 
        }

        await db.query( 'UPDATE users SET username = $1, password = $2, email = $3, dob = $4, image_url = $5, image_upload = $6 WHERE id = $7', 
        [foundUser.username, foundUser.password, foundUser.email, foundUser.dob, foundUser.imageUrl, foundUser.imageUpload, userId ]);

        res.status(200).json({ message: 'Profile updated successfully.', user: foundUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
