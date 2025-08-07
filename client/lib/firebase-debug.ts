import { ref, set, get, serverTimestamp } from 'firebase/database';
import { database } from './firebase';

// Test Firebase Realtime Database connection and permissions
export const testFirebaseConnection = async () => {
  console.log('🔥 Testing Firebase Realtime Database connection...');
  
  try {
    // Test basic write operation
    const testRef = ref(database, 'test/connection');
    const testData = {
      message: 'Hello Firebase!',
      timestamp: serverTimestamp(),
      testId: Math.random().toString(36).substr(2, 9)
    };
    
    console.log('📝 Attempting to write test data...');
    await set(testRef, testData);
    console.log('✅ Write operation successful');
    
    // Test read operation
    console.log('📖 Attempting to read test data...');
    const snapshot = await get(testRef);
    
    if (snapshot.exists()) {
      console.log('✅ Read operation successful:', snapshot.val());
      
      // Cleanup test data
      await set(testRef, null);
      console.log('🧹 Test data cleaned up');
      
      return true;
    } else {
      console.error('❌ No data found after write operation');
      return false;
    }
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    
    // Check if it's a permission error
    if (error instanceof Error) {
      if (error.message.includes('permission') || error.message.includes('PERMISSION_DENIED')) {
        console.error('🚫 This appears to be a permission/rules issue');
        console.log('💡 To fix this, update your Firebase Realtime Database rules to:');
        console.log(`
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
        `);
      }
    }
    
    return false;
  }
};

// Test user creation specifically
export const testUserCreation = async (uid: string) => {
  console.log(`🧪 Testing user creation for UID: ${uid}`);
  
  try {
    const userRef = ref(database, `users/${uid}`);
    const testUser = {
      uid,
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };
    
    console.log('📝 Writing test user data...');
    await set(userRef, testUser);
    console.log('✅ User write successful');
    
    // Verify the write
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      console.log('✅ User read successful:', snapshot.val());
      return true;
    } else {
      console.error('❌ User data not found after write');
      return false;
    }
  } catch (error) {
    console.error('❌ User creation test failed:', error);
    return false;
  }
};

// Debug database rules
export const debugDatabaseRules = () => {
  console.log(`
🔧 Firebase Realtime Database Debug Info:

Database URL: ${database.app.options.databaseURL}
Project ID: ${database.app.options.projectId}

Common Issues & Solutions:

1. 🚫 Permission Denied Error:
   - Go to Firebase Console > Realtime Database > Rules
   - Update rules to allow authenticated users:
   {
     "rules": {
       ".read": "auth != null",
       ".write": "auth != null"
     }
   }

2. 🌐 Wrong Database URL:
   - Verify the databaseURL in firebase config
   - Should match your Firebase project's database URL

3. 🔑 Authentication Required:
   - Ensure user is logged in before database operations
   - Check if Firebase Auth is working properly

4. 📝 Data Not Persisting:
   - Check network connectivity
   - Verify database rules allow writes
   - Check browser console for errors
  `);
};
