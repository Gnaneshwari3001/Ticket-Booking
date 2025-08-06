import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { enableNetwork, disableNetwork } from 'firebase/firestore';

export const useFirebaseConnection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      try {
        await enableNetwork(db);
        setIsFirebaseConnected(true);
        console.log('Firebase connection restored');
      } catch (error) {
        console.warn('Failed to restore Firebase connection:', error);
        setIsFirebaseConnected(false);
      }
    };

    const handleOffline = async () => {
      setIsOnline(false);
      try {
        await disableNetwork(db);
        setIsFirebaseConnected(false);
        console.log('Firebase connection disabled');
      } catch (error) {
        console.warn('Failed to disable Firebase connection:', error);
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial connection state
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isFirebaseConnected,
    connectionStatus: isOnline && isFirebaseConnected ? 'connected' : 'offline'
  };
};
