const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const protectAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(401, 'Unauthorized: missing token'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        req.admin = { username: decoded.username };
        return next();
    } catch (error) {
        return next(new ApiError(401, 'Unauthorized: invalid token'));
    }
};

module.exports = { protectAdmin };