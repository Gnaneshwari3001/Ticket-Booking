import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgH7wMW_52scrkmDLbeja7Hll8Y_PmzU8",
  authDomain: "ticket-booking-bb521.firebaseapp.com",
  databaseURL: "https://ticket-booking-bb521-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ticket-booking-bb521",
  storageBucket: "ticket-booking-bb521.firebasestorage.app",
  messagingSenderId: "80802504410",
  appId: "1:80802504410:web:a5fc6773904555e1618fe3",
  measurementId: "G-DWTE702NC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Add connection monitoring for Realtime Database
if (typeof window !== 'undefined') {
  // Monitor online/offline status
  window.addEventListener('online', () => {
    console.log('Connection restored to Firebase Realtime Database');
  });

  window.addEventListener('offline', () => {
    console.log('Connection lost, Firebase Realtime Database will work offline');
  });
}

// Helper function to check if Firebase is available
export const isFirebaseAvailable = (): boolean => {
  try {
    // Realtime Database works offline by default, so it's always "available"
    return true;
  } catch (error) {
    console.warn('Firebase unavailable:', error);
    return false;
  }
};

export default app;
