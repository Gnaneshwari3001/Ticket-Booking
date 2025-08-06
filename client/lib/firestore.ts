import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

// Types for Firestore documents
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  bookingDate: Timestamp;
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  lastUpdated: Timestamp;
}

// Train Services
export const trainService = {
  // Search trains by route and date
  async searchTrains(from: string, to: string, date: string): Promise<Train[]> {
    try {
      const trainsRef = collection(db, 'trains');
      const q = query(
        trainsRef,
        where('from', '==', from),
        where('to', '==', to),
        orderBy('departure')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Train));
    } catch (error) {
      console.error('Error searching trains:', error);
      throw error;
    }
  },

  // Get train by number
  async getTrainByNumber(trainNumber: string): Promise<Train | null> {
    try {
      const trainsRef = collection(db, 'trains');
      const q = query(trainsRef, where('number', '==', trainNumber), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Train;
    } catch (error) {
      console.error('Error getting train:', error);
      throw error;
    }
  },

  // Add new train (admin only)
  async addTrain(trainData: Omit<Train, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const trainWithTimestamps = {
        ...trainData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, 'trains'), trainWithTimestamps);
      return docRef.id;
    } catch (error) {
      console.error('Error adding train:', error);
      throw error;
    }
  },

  // Update train availability
  async updateSeatAvailability(trainId: string, className: string, seatsBooked: number): Promise<void> {
    try {
      const trainRef = doc(db, 'trains', trainId);
      const trainDoc = await getDoc(trainRef);
      
      if (trainDoc.exists()) {
        const trainData = trainDoc.data() as Train;
        const updatedClasses = { ...trainData.classes };
        
        if (updatedClasses[className]) {
          updatedClasses[className].availableSeats -= seatsBooked;
          if (updatedClasses[className].availableSeats < 0) {
            updatedClasses[className].waitingList += Math.abs(updatedClasses[className].availableSeats);
            updatedClasses[className].availableSeats = 0;
          }
        }
        
        await updateDoc(trainRef, {
          classes: updatedClasses,
          updatedAt: Timestamp.now()
        });
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
      const now = Timestamp.now();
      const bookingWithTimestamps = {
        ...bookingData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, 'bookings'), bookingWithTimestamps);
      
      // Update train seat availability
      const train = await trainService.getTrainByNumber(bookingData.trainNumber);
      if (train && train.id) {
        await trainService.updateSeatAvailability(train.id, bookingData.class, bookingData.passengers.length);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get bookings by user
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('userId', '==', userId),
        orderBy('bookingDate', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  },

  // Get booking by PNR
  async getBookingByPNR(pnr: string): Promise<Booking | null> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('pnr', '==', pnr), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Booking;
    } catch (error) {
      console.error('Error getting booking by PNR:', error);
      throw error;
    }
  },

  // Cancel booking
  async cancelBooking(bookingId: string, cancellationCharges: number): Promise<void> {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);
      
      if (bookingDoc.exists()) {
        const booking = bookingDoc.data() as Booking;
        const refundAmount = booking.totalFare - cancellationCharges;
        
        await updateDoc(bookingRef, {
          status: 'cancelled',
          cancellationCharges,
          refundAmount,
          updatedAt: Timestamp.now()
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
        updatedAt: Timestamp.now()
      };
      
      if (paymentId) {
        updateData.paymentId = paymentId;
      }
      
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, updateData);
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
      const pnrRef = collection(db, 'pnrStatus');
      const q = query(pnrRef, where('pnr', '==', pnr), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // If no PNR status record exists, get from booking
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
            lastUpdated: Timestamp.now()
          };
        }
        return null;
      }
      
      const doc = snapshot.docs[0];
      return doc.data() as PNRStatus;
    } catch (error) {
      console.error('Error getting PNR status:', error);
      throw error;
    }
  },

  // Update PNR status
  async updatePNRStatus(pnr: string, statusData: Partial<PNRStatus>): Promise<void> {
    try {
      const pnrRef = collection(db, 'pnrStatus');
      const q = query(pnrRef, where('pnr', '==', pnr), limit(1));
      const snapshot = await getDocs(q);
      
      const updateData = {
        ...statusData,
        lastUpdated: Timestamp.now()
      };
      
      if (snapshot.empty) {
        // Create new PNR status record
        await addDoc(pnrRef, { pnr, ...updateData });
      } else {
        // Update existing record
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, updateData);
      }
    } catch (error) {
      console.error('Error updating PNR status:', error);
      throw error;
    }
  }
};

// Utility function to generate PNR
export const generatePNR = (): string => {
  return Math.random().toString(36).substr(2, 10).toUpperCase();
};
