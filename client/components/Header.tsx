import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Train,
  User,
  Search,
  Ticket,
  History,
  Settings,
  LogOut,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export function Header() {
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-railway-blue p-2 rounded-lg">
              <Train className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">RailEase Portal</h1>
              <p className="text-xs text-muted-foreground">Indian Railway Booking</p>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/pnr-status"
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">PNR Status</span>
            </Link>
            <Link
              to="/booking-history"
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <History className="h-4 w-4" />
              <span className="text-sm">My Bookings</span>
            </Link>
            <Link
              to="/live-tracking"
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Live Tracking</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Contact Support */}
            <div className="hidden lg:flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>139</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>help@railease.in</span>
              </div>
            </div>

            {/* User Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">Welcome to RailEase</p>
                  <p className="text-xs text-muted-foreground">Book your journey with us</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/login" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Login / Sign Up</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/booking-history" className="flex items-center space-x-2">
                    <Ticket className="h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
