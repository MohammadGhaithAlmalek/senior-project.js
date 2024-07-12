const userModel = require('../models/userModel');

const tokenValidationMiddleware = async (req, res, next) => {
    try {
        const expired = await userModel.isTokenExpired(req.body);
        if (expired.expired) {
            console.log('Token is valid');
            next();
        } else {
            console.log('Token is expired');
            res.status(401).json({ message: 'Token is expired' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

 module.exports ={ tokenValidationMiddleware};