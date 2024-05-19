// Create custom Express Error Handler class that extends the Error class 

class ExpressError extends Error {
    constructor( message, status ){
        super();
        this.message = message;
        this.status = status;
        console.error( this.stack );
    }
}

module.exports = ExpressError;