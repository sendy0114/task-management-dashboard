const admin = require('firebase-admin');
const path = require('path');

// NOTE: You must place your serviceAccountKey.json in this directory
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

let db;

try {
    // Try environment variables first (Production/Deployment)
    if (process.env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle private key newlines correctly
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase initialized from Environment Variables');
    } else {
        // Fallback to local file (Development)
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase initialized from serviceAccountKey.json');
    }
    db = admin.firestore();
} catch (error) {
    console.error('Firebase initialization error:', error.message);
    db = null;
}

module.exports = { admin, db };
