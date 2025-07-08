import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import type { FlightFilters } from "@/types/flight";

interface FiltersSidebarProps {
  filters: FlightFilters;
  onFiltersChange: (filters: FlightFilters) => void;
}

export default function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<number | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const priceRanges = [
    { id: "0-300", label: "$0 - $300", min: 0, max: 300 },
    { id: "300-600", label: "$300 - $600", min: 300, max: 600 },
    { id: "600+", label: "$600+", min: 600, max: 9999 },
  ];

  const airlines = [
    "American Airlines",
    "Delta Airlines", 
    "United Airlines",
    "JetBlue Airways",
  ];

  const stopOptions = [
    { value: 0, label: "Non-stop" },
    { value: 1, label: "1 stop" },
    { value: 2, label: "2+ stops" },
  ];

  const timeSlots = [
    { id: "morning", label: "Morning", time: "6AM - 12PM", icon: Sun },
    { id: "afternoon", label: "Afternoon", time: "12PM - 6PM", icon: Sun },
    { id: "evening", label: "Evening", time: "6PM - 12AM", icon: Moon },
    { id: "night", label: "Night", time: "12AM - 6AM", icon: Moon },
  ];

  const handlePriceRangeChange = (rangeId: string, checked: boolean) => {
    const newRanges = checked 
      ? [...selectedPriceRanges, rangeId]
      : selectedPriceRanges.filter(id => id !== rangeId);
    setSelectedPriceRanges(newRanges);
    
    // Update filters
    const range = priceRanges.find(r => r.id === rangeId);
    if (range) {
      onFiltersChange({
        ...filters,
        priceRange: { min: range.min, max: range.max }
      });
    }
  };

  const handleAirlineChange = (airline: string, checked: boolean) => {
    const newAirlines = checked
      ? [...selectedAirlines, airline]
      : selectedAirlines.filter(a => a !== airline);
    setSelectedAirlines(newAirlines);
    
    onFiltersChange({
      ...filters,
      airlines: newAirlines
    });
  };

  const handleStopsChange = (stops: number) => {
    setSelectedStops(stops);
    onFiltersChange({
      ...filters,
      stops: [stops]
    });
  };

  const handleTimeSlotChange = (slot: string) => {
    const newSlots = selectedTimeSlots.includes(slot)
      ? selectedTimeSlots.filter(s => s !== slot)
      : [...selectedTimeSlots, slot];
    setSelectedTimeSlots(newSlots);
    
    onFiltersChange({
      ...filters,
      departureTime: newSlots
    });
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Filter Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <Checkbox
                  id={range.id}
                  checked={selectedPriceRanges.includes(range.id)}
                  onCheckedChange={(checked) => 
                    handlePriceRangeChange(range.id, checked as boolean)
                  }
                />
                <Label htmlFor={range.id} className="text-sm">
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Airlines */}
        <div>
          <h4 className="font-medium mb-3">Airlines</h4>
          <div className="space-y-2">
            {airlines.map((airline) => (
              <div key={airline} className="flex items-center space-x-2">
                <Checkbox
                  id={airline}
                  checked={selectedAirlines.includes(airline)}
                  onCheckedChange={(checked) => 
                    handleAirlineChange(airline, checked as boolean)
                  }
                />
                <Label htmlFor={airline} className="text-sm">
                  {airline}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Stops */}
        <div>
          <h4 className="font-medium mb-3">Stops</h4>
          <div className="space-y-2">
            {stopOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`stops-${option.value}`}
                  name="stops"
                  checked={selectedStops === option.value}
                  onChange={() => handleStopsChange(option.value)}
                  className="text-flight-blue focus:ring-flight-blue"
                />
                <Label htmlFor={`stops-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Departure Time */}
        <div>
          <h4 className="font-medium mb-3">Departure Time</h4>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const Icon = slot.icon;
              return (
                <Button
                  key={slot.id}
                  variant={selectedTimeSlots.includes(slot.id) ? "default" : "outline"}
                  className={`p-2 text-xs flex flex-col items-center h-auto ${
                    selectedTimeSlots.includes(slot.id) 
                      ? "bg-flight-blue text-white" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleTimeSlotChange(slot.id)}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="font-medium">{slot.label}</span>
                  <span className="text-xs opacity-80">{slot.time}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
