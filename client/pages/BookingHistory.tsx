import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Train,
  Calendar,
  MapPin,
  Clock,
  Users,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface BookingHistoryItem {
  id: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  journeyDate: string;
  bookingDate: string;
  class: string;
  passengers: {
    name: string;
    age: number;
    gender: string;
    status: string;
  }[];
  totalFare: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'upcoming';
  paymentStatus: 'paid' | 'refunded' | 'pending';
  departureTime: string;
  arrivalTime: string;
  cancellationCharges?: number;
  refundAmount?: number;
}

export default function BookingHistory() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("bookingDate");
  const [selectedBooking, setSelectedBooking] = useState<BookingHistoryItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock booking data - in real app, this would come from Firebase/API
  const mockBookings: BookingHistoryItem[] = [
    {
      id: "1",
      pnr: "1234567890",
      trainNumber: "12951",
      trainName: "Mumbai Rajdhani",
      from: "NDLS",
      fromName: "New Delhi",
      to: "BCT",
      toName: "Mumbai Central",
      journeyDate: "2024-12-25",
      bookingDate: "2024-12-20",
      class: "3A",
      passengers: [
        { name: "John Doe", age: 35, gender: "M", status: "CNF/B2/25" },
        { name: "Jane Doe", age: 32, gender: "F", status: "CNF/B2/26" }
      ],
      totalFare: 5080,
      status: "upcoming",
      paymentStatus: "paid",
      departureTime: "16:55",
      arrivalTime: "08:35"
    },
    {
      id: "2",
      pnr: "2345678901",
      trainNumber: "12603",
      trainName: "Hyderabad Express",
      from: "SC",
      fromName: "Secunderabad Jn",
      to: "MAS",
      toName: "Chennai Central",
      journeyDate: "2024-12-15",
      bookingDate: "2024-12-10",
      class: "SL",
      passengers: [
        { name: "Alice Smith", age: 28, gender: "F", status: "CNF/S4/12" }
      ],
      totalFare: 485,
      status: "completed",
      paymentStatus: "paid",
      departureTime: "17:35",
      arrivalTime: "05:45"
    },
    {
      id: "3",
      pnr: "3456789012",
      trainNumber: "22691",
      trainName: "Rajdhani Express",
      from: "SC",
      fromName: "Secunderabad Jn",
      to: "NDLS",
      toName: "New Delhi",
      journeyDate: "2024-12-10",
      bookingDate: "2024-12-05",
      class: "2A",
      passengers: [
        { name: "Bob Johnson", age: 45, gender: "M", status: "CAN/REF" }
      ],
      totalFare: 2540,
      status: "cancelled",
      paymentStatus: "refunded",
      departureTime: "20:05",
      arrivalTime: "11:35",
      cancellationCharges: 240,
      refundAmount: 2300
    }
  ];

  useEffect(() => {
    // Simulate loading bookings
    setLoading(true);
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort bookings
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.trainNumber.includes(searchQuery) ||
        booking.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.toName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "bookingDate":
          return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
        case "journeyDate":
          return new Date(b.journeyDate).getTime() - new Date(a.journeyDate).getTime();
        case "fare":
          return b.totalFare - a.totalFare;
        default:
          return 0;
      }
    });

    setFilteredBookings(filtered);
  }, [bookings, searchQuery, statusFilter, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "upcoming":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-green-100 text-green-800">Upcoming</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setIsRefreshing(true);
    // Simulate cancellation
    setTimeout(() => {
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" as const, paymentStatus: "refunded" as const }
          : booking
      ));
      setIsRefreshing(false);
    }, 2000);
  };

  const handleDownloadTicket = (booking: BookingHistoryItem) => {
    // Simulate ticket download
    alert(`Downloading e-ticket for PNR: ${booking.pnr}`);
  };

  const refreshBookings = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-muted-foreground mb-4">
            Please login to view your booking history.
          </p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-railway-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Booking History</h1>
            <p className="text-muted-foreground">Manage all your train bookings</p>
          </div>
          <Button 
            onClick={refreshBookings} 
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Bookings</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="PNR, Train name, Station..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bookingDate">Booking Date</SelectItem>
                    <SelectItem value="journeyDate">Journey Date</SelectItem>
                    <SelectItem value="fare">Fare Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setSortBy("bookingDate");
                  }}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Cards */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <Train className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "You haven't made any train bookings yet"
                }
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button asChild>
                  <Link to="/">Book Your First Trip</Link>
                </Button>
              )}
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{booking.trainName}</h3>
                          <Badge variant="outline">{booking.trainNumber}</Badge>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">PNR: {booking.pnr}</p>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Booking Actions</DialogTitle>
                            <DialogDescription>
                              Manage your booking for {booking.trainName}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => handleDownloadTicket(booking)}
                              className="justify-start"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download E-Ticket
                            </Button>
                            <Button 
                              variant="outline" 
                              asChild
                              className="justify-start"
                            >
                              <Link to={`/pnr-status?pnr=${booking.pnr}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Check PNR Status
                              </Link>
                            </Button>
                            {booking.status === "upcoming" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" className="justify-start">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Cancel Booking
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel this booking? 
                                      Cancellation charges may apply based on IRCTC rules.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Cancel Booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Journey Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="font-semibold">{booking.fromName}</p>
                            <p className="text-lg font-bold text-railway-blue">{booking.departureTime}</p>
                            <p className="text-xs text-muted-foreground">{booking.from}</p>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="h-px bg-border"></div>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{booking.toName}</p>
                            <p className="text-lg font-bold text-railway-blue">{booking.arrivalTime}</p>
                            <p className="text-xs text-muted-foreground">{booking.to}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.journeyDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Class: {booking.class}</span>
                        </div>
                      </div>

                      {/* Passengers */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Passengers ({booking.passengers.length})</span>
                        </div>
                        <div className="space-y-1">
                          {booking.passengers.map((passenger, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{passenger.name}</span>
                              <span className="text-muted-foreground ml-2">
                                ({passenger.age}{passenger.gender}) - {passenger.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fare & Status */}
                      <div className="space-y-3">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Fare</p>
                          <p className="text-xl font-bold text-railway-blue">₹{booking.totalFare}</p>
                          <p className="text-xs text-muted-foreground">
                            Payment: {booking.paymentStatus}
                          </p>
                        </div>
                        
                        {booking.status === "cancelled" && booking.refundAmount && (
                          <div className="text-right text-sm">
                            <p className="text-muted-foreground">Cancellation Charges: ₹{booking.cancellationCharges}</p>
                            <p className="text-green-600 font-medium">Refund Amount: ₹{booking.refundAmount}</p>
                          </div>
                        )}
                        
                        <div className="text-right text-xs text-muted-foreground">
                          <p>Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredBookings.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-railway-blue">{filteredBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredBookings.filter(b => b.status === "upcoming").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Upcoming Trips</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredBookings.filter(b => b.status === "completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed Trips</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-railway-blue">
                    ₹{filteredBookings.reduce((sum, booking) => sum + booking.totalFare, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
