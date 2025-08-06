import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RailwayDataService, StationData } from "@/lib/railway-data";
import { MapPin, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StationSearchProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (stationCode: string, stationName: string) => void;
  className?: string;
}

export function StationSearch({ 
  id, 
  label, 
  placeholder, 
  value, 
  onChange, 
  className 
}: StationSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Find current station details
  const currentStation = MAJOR_STATIONS.find(
    station => station.stationCode === value || station.stationName === value
  );

  // Filter stations based on search query
  const filteredStations = useMemo(() => {
    if (!searchQuery) return MAJOR_STATIONS.slice(0, 20); // Show top 20 by default
    
    const query = searchQuery.toLowerCase();
    return MAJOR_STATIONS.filter(
      station =>
        station.stationName.toLowerCase().includes(query) ||
        station.stationCode.toLowerCase().includes(query) ||
        station.city.toLowerCase().includes(query) ||
        station.state.toLowerCase().includes(query)
    ).slice(0, 50); // Limit to 50 results
  }, [searchQuery]);

  // Group stations by state for better organization
  const groupedStations = useMemo(() => {
    const groups: { [key: string]: typeof MAJOR_STATIONS } = {};
    
    filteredStations.forEach(station => {
      if (!groups[station.state]) {
        groups[station.state] = [];
      }
      groups[station.state].push(station);
    });

    // Sort states alphabetically and stations within each state
    return Object.keys(groups)
      .sort()
      .reduce((acc, state) => {
        acc[state] = groups[state].sort((a, b) => a.stationName.localeCompare(b.stationName));
        return acc;
      }, {} as { [key: string]: typeof MAJOR_STATIONS });
  }, [filteredStations]);

  const handleStationSelect = (station: typeof MAJOR_STATIONS[0]) => {
    onChange(station.stationCode, station.stationName);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium flex items-center gap-1">
        <MapPin className="h-4 w-4" />
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 text-left font-normal"
          >
            {currentStation ? (
              <div className="flex flex-col items-start">
                <span className="font-medium">{currentStation.stationName}</span>
                <span className="text-xs text-muted-foreground">
                  {currentStation.stationCode} • {currentStation.city}, {currentStation.state}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search stations by name, code, or city..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>No stations found.</CommandEmpty>
            <CommandList className="max-h-[300px]">
              {Object.entries(groupedStations).map(([state, stations]) => (
                <CommandGroup key={state} heading={state}>
                  {stations.map((station) => (
                    <CommandItem
                      key={station.stationCode}
                      value={`${station.stationName} ${station.stationCode} ${station.city}`}
                      onSelect={() => handleStationSelect(station)}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{station.stationName}</span>
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {station.stationCode}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {station.city}, {station.state}
                          {station.zone && ` • ${station.zone} Zone`}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          currentStation?.stationCode === station.stationCode 
                            ? "opacity-100" 
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Popular station pairs for quick selection
export const POPULAR_ROUTES = [
  { from: "NDLS", fromName: "New Delhi", to: "BCT", toName: "Mumbai Central" },
  { from: "MAS", fromName: "Chennai Central", to: "SBC", toName: "KSR Bengaluru" },
  { from: "HWH", fromName: "Howrah Jn", to: "NDLS", toName: "New Delhi" },
  { from: "PUNE", fromName: "Pune Jn", to: "BCT", toName: "Mumbai Central" },
  { from: "SC", fromName: "Secunderabad Jn", to: "MAS", toName: "Chennai Central" },
  { from: "ADI", fromName: "Ahmedabad Jn", to: "BCT", toName: "Mumbai Central" },
  { from: "JP", fromName: "Jaipur", to: "NDLS", toName: "New Delhi" },
  { from: "LJN", fromName: "Lucknow Jn", to: "NDLS", toName: "New Delhi" },
];

interface PopularRoutesProps {
  onRouteSelect: (fromCode: string, fromName: string, toCode: string, toName: string) => void;
}

export function PopularRoutes({ onRouteSelect }: PopularRoutesProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">Popular Routes</h4>
      <div className="grid grid-cols-2 gap-2">
        {POPULAR_ROUTES.slice(0, 8).map((route, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="h-auto p-2 text-left justify-start"
            onClick={() => onRouteSelect(route.from, route.fromName, route.to, route.toName)}
          >
            <div className="text-xs">
              <div className="font-medium">{route.fromName}</div>
              <div className="text-muted-foreground">to {route.toName}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
