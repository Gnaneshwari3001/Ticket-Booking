import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Train,
  Clock,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  Ticket,
} from "lucide-react";

export default function PNRStatus() {
  const [pnrNumber, setPnrNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrNumber.length !== 10) return;
    
    setIsLoading(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      setSearchResult({
        pnr: pnrNumber,
        trainNumber: "12951",
        trainName: "Mumbai Rajdhani",
        from: "New Delhi (NDLS)",
        to: "Mumbai Central (BCT)",
        dateOfJourney: "15-Dec-2024",
        class: "3A",
        quota: "GN",
        bookingStatus: "CNF",
        currentStatus: "CNF",
        distance: "1384 km",
        passengers: [
          {
            name: "PASSENGER 1",
            age: 35,
            gender: "M",
            bookingStatus: "CNF/B2/25",
            currentStatus: "CNF/B2/25"
          },
          {
            name: "PASSENGER 2", 
            age: 32,
            gender: "F",
            bookingStatus: "CNF/B2/26",
            currentStatus: "CNF/B2/26"
          }
        ],
        fare: 2540,
        bookingDate: "10-Dec-2024",
        departureTime: "16:55",
        arrivalTime: "08:35",
        totalTime: "15h 40m"
      });
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    if (status.includes("CNF")) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status.includes("RAC")) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    if (status.includes("WL")) return <Clock className="h-4 w-4 text-blue-600" />;
    if (status.includes("CAN")) return <XCircle className="h-4 w-4 text-red-600" />;
    return <AlertCircle className="h-4 w-4 text-gray-600" />;
  };

  const getStatusBadge = (status: string) => {
    if (status.includes("CNF")) return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
    if (status.includes("RAC")) return <Badge className="bg-yellow-100 text-yellow-800">RAC</Badge>;
    if (status.includes("WL")) return <Badge className="bg-blue-100 text-blue-800">Waiting List</Badge>;
    if (status.includes("CAN")) return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    return <Badge variant="secondary">Unknown</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">PNR Status Check</h1>
          <p className="text-muted-foreground">
            Get real-time updates on your booking status and journey details
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-railway-blue" />
              Enter PNR Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pnr">PNR Number (10 digits)</Label>
                <div className="flex gap-2">
                  <Input
                    id="pnr"
                    placeholder="Enter 10-digit PNR number"
                    value={pnrNumber}
                    onChange={(e) => setPnrNumber(e.target.value.toUpperCase())}
                    maxLength={10}
                    className="font-mono text-lg tracking-wider"
                  />
                  <Button 
                    type="submit" 
                    disabled={pnrNumber.length !== 10 || isLoading}
                    className="px-8"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Try: 1234567890 for a sample confirmed booking
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResult && (
          <div className="space-y-6">
            {/* Train Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Train className="h-5 w-5 text-railway-blue" />
                    Train Details
                  </CardTitle>
                  <div className="flex gap-2">
                    {getStatusBadge(searchResult.currentStatus)}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {searchResult.trainNumber} - {searchResult.trainName}
                      </h3>
                      <p className="text-sm text-muted-foreground">PNR: {searchResult.pnr}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-semibold">{searchResult.from.split("(")[0]}</p>
                        <p className="text-sm text-muted-foreground">{searchResult.departureTime}</p>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="h-px bg-border flex-1"></div>
                        <div className="text-xs text-muted-foreground">{searchResult.totalTime}</div>
                        <div className="h-px bg-border flex-1"></div>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{searchResult.to.split("(")[0]}</p>
                        <p className="text-sm text-muted-foreground">{searchResult.arrivalTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Journey Date: {searchResult.dateOfJourney}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Class: {searchResult.class} | Quota: {searchResult.quota}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Distance: {searchResult.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Total Fare: ₹{searchResult.fare}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-railway-blue" />
                  Passenger Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResult.passengers.map((passenger: any, index: number) => (
                    <div key={index}>
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{passenger.name}</span>
                            <span className="text-sm text-muted-foreground">
                              Age: {passenger.age} | {passenger.gender}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Booking Status:</span>
                            <span className="font-mono">{passenger.bookingStatus}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(passenger.currentStatus)}
                          <span className="font-mono text-sm">{passenger.currentStatus}</span>
                        </div>
                      </div>
                      {index < searchResult.passengers.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Booking Date</p>
                    <p className="font-medium">{searchResult.bookingDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Booking Status</p>
                    <p className="font-medium">{searchResult.bookingStatus}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Status</p>
                    <p className="font-medium">{searchResult.currentStatus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download E-Ticket
              </Button>
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Live Train Status
              </Button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <Card className="mt-8 bg-railway-blue/5">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">PNR Status Guide</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span><strong>CNF:</strong> Confirmed with seat/berth number</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span><strong>RAC:</strong> Reservation Against Cancellation</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span><strong>WL:</strong> Waiting List (followed by number)</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span><strong>CAN:</strong> Cancelled booking</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
