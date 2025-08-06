import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RailwayDataService, EnhancedTrainData } from "@/lib/railway-data";
import { RailwayFareCalculator, BookingHelper } from "@/lib/railway-services";
import {
  Train,
  ArrowRight,
  Users,
  CreditCard,
  Shield,
  AlertCircle,
  Plus,
  Minus,
  Clock,
  MapPin,
  Ticket,
  Calendar,
} from "lucide-react";

interface Passenger {
  id: string;
  name: string;
  age: string;
  gender: 'M' | 'F' | 'O';
  berthPreference: 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER' | 'NO_PREFERENCE';
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [train, setTrain] = useState<EnhancedTrainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: '1', name: '', age: '', gender: 'M', berthPreference: 'NO_PREFERENCE' }
  ]);
  const [contactDetails, setContactDetails] = useState({
    mobile: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Extract booking parameters
  const trainNumber = searchParams.get('train') || '';
  const fromStation = searchParams.get('from') || '';
  const toStation = searchParams.get('to') || '';
  const journeyDate = searchParams.get('date') || '';
  const classParam = searchParams.get('class') || '';

  // Load train details
  useEffect(() => {
    if (trainNumber && fromStation && toStation) {
      setLoading(true);
      try {
        const trainData = RailwayDataService.getTrainByNumber(trainNumber);
        if (trainData) {
          const searchResults = RailwayDataService.searchTrainsBetweenStations(fromStation, toStation);
          const foundTrain = searchResults.find(t => t.train_number === trainNumber);
          if (foundTrain) {
            setTrain(foundTrain);
            // Set default class if provided
            if (classParam && foundTrain.classes[classParam]) {
              setSelectedClass(classParam);
            } else {
              // Set first available class as default
              const firstClass = Object.keys(foundTrain.classes)[0];
              setSelectedClass(firstClass);
            }
          }
        }
      } catch (error) {
        console.error('Error loading train details:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [trainNumber, fromStation, toStation, classParam]);

  // Get station details
  const fromStationData = RailwayDataService.getStationByCode(fromStation);
  const toStationData = RailwayDataService.getStationByCode(toStation);

  // Get train schedule details
  const fromSchedule = train?.schedules.find(s => s.station_code === fromStation);
  const toSchedule = train?.schedules.find(s => s.station_code === toStation);

  // Update passengers when count changes
  useEffect(() => {
    const newPassengers = Array.from({ length: passengerCount }, (_, index) => 
      passengers[index] || {
        id: (index + 1).toString(),
        name: '',
        age: '',
        gender: 'M',
        berthPreference: 'NO_PREFERENCE'
      }
    );
    setPassengers(newPassengers);
  }, [passengerCount]);

  // Calculate fare
  const calculateTotalFare = () => {
    if (!train || !selectedClass) return { baseFare: 0, totalFare: 0, charges: { convenienceFee: 0, paymentGatewayCharges: 0, totalAmount: 0 } };
    
    const classDetails = train.classes[selectedClass];
    if (!classDetails) return { baseFare: 0, totalFare: 0, charges: { convenienceFee: 0, paymentGatewayCharges: 0, totalAmount: 0 } };

    const baseFare = classDetails.fare * passengerCount;
    const charges = BookingHelper.calculateBookingCharges(baseFare);
    
    return {
      baseFare,
      totalFare: baseFare,
      charges
    };
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleBooking = async () => {
    if (!currentUser) {
      // Redirect to login
      navigate('/login');
      return;
    }

    if (!train || !selectedClass) return;

    // Validate passenger details
    const hasEmptyFields = passengers.some(p => !p.name || !p.age);
    if (hasEmptyFields) {
      alert('Please fill all passenger details');
      return;
    }

    if (!contactDetails.mobile || !contactDetails.email) {
      alert('Please provide contact details');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (!termsAccepted) {
      alert('Please accept terms and conditions');
      return;
    }

    setIsBooking(true);

    try {
      // Generate PNR
      const pnr = BookingHelper.generatePNR();
      const fareDetails = calculateTotalFare();
      
      // Create booking object
      const bookingData = {
        pnr,
        trainNumber: train.train_number,
        trainName: train.train_name,
        fromStation: fromStation,
        toStation: toStation,
        fromStationName: fromStationData?.station_name || fromStation,
        toStationName: toStationData?.station_name || toStation,
        journeyDate,
        departureTime: fromSchedule?.departure_time || '',
        arrivalTime: toSchedule?.arrival_time || '',
        class: selectedClass,
        passengers: passengers.map(p => ({
          name: p.name,
          age: parseInt(p.age),
          gender: p.gender,
          berthPreference: p.berthPreference
        })),
        totalFare: fareDetails.charges.totalAmount,
        contactDetails
      };

      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to booking success
      navigate(`/booking-success?pnr=${pnr}`, { 
        state: { bookingData } 
      });

    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-railway-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Train not found</h3>
          <p className="text-muted-foreground mb-4">
            The requested train could not be found or is not available for booking.
          </p>
          <Button asChild>
            <Link to="/">Back to Search</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const fareDetails = calculateTotalFare();

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/real-data-search-results" className="text-railway-blue hover:underline">
              ← Back to Search Results
            </Link>
          </div>
          <h1 className="text-2xl font-bold">Book Your Journey</h1>
        </div>

        {/* Train Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-railway-blue" />
              Train Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {train.train_number} - {train.train_name}
                  </h3>
                  <Badge variant="outline">{train.train_type}</Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-semibold">{fromStationData?.station_name}</p>
                    <p className="text-lg font-bold text-railway-blue">
                      {fromSchedule?.departure_time || '--:--'}
                    </p>
                    <p className="text-xs text-muted-foreground">{fromStation}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-semibold">{toStationData?.station_name}</p>
                    <p className="text-lg font-bold text-railway-blue">
                      {toSchedule?.arrival_time || '--:--'}
                    </p>
                    <p className="text-xs text-muted-foreground">{toStation}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Journey Date: {journeyDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {train.totalDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Distance: {train.totalDistance} km</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Travel Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(train.classes).map(([classCode, details]) => (
                <Card 
                  key={classCode} 
                  className={`cursor-pointer transition-all ${
                    selectedClass === classCode ? 'ring-2 ring-railway-blue' : ''
                  }`}
                  onClick={() => setSelectedClass(classCode)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{classCode}</span>
                        <Badge 
                          className={
                            details.status.includes('Available') 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {details.status.includes('Available') ? 'Available' : 'Full'}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-railway-blue">₹{details.fare}</p>
                      <p className="text-xs text-muted-foreground">
                        {details.availability > 0 
                          ? `${details.availability} seats available` 
                          : details.status
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Passenger Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-railway-blue" />
                Passenger Details
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                  disabled={passengerCount <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-2">{passengerCount} Passenger{passengerCount > 1 ? 's' : ''}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPassengerCount(Math.min(6, passengerCount + 1))}
                  disabled={passengerCount >= 6}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={passenger.id} className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-medium">Passenger {index + 1}</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Full Name *</Label>
                      <Input
                        id={`name-${index}`}
                        placeholder="Enter full name"
                        value={passenger.name}
                        onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`age-${index}`}>Age *</Label>
                      <Input
                        id={`age-${index}`}
                        type="number"
                        placeholder="Age"
                        min="1"
                        max="120"
                        value={passenger.age}
                        onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender *</Label>
                      <Select
                        value={passenger.gender}
                        onValueChange={(value) => updatePassenger(index, 'gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                          <SelectItem value="O">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Berth Preference</Label>
                    <Select
                      value={passenger.berthPreference}
                      onValueChange={(value) => updatePassenger(index, 'berthPreference', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NO_PREFERENCE">No Preference</SelectItem>
                        <SelectItem value="LOWER">Lower Berth</SelectItem>
                        <SelectItem value="MIDDLE">Middle Berth</SelectItem>
                        <SelectItem value="UPPER">Upper Berth</SelectItem>
                        <SelectItem value="SIDE_LOWER">Side Lower</SelectItem>
                        <SelectItem value="SIDE_UPPER">Side Upper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={contactDetails.mobile}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, mobile: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={contactDetails.email}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Options */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-railway-blue" />
                  Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI Payment (PhonePe, GPay, Paytm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking">Net Banking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet">Digital Wallet</Label>
                    </div>
                  </div>
                </RadioGroup>

                <Separator className="my-4" />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={setTermsAccepted}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-railway-blue hover:underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-railway-blue hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fare Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-railway-blue" />
                  Fare Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Fare ({passengerCount} × ₹{selectedClass ? train.classes[selectedClass]?.fare || 0 : 0})</span>
                    <span>₹{fareDetails.baseFare}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Convenience Fee</span>
                    <span>₹{fareDetails.charges.convenienceFee}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Payment Gateway</span>
                    <span>₹{fareDetails.charges.paymentGatewayCharges}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span className="text-railway-blue">₹{fareDetails.charges.totalAmount}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleBooking}
                  disabled={isBooking || !selectedClass || passengers.some(p => !p.name || !p.age) || !contactDetails.mobile || !contactDetails.email || !paymentMethod || !termsAccepted}
                >
                  {isBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Pay & Book Ticket
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Secure payment powered by 256-bit SSL encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
