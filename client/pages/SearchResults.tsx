import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Train,
  Clock,
  MapPin,
  Calendar,
  Users,
  Filter,
  ArrowRight,
  Wifi,
  Utensils,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

export default function SearchResults() {
  const [sortBy, setSortBy] = useState("departure");
  const [expandedTrain, setExpandedTrain] = useState<string | null>(null);

  const searchParams = {
    from: "New Delhi",
    to: "Mumbai Central", 
    date: "15-Dec-2024",
    class: "3A"
  };

  const trains = [
    {
      number: "12951",
      name: "Mumbai Rajdhani",
      departure: "16:55",
      arrival: "08:35+1",
      duration: "15h 40m",
      distance: "1384 km",
      runDays: "Daily",
      classes: {
        "1A": { fare: 4565, status: "Available", seats: 12 },
        "2A": { fare: 2540, status: "Available", seats: 45 },
        "3A": { fare: 1780, status: "Available", seats: 78 },
        "SL": { fare: 635, status: "Waiting List 25", seats: 0 }
      },
      amenities: ["wifi", "meals", "blanket"],
      punctuality: 92,
      rating: 4.3
    },
    {
      number: "12953",
      name: "August Kranti Rajdhani",
      departure: "17:55", 
      arrival: "09:55+1",
      duration: "16h 00m",
      distance: "1384 km",
      runDays: "Daily",
      classes: {
        "1A": { fare: 4565, status: "Available", seats: 8 },
        "2A": { fare: 2540, status: "Available", seats: 23 },
        "3A": { fare: 1780, status: "RAC 5", seats: 0 },
        "SL": { fare: 635, status: "Waiting List 45", seats: 0 }
      },
      amenities: ["wifi", "meals", "blanket"],
      punctuality: 88,
      rating: 4.2
    },
    {
      number: "12615",
      name: "Grand Trunk Express",
      departure: "07:10",
      arrival: "03:05+1",
      duration: "19h 55m", 
      distance: "1447 km",
      runDays: "Daily",
      classes: {
        "1A": { fare: 3245, status: "Not Available", seats: 0 },
        "2A": { fare: 1890, status: "Available", seats: 67 },
        "3A": { fare: 1320, status: "Available", seats: 89 },
        "SL": { fare: 475, status: "Available", seats: 156 }
      },
      amenities: ["meals"],
      punctuality: 78,
      rating: 3.8
    },
    {
      number: "22691",
      name: "Rajdhani Express",
      departure: "20:05",
      arrival: "11:35+1",
      duration: "15h 30m",
      distance: "1384 km", 
      runDays: "Tue, Thu, Sun",
      classes: {
        "1A": { fare: 4565, status: "Available", seats: 3 },
        "2A": { fare: 2540, status: "Available", seats: 18 },
        "3A": { fare: 1780, status: "Available", seats: 34 },
        "SL": { fare: 635, status: "Waiting List 12", seats: 0 }
      },
      amenities: ["wifi", "meals", "blanket"],
      punctuality: 95,
      rating: 4.5
    }
  ];

  const getStatusColor = (status: string) => {
    if (status.includes("Available")) return "text-green-600";
    if (status.includes("RAC")) return "text-yellow-600";
    if (status.includes("Waiting")) return "text-blue-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    if (status.includes("Available")) return <Badge className="bg-green-100 text-green-800">Available</Badge>;
    if (status.includes("RAC")) return <Badge className="bg-yellow-100 text-yellow-800">RAC</Badge>;
    if (status.includes("Waiting")) return <Badge className="bg-blue-100 text-blue-800">Waitlist</Badge>;
    return <Badge className="bg-red-100 text-red-800">Not Available</Badge>;
  };

  const sortedTrains = [...trains].sort((a, b) => {
    if (sortBy === "departure") return a.departure.localeCompare(b.departure);
    if (sortBy === "duration") return a.duration.localeCompare(b.duration);
    if (sortBy === "fare") return a.classes["3A"].fare - b.classes["3A"].fare;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="text-railway-blue hover:underline">← Back to Search</Link>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-semibold">{searchParams.from}</p>
                    <p className="text-xs text-muted-foreground">From</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-semibold">{searchParams.to}</p>
                    <p className="text-xs text-muted-foreground">To</p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="text-center">
                    <p className="font-semibold">{searchParams.date}</p>
                    <p className="text-xs text-muted-foreground">Journey Date</p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="text-center">
                    <p className="font-semibold">{searchParams.class}</p>
                    <p className="text-xs text-muted-foreground">Class</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Modify Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{trains.length} trains found</span>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="departure">Departure Time</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="fare">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Train Results */}
        <div className="space-y-4">
          {sortedTrains.map((train) => (
            <Card key={train.number} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Main Train Info */}
                <div className="p-6">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Train Details */}
                    <div className="col-span-12 md:col-span-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Train className="h-4 w-4 text-railway-blue" />
                        <span className="font-semibold">{train.number}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{train.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-medium">{train.name}</h3>
                      <p className="text-xs text-muted-foreground">Runs: {train.runDays}</p>
                    </div>

                    {/* Timing */}
                    <div className="col-span-12 md:col-span-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">{train.departure}</p>
                          <p className="text-xs text-muted-foreground">{searchParams.from}</p>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground">{train.duration}</p>
                          <div className="h-px bg-border my-1"></div>
                          <p className="text-xs text-muted-foreground">{train.distance}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{train.arrival}</p>
                          <p className="text-xs text-muted-foreground">{searchParams.to}</p>
                        </div>
                      </div>
                    </div>

                    {/* Availability & Fare */}
                    <div className="col-span-12 md:col-span-4">
                      <div className="text-right space-y-2">
                        <div className="flex items-center justify-end gap-2">
                          {getStatusBadge(train.classes["3A"].status)}
                          <span className="text-lg font-bold text-railway-blue">
                            ₹{train.classes["3A"].fare}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {train.classes["3A"].seats > 0 ? `${train.classes["3A"].seats} seats` : train.classes["3A"].status}
                        </p>
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs text-muted-foreground">Punctuality:</span>
                          <span className="text-xs font-medium">{train.punctuality}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      {train.amenities.includes("wifi") && (
                        <div className="flex items-center gap-1">
                          <Wifi className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">WiFi</span>
                        </div>
                      )}
                      {train.amenities.includes("meals") && (
                        <div className="flex items-center gap-1">
                          <Utensils className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">Meals</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">Secure</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedTrain(expandedTrain === train.number ? null : train.number)}
                      >
                        View Classes
                        {expandedTrain === train.number ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </Button>
                      <Button 
                        size="sm"
                        disabled={!train.classes["3A"].status.includes("Available")}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Class Details */}
                {expandedTrain === train.number && (
                  <div className="border-t border-border bg-muted/30 p-6">
                    <h4 className="font-medium mb-4">Available Classes</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(train.classes).map(([classCode, details]) => (
                        <Card key={classCode} className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{classCode}</span>
                              {getStatusBadge(details.status)}
                            </div>
                            <p className="text-lg font-bold text-railway-blue">₹{details.fare}</p>
                            <p className="text-xs text-muted-foreground">
                              {details.seats > 0 ? `${details.seats} seats available` : details.status}
                            </p>
                            <Button 
                              size="sm" 
                              className="w-full"
                              disabled={!details.status.includes("Available")}
                            >
                              {details.status.includes("Available") ? "Book" : "Not Available"}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Notice */}
        <Card className="mt-8 bg-railway-orange/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-railway-orange mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Important Information</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Fares shown are base fares. Service charges and payment gateway charges may apply.</li>
                  <li>• Seat availability is updated in real-time but may change during booking.</li>
                  <li>• RAC (Reservation Against Cancellation) passengers get confirmed seats if someone cancels.</li>
                  <li>• Waiting list tickets may get confirmed based on cancellations.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
