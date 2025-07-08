import { Link, useLocation } from "wouter";
import { Plane, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Flights", id: "flights" },
    { href: "#hotels", label: "Hotels", id: "hotels" },
    { href: "#car-rental", label: "Car Rental", id: "car-rental" },
    { href: "#deals", label: "Deals", id: "deals" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="text-flight-blue text-2xl" />
              <span className="text-2xl font-bold text-gray-900">FlightFinder</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`transition-colors ${
                    location === item.href
                      ? "text-flight-blue"
                      : "text-gray-700 hover:text-flight-blue"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-flight-blue">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button className="bg-flight-blue text-white hover:bg-flight-blue">
                Sign Up
              </Button>
            </div>
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="text-gray-700 hover:text-flight-blue transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  <Button variant="ghost" className="justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button className="bg-flight-blue text-white hover:bg-flight-blue">
                    Sign Up
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
