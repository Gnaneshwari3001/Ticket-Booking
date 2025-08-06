import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { RailwayDataService } from "@/lib/railway-data";
import {
  Train,
  MapPin,
  Clock,
  Navigation,
  Zap,
  AlertTriangle,
  CheckCircle,
  Search,
  RefreshCw,
  Bell,
  Route,
  Calendar,
  Users,
  Phone,
  Wifi,
  Signal,
  Battery,
} from "lucide-react";

interface TrainLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  speed: number;
  heading: number;
}

interface LiveTrainData {
  trainNumber: string;
  trainName: string;
  runningDate: string;
  currentLocation: TrainLocation;
  currentStation: {
    code: string;
    name: string;
    arrivalTime: string;
    departureTime: string;
    actualArrival?: string;
    actualDeparture?: string;
    delayMinutes: number;
    platform?: string;
  };
  nextStation: {
    code: string;
    name: string;
    expectedArrival: string;
    distance: number;
  };
  status: 'on-time' | 'running-late' | 'departed' | 'arrived' | 'cancelled' | 'rescheduled';
  delay: number;
  totalDistance: number;
  distanceCovered: number;
  averageSpeed: number;
  route: {
    stationCode: string;
    stationName: string;
    arrivalTime: string;
    departureTime: string;
    actualArrival?: string;
    actualDeparture?: string;
    delayMinutes: number;
    distance: number;
    isCompleted: boolean;
    isCurrent: boolean;
    platform?: string;
  }[];
  lastUpdated: string;
}

export default function LiveTracking() {
  const [searchTrain, setSearchTrain] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [trainData, setTrainData] = useState<LiveTrainData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  // Mock live train data
  const mockTrainData: LiveTrainData = {
    trainNumber: "12951",
    trainName: "Mumbai Rajdhani",
    runningDate: selectedDate,
    currentLocation: {
      latitude: 25.4358,
      longitude: 81.8463,
      timestamp: new Date().toISOString(),
      speed: 85,
      heading: 215
    },
    currentStation: {
      code: "ALLP",
      name: "Allahabad Jn",
      arrivalTime: "14:35",
      departureTime: "14:40",
      actualArrival: "14:42",
      actualDeparture: "14:47",
      delayMinutes: 7,
      platform: "6"
    },
    nextStation: {
      code: "JHS",
      name: "Jhansi Jn",
      expectedArrival: "16:25",
      distance: 189
    },
    status: "running-late",
    delay: 7,
    totalDistance: 1384,
    distanceCovered: 692,
    averageSpeed: 78,
    route: [
      {
        stationCode: "NDLS",
        stationName: "New Delhi",
        arrivalTime: "16:55",
        departureTime: "16:55",
        actualDeparture: "16:55",
        delayMinutes: 0,
        distance: 0,
        isCompleted: true,
        isCurrent: false,
        platform: "2"
      },
      {
        stationCode: "AGC",
        stationName: "Agra Cantt",
        arrivalTime: "19:35",
        departureTime: "19:40",
        actualArrival: "19:38",
        actualDeparture: "19:43",
        delayMinutes: 3,
        distance: 199,
        isCompleted: true,
        isCurrent: false,
        platform: "1"
      },
      {
        stationCode: "ALLP",
        stationName: "Allahabad Jn",
        arrivalTime: "14:35",
        departureTime: "14:40",
        actualArrival: "14:42",
        actualDeparture: "14:47",
        delayMinutes: 7,
        distance: 692,
        isCompleted: false,
        isCurrent: true,
        platform: "6"
      },
      {
        stationCode: "JHS",
        stationName: "Jhansi Jn",
        arrivalTime: "16:05",
        departureTime: "16:10",
        delayMinutes: 0,
        distance: 881,
        isCompleted: false,
        isCurrent: false
      },
      {
        stationCode: "BCT",
        stationName: "Mumbai Central",
        arrivalTime: "08:35",
        departureTime: "08:35",
        delayMinutes: 0,
        distance: 1384,
        isCompleted: false,
        isCurrent: false
      }
    ],
    lastUpdated: new Date().toISOString()
  };

  const searchTrainStatus = async () => {
    if (!searchTrain) {
      setError("Please enter a train number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (searchTrain === "12951") {
        setTrainData(mockTrainData);
      } else {
        // Check if train exists in our data
        const train = RailwayDataService.getTrainByNumber(searchTrain);
        if (train) {
          setTrainData({
            ...mockTrainData,
            trainNumber: train.train_number,
            trainName: train.train_name
          });
        } else {
          setError("Train not found or not running on the selected date");
          setTrainData(null);
        }
      }
      
      setLastRefresh(new Date());
    } catch (err) {
      setError("Failed to fetch train status. Please try again.");
      setTrainData(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    if (!trainData) return;
    
    setLoading(true);
    // Simulate refresh with slight delay changes
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTrainData(prev => prev ? {
      ...prev,
      delay: prev.delay + Math.floor(Math.random() * 3) - 1, // Random delay change
      currentLocation: {
        ...prev.currentLocation,
        timestamp: new Date().toISOString(),
        speed: 75 + Math.floor(Math.random() * 20), // Random speed
      },
      lastUpdated: new Date().toISOString()
    } : null);
    
    setLastRefresh(new Date());
    setLoading(false);
  };

  // Auto refresh functionality
  useEffect(() => {
    if (isAutoRefresh && trainData) {
      refreshInterval.current = setInterval(refreshStatus, 30000); // 30 seconds
    } else if (refreshInterval.current) {
      clearInterval(refreshInterval.current);
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [isAutoRefresh, trainData]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-time":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "running-late":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "departed":
        return <Train className="h-5 w-5 text-blue-600" />;
      case "arrived":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "cancelled":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string, delay: number = 0) => {
    if (status === "on-time" && delay <= 5) {
      return <Badge className="bg-green-100 text-green-800">On Time</Badge>;
    } else if (status === "running-late" || delay > 5) {
      return <Badge className="bg-yellow-100 text-yellow-800">Running Late ({delay} min)</Badge>;
    } else if (status === "cancelled") {
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    } else if (status === "departed") {
      return <Badge className="bg-blue-100 text-blue-800">Departed</Badge>;
    } else if (status === "arrived") {
      return <Badge className="bg-green-100 text-green-800">Arrived</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Live Train Tracking</h1>
          <p className="text-muted-foreground">
            Track trains in real-time with GPS location and arrival estimates
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-railway-blue" />
              Track Your Train
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="train-number">Train Number</Label>
                <Input
                  id="train-number"
                  placeholder="Enter train number (e.g., 12951)"
                  value={searchTrain}
                  onChange={(e) => setSearchTrain(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchTrainStatus()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="running-date">Running Date</Label>
                <Input
                  id="running-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={searchTrainStatus} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Navigation className="h-4 w-4 mr-2" />
                      Track Train
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mt-4 text-xs text-muted-foreground">
              💡 Try tracking train number <strong>12951</strong> for live demo data
            </div>
          </CardContent>
        </Card>

        {/* Train Status */}
        {trainData && (
          <div className="space-y-6">
            {/* Current Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Train className="h-5 w-5 text-railway-blue" />
                    {trainData.trainNumber} - {trainData.trainName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(trainData.status, trainData.delay)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshStatus}
                      disabled={loading}
                    >
                      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Current Location */}
                  <Card className="bg-railway-blue/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-railway-blue" />
                        <span className="font-medium">Current Location</span>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold">{trainData.currentStation.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Platform: {trainData.currentStation.platform || 'TBA'}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span>{trainData.currentLocation.speed} km/h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(trainData.currentLocation.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Station */}
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Navigation className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Next Station</span>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold">{trainData.nextStation.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Expected: {trainData.nextStation.expectedArrival}
                        </p>
                        <p className="text-sm text-green-600">
                          {trainData.nextStation.distance} km away
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Journey Progress */}
                  <Card className="bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Route className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">Journey Progress</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Distance Covered</span>
                          <span>{trainData.distanceCovered} / {trainData.totalDistance} km</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(trainData.distanceCovered / trainData.totalDistance) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Avg Speed: {trainData.averageSpeed} km/h
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Auto Refresh Toggle */}
                <div className="flex items-center justify-between mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Signal className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Live Updates</span>
                    {lastRefresh && (
                      <span className="text-xs text-muted-foreground">
                        Last updated: {formatTime(lastRefresh.toISOString())}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                      className={isAutoRefresh ? "bg-green-100 text-green-800" : ""}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      {isAutoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Route Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Live Route Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={mapRef}
                  className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20"
                >
                  <div className="text-center space-y-2">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Interactive GPS Map</p>
                    <p className="text-sm text-muted-foreground">
                      Real-time train location: {trainData.currentLocation.latitude.toFixed(4)}, {trainData.currentLocation.longitude.toFixed(4)}
                    </p>
                    <Button variant="outline" size="sm">
                      <Navigation className="h-4 w-4 mr-2" />
                      View on Google Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Route */}
            <Card>
              <CardHeader>
                <CardTitle>Station-wise Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainData.route.map((station, index) => (
                    <div key={station.stationCode} className="relative">
                      {index < trainData.route.length - 1 && (
                        <div className={`absolute left-4 top-12 w-0.5 h-16 ${
                          station.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>
                      )}
                      
                      <div className={`flex items-start gap-4 p-4 rounded-lg border-2 ${
                        station.isCurrent 
                          ? 'border-railway-blue bg-railway-blue/5' 
                          : station.isCompleted 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          station.isCurrent 
                            ? 'bg-railway-blue text-white' 
                            : station.isCompleted 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-300 text-gray-600'
                        }`}>
                          {station.isCurrent ? (
                            <Train className="h-4 w-4" />
                          ) : station.isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>

                        <div className="flex-1 grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="font-semibold">{station.stationName}</p>
                            <p className="text-sm text-muted-foreground">{station.stationCode}</p>
                            {station.platform && (
                              <p className="text-xs text-muted-foreground">Platform: {station.platform}</p>
                            )}
                          </div>
                          
                          <div className="text-sm">
                            <p><strong>Arrival:</strong> {station.arrivalTime}</p>
                            {station.actualArrival && (
                              <p className="text-green-600">Actual: {station.actualArrival}</p>
                            )}
                          </div>
                          
                          <div className="text-sm">
                            <p><strong>Departure:</strong> {station.departureTime}</p>
                            {station.actualDeparture && (
                              <p className="text-green-600">Actual: {station.actualDeparture}</p>
                            )}
                          </div>
                          
                          <div className="text-sm">
                            <p><strong>Distance:</strong> {station.distance} km</p>
                            {station.delayMinutes !== 0 && (
                              <p className={station.delayMinutes > 0 ? "text-red-600" : "text-green-600"}>
                                {station.delayMinutes > 0 ? `+${station.delayMinutes}` : station.delayMinutes} min
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link to={`/pnr-status`}>
                  <Search className="h-4 w-4 mr-2" />
                  Check PNR Status
                </Link>
              </Button>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Set Alerts
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Station Contact
              </Button>
              <Button variant="outline">
                <Wifi className="h-4 w-4 mr-2" />
                Station WiFi
              </Button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-railway-orange/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Navigation className="h-5 w-5 text-railway-orange mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Live Tracking Information</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• GPS location is updated every 30 seconds when auto-refresh is enabled</li>
                  <li>• Train positions are tracked using railway GPS systems and station reports</li>
                  <li>• Delay information is updated in real-time from control room data</li>
                  <li>• Platform numbers are subject to change - please verify at the station</li>
                  <li>• Contact station helpline for emergency assistance during journey</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
