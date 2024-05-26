// Bookmarks Routes 


// Dependencies 
const express = require( 'express' );
const router = express.Router();
const pool = require( '../pool' );

// Necessary Files
const { SECRET_KEY, ACCESS_KEY } = require( '../config' ); 
const authorizationMiddleware = require( '../middleware/authorization' );


// Routes 


// Add Bookmark 
router.post( '/add', authorizationMiddleware, async ( req, res, next ) => {
    try{
        const { userId, endpoint, responseData, notes } = req.body;;
        console.log( req.body );
        const query = `
        INSERT INTO bookmarks ( user_id, endpoint, response_data, notes )
        VALUES ($1, $2, $3, $4 )
        RETURNING *;
        `;
        const result = await pool.query( query, [ userId, endpoint, responseData, notes ]);
        console.log( 'Result:', result );
        const bookmark = result.rows[0];
        console.log( 'Added Bookmark:', bookmark );
        res.status( 200 ).json({ message: `Bookmark added successfully!`, bookmark });
    }   
    catch( error ){
        console.error( 'Error adding a bookmark', error );
        return res.status( 500 ).json({ message: 'Internal server error!' });
    }
});


// List Bookmarks
router.get('/list/:userId', authorizationMiddleware, async (req, res) => {
    try {
      const userId = req.params.userId;
      const query = 'SELECT * FROM bookmarks WHERE user_id = $1';
      const result = await pool.query(query, [userId]);
      const bookmarks = result.rows;
      if( bookmarks.length === 0 ){
        return res.status( 200 ).json({ message: `You currently don't have any bookmarks!`, bookmarks });
      }
      res.status(200).json({ message: 'Bookmarks retrieved successfully', bookmarks });
    } catch (error) {
      console.error('Error listing bookmarks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Delete Bookmark
router.delete( '/remove/:bookmarkId', authorizationMiddleware, async ( req, res ) => {
    try {
      const userId = req.user.id;
      const { bookmarkId } = req.params;
      const query = 'DELETE FROM bookmarks WHERE id = $1 AND user_id = $2 RETURNING *';
      const result = await pool.query(query, [bookmarkId, userId]);
      const bookmark = result.rows[0];
      if (!bookmark) {
        return res.status(404).json({ message: 'Bookmark not found' });
      }
      res.status(200).json({ message: 'Bookmark removed successfully', bookmark });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Modify Bookmark
router.put( '/modify/:bookmarkId', authorizationMiddleware, async ( req, res ) => {
    try {
      const userId = req.user.id;
      const { bookmarkId } = req.params;
      const { notes } = req.body;
      const query = 'UPDATE bookmarks SET notes = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
      const result = await pool.query(query, [notes, bookmarkId, userId]);
      const updatepoolookmark = result.rows[0];
      if (!updatepoolookmark) {
        return res.status(404).json({ message: 'Bookmark not found or you do not have permission to modify it' });
      }
      res.status(200).json({ message: 'Bookmark updated successfully', bookmark: updatepoolookmark });
    } catch (error) {
      console.error('Error modifying bookmark:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports = router;
