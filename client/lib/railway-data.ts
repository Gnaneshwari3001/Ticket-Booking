import { TrainType } from './railway-schema';

// CSV Data Interfaces matching your database structure
export interface StationData {
  id: number;
  station_code: string;
  station_name: string;
  city: string;
  state: string;
}

export interface TrainData {
  id: number;
  train_number: string;
  train_name: string;
  train_type: string;
  source_station_code: string;
  destination_station_code: string;
}

export interface TrainScheduleData {
  id: number;
  train_id: number;
  station_code: string;
  arrival_time?: string;
  departure_time?: string;
  day_number: number;
  distance_from_source: number;
}

// Extended interfaces for enhanced functionality
export interface EnhancedTrainData extends TrainData {
  schedules: TrainScheduleData[];
  sourceStationName: string;
  destinationStationName: string;
  totalDistance: number;
  totalDuration: string;
  runDays: string[];
  amenities: string[];
  classes: { [key: string]: { fare: number; availability: number; status: string } };
  punctuality: number;
  rating: number;
}

// Sample CSV Data - In production, this would be loaded from actual CSV files or API
export const STATIONS_DATA: StationData[] = [
  // Telangana & Andhra Pradesh
  { id: 1, station_code: 'SC', station_name: 'Secunderabad Jn', city: 'Secunderabad', state: 'Telangana' },
  { id: 2, station_code: 'HYB', station_name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
  { id: 3, station_code: 'GDWL', station_name: 'Gadwal', city: 'Gadwal', state: 'Telangana' },
  { id: 4, station_code: 'KCG', station_name: 'Kacheguda', city: 'Hyderabad', state: 'Telangana' },
  { id: 5, station_code: 'BZA', station_name: 'Vijayawada Jn', city: 'Vijayawada', state: 'Andhra Pradesh' },
  { id: 6, station_code: 'TPTY', station_name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh' },
  { id: 7, station_code: 'KRNT', station_name: 'Kurnool Town', city: 'Kurnool', state: 'Andhra Pradesh' },
  { id: 8, station_code: 'GTL', station_name: 'Guntakal Jn', city: 'Guntakal', state: 'Andhra Pradesh' },
  { id: 9, station_code: 'ATP', station_name: 'Anantapur', city: 'Anantapur', state: 'Andhra Pradesh' },
  { id: 10, station_code: 'COA', station_name: 'Kakinada Port', city: 'Kakinada', state: 'Andhra Pradesh' },
  
  // Major Indian Cities
  { id: 11, station_code: 'NDLS', station_name: 'New Delhi', city: 'Delhi', state: 'Delhi' },
  { id: 12, station_code: 'BCT', station_name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
  { id: 13, station_code: 'MAS', station_name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 14, station_code: 'SBC', station_name: 'KSR Bengaluru', city: 'Bengaluru', state: 'Karnataka' },
  { id: 15, station_code: 'HWH', station_name: 'Howrah Jn', city: 'Kolkata', state: 'West Bengal' },
  { id: 16, station_code: 'PUNE', station_name: 'Pune Jn', city: 'Pune', state: 'Maharashtra' },
  { id: 17, station_code: 'ADI', station_name: 'Ahmedabad Jn', city: 'Ahmedabad', state: 'Gujarat' },
  { id: 18, station_code: 'JP', station_name: 'Jaipur', city: 'Jaipur', state: 'Rajasthan' },
  { id: 19, station_code: 'LJN', station_name: 'Lucknow Jn', city: 'Lucknow', state: 'Uttar Pradesh' },
  { id: 20, station_code: 'PNBE', station_name: 'Patna Jn', city: 'Patna', state: 'Bihar' },
  
  // Additional Southern Stations
  { id: 21, station_code: 'CBE', station_name: 'Coimbatore Jn', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 22, station_code: 'TVC', station_name: 'Trivandrum Central', city: 'Thiruvananthapuram', state: 'Kerala' },
  { id: 23, station_code: 'ERS', station_name: 'Ernakulam Jn', city: 'Kochi', state: 'Kerala' },
  { id: 24, station_code: 'VSKP', station_name: 'Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { id: 25, station_code: 'RJY', station_name: 'Rajahmundry', city: 'Rajahmundry', state: 'Andhra Pradesh' },
];

export const TRAINS_DATA: TrainData[] = [
  // Telangana/Andhra Express Trains
  { id: 1, train_number: '12723', train_name: 'Telangana Express', train_type: 'Superfast Express', source_station_code: 'HYB', destination_station_code: 'NDLS' },
  { id: 2, train_number: '17027', train_name: 'Hundry Express', train_type: 'Express', source_station_code: 'HYB', destination_station_code: 'GDWL' },
  { id: 3, train_number: '12785', train_name: 'Kacheguda Kurnool Intercity', train_type: 'Intercity Express', source_station_code: 'KCG', destination_station_code: 'KRNT' },
  { id: 4, train_number: '12737', train_name: 'Gowthami Express', train_type: 'Superfast Express', source_station_code: 'KCG', destination_station_code: 'COA' },
  { id: 5, train_number: '12759', train_name: 'Charminar Express', train_type: 'Superfast Express', source_station_code: 'HYB', destination_station_code: 'MAS' },
  { id: 6, train_number: '12603', train_name: 'Hyderabad Express', train_type: 'Superfast Express', source_station_code: 'SC', destination_station_code: 'MAS' },
  { id: 7, train_number: '12701', train_name: 'Hussainsagar Express', train_type: 'Express', source_station_code: 'HYB', destination_station_code: 'BCT' },
  { id: 8, train_number: '17406', train_name: 'Krishna Express', train_type: 'Express', source_station_code: 'SC', destination_station_code: 'SBC' },
  { id: 9, train_number: '12649', train_name: 'Sampark Kranti Express', train_type: 'Sampark Kranti Express', source_station_code: 'SC', destination_station_code: 'NDLS' },
  { id: 10, train_number: '22691', train_name: 'Rajdhani Express', train_type: 'Rajdhani Express', source_station_code: 'SC', destination_station_code: 'NDLS' },
  
  // Premium Trains
  { id: 11, train_number: '20501', train_name: 'Vande Bharat Express', train_type: 'Vande Bharat Express', source_station_code: 'SC', destination_station_code: 'BZA' },
  { id: 12, train_number: '12629', train_name: 'Karnataka Express', train_type: 'Express', source_station_code: 'SC', destination_station_code: 'SBC' },
  { id: 13, train_number: '12616', train_name: 'GT Express', train_type: 'Express', source_station_code: 'MAS', destination_station_code: 'NDLS' },
  { id: 14, train_number: '12295', train_name: 'Sanghamitra Express', train_type: 'Superfast Express', source_station_code: 'SBC', destination_station_code: 'PNBE' },
];

export const TRAIN_SCHEDULES_DATA: TrainScheduleData[] = [
  // Train 1: Telangana Express (12723) - HYB to NDLS
  { id: 1, train_id: 1, station_code: 'HYB', departure_time: '06:00', day_number: 1, distance_from_source: 0 },
  { id: 2, train_id: 1, station_code: 'SC', arrival_time: '06:25', departure_time: '06:30', day_number: 1, distance_from_source: 10 },
  { id: 3, train_id: 1, station_code: 'BZA', arrival_time: '10:00', departure_time: '10:05', day_number: 1, distance_from_source: 310 },
  { id: 4, train_id: 1, station_code: 'NDLS', arrival_time: '06:35', day_number: 2, distance_from_source: 1687 },
  
  // Train 2: Hundry Express (17027) - HYB to GDWL
  { id: 5, train_id: 2, station_code: 'HYB', departure_time: '07:00', day_number: 1, distance_from_source: 0 },
  { id: 6, train_id: 2, station_code: 'SC', arrival_time: '07:20', departure_time: '07:25', day_number: 1, distance_from_source: 10 },
  { id: 7, train_id: 2, station_code: 'GDWL', arrival_time: '09:00', day_number: 1, distance_from_source: 150 },
  
  // Train 3: Kacheguda Kurnool Intercity (12785)
  { id: 8, train_id: 3, station_code: 'KCG', departure_time: '05:30', day_number: 1, distance_from_source: 0 },
  { id: 9, train_id: 3, station_code: 'SC', arrival_time: '05:45', departure_time: '05:50', day_number: 1, distance_from_source: 8 },
  { id: 10, train_id: 3, station_code: 'ATP', arrival_time: '09:30', departure_time: '09:35', day_number: 1, distance_from_source: 180 },
  { id: 11, train_id: 3, station_code: 'KRNT', arrival_time: '11:30', day_number: 1, distance_from_source: 250 },
  
  // Train 4: Gowthami Express (12737)
  { id: 12, train_id: 4, station_code: 'KCG', departure_time: '22:00', day_number: 1, distance_from_source: 0 },
  { id: 13, train_id: 4, station_code: 'SC', arrival_time: '22:15', departure_time: '22:20', day_number: 1, distance_from_source: 8 },
  { id: 14, train_id: 4, station_code: 'BZA', arrival_time: '02:30', departure_time: '02:35', day_number: 2, distance_from_source: 310 },
  { id: 15, train_id: 4, station_code: 'RJY', arrival_time: '04:15', departure_time: '04:20', day_number: 2, distance_from_source: 450 },
  { id: 16, train_id: 4, station_code: 'COA', arrival_time: '05:30', day_number: 2, distance_from_source: 520 },
  
  // Train 5: Charminar Express (12759)
  { id: 17, train_id: 5, station_code: 'HYB', departure_time: '07:15', day_number: 1, distance_from_source: 0 },
  { id: 18, train_id: 5, station_code: 'SC', arrival_time: '07:35', departure_time: '07:40', day_number: 1, distance_from_source: 10 },
  { id: 19, train_id: 5, station_code: 'BZA', arrival_time: '11:20', departure_time: '11:25', day_number: 1, distance_from_source: 310 },
  { id: 20, train_id: 5, station_code: 'MAS', arrival_time: '19:45', day_number: 1, distance_from_source: 612 },
  
  // Train 6: Hyderabad Express (12603)
  { id: 21, train_id: 6, station_code: 'SC', departure_time: '17:35', day_number: 1, distance_from_source: 0 },
  { id: 22, train_id: 6, station_code: 'BZA', arrival_time: '21:40', departure_time: '21:45', day_number: 1, distance_from_source: 310 },
  { id: 23, train_id: 6, station_code: 'MAS', arrival_time: '05:45', day_number: 2, distance_from_source: 612 },
  
  // Train 7: Hussainsagar Express (12701)
  { id: 24, train_id: 7, station_code: 'HYB', departure_time: '22:15', day_number: 1, distance_from_source: 0 },
  { id: 25, train_id: 7, station_code: 'SC', arrival_time: '22:35', departure_time: '22:40', day_number: 1, distance_from_source: 10 },
  { id: 26, train_id: 7, station_code: 'GTL', arrival_time: '04:30', departure_time: '04:35', day_number: 2, distance_from_source: 380 },
  { id: 27, train_id: 7, station_code: 'PUNE', arrival_time: '13:45', departure_time: '13:50', day_number: 2, distance_from_source: 680 },
  { id: 28, train_id: 7, station_code: 'BCT', arrival_time: '17:30', day_number: 2, distance_from_source: 751 },
  
  // Train 8: Krishna Express (17406)
  { id: 29, train_id: 8, station_code: 'SC', departure_time: '20:45', day_number: 1, distance_from_source: 0 },
  { id: 30, train_id: 8, station_code: 'GTL', arrival_time: '02:15', departure_time: '02:20', day_number: 2, distance_from_source: 380 },
  { id: 31, train_id: 8, station_code: 'SBC', arrival_time: '12:30', day_number: 2, distance_from_source: 612 },
  
  // Train 9: Sampark Kranti Express (12649)
  { id: 32, train_id: 9, station_code: 'SC', departure_time: '09:45', day_number: 1, distance_from_source: 0 },
  { id: 33, train_id: 9, station_code: 'BZA', arrival_time: '13:30', departure_time: '13:35', day_number: 1, distance_from_source: 310 },
  { id: 34, train_id: 9, station_code: 'VSKP', arrival_time: '19:45', departure_time: '19:50', day_number: 1, distance_from_source: 680 },
  { id: 35, train_id: 9, station_code: 'PNBE', arrival_time: '14:20', departure_time: '14:25', day_number: 2, distance_from_source: 1480 },
  { id: 36, train_id: 9, station_code: 'NDLS', arrival_time: '02:15', day_number: 3, distance_from_source: 1687 },
  
  // Train 10: Rajdhani Express (22691)
  { id: 37, train_id: 10, station_code: 'SC', departure_time: '20:05', day_number: 1, distance_from_source: 0 },
  { id: 38, train_id: 10, station_code: 'BZA', arrival_time: '23:50', departure_time: '23:55', day_number: 1, distance_from_source: 310 },
  { id: 39, train_id: 10, station_code: 'NDLS', arrival_time: '11:35', day_number: 2, distance_from_source: 1687 },
  
  // Train 11: Vande Bharat Express (20501)
  { id: 40, train_id: 11, station_code: 'SC', departure_time: '06:00', day_number: 1, distance_from_source: 0 },
  { id: 41, train_id: 11, station_code: 'BZA', arrival_time: '09:30', day_number: 1, distance_from_source: 310 },
];

export class RailwayDataService {
  // Get all stations
  static getAllStations(): StationData[] {
    return STATIONS_DATA;
  }

  // Search stations by query
  static searchStations(query: string): StationData[] {
    if (!query) return STATIONS_DATA.slice(0, 20);
    
    const searchTerm = query.toLowerCase();
    return STATIONS_DATA.filter(station =>
      station.station_name.toLowerCase().includes(searchTerm) ||
      station.station_code.toLowerCase().includes(searchTerm) ||
      station.city.toLowerCase().includes(searchTerm) ||
      station.state.toLowerCase().includes(searchTerm)
    );
  }

  // Get station by code
  static getStationByCode(stationCode: string): StationData | undefined {
    return STATIONS_DATA.find(station => station.station_code === stationCode);
  }

  // Get all trains
  static getAllTrains(): TrainData[] {
    return TRAINS_DATA;
  }

  // Get train by number
  static getTrainByNumber(trainNumber: string): TrainData | undefined {
    return TRAINS_DATA.find(train => train.train_number === trainNumber);
  }

  // Get train schedules for a specific train
  static getTrainSchedules(trainId: number): TrainScheduleData[] {
    return TRAIN_SCHEDULES_DATA.filter(schedule => schedule.train_id === trainId);
  }

  // Search trains between two stations
  static searchTrainsBetweenStations(fromStationCode: string, toStationCode: string): EnhancedTrainData[] {
    const results: EnhancedTrainData[] = [];

    for (const train of TRAINS_DATA) {
      const schedules = this.getTrainSchedules(train.id);
      
      // Check if train runs between the stations (direct or via intermediate stations)
      const fromSchedule = schedules.find(s => s.station_code === fromStationCode);
      const toSchedule = schedules.find(s => s.station_code === toStationCode);
      
      if (fromSchedule && toSchedule && fromSchedule.distance_from_source < toSchedule.distance_from_source) {
        const fromStation = this.getStationByCode(train.source_station_code);
        const toStation = this.getStationByCode(train.destination_station_code);
        
        // Calculate duration
        const duration = this.calculateDuration(fromSchedule, toSchedule);
        const distance = toSchedule.distance_from_source - fromSchedule.distance_from_source;
        
        // Generate classes and fares based on train type
        const classes = this.generateClassData(train.train_type, distance);
        
        const enhancedTrain: EnhancedTrainData = {
          ...train,
          schedules: schedules,
          sourceStationName: fromStation?.station_name || train.source_station_code,
          destinationStationName: toStation?.station_name || train.destination_station_code,
          totalDistance: distance,
          totalDuration: duration,
          runDays: ['Daily'], // In real data, this would come from train master
          amenities: this.getAmenitiesByTrainType(train.train_type),
          classes: classes,
          punctuality: Math.floor(Math.random() * 20) + 80, // 80-100%
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10 // 3.0-5.0
        };
        
        results.push(enhancedTrain);
      }
    }

    return results.sort((a, b) => {
      const aDepTime = this.getTrainSchedules(a.id).find(s => s.station_code === fromStationCode)?.departure_time || '00:00';
      const bDepTime = this.getTrainSchedules(b.id).find(s => s.station_code === fromStationCode)?.departure_time || '00:00';
      return aDepTime.localeCompare(bDepTime);
    });
  }

  // Calculate duration between two schedule points
  private static calculateDuration(fromSchedule: TrainScheduleData, toSchedule: TrainScheduleData): string {
    const startTime = fromSchedule.departure_time || fromSchedule.arrival_time || '00:00';
    const endTime = toSchedule.arrival_time || toSchedule.departure_time || '00:00';
    
    const startDay = fromSchedule.day_number;
    const endDay = toSchedule.day_number;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let totalMinutes = (endDay - startDay) * 24 * 60 + (endHour * 60 + endMin) - (startHour * 60 + startMin);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  }

  // Generate class data based on train type
  private static generateClassData(trainType: string, distance: number): { [key: string]: { fare: number; availability: number; status: string } } {
    const baseRate = 0.5; // Base rate per km
    
    const classes: { [key: string]: { fare: number; availability: number; status: string } } = {};
    
    switch (trainType) {
      case 'Rajdhani Express':
        classes['1A'] = { fare: Math.round(distance * baseRate * 4.5), availability: Math.floor(Math.random() * 20), status: 'Available' };
        classes['2A'] = { fare: Math.round(distance * baseRate * 2.8), availability: Math.floor(Math.random() * 50), status: 'Available' };
        classes['3A'] = { fare: Math.round(distance * baseRate * 2.0), availability: Math.floor(Math.random() * 80), status: 'Available' };
        break;
      case 'Vande Bharat Express':
        classes['CC'] = { fare: Math.round(distance * baseRate * 2.5), availability: Math.floor(Math.random() * 60), status: 'Available' };
        classes['EA'] = { fare: Math.round(distance * baseRate * 4.0), availability: Math.floor(Math.random() * 20), status: 'Available' };
        break;
      case 'Superfast Express':
        classes['2A'] = { fare: Math.round(distance * baseRate * 2.6), availability: Math.floor(Math.random() * 40), status: 'Available' };
        classes['3A'] = { fare: Math.round(distance * baseRate * 1.8), availability: Math.floor(Math.random() * 70), status: 'Available' };
        classes['SL'] = { fare: Math.round(distance * baseRate * 0.8), availability: Math.floor(Math.random() * 120), status: 'Available' };
        break;
      default:
        classes['3A'] = { fare: Math.round(distance * baseRate * 1.6), availability: Math.floor(Math.random() * 60), status: 'Available' };
        classes['SL'] = { fare: Math.round(distance * baseRate * 0.7), availability: Math.floor(Math.random() * 100), status: 'Available' };
        classes['2S'] = { fare: Math.round(distance * baseRate * 0.35), availability: Math.floor(Math.random() * 200), status: 'Available' };
        break;
    }

    // Randomly set some as RAC or Waiting List
    Object.keys(classes).forEach(cls => {
      const rand = Math.random();
      if (rand < 0.1) {
        classes[cls].status = `RAC ${Math.floor(Math.random() * 20) + 1}`;
        classes[cls].availability = 0;
      } else if (rand < 0.2) {
        classes[cls].status = `Waiting List ${Math.floor(Math.random() * 50) + 1}`;
        classes[cls].availability = 0;
      }
    });

    return classes;
  }

  // Get amenities by train type
  private static getAmenitiesByTrainType(trainType: string): string[] {
    switch (trainType) {
      case 'Rajdhani Express':
        return ['wifi', 'meals', 'blanket', 'charging', 'ac'];
      case 'Shatabdi Express':
        return ['wifi', 'meals', 'charging', 'ac'];
      case 'Vande Bharat Express':
        return ['wifi', 'meals', 'charging', 'ac', 'gps', 'automatic_doors'];
      case 'Superfast Express':
        return ['charging', 'pantry'];
      case 'Express':
        return ['charging'];
      case 'Intercity Express':
        return ['charging', 'pantry'];
      default:
        return ['charging'];
    }
  }

  // Get route details for a train
  static getTrainRoute(trainId: number): { station: StationData; schedule: TrainScheduleData }[] {
    const schedules = this.getTrainSchedules(trainId);
    return schedules.map(schedule => ({
      station: this.getStationByCode(schedule.station_code)!,
      schedule
    })).filter(item => item.station);
  }

  // Check if train runs on specific days
  static doesTrainRunOnDate(trainNumber: string, date: string): boolean {
    // In real implementation, this would check actual run days
    // For now, assuming most trains run daily
    const train = this.getTrainByNumber(trainNumber);
    if (!train) return false;
    
    // Some trains run on specific days
    const restrictedTrains = ['22691', '12649']; // Example: some trains run 3 days a week
    if (restrictedTrains.includes(trainNumber)) {
      const dayOfWeek = new Date(date).getDay();
      return [2, 4, 0].includes(dayOfWeek); // Tue, Thu, Sun
    }
    
    return true; // Most trains run daily
  }
}
