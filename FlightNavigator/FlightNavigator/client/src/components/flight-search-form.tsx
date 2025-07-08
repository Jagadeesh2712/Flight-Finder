import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Plane, Calendar, Search, RotateCcw, ArrowRight, Route } from "lucide-react";
import { airports } from "@/lib/mock-data";

const searchSchema = z.object({
  origin: z.string().min(1, "Please select origin"),
  destination: z.string().min(1, "Please select destination"),
  departureDate: z.string().min(1, "Please select departure date"),
  returnDate: z.string().optional(),
  passengers: z.string().default("1"),
  class: z.string().default("economy"),
  tripType: z.string().default("round-trip"),
});

type SearchFormData = z.infer<typeof searchSchema>;

export default function FlightSearchForm() {
  const [, setLocation] = useLocation();
  const [tripType, setTripType] = useState("round-trip");

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: "",
      destination: "",
      departureDate: "",
      returnDate: "",
      passengers: "1",
      class: "economy",
      tripType: "round-trip",
    },
  });

  const onSubmit = (data: SearchFormData) => {
    const searchParams = new URLSearchParams({
      origin: data.origin,
      destination: data.destination,
      departureDate: data.departureDate,
      passengers: data.passengers,
      class: data.class,
      tripType: data.tripType,
    });

    if (data.returnDate && tripType === "round-trip") {
      searchParams.append("returnDate", data.returnDate);
    }

    setLocation(`/search?${searchParams.toString()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Trip Type Buttons */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Button
              type="button"
              variant={tripType === "round-trip" ? "default" : "outline"}
              onClick={() => {
                setTripType("round-trip");
                form.setValue("tripType", "round-trip");
              }}
              className={tripType === "round-trip" ? "bg-flight-blue text-white" : ""}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Round Trip
            </Button>
            <Button
              type="button"
              variant={tripType === "one-way" ? "default" : "outline"}
              onClick={() => {
                setTripType("one-way");
                form.setValue("tripType", "one-way");
              }}
              className={tripType === "one-way" ? "bg-flight-blue text-white" : ""}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              One Way
            </Button>
            <Button
              type="button"
              variant={tripType === "multi-city" ? "default" : "outline"}
              onClick={() => {
                setTripType("multi-city");
                form.setValue("tripType", "multi-city");
              }}
              className={tripType === "multi-city" ? "bg-flight-blue text-white" : ""}
            >
              <Route className="w-4 h-4 mr-2" />
              Multi-city
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Passenger</SelectItem>
                        <SelectItem value="2">2 Passengers</SelectItem>
                        <SelectItem value="3">3 Passengers</SelectItem>
                        <SelectItem value="4">4+ Passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="premium-economy">Premium Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="relative">
                      <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="City or Airport" className="pl-10" />
                    </SelectTrigger>
                    <SelectContent>
                      {airports.map((airport) => (
                        <SelectItem key={airport.code} value={`${airport.city} (${airport.code})`}>
                          {airport.city} ({airport.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="relative">
                      <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 rotate-90" />
                      <SelectValue placeholder="City or Airport" className="pl-10" />
                    </SelectTrigger>
                    <SelectContent>
                      {airports.map((airport) => (
                        <SelectItem key={airport.code} value={`${airport.city} (${airport.code})`}>
                          {airport.city} ({airport.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10"
                      {...field}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {tripType === "round-trip" && (
            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        className="pl-10"
                        {...field}
                        min={form.watch("departureDate") || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="bg-flight-blue text-white hover:bg-flight-blue mt-7 flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Flights</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
