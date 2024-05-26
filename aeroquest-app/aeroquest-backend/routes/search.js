// Search Routes 


// Dependencies 
const express = require( 'express' );
const router = express.Router();


// Necessary Files 
const pool = require( '../db' );
const { SECRET_KEY, ACCESS_KEY } = require( '../config' );
const apiClient = require( '../apiClient' );


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
        console.log( searchTerm, offset, limit );
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


module.exports = router;

