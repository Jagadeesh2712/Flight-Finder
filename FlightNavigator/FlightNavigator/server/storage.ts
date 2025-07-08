import { flights, bookings, searchQueries, type Flight, type InsertFlight, type Booking, type InsertBooking, type SearchQuery, type InsertSearchQuery } from "@shared/schema";

export interface IStorage {
  // Flight operations
  searchFlights(origin: string, destination: string, departureDate: string): Promise<Flight[]>;
  getAllFlights(): Promise<Flight[]>;
  getFlightById(id: number): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingByConfirmation(confirmationNumber: string): Promise<Booking | undefined>;
  
  // Search query operations
  saveSearchQuery(query: InsertSearchQuery): Promise<SearchQuery>;
}

export class MemStorage implements IStorage {
  private flights: Map<number, Flight>;
  private bookings: Map<number, Booking>;
  private searchQueries: Map<number, SearchQuery>;
  private currentFlightId: number;
  private currentBookingId: number;
  private currentSearchId: number;

  constructor() {
    this.flights = new Map();
    this.bookings = new Map();
    this.searchQueries = new Map();
    this.currentFlightId = 1;
    this.currentBookingId = 1;
    this.currentSearchId = 1;
    
    // Populate with sample flight data
    this.populateSampleFlights();
  }

  private populateSampleFlights() {
    const sampleFlights: Omit<Flight, 'id'>[] = [
      {
        flightNumber: "AA1234",
        airline: "American Airlines",
        departureAirport: "JFK",
        arrivalAirport: "LAX",
        departureCity: "New York",
        arrivalCity: "Los Angeles",
        departureTime: "8:45 AM",
        arrivalTime: "11:20 PM",
        duration: "5h 35m",
        stops: 1,
        price: "459.00",
        aircraft: "Boeing 737",
        availableSeats: 95
      },
      {
        flightNumber: "DL5678",
        airline: "Delta Airlines",
        departureAirport: "LGA",
        arrivalAirport: "LAX",
        departureCity: "New York",
        arrivalCity: "Los Angeles",
        departureTime: "6:15 AM",
        arrivalTime: "9:25 AM",
        duration: "6h 10m",
        stops: 0,
        price: "387.00",
        aircraft: "Airbus A320",
        availableSeats: 120
      },
      {
        flightNumber: "UA9012",
        airline: "United Airlines",
        departureAirport: "EWR",
        arrivalAirport: "LAX",
        departureCity: "New York",
        arrivalCity: "Los Angeles",
        departureTime: "2:30 PM",
        arrivalTime: "7:15 PM",
        duration: "7h 45m",
        stops: 1,
        price: "523.00",
        aircraft: "Boeing 777",
        availableSeats: 88
      },
      {
        flightNumber: "B6456",
        airline: "JetBlue Airways",
        departureAirport: "JFK",
        arrivalAirport: "LAX",
        departureCity: "New York",
        arrivalCity: "Los Angeles",
        departureTime: "11:30 AM",
        arrivalTime: "2:45 PM",
        duration: "6h 15m",
        stops: 0,
        price: "412.00",
        aircraft: "Airbus A321",
        availableSeats: 102
      },
      {
        flightNumber: "AA8765",
        airline: "American Airlines",
        departureAirport: "JFK",
        arrivalAirport: "SFO",
        departureCity: "New York",
        arrivalCity: "San Francisco",
        departureTime: "7:00 AM",
        arrivalTime: "10:30 AM",
        duration: "6h 30m",
        stops: 0,
        price: "486.00",
        aircraft: "Boeing 757",
        availableSeats: 76
      },
      {
        flightNumber: "DL2345",
        airline: "Delta Airlines",
        departureAirport: "LGA",
        arrivalAirport: "SFO",
        departureCity: "New York",
        arrivalCity: "San Francisco",
        departureTime: "3:15 PM",
        arrivalTime: "6:45 PM",
        duration: "6h 30m",
        stops: 0,
        price: "521.00",
        aircraft: "Airbus A330",
        availableSeats: 94
      }
    ];

    sampleFlights.forEach(flight => {
      const id = this.currentFlightId++;
      this.flights.set(id, { ...flight, id });
    });
  }

  async searchFlights(origin: string, destination: string, departureDate: string): Promise<Flight[]> {
    const results = Array.from(this.flights.values()).filter(flight => {
      const originMatch = flight.departureCity.toLowerCase().includes(origin.toLowerCase()) ||
                         flight.departureAirport.toLowerCase().includes(origin.toLowerCase());
      const destinationMatch = flight.arrivalCity.toLowerCase().includes(destination.toLowerCase()) ||
                              flight.arrivalAirport.toLowerCase().includes(destination.toLowerCase());
      return originMatch && destinationMatch;
    });
    
    return results;
  }

  async getAllFlights(): Promise<Flight[]> {
    return Array.from(this.flights.values());
  }

  async getFlightById(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const id = this.currentFlightId++;
    const flight: Flight = { 
      ...insertFlight, 
      id,
      stops: insertFlight.stops ?? 0,
      aircraft: insertFlight.aircraft ?? null,
      availableSeats: insertFlight.availableSeats ?? 100
    };
    this.flights.set(id, flight);
    return flight;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const confirmationNumber = `FL${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      confirmationNumber,
      bookingDate: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingByConfirmation(confirmationNumber: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(
      booking => booking.confirmationNumber === confirmationNumber
    );
  }

  async saveSearchQuery(insertQuery: InsertSearchQuery): Promise<SearchQuery> {
    const id = this.currentSearchId++;
    const query: SearchQuery = { 
      ...insertQuery, 
      id, 
      searchDate: new Date(),
      class: insertQuery.class ?? "economy",
      returnDate: insertQuery.returnDate ?? null,
      passengers: insertQuery.passengers ?? 1,
      tripType: insertQuery.tripType ?? "round-trip"
    };
    this.searchQueries.set(id, query);
    return query;
  }
}

export const storage = new MemStorage();
