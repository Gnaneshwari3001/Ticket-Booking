import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { RailwayDataService, EnhancedTrainData } from "@/lib/railway-data";
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
  Route,
} from "lucide-react";

export default function RealDataSearchResults() {
  const [searchParams] = useSearchParams();
  const [trains, setTrains] = useState<EnhancedTrainData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("departure");
  const [expandedTrain, setExpandedTrain] = useState<string | null>(null);
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    trainTypes: [] as string[],
    classes: [] as string[],
    departureTime: [0, 24] as [number, number],
    fareRange: [0, 5000] as [number, number],
    duration: [0, 30] as [number, number],
    amenities: [] as string[],
    availability: [] as string[]
  });

  // Extract search parameters
  const fromStation = searchParams.get('from') || '';
  const toStation = searchParams.get('to') || '';
  const journeyDate = searchParams.get('date') || '';
  const travelClass = searchParams.get('class') || '3A';

  // Get station details
  const fromStationData = RailwayDataService.getStationByCode(fromStation);
  const toStationData = RailwayDataService.getStationByCode(toStation);

  // Load trains on component mount
  useEffect(() => {
    if (fromStation && toStation) {
      setLoading(true);
      try {
        const searchResults = RailwayDataService.searchTrainsBetweenStations(fromStation, toStation);
        setTrains(searchResults);
      } catch (error) {
        console.error('Error searching trains:', error);
        setTrains([]);
      } finally {
        setLoading(false);
      }
    }
  }, [fromStation, toStation]);

  // Filter trains based on selected filters
  const filteredTrains = useMemo(() => {
    return trains.filter(train => {
      // Train type filter
      if (filters.trainTypes.length > 0 && !filters.trainTypes.includes(train.train_type)) {
        return false;
      }

      // Class filter
      if (filters.classes.length > 0) {
        const hasClass = filters.classes.some(cls => train.classes[cls]);
        if (!hasClass) return false;
      }

      // Get departure time for this route
      const fromSchedule = train.schedules.find(s => s.station_code === fromStation);
      if (fromSchedule?.departure_time) {
        const depHour = parseInt(fromSchedule.departure_time.split(':')[0]);
        if (depHour < filters.departureTime[0] || depHour > filters.departureTime[1]) {
          return false;
        }
      }

      // Fare range filter (checking default class as reference)
      const defaultClass = Object.keys(train.classes)[0];
      const fare = train.classes[defaultClass]?.fare || 0;
      if (fare < filters.fareRange[0] || fare > filters.fareRange[1]) {
        return false;
      }

      // Duration filter
      const durationHours = parseFloat(train.totalDuration.split('h')[0]);
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
  }, [trains, filters, fromStation]);

  // Sort trains
  const sortedTrains = useMemo(() => {
    return [...filteredTrains].sort((a, b) => {
      switch (sortBy) {
        case "departure":
          const aDepTime = a.schedules.find(s => s.station_code === fromStation)?.departure_time || '00:00';
          const bDepTime = b.schedules.find(s => s.station_code === fromStation)?.departure_time || '00:00';
          return aDepTime.localeCompare(bDepTime);
        case "duration":
          return parseFloat(a.totalDuration) - parseFloat(b.totalDuration);
        case "fare":
          const fareA = Object.values(a.classes)[0]?.fare || 0;
          const fareB = Object.values(b.classes)[0]?.fare || 0;
          return fareA - fareB;
        case "rating":
          return b.rating - a.rating;
        case "punctuality":
          return b.punctuality - a.punctuality;
        default:
          return 0;
      }
    });
  }, [filteredTrains, sortBy, fromStation]);

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

  const getTrainTypeIcon = (type: string) => {
    if (type.includes('Vande Bharat')) return <Zap className="h-4 w-4 text-blue-600" />;
    if (type.includes('Rajdhani')) return <Award className="h-4 w-4 text-red-600" />;
    if (type.includes('Shatabdi')) return <Star className="h-4 w-4 text-orange-600" />;
    return <Train className="h-4 w-4 text-railway-blue" />;
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

  const getTrainRoute = (trainId: number) => {
    return RailwayDataService.getTrainRoute(trainId);
  };

  const formatTime = (time: string) => {
    return time || '--:--';
  };

  const formatDay = (dayNumber: number) => {
    if (dayNumber === 1) return '';
    return `+${dayNumber - 1}`;
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
          {Array.from(new Set(trains.map(t => t.train_type))).map((type) => (
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
          {Array.from(new Set(trains.flatMap(t => Object.keys(t.classes)))).map((cls) => (
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
          {Array.from(new Set(trains.flatMap(t => t.amenities))).map((amenity) => (
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
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-railway-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Searching trains...</p>
        </div>
      </div>
    );
  }

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
                    <p className="font-semibold">{fromStationData?.station_name || fromStation}</p>
                    <p className="text-xs text-muted-foreground">{fromStation}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-semibold">{toStationData?.station_name || toStation}</p>
                    <p className="text-xs text-muted-foreground">{toStation}</p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="text-center">
                    <p className="font-semibold">{journeyDate}</p>
                    <p className="text-xs text-muted-foreground">Journey Date</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">Modify Search</Link>
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
              {sortedTrains.map((train) => {
                const fromSchedule = train.schedules.find(s => s.station_code === fromStation);
                const toSchedule = train.schedules.find(s => s.station_code === toStation);
                const defaultClassFare = Object.values(train.classes)[0]?.fare || 0;
                const defaultClassStatus = Object.values(train.classes)[0]?.status || "Not Available";

                return (
                  <Card key={train.train_number} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      {/* Main Train Info */}
                      <div className="p-6">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Train Details */}
                          <div className="col-span-12 md:col-span-4 space-y-2">
                            <div className="flex items-center gap-2">
                              {getTrainTypeIcon(train.train_type)}
                              <span className="font-semibold">{train.train_number}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">{train.rating}</span>
                              </div>
                            </div>
                            <h3 className="font-medium">{train.train_name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {train.train_type.split(' ')[0]}
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
                                <p className="text-lg font-bold">
                                  {formatTime(fromSchedule?.departure_time || fromSchedule?.arrival_time || '')}
                                </p>
                                <p className="text-xs text-muted-foreground">{fromStation}</p>
                              </div>
                              <div className="flex-1 text-center">
                                <p className="text-xs text-muted-foreground">{train.totalDuration}</p>
                                <div className="h-px bg-border my-1"></div>
                                <p className="text-xs text-muted-foreground">{train.totalDistance} km</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold">
                                  {formatTime(toSchedule?.arrival_time || toSchedule?.departure_time || '')}
                                  {toSchedule && formatDay(toSchedule.day_number)}
                                </p>
                                <p className="text-xs text-muted-foreground">{toStation}</p>
                              </div>
                            </div>
                          </div>

                          {/* Availability & Fare */}
                          <div className="col-span-12 md:col-span-4">
                            <div className="text-right space-y-2">
                              <div className="flex items-center justify-end gap-2">
                                {getStatusBadge(defaultClassStatus)}
                                <span className="text-lg font-bold text-railway-blue">
                                  ₹{defaultClassFare}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {Object.values(train.classes)[0]?.availability > 0 
                                  ? `${Object.values(train.classes)[0]?.availability} seats` 
                                  : defaultClassStatus
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
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedRoute(expandedRoute === train.train_number ? null : train.train_number)}
                            >
                              <Route className="h-4 w-4 mr-1" />
                              Route
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedTrain(expandedTrain === train.train_number ? null : train.train_number)}
                            >
                              View Classes
                              {expandedTrain === train.train_number ? (
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

                      {/* Expanded Route Details */}
                      {expandedRoute === train.train_number && (
                        <div className="border-t border-border bg-muted/30 p-6">
                          <h4 className="font-medium mb-4">Train Route</h4>
                          <div className="space-y-2">
                            {getTrainRoute(train.id).map((routeItem, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-railway-blue/10 flex items-center justify-center">
                                    <span className="text-xs font-medium">{index + 1}</span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{routeItem.station.station_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {routeItem.station.station_code} • {routeItem.station.city}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Arr: </span>
                                      <span className="font-medium">
                                        {formatTime(routeItem.schedule.arrival_time || '')}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Dep: </span>
                                      <span className="font-medium">
                                        {formatTime(routeItem.schedule.departure_time || '')}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {routeItem.schedule.distance_from_source} km
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expanded Class Details */}
                      {expandedTrain === train.train_number && (
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
                                    {details.availability > 0 
                                      ? `${details.availability} seats available` 
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
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* No Results */}
            {sortedTrains.length === 0 && !loading && (
              <Card className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No trains found</h3>
                <p className="text-muted-foreground mb-4">
                  No trains available between {fromStationData?.station_name} and {toStationData?.station_name}
                </p>
                <Button asChild>
                  <Link to="/">Try Different Route</Link>
                </Button>
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
                <p className="text-sm font-medium">Real Train Data Information</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Train schedules and routes are based on actual IRCTC data structure.</li>
                  <li>• Seat availability and fares are dynamically calculated based on distance and train type.</li>
                  <li>• Route information shows all intermediate stations with actual timings.</li>
                  <li>• Train types include Express, Superfast Express, Rajdhani, and regional trains.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
