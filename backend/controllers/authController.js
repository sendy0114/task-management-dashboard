const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase');
const { generateToken } = require('../utils/tokenUtils');

const signup = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // 1. Validation
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 2. Check if user exists
        const userRef = db.collection('users').where('email', '==', email);
        const snapshot = await userRef.get();

        if (!snapshot.empty) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Save to Firestore
        const newUser = {
            fullName,
            email,
            password: hashedPassword,
            role, // 'admin' or 'user'
            createdAt: new Date().toISOString(),
        };

        const docRef = await db.collection('users').add(newUser);
        const userId = docRef.id;

        // 5. Generate JWT
        const token = generateToken({ id: userId, email, role });

        res.status(201).json({
            token,
            user: { id: userId, fullName, email, role },
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check user exists
        const userRef = db.collection('users').where('email', '==', email);
        const snapshot = await userRef.get();

        if (snapshot.empty) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const userData = snapshot.docs[0].data();
        const userId = snapshot.docs[0].id;

        // 2. Verify password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Generate JWT
        const token = generateToken({ id: userId, email, role: userData.role });

        res.json({
            token,
            user: { id: userId, fullName: userData.fullName, email, role: userData.role },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const getMe = async (req, res) => {
    try {
        // req.user is populated by authMiddleware
        const userSnapshot = await db.collection('users').doc(req.user.id).get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = userSnapshot.data();
        delete userData.password;

        res.json({ ...userData, id: userSnapshot.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signup, login, getMe };
