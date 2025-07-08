import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane } from "lucide-react";
import type { Flight } from "@shared/schema";

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  const getAirlineColor = (airline: string) => {
    switch (airline.toLowerCase()) {
      case "american airlines":
        return "bg-red-600";
      case "delta airlines":
        return "bg-blue-600";
      case "united airlines":
        return "bg-blue-800";
      case "jetblue airways":
        return "bg-blue-500";
      default:
        return "bg-gray-600";
    }
  };

  const isBestValue = flight.price === "387.00"; // Mock logic for best value

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 ${getAirlineColor(flight.airline)} rounded-lg flex items-center justify-center`}>
                <Plane className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">{flight.airline}</h3>
                <p className="text-sm text-gray-500">{flight.flightNumber}</p>
              </div>
              {isBestValue && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Best Value
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Departure */}
              <div className="text-center">
                <p className="text-2xl font-bold">{flight.departureTime}</p>
                <p className="text-sm text-gray-500">{flight.departureAirport}, {flight.departureCity}</p>
              </div>
              
              {/* Flight Duration */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-flight-blue rounded-full"></div>
                  <div className={`flex-1 border-t-2 ${flight.stops > 0 ? 'border-dashed' : ''} border-gray-300`}></div>
                  <Plane className="text-flight-blue transform rotate-90" size={16} />
                  <div className={`flex-1 border-t-2 ${flight.stops > 0 ? 'border-dashed' : ''} border-gray-300`}></div>
                  <div className="w-3 h-3 bg-flight-blue rounded-full"></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{flight.duration}</p>
                <p className="text-xs text-gray-400">
                  {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </p>
              </div>
              
              {/* Arrival */}
              <div className="text-center">
                <p className="text-2xl font-bold">{flight.arrivalTime}</p>
                <p className="text-sm text-gray-500">{flight.arrivalAirport}, {flight.arrivalCity}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center lg:text-right lg:ml-8">
            <p className="text-3xl font-bold text-flight-blue">${flight.price}</p>
            <p className="text-sm text-gray-500 mb-4">per person</p>
            <Button 
              onClick={() => onSelect(flight)}
              className="bg-flight-blue text-white hover:bg-flight-blue w-full lg:w-auto"
            >
              Select Flight
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
