import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Plane, Calendar, Clock, Users } from "lucide-react";

export default function Booking() {
  const params = useParams();
  const confirmationNumber = params.confirmationNumber as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['/api/bookings', confirmationNumber],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${confirmationNumber}`);
      if (!response.ok) {
        throw new Error('Booking not found');
      }
      return response.json();
    },
    enabled: !!confirmationNumber,
  });

  const booking = data?.booking;
  const flight = data?.flight;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error?.message || 'Failed to load booking details.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Booking Confirmation */}
          {!isLoading && !isError && booking && flight && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                <p className="text-gray-600">
                  Your flight has been successfully booked. Here are your booking details:
                </p>
              </div>

              {/* Confirmation Number */}
              <Card className="mb-6">
                <CardContent className="p-6 text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Confirmation Number</h3>
                  <p className="text-2xl font-bold text-flight-blue tracking-wider">
                    {booking.confirmationNumber}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please save this number for your records
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Flight Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plane className="w-5 h-5 mr-2" />
                      Flight Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {flight.departureCity} → {flight.arrivalCity}
                      </h4>
                      <p className="text-gray-600">
                        {flight.airline} • {flight.flightNumber}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-medium">{flight.departureTime}</p>
                        <p className="text-sm text-gray-600">
                          {flight.departureAirport}, {flight.departureCity}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Arrival</p>
                        <p className="font-medium">{flight.arrivalTime}</p>
                        <p className="text-sm text-gray-600">
                          {flight.arrivalAirport}, {flight.arrivalCity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-600">{flight.duration}</span>
                        </div>
                        <Badge variant={flight.stops === 0 ? "default" : "secondary"}>
                          {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </Badge>
                      </div>
                      <p className="text-xl font-bold text-flight-blue">${flight.price}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Passenger Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Passenger Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Passenger Name</p>
                      <p className="font-medium">
                        {booking.passengerFirstName} {booking.passengerLastName}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{booking.passengerEmail}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{booking.passengerPhone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Booking Date</p>
                      <p className="font-medium">
                        {new Date(booking.bookingDate || '').toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Important Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      • Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights.
                    </p>
                    <p>
                      • Check-in opens 24 hours before departure and closes 45 minutes before domestic flights.
                    </p>
                    <p>
                      • Bring a valid government-issued photo ID for all passengers.
                    </p>
                    <p>
                      • You can manage your booking, select seats, and check flight status using your confirmation number.
                    </p>
                    <p>
                      • For any changes or cancellations, contact customer service or visit the airline's website.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Alert className="mt-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Next Steps:</strong> A confirmation email has been sent to {booking.passengerEmail}. 
                  You can use your confirmation number {booking.confirmationNumber} to check in online 24 hours before departure.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
