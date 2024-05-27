// Search Routes 


// Dependencies 
const express = require( 'express' );
const router = express.Router();
const ExpressError = require( '../ExpressError' );


// Necessary Files 
const pool = require( '../db' );
const { SECRET_KEY, ACCESS_KEY } = require( '../config' );
const apiClient = require( '../apiClient' );
const authorizationMiddleware = require('../middleware/authorization');


// API Endpoints 
const AIRPLANES_ENDPOINT_BASE = 'http://api.aviationstack.com/v1/airplanes';
const AIRLINES_ENDPOINT_BASE = 'http://api.aviationstack.com/v1/airlines';
const AIRPORTS_ENDPOINT_BASE = 'http://api.aviationstack.com/v1/airports';


// Routes 


// Search Routes  
router.get( '/:type', async ( req, res, next ) => {
    try{
        const { type } = req.params;
        const { searchTerm, offset = 0, limit = 10 } = req.query;
        let endpoint = '';

        switch( type ){
            case 'airplanes': 
                endpoint = AIRPLANES_ENDPOINT_BASE;
                break;
            case 'airlines':
                endpoint = AIRLINES_ENDPOINT_BASE;
                break;
            case 'airports':
                endpoint = AIRPORTS_ENDPOINT_BASE;
                break;
            default: 
                return res.status( 400 ).json({ error: 'Invalid Search Type' });
        }

        const response = await apiClient.get( endpoint, {
            params: {
                access_key: ACCESS_KEY,
                search: searchTerm,
                offset,
                limit
            },
        });

        return res.status( 200 ).json({ message: `${ type } Information`, data: response.data.data });
    }
    catch( error ){
        console.error( `Error: `, error.response.data.error );
        res.status( 500 ).json({ error: 'Internal Server Error' });
    }
});


// Search History 
router.post( '/add', authorizationMiddleware, async ( req, res, next ) => {
    try{ 
        const { searchTerm, userId } = req.body;
        let query = '';
        let values = [ searchTerm ];

        if ( userId ) {
            query = `INSERT INTO search_history ( search_term, user_id ) VALUES ( $1, $2 ) RETURNING *`;
            values.push( userId );
        }
        else {
            query = `INSERT INTO search_history ( search_term, user_id ) VALUES ( $1 ) RETURNING *`;
        }

        const result = await pool.query( query, values );

        if( result.rows.length > 0 ){
            console.log( result.rows[0] );
            return res.status( 200 ).json({ message: `${ searchTerm } was added to the search history!`, data: searchTerm });
        }
        else{
            throw new ExpressError( 'Failed to add search to search history' );
        }
    }
    catch( error ){
        console.error( 'Error adding search to search history!!!', error.message );
        return res.status( 500 ).json({ error: `Internal Server Error` });
    }
})


module.exports = router;

