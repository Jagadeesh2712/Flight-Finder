import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertSearchQuerySchema } from "@shared/schema";
import { z } from "zod";

const searchParamsSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  departureDate: z.string().min(1),
  returnDate: z.string().optional(),
  passengers: z.string().transform(val => parseInt(val, 10)).default("1"),
  class: z.string().default("economy"),
  tripType: z.string().default("round-trip")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Search flights
  app.get("/api/flights/search", async (req, res) => {
    try {
      const params = searchParamsSchema.parse(req.query);
      
      // Save search query
      await storage.saveSearchQuery({
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        passengers: params.passengers,
        tripType: params.tripType,
        class: params.class
      });

      const flights = await storage.searchFlights(
        params.origin,
        params.destination,
        params.departureDate
      );

      res.json({ flights, total: flights.length });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get all flights
  app.get("/api/flights", async (req, res) => {
    try {
      const flights = await storage.getAllFlights();
      res.json({ flights });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get flight by ID
  app.get("/api/flights/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const flight = await storage.getFlightById(id);
      
      if (!flight) {
        res.status(404).json({ message: "Flight not found" });
        return;
      }

      res.json({ flight });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Verify flight exists
      const flight = await storage.getFlightById(bookingData.flightId);
      if (!flight) {
        res.status(404).json({ message: "Flight not found" });
        return;
      }

      const booking = await storage.createBooking(bookingData);
      res.status(201).json({ booking });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get booking by confirmation number
  app.get("/api/bookings/:confirmationNumber", async (req, res) => {
    try {
      const confirmationNumber = req.params.confirmationNumber;
      const booking = await storage.getBookingByConfirmation(confirmationNumber);
      
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }

      const flight = await storage.getFlightById(booking.flightId);
      res.json({ booking, flight });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
