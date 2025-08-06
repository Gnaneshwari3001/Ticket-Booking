import { trainService } from './realtime-database';

// Sample Indian Railway data for demonstration
export const sampleTrains = [
  {
    number: '12951',
    name: 'Mumbai Rajdhani Express',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departure: '16:55',
    arrival: '08:35',
    duration: '15h 40m',
    distance: '1384 km',
    runDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    classes: {
      '1A': {
        fare: 4500,
        totalSeats: 18,
        availableSeats: 8,
        waitingList: 0
      },
      '2A': {
        fare: 2800,
        totalSeats: 54,
        availableSeats: 12,
        waitingList: 0
      },
      '3A': {
        fare: 1950,
        totalSeats: 64,
        availableSeats: 23,
        waitingList: 0
      }
    },
    amenities: ['AC', 'Meals Included', 'Blanket', 'Newspaper', 'Tea/Coffee'],
    punctuality: 85,
    rating: 4.2,
    route: ['New Delhi', 'Gurgaon', 'Rewari', 'Alwar', 'Jaipur', 'Ajmer', 'Marwar Jn', 'Jodhpur', 'Luni', 'Bhagat Ki Kothi', 'Osian', 'Phalodi', 'Pokaran', 'Jaisalmer']
  },
  {
    number: '12302',
    name: 'Kolkata Rajdhani Express',
    from: 'New Delhi',
    to: 'Howrah Junction',
    departure: '16:55',
    arrival: '10:05',
    duration: '17h 10m',
    distance: '1441 km',
    runDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    classes: {
      '1A': {
        fare: 4200,
        totalSeats: 18,
        availableSeats: 3,
        waitingList: 5
      },
      '2A': {
        fare: 2600,
        totalSeats: 54,
        availableSeats: 0,
        waitingList: 12
      },
      '3A': {
        fare: 1850,
        totalSeats: 64,
        availableSeats: 7,
        waitingList: 8
      }
    },
    amenities: ['AC', 'Meals Included', 'Blanket', 'Newspaper', 'Tea/Coffee'],
    punctuality: 78,
    rating: 4.0,
    route: ['New Delhi', 'Ghaziabad', 'Aligarh', 'Kanpur Central', 'Allahabad', 'Varanasi', 'Gaya', 'Dhanbad', 'Asansol', 'Durgapur', 'Howrah Junction']
  },
  {
    number: '12423',
    name: 'Dibrugarh Rajdhani Express',
    from: 'New Delhi',
    to: 'Dibrugarh',
    departure: '11:00',
    arrival: '16:15',
    duration: '29h 15m',
    distance: '2382 km',
    runDays: ['Wednesday', 'Saturday'],
    classes: {
      '1A': {
        fare: 6500,
        totalSeats: 18,
        availableSeats: 12,
        waitingList: 0
      },
      '2A': {
        fare: 4200,
        totalSeats: 54,
        availableSeats: 25,
        waitingList: 0
      },
      '3A': {
        fare: 2950,
        totalSeats: 64,
        availableSeats: 35,
        waitingList: 0
      }
    },
    amenities: ['AC', 'Meals Included', 'Blanket', 'Newspaper', 'Tea/Coffee'],
    punctuality: 82,
    rating: 4.1,
    route: ['New Delhi', 'Ghaziabad', 'Moradabad', 'Bareilly', 'Lucknow', 'Gonda', 'Gorakhpur', 'Deoria Sadar', 'Siwan', 'Chhapra', 'Hajipur', 'Patna', 'Mokama', 'Kiul', 'Bhagalpur', 'Sabour', 'Tinpahar', 'Barharwa', 'Malda Town', 'Balurghat', 'Alipurduar', 'New Jalpaiguri', 'Siliguri', 'New Bongaigaon', 'Guwahati', 'Jorhat Town', 'Mariani', 'Simalguri', 'Dibrugarh']
  },
  {
    number: '22688',
    name: 'Chennai Superfast Express',
    from: 'New Delhi',
    to: 'Chennai Central',
    departure: '15:50',
    arrival: '19:15',
    duration: '27h 25m',
    distance: '2180 km',
    runDays: ['Monday', 'Wednesday', 'Saturday'],
    classes: {
      '1A': {
        fare: 5800,
        totalSeats: 18,
        availableSeats: 6,
        waitingList: 0
      },
      '2A': {
        fare: 3600,
        totalSeats: 54,
        availableSeats: 18,
        waitingList: 0
      },
      '3A': {
        fare: 2450,
        totalSeats: 64,
        availableSeats: 28,
        waitingList: 0
      },
      'SL': {
        fare: 785,
        totalSeats: 72,
        availableSeats: 42,
        waitingList: 0
      }
    },
    amenities: ['AC', 'Meals Available', 'Blanket', 'Charging Points'],
    punctuality: 75,
    rating: 3.8,
    route: ['New Delhi', 'Mathura', 'Agra Cantonment', 'Gwalior', 'Jhansi', 'Bhopal', 'Itarsi', 'Nagpur', 'Balharshah', 'Kazipet', 'Warangal', 'Vijayawada', 'Chennai Central']
  },
  {
    number: '16031',
    name: 'Andaman Express',
    from: 'Chennai Central',
    to: 'Jammu Tawi',
    departure: '06:40',
    arrival: '04:55',
    duration: '46h 15m',
    distance: '2647 km',
    runDays: ['Wednesday'],
    classes: {
      '2A': {
        fare: 4800,
        totalSeats: 54,
        availableSeats: 31,
        waitingList: 0
      },
      '3A': {
        fare: 3200,
        totalSeats: 64,
        availableSeats: 45,
        waitingList: 0
      },
      'SL': {
        fare: 1250,
        totalSeats: 72,
        availableSeats: 58,
        waitingList: 0
      },
      '2S': {
        fare: 485,
        totalSeats: 118,
        availableSeats: 89,
        waitingList: 0
      }
    },
    amenities: ['AC', 'Charging Points', 'Water Bottle'],
    punctuality: 68,
    rating: 3.5,
    route: ['Chennai Central', 'Arakkonam', 'Katpadi', 'Bangalore City', 'Tumkur', 'Davangere', 'Hubli', 'Belgaum', 'Miraj', 'Pune', 'Daund', 'Solapur', 'Gulbarga', 'Wadi', 'Raichur', 'Adoni', 'Guntakal', 'Anantapur', 'Dharmavaram', 'Bangalore', 'Mysore']
  }
];

// Function to populate sample data in Realtime Database
export const populateSampleData = async () => {
  console.log('Starting to populate sample railway data...');
  
  try {
    for (const train of sampleTrains) {
      await trainService.addTrain(train);
      console.log(`Added train ${train.number} - ${train.name}`);
    }
    console.log('Sample railway data populated successfully!');
  } catch (error) {
    console.error('Error populating sample data:', error);
  }
};

// Export individual train data for testing
export { sampleTrains as trains };
