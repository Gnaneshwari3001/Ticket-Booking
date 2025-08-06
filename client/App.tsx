import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PNRStatus from "./pages/PNRStatus";
import SearchResults from "./pages/SearchResults";
import EnhancedSearchResults from "./pages/EnhancedSearchResults";
import RealDataSearchResults from "./pages/RealDataSearchResults";
import BookingPage from "./pages/BookingPage";
import BookingSuccess from "./pages/BookingSuccess";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/enhanced-search-results" element={<EnhancedSearchResults />} />
            <Route path="/real-data-search-results" element={<RealDataSearchResults />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/pnr-status" element={<PNRStatus />} />
            <Route
              path="/booking-history"
              element={
                <Placeholder
                  title="Booking History"
                  description="View and manage all your past and upcoming train bookings."
                />
              }
            />
            <Route
              path="/live-tracking"
              element={
                <Placeholder
                  title="Live Train Tracking"
                  description="Track trains in real-time with GPS location and arrival estimates."
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Placeholder
                  title="User Profile"
                  description="Manage your personal details, travel preferences, and account settings."
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
