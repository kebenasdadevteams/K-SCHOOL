// backend/config/firebase-admin.js
const admin = require('firebase-admin');
const path = require('path');

let firebaseAdmin = null;

try {
  // Try to load from file
  let serviceAccount;
  try {
    const serviceAccountPath = path.join(__dirname, '../service-account-key.json');
    serviceAccount = require(serviceAccountPath);
    console.log('✅ Firebase service account loaded from file');
  } catch (error) {
    console.warn('Service account file not found:', error.message);
  }
  
  // If not found in file, try environment variable
  if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('✅ Firebase service account loaded from environment');
    } catch (error) {
      console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', error);
    }
  }
  
  if (serviceAccount) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized successfully');
  } else {
    console.warn('⚠️ Firebase Admin not configured. Google Sign-In will not work.');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
}

module.exports = firebaseAdmin;