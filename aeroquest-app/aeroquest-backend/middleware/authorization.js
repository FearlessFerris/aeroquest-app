// Authentification Middleware Implementation 


// Dependencies 
const jwt = require( 'jsonwebtoken' );


// Components / Necessary Files 
const { SECRET_KEY, ACCESS_KEY } = require( '../config' );


// Authorization Middleware 
const authorizationMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        req.user = null; // Set user to null if no token is provided
        return next(); // Continue without throwing an error
    }

    const tokenWithoutBearer = token.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        req.user = null; // Set user to null if token is invalid
        next(); // Continue without throwing an error
    }
};



module.exports = authorizationMiddleware;