// Search Routes 


// Dependencies 
const express = require( 'express' );
const router = express.Router();
const axios = require( 'axios' );


// Necessary Files 
const db = require( '../db' );
const { SECRET_KEY, ACCESS_KEY } = require( '../config' );


// API Endpoints 
const AIRPLANES_ENDPOINT_BASE = 'http://api.aviationstack.com/v1/airplanes';
const AIRLINES_ENDPOINT_BASE = 'http://api.aviationstack.com/v1/airlines';
const AIRPORTS_ENDPOINT_BASE = 'http://api.aviationstack.com/v1/airports';


// Routes 


// Search Routes  
router.get( '/:type', async ( req, res, next ) => {
    try{
        const { type } = req.params;
        console.log( type );
        const { searchTerm, offset = 0, limit = 30 } = req.query;
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

        const response = await axios.get( endpoint, {
            params: {
                access_key: ACCESS_KEY,
                search: searchTerm,
                offset,
                limit
            },
        });

        console.log( response.data.data );
        return res.status( 200 ).json({ message: `${ type } Information`, data: response.data.data });
    }
    catch( error ){
        console.error( `Error: `, error.response.data.error );
        res.status( 500 ).json({ error: 'Internal Server Error' });
    }
});


// router.get('/history/:userId', async (req, res) => {
//     try {
//       const { userId } = req.params;
//       const result = await db.query(
//         'SELECT * FROM searches WHERE user_id = $1 ORDER BY search_timestamp DESC',
//         [userId]
//       );
//       res.status(200).json({ data: result.rows });
//     } catch (error) {
//       console.error('Error fetching search history:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });


module.exports = router;

