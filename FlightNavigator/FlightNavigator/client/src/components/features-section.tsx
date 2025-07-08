import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield, Headphones } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find the best flights with our intelligent search algorithm that compares hundreds of airlines.",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your payment and personal information are protected with bank-level security encryption.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help anytime with our round-the-clock customer support team ready to assist you.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose FlightFinder?</h2>
          <p className="text-xl text-gray-600">Experience the best in flight booking technology</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-flight-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
