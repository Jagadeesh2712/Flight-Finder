import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { X, Info } from "lucide-react";
import type { Flight } from "@shared/schema";
import type { BookingFormData } from "@/types/flight";

const bookingSchema = z.object({
  passengerFirstName: z.string().min(2, "First name must be at least 2 characters"),
  passengerLastName: z.string().min(2, "Last name must be at least 2 characters"),
  passengerEmail: z.string().email("Please enter a valid email address"),
  passengerPhone: z.string().min(10, "Please enter a valid phone number"),
});

type BookingFormFields = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  flight: Flight | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ flight, isOpen, onClose }: BookingModalProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<BookingFormFields>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      passengerFirstName: "",
      passengerLastName: "",
      passengerEmail: "",
      passengerPhone: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Booking Confirmed!",
        description: `Your confirmation number is ${data.booking.confirmationNumber}`,
      });
      onClose();
      setLocation(`/booking/${data.booking.confirmationNumber}`);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormFields) => {
    if (!flight) return;

    const bookingData: BookingFormData = {
      flightId: flight.id,
      totalPrice: flight.price,
      ...data,
    };

    bookingMutation.mutate(bookingData);
  };

  if (!flight) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Your Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Flight Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Flight Summary</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {flight.departureCity} ({flight.departureAirport}) → {flight.arrivalCity} ({flight.arrivalAirport})
                  </p>
                  <p className="text-sm text-gray-500">
                    {flight.airline} • {flight.flightNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {flight.departureTime} - {flight.arrivalTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-flight-blue">${flight.price}</p>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Passenger Information */}
              <div>
                <h4 className="font-semibold mb-4">Passenger Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="passengerFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passengerLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passengerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passengerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="font-semibold mb-4">Payment Information</h4>
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This is a demo booking. No actual payment will be processed.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <Input 
                      placeholder="**** **** **** 1234" 
                      disabled 
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <Input 
                        placeholder="MM/YY" 
                        disabled 
                        className="bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <Input 
                        placeholder="123" 
                        disabled 
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Total and Book Button */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-flight-blue">${flight.price}</span>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-flight-blue text-white hover:bg-flight-blue py-4 text-lg"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? "Processing..." : "Complete Booking"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
