import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StationSearch, PopularRoutes } from "@/components/StationSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Train,
  ArrowRightLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Shield,
  Zap,
  Search,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function Index() {
  const [fromStation, setFromStation] = useState("");
  const [fromStationName, setFromStationName] = useState("");
  const [toStation, setToStation] = useState("");
  const [toStationName, setToStationName] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelClass, setTravelClass] = useState("3A");
  const [quota, setQuota] = useState("GN");
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const popularRoutes = [
    { from: "New Delhi", to: "Mumbai Central", time: "15h 50m", price: "₹1,545" },
    { from: "Chennai Central", to: "Bangalore", time: "4h 45m", price: "₹485" },
    { from: "Kolkata", to: "Delhi", time: "17h 20m", price: "₹1,275" },
    { from: "Pune", to: "Mumbai", time: "3h 25m", price: "₹285" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "256-bit SSL encryption for safe transactions",
    },
    {
      icon: Zap,
      title: "Instant Confirmation",
      description: "Get your e-ticket immediately after payment",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer service",
    },
    {
      icon: Star,
      title: "Best Prices",
      description: "Official IRCTC rates with no hidden charges",
    },
  ];

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-railway-blue/10 to-railway-orange/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Book Your{" "}
              <span className="text-railway-blue">Railway Journey</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Safe, reliable, and convenient train booking with real-time availability.
              Your trusted partner for Indian Railway reservations.
            </p>
          </div>

          {/* Train Search Form */}
          <Card className="max-w-5xl mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Train className="h-5 w-5 text-railway-blue" />
                  Search Trains
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      checked={!isRoundTrip}
                      onChange={() => setIsRoundTrip(false)}
                      className="accent-railway-blue"
                    />
                    One Way
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      checked={isRoundTrip}
                      onChange={() => setIsRoundTrip(true)}
                      className="accent-railway-blue"
                    />
                    Round Trip
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Station Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from" className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    From
                  </Label>
                  <Input
                    id="from"
                    placeholder="Enter source station"
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="to" className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    To
                  </Label>
                  <Input
                    id="to"
                    placeholder="Enter destination station"
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="h-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSwapStations}
                    className="absolute top-8 right-2 h-8 w-8 p-0"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="journey-date" className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Journey Date
                  </Label>
                  <Input
                    id="journey-date"
                    type="date"
                    min={today}
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="h-12"
                  />
                </div>
                {isRoundTrip && (
                  <div className="space-y-2">
                    <Label htmlFor="return-date" className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Return Date
                    </Label>
                    <Input
                      id="return-date"
                      type="date"
                      min={journeyDate || today}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="h-12"
                    />
                  </div>
                )}
              </div>

              {/* Class and Quota Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Travel Class
                  </Label>
                  <Select value={travelClass} onValueChange={setTravelClass}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1A">AC First Class (1A)</SelectItem>
                      <SelectItem value="2A">AC 2 Tier (2A)</SelectItem>
                      <SelectItem value="3A">AC 3 Tier (3A)</SelectItem>
                      <SelectItem value="SL">Sleeper (SL)</SelectItem>
                      <SelectItem value="CC">Chair Car (CC)</SelectItem>
                      <SelectItem value="2S">Second Sitting (2S)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quota</Label>
                  <Select value={quota} onValueChange={setQuota}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GN">General</SelectItem>
                      <SelectItem value="TQ">Tatkal</SelectItem>
                      <SelectItem value="LD">Ladies</SelectItem>
                      <SelectItem value="SS">Senior Citizen</SelectItem>
                      <SelectItem value="HP">Handicapped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search Button */}
              <Button asChild size="lg" className="w-full h-14 text-lg font-semibold">
                <Link to="/search-results" className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Trains
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all group">
              <CardContent className="p-6 text-center">
                <div className="bg-railway-blue/10 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-railway-blue/20 transition-colors">
                  <Search className="h-6 w-6 text-railway-blue" />
                </div>
                <h3 className="font-semibold mb-2">PNR Status</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check your booking status and get live updates
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/pnr-status">Check Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all group">
              <CardContent className="p-6 text-center">
                <div className="bg-railway-orange/10 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-railway-orange/20 transition-colors">
                  <MapPin className="h-6 w-6 text-railway-orange" />
                </div>
                <h3 className="font-semibold mb-2">Live Tracking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your train's real-time location and delays
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/live-tracking">Track Train</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all group">
              <CardContent className="p-6 text-center">
                <div className="bg-railway-green/10 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-railway-green/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-railway-green" />
                </div>
                <h3 className="font-semibold mb-2">Booking History</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage your past bookings
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/booking-history">View History</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Routes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoutes.map((route, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-all group">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{route.from}</p>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ArrowRightLeft className="h-3 w-3" />
                      </div>
                      <p className="font-medium text-sm">{route.to}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {route.time}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-railway-blue">{route.price}</span>
                    <Button size="sm" variant="ghost" className="text-xs">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose RailEase Portal?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-railway-blue/10 p-4 rounded-full w-fit mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-railway-blue" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-railway-orange/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 justify-center text-center">
            <AlertCircle className="h-5 w-5 text-railway-orange" />
            <p className="text-sm">
              <strong>Notice:</strong> Booking opens 120 days in advance. Tatkal booking opens 1 day before departure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
