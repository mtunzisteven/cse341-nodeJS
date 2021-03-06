const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization');
    
    if(!authHeader){
        const error = new Error('Not Authenticated[No authHeader]: Error!');
        error.statusCode = 401;
    }

    const token = authHeader.split(' ')[1];

    let decodedToken;

    try{
        decodedToken = jwt.verify(token, 'somedevelopercreatedsecretusedtosignthetoken'); // same secret created in login middleware of auth controller

    } catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not Authenticated: Error!');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
};