import { Card } from "@/components/ui/card";
import FlightSearchForm from "./flight-search-form";

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="h-96 hero-bg bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Flight</h1>
            <p className="text-xl md:text-2xl font-light">Discover, compare, and book flights with ease</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-6xl px-4">
        <Card className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <FlightSearchForm />
        </Card>
      </div>
    </section>
  );
}
