import {
  TrainType,
  TrainClass,
  QuotaType,
  FareBreakdown,
  TrainMaster,
  SeatAvailability,
  LiveTrainStatus,
  MAJOR_STATIONS,
} from './railway-schema';

// Fare calculation constants
const FARE_RATES = {
  // Base fare per km for different classes
  [TrainClass.AC_FIRST_CLASS]: 4.5,
  [TrainClass.AC_2_TIER]: 2.8,
  [TrainClass.AC_3_TIER]: 2.0,
  [TrainClass.AC_3_TIER_ECONOMY]: 1.75,
  [TrainClass.AC_CHAIR_CAR]: 1.5,
  [TrainClass.SLEEPER]: 0.8,
  [TrainClass.SECOND_SITTING]: 0.35,
  [TrainClass.FIRST_CLASS]: 3.5,
  [TrainClass.ANUBHUTI]: 5.5,
  [TrainClass.VISTADOME]: 6.0,
};

const RESERVATION_CHARGES = {
  [TrainClass.AC_FIRST_CLASS]: 60,
  [TrainClass.AC_2_TIER]: 50,
  [TrainClass.AC_3_TIER]: 40,
  [TrainClass.AC_3_TIER_ECONOMY]: 40,
  [TrainClass.AC_CHAIR_CAR]: 25,
  [TrainClass.SLEEPER]: 20,
  [TrainClass.SECOND_SITTING]: 15,
  [TrainClass.FIRST_CLASS]: 50,
  [TrainClass.ANUBHUTI]: 60,
  [TrainClass.VISTADOME]: 60,
};

const SUPERFAST_CHARGES = {
  [TrainClass.AC_FIRST_CLASS]: 75,
  [TrainClass.AC_2_TIER]: 45,
  [TrainClass.AC_3_TIER]: 30,
  [TrainClass.AC_3_TIER_ECONOMY]: 30,
  [TrainClass.AC_CHAIR_CAR]: 30,
  [TrainClass.SLEEPER]: 30,
  [TrainClass.SECOND_SITTING]: 15,
  [TrainClass.FIRST_CLASS]: 45,
  [TrainClass.ANUBHUTI]: 75,
  [TrainClass.VISTADOME]: 75,
};

// Train type multipliers
const TRAIN_TYPE_MULTIPLIERS = {
  [TrainType.RAJDHANI_EXPRESS]: 1.5,
  [TrainType.SHATABDI_EXPRESS]: 1.4,
  [TrainType.VANDE_BHARAT_EXPRESS]: 2.0,
  [TrainType.DURONTO_EXPRESS]: 1.3,
  [TrainType.TEJAS_EXPRESS]: 1.6,
  [TrainType.HUMSAFAR_EXPRESS]: 1.2,
  [TrainType.GARIB_RATH_EXPRESS]: 0.8,
  [TrainType.SUPERFAST_EXPRESS]: 1.1,
  [TrainType.EXPRESS]: 1.0,
  [TrainType.PASSENGER]: 0.7,
  [TrainType.MAIL]: 1.0,
  [TrainType.JAN_SHATABDI_EXPRESS]: 1.1,
  [TrainType.SAMPARK_KRANTI_EXPRESS]: 1.1,
  [TrainType.INTERCITY_EXPRESS]: 1.0,
  [TrainType.DOUBLE_DECKER_EXPRESS]: 1.2,
  [TrainType.LOCAL_EMU_MEMU]: 0.5,
  [TrainType.SPECIAL_TRAINS]: 1.0,
};

// Quota charges
const QUOTA_CHARGES = {
  [QuotaType.GENERAL]: 0,
  [QuotaType.TATKAL]: 0.3, // 30% of base fare
  [QuotaType.PREMIUM_TATKAL]: 0.5, // 50% of base fare
  [QuotaType.LADIES]: 0,
  [QuotaType.SENIOR_CITIZEN]: -0.4, // 40% discount
  [QuotaType.HANDICAPPED]: -0.75, // 75% discount
  [QuotaType.DEFENCE]: -0.1, // 10% discount
  [QuotaType.FOREIGN_TOURIST]: 0.5, // 50% surcharge in USD
  [QuotaType.LOWER_BERTH]: 0,
  [QuotaType.PHYSICALLY_HANDICAPPED]: -0.75, // 75% discount
};

export class RailwayFareCalculator {
  static calculateFare(
    trainType: TrainType,
    trainClass: TrainClass,
    quota: QuotaType,
    distance: number,
    isDynamicPricing: boolean = false,
    surgeMultiplier: number = 1.0
  ): FareBreakdown {
    // Base fare calculation
    const baseRatePerKm = FARE_RATES[trainClass];
    const trainMultiplier = TRAIN_TYPE_MULTIPLIERS[trainType];
    let baseFare = baseRatePerKm * distance * trainMultiplier;

    // Reservation charge
    const reservationCharge = RESERVATION_CHARGES[trainClass];

    // Superfast charge (for superfast and premium trains)
    const isSuperfast = [
      TrainType.SUPERFAST_EXPRESS,
      TrainType.RAJDHANI_EXPRESS,
      TrainType.SHATABDI_EXPRESS,
      TrainType.VANDE_BHARAT_EXPRESS,
      TrainType.DURONTO_EXPRESS,
      TrainType.TEJAS_EXPRESS,
    ].includes(trainType);
    
    const superFastCharge = isSuperfast ? SUPERFAST_CHARGES[trainClass] : 0;

    // Catering charge (for premium trains)
    const hasCatering = [
      TrainType.RAJDHANI_EXPRESS,
      TrainType.SHATABDI_EXPRESS,
      TrainType.VANDE_BHARAT_EXPRESS,
      TrainType.TEJAS_EXPRESS,
    ].includes(trainType);
    
    const cateringCharge = hasCatering ? (distance > 500 ? 50 : 25) : 0;

    // Quota-based charges
    const quotaMultiplier = QUOTA_CHARGES[quota];
    let tatkalCharge = 0;
    
    if (quota === QuotaType.TATKAL || quota === QuotaType.PREMIUM_TATKAL) {
      tatkalCharge = baseFare * Math.abs(quotaMultiplier);
    }

    // Dynamic pricing
    const dynamicFareCharge = isDynamicPricing ? baseFare * (surgeMultiplier - 1) : 0;

    // Apply quota discounts/surcharges to base fare
    if (quotaMultiplier < 0) {
      baseFare = baseFare * (1 + quotaMultiplier); // Apply discount
    }

    // Calculate subtotal
    const subtotal = baseFare + reservationCharge + superFastCharge + cateringCharge + tatkalCharge + dynamicFareCharge;

    // GST calculation (5% on base fare + charges)
    const gst = subtotal * 0.05;

    // Insurance (optional, ₹1 per passenger)
    const insurance = 1;

    // Total fare
    const totalFare = subtotal + gst + insurance;

    // Apply any additional discounts
    const discountApplied = 0; // Can be implemented for offers/coupons

    const finalFare = totalFare - discountApplied;

    return {
      baseFare: Math.round(baseFare),
      reservationCharge,
      superFastCharge,
      cateringCharge,
      tatkalCharge: Math.round(tatkalCharge),
      dynamicFareCharge: Math.round(dynamicFareCharge),
      gst: Math.round(gst),
      insurance,
      totalFare: Math.round(totalFare),
      discountApplied,
      finalFare: Math.round(finalFare),
    };
  }

  static calculateDistance(fromStationCode: string, toStationCode: string): number {
    // In a real implementation, this would use a distance matrix or route calculation
    // For now, we'll use approximate distances between major stations
    const distanceMatrix: { [key: string]: { [key: string]: number } } = {
      'NDLS': { 'BCT': 1384, 'MAS': 2180, 'HWH': 1447, 'SBC': 2444 },
      'BCT': { 'NDLS': 1384, 'MAS': 1279, 'HWH': 1968, 'SBC': 1113 },
      'MAS': { 'NDLS': 2180, 'BCT': 1279, 'HWH': 1663, 'SBC': 362 },
      'HWH': { 'NDLS': 1447, 'BCT': 1968, 'MAS': 1663, 'SBC': 1871 },
      'SBC': { 'NDLS': 2444, 'BCT': 1113, 'MAS': 362, 'HWH': 1871 },
      'SC': { 'NDLS': 1687, 'BCT': 751, 'MAS': 612, 'HWH': 1273, 'SBC': 612 },
      'PUNE': { 'BCT': 192, 'NDLS': 1534, 'MAS': 1147, 'SBC': 961 },
      'ADI': { 'BCT': 492, 'NDLS': 934, 'JP': 385 },
      'JP': { 'NDLS': 308, 'ADI': 385, 'BCT': 826 },
    };

    return distanceMatrix[fromStationCode]?.[toStationCode] || 1000; // Default 1000km if not found
  }
}

export class TrainSearchService {
  static searchTrains(
    fromStationCode: string,
    toStationCode: string,
    journeyDate: string,
    classType?: TrainClass
  ): TrainMaster[] {
    // In a real implementation, this would query the database
    // For now, returning mock data based on popular routes
    
    const mockTrains: TrainMaster[] = [
      {
        trainNumber: "12951",
        trainName: "Mumbai Rajdhani",
        trainType: TrainType.RAJDHANI_EXPRESS,
        sourceStationCode: "NDLS",
        destinationStationCode: "BCT",
        sourceStationName: "New Delhi",
        destinationStationName: "Mumbai Central",
        runDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        distance: 1384,
        duration: "15:40",
        averageSpeed: 88.5,
        punctuality: 92,
        rating: 4.3,
        amenities: ["wifi", "meals", "blanket", "charging"],
        pantryAvailable: true,
        wifiAvailable: true,
        emergencyBrake: true,
        isActive: true,
        effectiveFrom: new Date("2024-01-01"),
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      },
      // Add more trains...
    ];

    return mockTrains.filter(train => 
      (train.sourceStationCode === fromStationCode && train.destinationStationCode === toStationCode) ||
      // In real implementation, check intermediate stations through train_schedules
      train.trainNumber.includes("12951") // Mock filter
    );
  }

  static getSeatAvailability(
    trainNumber: string,
    journeyDate: string,
    fromStationCode: string,
    toStationCode: string,
    classType: TrainClass
  ): SeatAvailability {
    // Mock implementation - in real app, this would query live data
    const mockAvailability: SeatAvailability = {
      trainNumber,
      journeyDate,
      fromStationCode,
      toStationCode,
      classType,
      quotaType: QuotaType.GENERAL,
      totalSeats: 72,
      bookedSeats: 45,
      availableSeats: 27,
      racSeats: 12,
      waitingListCount: 0,
      currentFare: RailwayFareCalculator.calculateFare(
        TrainType.RAJDHANI_EXPRESS,
        classType,
        QuotaType.GENERAL,
        RailwayFareCalculator.calculateDistance(fromStationCode, toStationCode)
      ).finalFare,
      surgeMultiplier: 1.0,
      lastUpdated: new Date() as any,
    };

    return mockAvailability;
  }

  static getLiveTrainStatus(trainNumber: string, journeyDate: string): LiveTrainStatus | null {
    // Mock implementation
    const mockStatus: LiveTrainStatus = {
      trainNumber,
      journeyDate,
      currentStationCode: "BPL",
      currentStationName: "Bhopal Jn",
      currentStatus: "ON_TIME",
      delayMinutes: 0,
      nextStationCode: "JHS",
      nextStationName: "Jhansi Jn",
      estimatedArrival: "14:35",
      estimatedDeparture: "14:40",
      lastUpdateTime: new Date() as any,
      averageSpeed: 85,
      distanceCovered: 692,
      distanceRemaining: 692,
    };

    return mockStatus;
  }

  static getStationByCode(stationCode: string) {
    return MAJOR_STATIONS.find(station => station.stationCode === stationCode);
  }

  static searchStations(query: string) {
    const searchTerm = query.toLowerCase();
    return MAJOR_STATIONS.filter(station =>
      station.stationName.toLowerCase().includes(searchTerm) ||
      station.stationCode.toLowerCase().includes(searchTerm) ||
      station.city.toLowerCase().includes(searchTerm)
    ).slice(0, 20);
  }
}

// Utility functions for train status and booking
export class TrainStatusHelper {
  static getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'ON_TIME':
        return 'text-green-600';
      case 'LATE':
        return 'text-yellow-600';
      case 'CANCELLED':
        return 'text-red-600';
      case 'RESCHEDULED':
        return 'text-blue-600';
      case 'DIVERTED':
        return 'text-purple-600';
      default:
        return 'text-muted-foreground';
    }
  }

  static getDelayText(delayMinutes: number): string {
    if (delayMinutes === 0) return 'On Time';
    if (delayMinutes > 0) return `Late by ${delayMinutes} min`;
    return `Early by ${Math.abs(delayMinutes)} min`;
  }

  static formatDuration(duration: string): string {
    // Convert "15:40" to "15h 40m"
    const [hours, minutes] = duration.split(':');
    return `${hours}h ${minutes}m`;
  }

  static getDaysDifference(arrivalTime: string): string {
    if (arrivalTime.includes('+1')) return '+1 day';
    if (arrivalTime.includes('+2')) return '+2 days';
    return 'same day';
  }
}

// Booking helper functions
export class BookingHelper {
  static generatePNR(): string {
    // Generate 10-digit PNR
    return Math.random().toString().substr(2, 10);
  }

  static calculateBookingCharges(totalFare: number): {
    convenienceFee: number;
    paymentGatewayCharges: number;
    totalAmount: number;
  } {
    const convenienceFee = totalFare < 500 ? 15 : Math.min(totalFare * 0.02, 40);
    const paymentGatewayCharges = Math.max(totalFare * 0.005, 5);
    
    return {
      convenienceFee: Math.round(convenienceFee),
      paymentGatewayCharges: Math.round(paymentGatewayCharges),
      totalAmount: Math.round(totalFare + convenienceFee + paymentGatewayCharges),
    };
  }

  static getCancellationCharges(
    trainType: TrainType,
    classType: TrainClass,
    hoursBeforeDeparture: number
  ): number {
    // Cancellation charges based on time before departure
    if (hoursBeforeDeparture >= 48) {
      return [TrainClass.AC_FIRST_CLASS, TrainClass.AC_2_TIER, TrainClass.AC_3_TIER].includes(classType) ? 240 : 120;
    } else if (hoursBeforeDeparture >= 12) {
      return [TrainClass.AC_FIRST_CLASS, TrainClass.AC_2_TIER, TrainClass.AC_3_TIER].includes(classType) ? 200 : 100;
    } else if (hoursBeforeDeparture >= 4) {
      return 50; // Flat rate for last-minute cancellations
    } else {
      return 0; // No refund for cancellations within 4 hours
    }
  }
}
