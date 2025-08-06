import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/login"
            element={
              <Placeholder
                title="Login & Registration"
                description="Secure authentication with email, phone OTP, and social login options."
              />
            }
          />
          <Route
            path="/search-results"
            element={
              <Placeholder
                title="Train Search Results"
                description="Browse available trains with real-time seat availability and booking options."
              />
            }
          />
          <Route
            path="/pnr-status"
            element={
              <Placeholder
                title="PNR Status Check"
                description="Check your booking status and get live updates on your journey."
              />
            }
          />
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
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
