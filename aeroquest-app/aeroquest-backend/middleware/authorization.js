// Authentification Middleware Implementation 


// Dependencies 
const jwt = require( 'jsonwebtoken' );


// Components / Necessary Files 
const { SECRET_KEY, ACCESS_KEY } = require( '../config' );



// Authorization Middleware
const authorizationMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith( 'Bearer ' )) {
        return res.status(401).json({ message: 'Authorization Token is required!' });
    }

    const tokenWithoutBearer = token.split(' ')[1];
    try {
        const decoded = jwt.verify( tokenWithoutBearer, SECRET_KEY );
        req.user = decoded;
        next();
    } catch (error) {
        // return res.status(401).json({ message: 'Invalid Token' });
        next({ status: 401, message: 'Invalid Token' });
    }
};


module.exports = authorizationMiddleware;