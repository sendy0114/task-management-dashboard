const admin = require('firebase-admin');
const path = require('path');

// NOTE: You must place your serviceAccountKey.json in this directory
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

let db;

try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully');
    db = admin.firestore();
} catch (error) {
    console.error('Firebase Admin initialization error (serviceAccountKey.json missing or invalid):', error.message);
    console.warn('Backend is running, but database operations will fail.');
    // Provide a mock or null db to prevent absolute crashes on startup, 
    // but actual calls will still fail if not handled.
    db = null;
}

module.exports = { admin, db };
