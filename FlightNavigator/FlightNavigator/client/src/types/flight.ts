export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: string;
  tripType: string;
}

export interface FlightFilters {
  priceRange: {
    min: number;
    max: number;
  };
  airlines: string[];
  stops: number[];
  departureTime: string[];
}

export interface BookingFormData {
  flightId: number;
  passengerFirstName: string;
  passengerLastName: string;
  passengerEmail: string;
  passengerPhone: string;
  totalPrice: string;
}
