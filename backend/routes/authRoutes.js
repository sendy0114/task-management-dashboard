const express = require('express');
const { signup, login, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/signup
router.post('/signup', signup);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/me
router.get('/me', authMiddleware, getMe);

module.exports = router;
