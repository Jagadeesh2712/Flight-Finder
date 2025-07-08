import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import FlightCard from "@/components/flight-card";
import FiltersSidebar from "@/components/filters-sidebar";
import BookingModal from "@/components/booking-modal";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Flight } from "@shared/schema";
import type { FlightFilters } from "@/types/flight";

export default function SearchResults() {
  const [location] = useLocation();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [filters, setFilters] = useState<FlightFilters>({
    priceRange: { min: 0, max: 9999 },
    airlines: [],
    stops: [],
    departureTime: [],
  });

  // Parse search parameters from URL
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departureDate = searchParams.get('departureDate') || '';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['/api/flights/search', { origin, destination, departureDate }],
    queryFn: async () => {
      const params = new URLSearchParams({
        origin,
        destination,
        departureDate,
        passengers: searchParams.get('passengers') || '1',
        class: searchParams.get('class') || 'economy',
        tripType: searchParams.get('tripType') || 'round-trip',
      });

      if (searchParams.get('returnDate')) {
        params.append('returnDate', searchParams.get('returnDate')!);
      }

      const response = await fetch(`/api/flights/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search flights');
      }
      return response.json();
    },
    enabled: !!(origin && destination && departureDate),
  });

  const flights = data?.flights || [];

  // Apply filters and sorting
  const filteredAndSortedFlights = flights
    .filter((flight: Flight) => {
      // Price filter
      const price = parseFloat(flight.price);
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }

      // Airlines filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }

      // Stops filter
      if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) {
        return false;
      }

      return true;
    })
    .sort((a: Flight, b: Flight) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'arrival':
          return a.arrivalTime.localeCompare(b.arrivalTime);
        default:
          return 0;
      }
    });

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsBookingModalOpen(true);
  };

  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false);
    setSelectedFlight(null);
  };

  if (!origin || !destination || !departureDate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please use the search form to find flights.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <FiltersSidebar filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Flight Results */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Flight Results</h2>
                <p className="text-gray-600">
                  {origin} → {destination} • {departureDate}
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {!isLoading && (
                  <span className="text-gray-600 text-sm">
                    Showing {filteredAndSortedFlights.length} of {flights.length} flights
                  </span>
                )}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Sort by Price</SelectItem>
                    <SelectItem value="duration">Sort by Duration</SelectItem>
                    <SelectItem value="departure">Sort by Departure</SelectItem>
                    <SelectItem value="arrival">Sort by Arrival</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error?.message || 'Failed to load flights. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            {/* No Results */}
            {!isLoading && !isError && filteredAndSortedFlights.length === 0 && flights.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No flights match your current filters. Try adjusting your search criteria.
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !isError && flights.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No flights found for this route. Try different cities or dates.
                </AlertDescription>
              </Alert>
            )}

            {/* Flight Results */}
            {!isLoading && !isError && filteredAndSortedFlights.length > 0 && (
              <>
                <div className="space-y-4">
                  {filteredAndSortedFlights.map((flight: Flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={handleFlightSelect}
                    />
                  ))}
                </div>

                {/* Load More Button (if there are more results) */}
                {filteredAndSortedFlights.length < flights.length && (
                  <div className="text-center mt-8">
                    <Button variant="outline" className="px-6 py-3">
                      Load More Flights
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        flight={selectedFlight}
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
      />
    </div>
  );
}
