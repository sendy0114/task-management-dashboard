const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key_123', {
        expiresIn: '7d',
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_123');
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
