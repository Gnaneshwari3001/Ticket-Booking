import { ref, get, set } from 'firebase/database';
import { database } from './firebase';
import { populateSampleData } from './sample-railway-data';

export const initializeDatabase = async () => {
  try {
    console.log('Checking if database needs initialization...');
    
    // Check if trains already exist
    const trainsRef = ref(database, 'trains');
    const snapshot = await get(trainsRef);
    
    if (!snapshot.exists()) {
      console.log('Database is empty, populating with sample data...');
      await populateSampleData();
      
      // Set initialization flag
      const initRef = ref(database, 'initialized');
      await set(initRef, {
        timestamp: new Date().toISOString(),
        version: '1.0'
      });
      
      console.log('Database initialized successfully!');
      return true;
    } else {
      console.log('Database already contains data');
      return false;
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Function to reset database (for testing purposes)
export const resetDatabase = async () => {
  try {
    console.log('Resetting database...');
    
    // Remove all data
    const rootRef = ref(database, '/');
    await set(rootRef, null);
    
    // Re-populate with sample data
    await populateSampleData();
    
    // Set initialization flag
    const initRef = ref(database, 'initialized');
    await set(initRef, {
      timestamp: new Date().toISOString(),
      version: '1.0',
      reset: true
    });
    
    console.log('Database reset and re-initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    return false;
  }
};
