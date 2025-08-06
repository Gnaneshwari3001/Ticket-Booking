import { Timestamp } from 'firebase/firestore';

// Train Types as per IRCTC
export enum TrainType {
  EXPRESS = 'Express Trains',
  SUPERFAST_EXPRESS = 'Superfast Express',
  PASSENGER = 'Passenger Trains',
  MAIL = 'Mail Trains',
  RAJDHANI_EXPRESS = 'Rajdhani Express',
  SHATABDI_EXPRESS = 'Shatabdi Express',
  DURONTO_EXPRESS = 'Duronto Express',
  GARIB_RATH_EXPRESS = 'Garib Rath Express',
  JAN_SHATABDI_EXPRESS = 'Jan Shatabdi Express',
  SAMPARK_KRANTI_EXPRESS = 'Sampark Kranti Express',
  INTERCITY_EXPRESS = 'Intercity Express',
  DOUBLE_DECKER_EXPRESS = 'Double Decker Express',
  LOCAL_EMU_MEMU = 'Local/EMU/MEMU Trains',
  VANDE_BHARAT_EXPRESS = 'Vande Bharat Express',
  HUMSAFAR_EXPRESS = 'Humsafar Express',
  TEJAS_EXPRESS = 'Tejas Express',
  SPECIAL_TRAINS = 'Special Trains'
}

// Train Classes
export enum TrainClass {
  AC_FIRST_CLASS = '1A',
  AC_2_TIER = '2A',
  AC_3_TIER = '3A',
  AC_3_TIER_ECONOMY = '3E',
  AC_CHAIR_CAR = 'CC',
  SLEEPER = 'SL',
  SECOND_SITTING = '2S',
  FIRST_CLASS = 'FC',
  ANUBHUTI = 'EA',
  VISTADOME = 'VD'
}

// Quota Types
export enum QuotaType {
  GENERAL = 'GN',
  TATKAL = 'TQ',
  LADIES = 'LD',
  SENIOR_CITIZEN = 'SS',
  HANDICAPPED = 'HP',
  DEFENCE = 'DF',
  FOREIGN_TOURIST = 'FT',
  LOWER_BERTH = 'LB',
  PREMIUM_TATKAL = 'PT',
  PHYSICALLY_HANDICAPPED = 'PH'
}

// Station Interface
export interface Station {
  id?: string;
  stationCode: string;
  stationName: string;
  city: string;
  state: string;
  zone: string;
  division: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  platforms?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Train Interface
export interface TrainMaster {
  id?: string;
  trainNumber: string;
  trainName: string;
  trainType: TrainType;
  sourceStationCode: string;
  destinationStationCode: string;
  sourceStationName: string;
  destinationStationName: string;
  runDays: string[]; // ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  distance: number; // in kilometers
  duration: string; // in format "HH:MM"
  averageSpeed: number; // km/h
  punctuality: number; // percentage
  rating: number; // 1-5 stars
  amenities: string[];
  pantryAvailable: boolean;
  wifiAvailable: boolean;
  emergencyBrake: boolean;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Train Schedule Interface
export interface TrainSchedule {
  id?: string;
  trainId: string;
  trainNumber: string;
  stationId: string;
  stationCode: string;
  stationName: string;
  arrivalTime?: string; // HH:MM format
  departureTime?: string; // HH:MM format
  dayNumber: number; // 1, 2, 3 for multi-day journeys
  distanceFromSource: number; // kilometers
  haltTime: number; // minutes
  platform?: string;
  routeSequence: number; // 1, 2, 3, ... for station order
  stoppingType: 'STOP' | 'TECHNICAL_STOP' | 'PASS'; // Whether train stops or passes
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Seat Configuration Interface
export interface SeatConfiguration {
  id?: string;
  trainId: string;
  trainNumber: string;
  classType: TrainClass;
  coachCount: number;
  seatsPerCoach: number;
  totalSeats: number;
  baseFare: number; // per kilometer
  reservationCharge: number;
  superFastCharge: number;
  cateringCharge?: number;
  tatkalCharge: number; // percentage of base fare
  dynamicFareEnabled: boolean;
  waitingListLimit: number;
  racLimit: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Seat Availability Interface
export interface SeatAvailability {
  id?: string;
  trainId: string;
  trainNumber: string;
  journeyDate: string; // YYYY-MM-DD
  fromStationCode: string;
  toStationCode: string;
  classType: TrainClass;
  quotaType: QuotaType;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  racSeats: number;
  waitingListCount: number;
  currentFare: number;
  surgeMultiplier: number; // for dynamic pricing
  lastUpdated: Timestamp;
}

// Fare Calculation Interface
export interface FareBreakdown {
  baseFare: number;
  reservationCharge: number;
  superFastCharge: number;
  cateringCharge: number;
  tatkalCharge: number;
  dynamicFareCharge: number;
  gst: number;
  insurance: number;
  totalFare: number;
  discountApplied: number;
  finalFare: number;
}

// Live Running Status Interface
export interface LiveTrainStatus {
  id?: string;
  trainNumber: string;
  journeyDate: string;
  currentStationCode: string;
  currentStationName: string;
  currentStatus: 'ON_TIME' | 'LATE' | 'RESCHEDULED' | 'CANCELLED' | 'DIVERTED';
  delayMinutes: number;
  nextStationCode: string;
  nextStationName: string;
  estimatedArrival: string;
  estimatedDeparture: string;
  lastUpdateTime: Timestamp;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  averageSpeed: number;
  distanceCovered: number;
  distanceRemaining: number;
}

// Booking Interface (Enhanced)
export interface EnhancedBooking {
  id?: string;
  userId: string;
  pnr: string;
  trainId: string;
  trainNumber: string;
  trainName: string;
  trainType: TrainType;
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  journeyDate: string;
  bookingDate: Timestamp;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: number;
  classType: TrainClass;
  quotaType: QuotaType;
  passengers: {
    name: string;
    age: number;
    gender: 'M' | 'F' | 'O';
    seatNumber?: string;
    berthPreference?: 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER' | 'NO_PREFERENCE';
    coachNumber?: string;
    currentStatus: 'CNF' | 'RAC' | 'WL' | 'CAN';
    waitingListNumber?: number;
    racPosition?: number;
  }[];
  fareBreakdown: FareBreakdown;
  totalFare: number;
  status: 'CONFIRMED' | 'RAC' | 'WAITING_LIST' | 'CANCELLED' | 'CHART_PREPARED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  paymentId?: string;
  cancellationCharges?: number;
  refundAmount?: number;
  chartStatus: 'NOT_PREPARED' | 'PREPARED';
  boardingPoint?: string;
  droppingPoint?: string;
  mobileNumber: string;
  emailId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Major Indian Railway Stations
export const MAJOR_STATIONS: Omit<Station, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Delhi
  { stationCode: 'NDLS', stationName: 'New Delhi', city: 'Delhi', state: 'Delhi', zone: 'NR', division: 'DLI', platforms: 16 },
  { stationCode: 'DLI', stationName: 'Delhi', city: 'Delhi', state: 'Delhi', zone: 'NR', division: 'DLI', platforms: 12 },
  { stationCode: 'DEC', stationName: 'Delhi Cantt', city: 'Delhi', state: 'Delhi', zone: 'NR', division: 'DLI', platforms: 6 },
  
  // Mumbai
  { stationCode: 'CSTM', stationName: 'Mumbai CST', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', division: 'BB', platforms: 18 },
  { stationCode: 'BCT', stationName: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'WR', division: 'BB', platforms: 7 },
  { stationCode: 'LTT', stationName: 'Lokmanya Tilak T', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', division: 'BB', platforms: 5 },
  
  // Kolkata
  { stationCode: 'HWH', stationName: 'Howrah Jn', city: 'Kolkata', state: 'West Bengal', zone: 'ER', division: 'HWH', platforms: 23 },
  { stationCode: 'KOAA', stationName: 'Kolkata', city: 'Kolkata', state: 'West Bengal', zone: 'ER', division: 'KOAA', platforms: 12 },
  { stationCode: 'SDAH', stationName: 'Sealdah', city: 'Kolkata', state: 'West Bengal', zone: 'ER', division: 'SDAH', platforms: 20 },
  
  // Chennai
  { stationCode: 'MAS', stationName: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', division: 'MAS', platforms: 12 },
  { stationCode: 'MSB', stationName: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', division: 'MAS', platforms: 11 },
  
  // Bangalore
  { stationCode: 'SBC', stationName: 'KSR Bengaluru', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', division: 'BNC', platforms: 10 },
  { stationCode: 'YPRJ', stationName: 'Yesvantpur Jn', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', division: 'BNC', platforms: 6 },
  
  // Hyderabad
  { stationCode: 'SC', stationName: 'Secunderabad Jn', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', division: 'SC', platforms: 10 },
  { stationCode: 'HYB', stationName: 'Hyderabad Decan', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', division: 'SC', platforms: 6 },
  { stationCode: 'KCG', stationName: 'Kacheguda', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', division: 'SC', platforms: 6 },
  
  // Pune
  { stationCode: 'PUNE', stationName: 'Pune Jn', city: 'Pune', state: 'Maharashtra', zone: 'CR', division: 'PUNE', platforms: 6 },
  
  // Ahmedabad
  { stationCode: 'ADI', stationName: 'Ahmedabad Jn', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR', division: 'AII', platforms: 12 },
  
  // Jaipur
  { stationCode: 'JP', stationName: 'Jaipur', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR', division: 'JP', platforms: 6 },
  
  // Lucknow
  { stationCode: 'LJN', stationName: 'Lucknow Jn', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NER', division: 'LKO', platforms: 6 },
  
  // Patna
  { stationCode: 'PNBE', stationName: 'Patna Jn', city: 'Patna', state: 'Bihar', zone: 'ECR', division: 'PNBE', platforms: 10 },
  
  // Bhopal
  { stationCode: 'BPL', stationName: 'Bhopal Jn', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR', division: 'BPL', platforms: 6 },
  
  // Nagpur
  { stationCode: 'NGP', stationName: 'Nagpur', city: 'Nagpur', state: 'Maharashtra', zone: 'CR', division: 'NGP', platforms: 6 },
  
  // Coimbatore
  { stationCode: 'CBE', stationName: 'Coimbatore Jn', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'SR', division: 'CBE', platforms: 6 },
  
  // Guwahati
  { stationCode: 'GHY', stationName: 'Guwahati', city: 'Guwahati', state: 'Assam', zone: 'NFR', division: 'RNY', platforms: 5 },
  
  // Trivandrum
  { stationCode: 'TVC', stationName: 'Trivandrum Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'SR', division: 'TVC', platforms: 5 },
  
  // Kochi
  { stationCode: 'ERS', stationName: 'Ernakulam Jn', city: 'Kochi', state: 'Kerala', zone: 'SR', division: 'ERS', platforms: 5 },
  
  // Visakhapatnam
  { stationCode: 'VSKP', stationName: 'Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh', zone: 'ECoR', division: 'VSKP', platforms: 7 },
  
  // Vijayawada
  { stationCode: 'BZA', stationName: 'Vijayawada Jn', city: 'Vijayawada', state: 'Andhra Pradesh', zone: 'SCR', division: 'BZA', platforms: 10 },
  
  // Chandigarh
  { stationCode: 'CDG', stationName: 'Chandigarh', city: 'Chandigarh', state: 'Chandigarh', zone: 'NR', division: 'FZR', platforms: 3 },
  
  // Jammu
  { stationCode: 'JAT', stationName: 'Jammu Tawi', city: 'Jammu', state: 'Jammu and Kashmir', zone: 'NR', division: 'FZR', platforms: 5 },
  
  // Additional major junctions
  { stationCode: 'ALLP', stationName: 'Allahabad Jn', city: 'Prayagraj', state: 'Uttar Pradesh', zone: 'NCR', division: 'ALLP', platforms: 10 },
  { stationCode: 'CNB', stationName: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'NCR', division: 'CNB', platforms: 9 },
  { stationCode: 'AGC', stationName: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', zone: 'NCR', division: 'AGC', platforms: 6 },
  { stationCode: 'GWL', stationName: 'Gwalior', city: 'Gwalior', state: 'Madhya Pradesh', zone: 'NCR', division: 'GWL', platforms: 5 },
  { stationCode: 'JBP', stationName: 'Jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh', zone: 'WCR', division: 'JBP', platforms: 6 }
];

// Train Type Descriptions
export const TRAIN_TYPE_INFO = {
  [TrainType.EXPRESS]: {
    description: 'Regular trains with limited stops',
    features: ['Limited stops', 'Good connectivity', 'Affordable fares'],
    avgSpeed: '50-60 km/h'
  },
  [TrainType.SUPERFAST_EXPRESS]: {
    description: 'Faster than normal Express trains',
    features: ['Fewer stops', 'Higher speed', 'Superfast surcharge'],
    avgSpeed: '65-80 km/h'
  },
  [TrainType.RAJDHANI_EXPRESS]: {
    description: 'Premium high-speed trains connecting major cities',
    features: ['Fully AC', 'Meals included', 'High priority', 'Limited stops'],
    avgSpeed: '90-130 km/h'
  },
  [TrainType.SHATABDI_EXPRESS]: {
    description: 'Fast intercity trains, no overnight journey',
    features: ['Same day return', 'Fully AC', 'Meals included', 'High speed'],
    avgSpeed: '80-110 km/h'
  },
  [TrainType.VANDE_BHARAT_EXPRESS]: {
    description: 'Semi-high-speed train with latest technology',
    features: ['Indigenous technology', 'Fully AC', 'WiFi', 'Automatic doors', 'GPS'],
    avgSpeed: '100-160 km/h'
  },
  [TrainType.DURONTO_EXPRESS]: {
    description: 'Non-stop trains between major cities',
    features: ['Zero commercial stops', 'High speed', 'Long distance'],
    avgSpeed: '85-110 km/h'
  },
  [TrainType.GARIB_RATH_EXPRESS]: {
    description: 'Low-cost AC travel',
    features: ['Affordable AC travel', 'Higher seating capacity', 'Budget-friendly'],
    avgSpeed: '70-90 km/h'
  },
  [TrainType.HUMSAFAR_EXPRESS]: {
    description: 'Luxury AC-3 tier trains',
    features: ['Only 3AC coaches', 'CCTV surveillance', 'Better amenities'],
    avgSpeed: '70-90 km/h'
  },
  [TrainType.TEJAS_EXPRESS]: {
    description: 'Fully air-conditioned high-speed trains',
    features: ['WiFi', 'LCD screens', 'Bio-toilets', 'LED lighting'],
    avgSpeed: '80-130 km/h'
  }
};
