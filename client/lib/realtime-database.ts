import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  onValue,
  off,
  serverTimestamp
} from 'firebase/database';
import { database } from './firebase';

// Types for Realtime Database documents
export interface Train {
  id?: string;
  number: string;
  name: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  distance: string;
  runDays: string[];
  classes: {
    [key: string]: {
      fare: number;
      totalSeats: number;
      availableSeats: number;
      waitingList: number;
    };
  };
  amenities: string[];
  punctuality: number;
  rating: number;
  route: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Booking {
  id?: string;
  userId: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  journeyDate: string;
  bookingDate: any;
  class: string;
  quota: string;
  passengers: {
    name: string;
    age: number;
    gender: string;
    seatNumber?: string;
    berthPreference?: string;
  }[];
  totalFare: number;
  status: 'confirmed' | 'rac' | 'waitingList' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentId?: string;
  cancellationCharges?: number;
  refundAmount?: number;
  createdAt: any;
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  preferredClass?: string;
  kycVerified?: boolean;
  createdAt: any;
  lastLogin: any;
}

export interface PNRStatus {
  pnr: string;
  currentStatus: string;
  passengers: {
    name: string;
    age: number;
    gender: string;
    bookingStatus: string;
    currentStatus: string;
  }[];
  lastUpdated: any;
}

export interface LiveTrainStatus {
  trainNumber: string;
  currentLocation: {
    stationCode: string;
    stationName: string;
    latitude: number;
    longitude: number;
  };
  nextStation: {
    stationCode: string;
    stationName: string;
    scheduledTime: string;
    estimatedTime: string;
    platform?: string;
  };
  delay: number; // in minutes
  speed: number; // in km/h
  lastUpdated: any;
}

// User Services
export const userService = {
  // Create or update user profile
  async createOrUpdateUser(userData: UserProfile): Promise<void> {
    try {
      console.log('🔥 Attempting to save user profile to Realtime Database...');
      console.log('📊 Database instance:', database ? 'Available' : 'Not available');
      console.log('👤 User data:', userData);

      const userRef = ref(database, `users/${userData.uid}`);
      console.log('📍 Database reference path:', `users/${userData.uid}`);

      // Filter out undefined values - Firebase Realtime Database doesn't allow them
      const cleanUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== undefined)
      );

      const dataToSave = {
        ...cleanUserData,
        createdAt: cleanUserData.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('💾 Data to save (filtered):', dataToSave);

      await set(userRef, dataToSave);
      console.log('✅ User profile saved to Realtime Database successfully');
    } catch (error) {
      console.error('❌ Error saving user profile:', error);
      console.error('🔍 Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(uid: string, userData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = ref(database, `users/${uid}`);

      // Filter out undefined values - Firebase Realtime Database doesn't allow them
      const cleanUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== undefined)
      );

      await update(userRef, {
        ...cleanUserData,
        updatedAt: serverTimestamp()
      });
      console.log('User profile updated in Realtime Database');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Update last login
  async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = ref(database, `users/${uid}/lastLogin`);
      await set(userRef, serverTimestamp());
      console.log('Last login updated');
    } catch (error) {
      console.warn('Failed to update last login:', error);
    }
  }
};

// Train Services
export const trainService = {
  // Add new train
  async addTrain(trainData: Omit<Train, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const trainsRef = ref(database, 'trains');
      const newTrainRef = push(trainsRef);
      
      const trainWithTimestamps = {
        ...trainData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await set(newTrainRef, trainWithTimestamps);
      
      // Also add to trains by number index for faster lookup
      const trainByNumberRef = ref(database, `trainsByNumber/${trainData.number}`);
      await set(trainByNumberRef, newTrainRef.key);
      
      return newTrainRef.key!;
    } catch (error) {
      console.error('Error adding train:', error);
      throw error;
    }
  },

  // Get all trains
  async getAllTrains(): Promise<Train[]> {
    try {
      const trainsRef = ref(database, 'trains');
      const snapshot = await get(trainsRef);
      
      if (snapshot.exists()) {
        const trains: Train[] = [];
        snapshot.forEach((childSnapshot) => {
          trains.push({
            id: childSnapshot.key!,
            ...childSnapshot.val()
          });
        });
        return trains;
      }
      return [];
    } catch (error) {
      console.error('Error getting trains:', error);
      throw error;
    }
  },

  // Search trains by route
  async searchTrains(from: string, to: string, date: string): Promise<Train[]> {
    try {
      const trains = await this.getAllTrains();
      // Filter trains by route (simple implementation)
      return trains.filter(train => 
        train.from.toLowerCase().includes(from.toLowerCase()) &&
        train.to.toLowerCase().includes(to.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching trains:', error);
      throw error;
    }
  },

  // Get train by number
  async getTrainByNumber(trainNumber: string): Promise<Train | null> {
    try {
      // First check the index
      const indexRef = ref(database, `trainsByNumber/${trainNumber}`);
      const indexSnapshot = await get(indexRef);
      
      if (indexSnapshot.exists()) {
        const trainId = indexSnapshot.val();
        const trainRef = ref(database, `trains/${trainId}`);
        const trainSnapshot = await get(trainRef);
        
        if (trainSnapshot.exists()) {
          return {
            id: trainSnapshot.key!,
            ...trainSnapshot.val()
          } as Train;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting train by number:', error);
      throw error;
    }
  },

  // Update seat availability
  async updateSeatAvailability(trainId: string, className: string, seatsBooked: number): Promise<void> {
    try {
      const classRef = ref(database, `trains/${trainId}/classes/${className}`);
      const snapshot = await get(classRef);
      
      if (snapshot.exists()) {
        const classData = snapshot.val();
        const newAvailableSeats = classData.availableSeats - seatsBooked;
        
        let updates: any = {
          availableSeats: Math.max(0, newAvailableSeats),
          updatedAt: serverTimestamp()
        };
        
        if (newAvailableSeats < 0) {
          updates.waitingList = classData.waitingList + Math.abs(newAvailableSeats);
        }
        
        await update(classRef, updates);
      }
    } catch (error) {
      console.error('Error updating seat availability:', error);
      throw error;
    }
  }
};

// Booking Services
export const bookingService = {
  // Create new booking
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const bookingsRef = ref(database, 'bookings');
      const newBookingRef = push(bookingsRef);
      
      const bookingWithTimestamps = {
        ...bookingData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await set(newBookingRef, bookingWithTimestamps);
      
      // Add to user's bookings index
      const userBookingRef = ref(database, `userBookings/${bookingData.userId}/${newBookingRef.key}`);
      await set(userBookingRef, true);
      
      // Add to PNR index
      const pnrRef = ref(database, `bookingsByPNR/${bookingData.pnr}`);
      await set(pnrRef, newBookingRef.key);
      
      // Update train seat availability
      const train = await trainService.getTrainByNumber(bookingData.trainNumber);
      if (train && train.id) {
        await trainService.updateSeatAvailability(train.id, bookingData.class, bookingData.passengers.length);
      }
      
      return newBookingRef.key!;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get bookings by user
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const userBookingsRef = ref(database, `userBookings/${userId}`);
      const snapshot = await get(userBookingsRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const bookings: Booking[] = [];
      const bookingPromises: Promise<void>[] = [];
      
      snapshot.forEach((childSnapshot) => {
        const bookingId = childSnapshot.key!;
        const promise = (async () => {
          const bookingRef = ref(database, `bookings/${bookingId}`);
          const bookingSnapshot = await get(bookingRef);
          if (bookingSnapshot.exists()) {
            bookings.push({
              id: bookingId,
              ...bookingSnapshot.val()
            });
          }
        })();
        bookingPromises.push(promise);
      });
      
      await Promise.all(bookingPromises);
      
      // Sort by booking date (most recent first)
      return bookings.sort((a, b) => {
        const dateA = a.bookingDate?.seconds || a.bookingDate || 0;
        const dateB = b.bookingDate?.seconds || b.bookingDate || 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  },

  // Get booking by PNR
  async getBookingByPNR(pnr: string): Promise<Booking | null> {
    try {
      // Check PNR index
      const pnrIndexRef = ref(database, `bookingsByPNR/${pnr}`);
      const indexSnapshot = await get(pnrIndexRef);
      
      if (indexSnapshot.exists()) {
        const bookingId = indexSnapshot.val();
        const bookingRef = ref(database, `bookings/${bookingId}`);
        const bookingSnapshot = await get(bookingRef);
        
        if (bookingSnapshot.exists()) {
          return {
            id: bookingId,
            ...bookingSnapshot.val()
          } as Booking;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting booking by PNR:', error);
      throw error;
    }
  },

  // Cancel booking
  async cancelBooking(bookingId: string, cancellationCharges: number): Promise<void> {
    try {
      const bookingRef = ref(database, `bookings/${bookingId}`);
      const snapshot = await get(bookingRef);
      
      if (snapshot.exists()) {
        const booking = snapshot.val() as Booking;
        const refundAmount = booking.totalFare - cancellationCharges;
        
        await update(bookingRef, {
          status: 'cancelled',
          cancellationCharges,
          refundAmount,
          updatedAt: serverTimestamp()
        });
        
        // Restore seat availability
        const train = await trainService.getTrainByNumber(booking.trainNumber);
        if (train && train.id) {
          await trainService.updateSeatAvailability(train.id, booking.class, -booking.passengers.length);
        }
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(bookingId: string, paymentStatus: string, paymentId?: string): Promise<void> {
    try {
      const updateData: any = {
        paymentStatus,
        updatedAt: serverTimestamp()
      };
      
      if (paymentId) {
        updateData.paymentId = paymentId;
      }
      
      const bookingRef = ref(database, `bookings/${bookingId}`);
      await update(bookingRef, updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
};

// PNR Status Service
export const pnrService = {
  // Get PNR status
  async getPNRStatus(pnr: string): Promise<PNRStatus | null> {
    try {
      const booking = await bookingService.getBookingByPNR(pnr);
      if (booking) {
        return {
          pnr,
          currentStatus: booking.status,
          passengers: booking.passengers.map(p => ({
            ...p,
            bookingStatus: booking.status,
            currentStatus: booking.status
          })),
          lastUpdated: serverTimestamp()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting PNR status:', error);
      throw error;
    }
  }
};

// Live Train Tracking Service
export const liveTrackingService = {
  // Get live train status
  async getLiveTrainStatus(trainNumber: string): Promise<LiveTrainStatus | null> {
    try {
      const statusRef = ref(database, `liveTrainStatus/${trainNumber}`);
      const snapshot = await get(statusRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as LiveTrainStatus;
      }
      
      // If no live status exists, create a mock one for demo
      const mockStatus: LiveTrainStatus = {
        trainNumber,
        currentLocation: {
          stationCode: 'NDLS',
          stationName: 'New Delhi',
          latitude: 28.6431,
          longitude: 77.2197
        },
        nextStation: {
          stationCode: 'GZB',
          stationName: 'Ghaziabad',
          scheduledTime: '10:30',
          estimatedTime: '10:35',
          platform: '3'
        },
        delay: 5,
        speed: 85,
        lastUpdated: serverTimestamp()
      };
      
      // Save the mock status
      await set(statusRef, mockStatus);
      return mockStatus;
    } catch (error) {
      console.error('Error getting live train status:', error);
      throw error;
    }
  },

  // Update live train status (for admin/system use)
  async updateLiveTrainStatus(trainNumber: string, statusData: Partial<LiveTrainStatus>): Promise<void> {
    try {
      const statusRef = ref(database, `liveTrainStatus/${trainNumber}`);
      await update(statusRef, {
        ...statusData,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating live train status:', error);
      throw error;
    }
  },

  // Subscribe to live train status updates
  subscribeLiveTrainStatus(trainNumber: string, callback: (status: LiveTrainStatus | null) => void): () => void {
    const statusRef = ref(database, `liveTrainStatus/${trainNumber}`);
    
    const unsubscribe = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as LiveTrainStatus);
      } else {
        callback(null);
      }
    });
    
    return () => off(statusRef, 'value', unsubscribe);
  }
};

// Utility function to generate PNR
export const generatePNR = (): string => {
  return Math.random().toString(36).substr(2, 10).toUpperCase();
};
