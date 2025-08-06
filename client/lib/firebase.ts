import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
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
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Add connection monitoring
if (typeof window !== 'undefined') {
  // Monitor online/offline status
  window.addEventListener('online', async () => {
    console.log('Connection restored, enabling Firestore network');
    try {
      await enableNetwork(db);
    } catch (error) {
      console.warn('Failed to enable Firestore network:', error);
    }
  });

  window.addEventListener('offline', async () => {
    console.log('Connection lost, disabling Firestore network');
    try {
      await disableNetwork(db);
    } catch (error) {
      console.warn('Failed to disable Firestore network:', error);
    }
  });
}

// Helper function to check if Firebase is available
export const isFirebaseAvailable = async (): Promise<boolean> => {
  try {
    // Try a simple operation to test connectivity
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.warn('Firebase unavailable:', error);
    return false;
  }
};

export default app;
