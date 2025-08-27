require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

// The verifyToken function verifies the token provided in the request header.
module.exports.verifyToken = function (req, res, next) {

    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader === 'undefined') {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    try {
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            console.error('Token verification error:', error);
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
    }
};

module.exports.verifyIsAdmin = function (req, res, next) {
    
    if (req.user.role !== 2) {
        return res.status(403).json({ error: 'Requires administrator role.' });
    }
    next();

};