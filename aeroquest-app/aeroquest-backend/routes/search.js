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


// Add Item to Search History 
// router.post('/add', authorizationMiddleware, async (req, res, next) => {
//     try {
//         console.log( `Req User: `, req.user );
//         console.log( `Request Body: `, req.body );
//         const { searchTerm, userId: bodyUserId } = req.body;
//         const tokenUserId = req.user?.id;


//         let query = '';
//         let values = [searchTerm];
//         const userId = tokenUserId || bodyUserId;

//         console.log( `UserID: `, userId );
//         console.log( `Values: `, values );
        
//         if (userId) {
//             query = `INSERT INTO search_history (search_term, user_id) VALUES ($1, $2) RETURNING *`;
//             values.push(userId);
//         } else {
//             query = `INSERT INTO search_history (search_term) VALUES ($1) RETURNING *`;
//         }

//         const result = await pool.query(query, values);
//         console.log( `Result: `, result.rows[0] );

//         if ( result.rows.length > 0 ) {
//             console.log('Search term added to history:', result.rows[0]);
//             const search = result.rows[0];
//             return res.status(200).json({ message: `${searchTerm} was added to the search history!`, data: search });
//         } else {
//             throw new Error('Failed to add search to search history');
//         }
//     } catch (error) {
//         console.error('Error adding search to search history:', error.message);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.post( '/add', authorizationMiddleware, async ( req, res, next ) => {
    try{
        if( !req.user ){
            return res.status( 401 ).json({ message: 'Unauthorized!' });
        }

        const { searchTerm } = req.body;
        const userId = req.user.id;
        console.log( userId );
        const query = `
        INSERT INTO search_history ( search_term, user_id )
        VALUES ( $1, $2 )
        RETURNING *`;
        const values = [ searchTerm, userId ];
        const result = await pool.query( query, values );
        console.log( result.rows );

        if ( result.rows.length > 0 ){
            const search = result.rows[0];
            return res.status( 200 ).json({ message: `Successfully added ${ searchTerm } to user search history!`, data: search }); 
        }
        else{
            throw new Error( `Failed to add search to search history!` );
        }

    }
    catch( error ){
        console.error( `Error adding search term to search history!`, error.message );
    }
})


// Get Search History of User 
router.get( '/history/:userId', authorizationMiddleware, async ( req, res, next ) => {
    try{
        const { userId } = req.params;
        const query = `SELECT * FROM search_history WHERE user_id = $1`;
        const result = await pool.query( query, [ userId ]);
        if (result.rows.length > 0) {
            const searches = result.rows;
            return res.status(200).json({ message: 'Successfully retrieved user history!', searches });
        } else {
            return res.status(200).json({ message: 'No searches in user history!' });
        }
    }
    catch( error ){
        console.error( 'Error fetching user search history:', error.message );
        return res.status( 500 ).json({ error: 'Internal Server Error' });
    }
});


// Remove Item from Search History 
router.delete('/remove', authorizationMiddleware, async (req, res, next) => {
    const { userId, searchId } = req.body;
    console.log(userId, searchId);
    try {
        const result = await pool.query(
            `DELETE FROM search_history WHERE user_id = $1 AND id = $2 RETURNING *`, 
            [userId, searchId]
        );
        if (result.rowCount > 0) { 
            console.log('Search term removed from history:', result.rows[0]);
            return res.status(200).json({ message: 'Search Item was successfully removed!' });
        } else {
            return res.status(404).json({ message: 'No search item found with the specified ID!' });
        }
    } catch (error) {
        console.error('Error removing search item', error.message);
        return res.status(500).json({ message: 'Internal Server Error!' });
    }
});

module.exports = router;

