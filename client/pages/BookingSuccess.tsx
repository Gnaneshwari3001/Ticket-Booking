import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Download,
  Share2,
  Calendar,
  Train,
  Users,
  MapPin,
  Clock,
  Ticket,
  AlertCircle,
} from "lucide-react";

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [bookingData, setBookingData] = useState<any>(null);

  const pnr = searchParams.get('pnr') || '';

  useEffect(() => {
    // Get booking data from navigation state
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
    }
  }, [location.state]);

  const handleDownloadTicket = () => {
    // In a real implementation, this would generate and download a PDF ticket
    alert('E-ticket download functionality would be implemented here');
  };

  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Train Ticket Booking Confirmation',
        text: `Your train ticket has been booked successfully. PNR: ${pnr}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Your train ticket has been booked successfully. PNR: ${pnr}`);
      alert('Booking details copied to clipboard!');
    }
  };

  if (!pnr || !bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Booking not found</h3>
          <p className="text-muted-foreground mb-4">
            The booking confirmation could not be loaded.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your train ticket has been booked successfully
          </p>
        </div>

        {/* PNR Display */}
        <Card className="mb-6 bg-railway-blue text-white">
          <CardContent className="p-6 text-center">
            <h2 className="text-sm font-medium mb-2">Your PNR Number</h2>
            <div className="text-4xl font-bold tracking-wider mb-2">{pnr}</div>
            <p className="text-blue-100 text-sm">
              Save this PNR number for future reference and train status checks
            </p>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-railway-blue" />
              Journey Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {bookingData.trainNumber} - {bookingData.trainName}
                  </h3>
                  <p className="text-sm text-muted-foreground">Train Information</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-semibold">{bookingData.fromStationName}</p>
                    <p className="text-lg font-bold text-railway-blue">
                      {bookingData.departureTime}
                    </p>
                    <p className="text-xs text-muted-foreground">{bookingData.fromStation}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="h-px bg-border"></div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{bookingData.toStationName}</p>
                    <p className="text-lg font-bold text-railway-blue">
                      {bookingData.arrivalTime}
                    </p>
                    <p className="text-xs text-muted-foreground">{bookingData.toStation}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Journey Date: {bookingData.journeyDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span>Class: {bookingData.class}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Passengers: {bookingData.passengers.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-railway-blue" />
              Passenger Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingData.passengers.map((passenger: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{passenger.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Age: {passenger.age} | Gender: {passenger.gender} | 
                      Berth: {passenger.berthPreference !== 'NO_PREFERENCE' ? passenger.berthPreference : 'Any'}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Amount Paid</span>
                <span className="font-semibold text-railway-blue">₹{bookingData.totalFare}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Payment Status</span>
                <Badge className="bg-green-100 text-green-800">Successful</Badge>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Transaction ID</span>
                <span className="font-mono">TXN{Date.now().toString().slice(-8)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p className="font-medium">{bookingData.contactDetails.mobile}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{bookingData.contactDetails.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={handleDownloadTicket} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download E-Ticket
          </Button>
          <Button variant="outline" onClick={handleShareTicket} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Booking
          </Button>
          <Button variant="outline" asChild>
            <Link to="/pnr-status" className="flex items-center gap-2">
              <Train className="h-4 w-4" />
              Check PNR Status
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Book Another Ticket
            </Link>
          </Button>
        </div>

        {/* Important Information */}
        <Card className="mt-8 bg-railway-orange/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-railway-orange mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Important Information</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Please carry a valid photo ID proof during your journey</li>
                  <li>• Arrive at the station at least 20 minutes before departure</li>
                  <li>• E-ticket and SMS will be sent to your registered mobile number and email</li>
                  <li>• Cancellation charges apply as per IRCTC rules</li>
                  <li>• Check your PNR status before traveling for any updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
