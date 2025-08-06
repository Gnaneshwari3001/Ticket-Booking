import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  TrainType,
  TrainClass,
  TRAIN_TYPE_INFO,
} from "@/lib/railway-schema";
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
  Zap,
  Award,
  X,
} from "lucide-react";

export default function EnhancedSearchResults() {
  const [sortBy, setSortBy] = useState("departure");
  const [expandedTrain, setExpandedTrain] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    trainTypes: [] as TrainType[],
    classes: [] as TrainClass[],
    departureTime: [0, 24] as [number, number],
    fareRange: [0, 5000] as [number, number],
    duration: [0, 30] as [number, number],
    amenities: [] as string[],
    availability: [] as string[]
  });

  const searchParams = {
    from: "Secunderabad Jn",
    fromCode: "SC",
    to: "Gadwal",
    toCode: "GWL",
    date: "15-Dec-2024",
    class: "3A"
  };

  // Comprehensive train data with all types
  const trains = [
    {
      number: "12951",
      name: "Mumbai Rajdhani",
      type: TrainType.RAJDHANI_EXPRESS,
      departure: "16:55",
      arrival: "08:35+1",
      duration: "15h 40m",
      distance: 1384,
      runDays: ["Daily"],
      classes: {
        "1A": { fare: 4565, status: "Available", seats: 12, waitingList: 0 },
        "2A": { fare: 2540, status: "Available", seats: 45, waitingList: 0 },
        "3A": { fare: 1780, status: "Available", seats: 78, waitingList: 0 },
      },
      amenities: ["wifi", "meals", "blanket", "charging"],
      punctuality: 92,
      rating: 4.3,
      features: ["Fully AC", "Meals included", "High priority"]
    },
    {
      number: "22691",
      name: "Rajdhani Express",
      type: TrainType.RAJDHANI_EXPRESS,
      departure: "20:05",
      arrival: "11:35+1",
      duration: "15h 30m",
      distance: 1384,
      runDays: ["Tue", "Thu", "Sun"],
      classes: {
        "1A": { fare: 4565, status: "Available", seats: 3, waitingList: 0 },
        "2A": { fare: 2540, status: "Available", seats: 18, waitingList: 0 },
        "3A": { fare: 1780, status: "Available", seats: 34, waitingList: 0 },
      },
      amenities: ["wifi", "meals", "blanket", "charging"],
      punctuality: 95,
      rating: 4.5,
      features: ["Fully AC", "Meals included", "Premium service"]
    },
    {
      number: "20501",
      name: "Vande Bharat Express",
      type: TrainType.VANDE_BHARAT_EXPRESS,
      departure: "06:00",
      arrival: "12:30",
      duration: "6h 30m",
      distance: 1384,
      runDays: ["Daily"],
      classes: {
        "CC": { fare: 1890, status: "Available", seats: 56, waitingList: 0 },
        "EA": { fare: 3240, status: "Available", seats: 18, waitingList: 0 },
      },
      amenities: ["wifi", "meals", "charging", "gps", "automatic_doors"],
      punctuality: 98,
      rating: 4.8,
      features: ["Semi-high speed", "Indigenous technology", "WiFi", "GPS"]
    },
    {
      number: "12615",
      name: "Grand Trunk Express",
      type: TrainType.EXPRESS,
      departure: "07:10",
      arrival: "03:05+1",
      duration: "19h 55m",
      distance: 1447,
      runDays: ["Daily"],
      classes: {
        "2A": { fare: 1890, status: "Available", seats: 67, waitingList: 0 },
        "3A": { fare: 1320, status: "Available", seats: 89, waitingList: 0 },
        "SL": { fare: 475, status: "Available", seats: 156, waitingList: 0 },
        "2S": { fare: 165, status: "Available", seats: 245, waitingList: 0 }
      },
      amenities: ["meals", "charging"],
      punctuality: 78,
      rating: 3.8,
      features: ["Budget friendly", "Good connectivity"]
    },
    {
      number: "12253",
      name: "Anga Express",
      type: TrainType.SUPERFAST_EXPRESS,
      departure: "14:20",
      arrival: "06:45+1",
      duration: "16h 25m",
      distance: 1384,
      runDays: ["Daily"],
      classes: {
        "3A": { fare: 1560, status: "RAC 5", seats: 0, waitingList: 0 },
        "SL": { fare: 525, status: "Available", seats: 23, waitingList: 0 },
        "2S": { fare: 185, status: "Available", seats: 78, waitingList: 0 }
      },
      amenities: ["meals", "charging"],
      punctuality: 85,
      rating: 4.0,
      features: ["Superfast", "Good timing"]
    },
    {
      number: "12701",
      name: "Husainsagar Express",
      type: TrainType.EXPRESS,
      departure: "22:15",
      arrival: "15:30+1",
      duration: "17h 15m",
      distance: 1447,
      runDays: ["Daily"],
      classes: {
        "3A": { fare: 1320, status: "Waiting List 25", seats: 0, waitingList: 25 },
        "SL": { fare: 475, status: "Available", seats: 45, waitingList: 0 },
        "2S": { fare: 165, status: "Available", seats: 123, waitingList: 0 }
      },
      amenities: ["meals"],
      punctuality: 82,
      rating: 3.9,
      features: ["Overnight journey", "Popular route"]
    },
    {
      number: "12752",
      name: "Sampark Kranti Express",
      type: TrainType.SAMPARK_KRANTI_EXPRESS,
      departure: "09:45",
      arrival: "02:15+1",
      duration: "16h 30m",
      distance: 1384,
      runDays: ["Mon", "Wed", "Fri"],
      classes: {
        "3A": { fare: 1650, status: "Available", seats: 67, waitingList: 0 },
        "SL": { fare: 545, status: "Available", seats: 89, waitingList: 0 },
        "2S": { fare: 195, status: "Available", seats: 156, waitingList: 0 }
      },
      amenities: ["meals", "charging"],
      punctuality: 88,
      rating: 4.1,
      features: ["State connectivity", "Good facilities"]
    },
    {
      number: "17201",
      name: "Hyderabad Golconda Express",
      type: TrainType.EXPRESS,
      departure: "18:30",
      arrival: "12:45+1",
      duration: "18h 15m",
      distance: 1447,
      runDays: ["Daily"],
      classes: {
        "SL": { fare: 475, status: "Available", seats: 234, waitingList: 0 },
        "2S": { fare: 165, status: "Available", seats: 456, waitingList: 0 }
      },
      amenities: ["charging"],
      punctuality: 76,
      rating: 3.6,
      features: ["Economy travel", "Multiple stops"]
    }
  ];

  // Filter trains based on selected filters
  const filteredTrains = useMemo(() => {
    return trains.filter(train => {
      // Train type filter
      if (filters.trainTypes.length > 0 && !filters.trainTypes.includes(train.type)) {
        return false;
      }

      // Class filter
      if (filters.classes.length > 0) {
        const hasClass = filters.classes.some(cls => train.classes[cls]);
        if (!hasClass) return false;
      }

      // Departure time filter
      const depHour = parseInt(train.departure.split(':')[0]);
      if (depHour < filters.departureTime[0] || depHour > filters.departureTime[1]) {
        return false;
      }

      // Fare range filter (checking 3A class as reference)
      const fare3A = train.classes["3A"]?.fare || train.classes["SL"]?.fare || 0;
      if (fare3A < filters.fareRange[0] || fare3A > filters.fareRange[1]) {
        return false;
      }

      // Duration filter
      const durationHours = parseFloat(train.duration.split('h')[0]);
      if (durationHours < filters.duration[0] || durationHours > filters.duration[1]) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAmenities = filters.amenities.every(amenity => train.amenities.includes(amenity));
        if (!hasAmenities) return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const hasAvailability = filters.availability.some(status => {
          return Object.values(train.classes).some(cls => cls.status.includes(status));
        });
        if (!hasAvailability) return false;
      }

      return true;
    });
  }, [trains, filters]);

  // Sort trains
  const sortedTrains = useMemo(() => {
    return [...filteredTrains].sort((a, b) => {
      switch (sortBy) {
        case "departure":
          return a.departure.localeCompare(b.departure);
        case "duration":
          return parseFloat(a.duration) - parseFloat(b.duration);
        case "fare":
          const fareA = a.classes["3A"]?.fare || a.classes["SL"]?.fare || 0;
          const fareB = b.classes["3A"]?.fare || b.classes["SL"]?.fare || 0;
          return fareA - fareB;
        case "rating":
          return b.rating - a.rating;
        case "punctuality":
          return b.punctuality - a.punctuality;
        default:
          return 0;
      }
    });
  }, [filteredTrains, sortBy]);

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

  const getTrainTypeIcon = (type: TrainType) => {
    switch (type) {
      case TrainType.VANDE_BHARAT_EXPRESS:
        return <Zap className="h-4 w-4 text-blue-600" />;
      case TrainType.RAJDHANI_EXPRESS:
        return <Award className="h-4 w-4 text-red-600" />;
      case TrainType.SHATABDI_EXPRESS:
        return <Star className="h-4 w-4 text-orange-600" />;
      default:
        return <Train className="h-4 w-4 text-railway-blue" />;
    }
  };

  const clearFilters = () => {
    setFilters({
      trainTypes: [],
      classes: [],
      departureTime: [0, 24],
      fareRange: [0, 5000],
      duration: [0, 30],
      amenities: [],
      availability: []
    });
  };

  // Filter sidebar content
  const FilterSidebar = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Train Types */}
      <div>
        <h4 className="font-medium mb-3">Train Types</h4>
        <div className="space-y-2">
          {Object.values(TrainType).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.trainTypes.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({
                      ...prev,
                      trainTypes: [...prev.trainTypes, type]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      trainTypes: prev.trainTypes.filter(t => t !== type)
                    }));
                  }
                }}
              />
              <Label htmlFor={type} className="text-sm">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Classes */}
      <div>
        <h4 className="font-medium mb-3">Classes</h4>
        <div className="space-y-2">
          {Object.values(TrainClass).map((cls) => (
            <div key={cls} className="flex items-center space-x-2">
              <Checkbox
                id={cls}
                checked={filters.classes.includes(cls)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({
                      ...prev,
                      classes: [...prev.classes, cls]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      classes: prev.classes.filter(c => c !== cls)
                    }));
                  }
                }}
              />
              <Label htmlFor={cls} className="text-sm">
                {cls}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div>
        <h4 className="font-medium mb-3">Departure Time</h4>
        <div className="px-2">
          <Slider
            value={filters.departureTime}
            onValueChange={(value) => setFilters(prev => ({ ...prev, departureTime: value as [number, number] }))}
            max={24}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{filters.departureTime[0]}:00</span>
            <span>{filters.departureTime[1]}:00</span>
          </div>
        </div>
      </div>

      {/* Fare Range */}
      <div>
        <h4 className="font-medium mb-3">Fare Range</h4>
        <div className="px-2">
          <Slider
            value={filters.fareRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, fareRange: value as [number, number] }))}
            max={5000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>₹{filters.fareRange[0]}</span>
            <span>₹{filters.fareRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-medium mb-3">Amenities</h4>
        <div className="space-y-2">
          {["wifi", "meals", "charging", "blanket"].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({
                      ...prev,
                      amenities: [...prev.amenities, amenity]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      amenities: prev.amenities.filter(a => a !== amenity)
                    }));
                  }
                }}
              />
              <Label htmlFor={amenity} className="text-sm capitalize">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-medium mb-3">Availability</h4>
        <div className="space-y-2">
          {["Available", "RAC", "Waiting"].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={status}
                checked={filters.availability.includes(status)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({
                      ...prev,
                      availability: [...prev.availability, status]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      availability: prev.availability.filter(s => s !== status)
                    }));
                  }
                }}
              />
              <Label htmlFor={status} className="text-sm">
                {status}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                    <p className="text-xs text-muted-foreground">{searchParams.fromCode}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-semibold">{searchParams.to}</p>
                    <p className="text-xs text-muted-foreground">{searchParams.toCode}</p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="text-center">
                    <p className="font-semibold">{searchParams.date}</p>
                    <p className="text-xs text-muted-foreground">Journey Date</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Modify Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="sticky top-4">
              <FilterSidebar />
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters and Sort */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{sortedTrains.length} trains found</span>
                
                {/* Mobile Filter Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Trains</SheetTitle>
                      <SheetDescription>
                        Filter trains by type, class, timing and more
                      </SheetDescription>
                    </SheetHeader>
                    <FilterSidebar />
                  </SheetContent>
                </Sheet>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure">Departure Time</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="fare">Price: Low to High</SelectItem>
                  <SelectItem value="rating">Rating: High to Low</SelectItem>
                  <SelectItem value="punctuality">Punctuality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Train Results */}
            <div className="space-y-4">
              {sortedTrains.map((train) => (
                <Card key={train.number} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Main Train Info */}
                    <div className="p-6">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Train Details */}
                        <div className="col-span-12 md:col-span-4 space-y-2">
                          <div className="flex items-center gap-2">
                            {getTrainTypeIcon(train.type)}
                            <span className="font-semibold">{train.number}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{train.rating}</span>
                            </div>
                          </div>
                          <h3 className="font-medium">{train.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {train.type.split(' ')[0]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Runs: {train.runDays.join(', ')}
                            </span>
                          </div>
                        </div>

                        {/* Timing */}
                        <div className="col-span-12 md:col-span-4">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-lg font-bold">{train.departure}</p>
                              <p className="text-xs text-muted-foreground">{searchParams.fromCode}</p>
                            </div>
                            <div className="flex-1 text-center">
                              <p className="text-xs text-muted-foreground">{train.duration}</p>
                              <div className="h-px bg-border my-1"></div>
                              <p className="text-xs text-muted-foreground">{train.distance} km</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold">{train.arrival}</p>
                              <p className="text-xs text-muted-foreground">{searchParams.toCode}</p>
                            </div>
                          </div>
                        </div>

                        {/* Availability & Fare */}
                        <div className="col-span-12 md:col-span-4">
                          <div className="text-right space-y-2">
                            <div className="flex items-center justify-end gap-2">
                              {getStatusBadge(Object.values(train.classes)[0]?.status || "Not Available")}
                              <span className="text-lg font-bold text-railway-blue">
                                ₹{Object.values(train.classes)[0]?.fare || 0}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {Object.values(train.classes)[0]?.seats > 0 
                                ? `${Object.values(train.classes)[0]?.seats} seats` 
                                : Object.values(train.classes)[0]?.status
                              }
                            </p>
                            <div className="flex items-center justify-end gap-3 text-xs">
                              <span className="text-muted-foreground">
                                Punctuality: {train.punctuality}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features & Amenities */}
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
                          {train.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
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
                            disabled={!Object.values(train.classes).some(cls => cls.status.includes("Available"))}
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
                                  {details.seats > 0 
                                    ? `${details.seats} seats available` 
                                    : details.waitingList > 0 
                                      ? `WL ${details.waitingList}`
                                      : details.status
                                  }
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
                        
                        {/* Train Type Info */}
                        {TRAIN_TYPE_INFO[train.type] && (
                          <div className="mt-4 p-4 bg-railway-blue/5 rounded-lg">
                            <h5 className="font-medium mb-2">{train.type}</h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              {TRAIN_TYPE_INFO[train.type].description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {TRAIN_TYPE_INFO[train.type].features.map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              <Badge variant="outline" className="text-xs">
                                Avg Speed: {TRAIN_TYPE_INFO[train.type].avgSpeed}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {sortedTrains.length === 0 && (
              <Card className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No trains found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </Card>
            )}
          </div>
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
                  <li>• Train timings and availability subject to change. Please verify before travel.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
