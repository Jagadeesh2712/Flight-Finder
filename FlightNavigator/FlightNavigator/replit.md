# FlightFinder - Flight Booking Application

## Overview

FlightFinder is a modern flight booking application built with a React frontend and Express.js backend. The application allows users to search for flights, view search results with filtering capabilities, and book flights through an intuitive interface. It features a clean, responsive design using shadcn/ui components and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API design
- **Validation**: Zod schemas for request/response validation
- **Development**: Hot reload with automatic error handling

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend application
- `shared/` - Shared TypeScript types and database schemas
- `migrations/` - Database migration files

## Key Components

### Database Schema (shared/schema.ts)
- **flights**: Core flight data including routes, times, pricing, and availability
- **bookings**: Customer booking records with passenger details and confirmation numbers
- **searchQueries**: Analytics tracking of user search patterns

### Frontend Pages
- **Home**: Landing page with hero section, flight search form, and features showcase
- **Search Results**: Flight listing with advanced filtering and sorting capabilities
- **Booking**: Booking confirmation and details display
- **Not Found**: 404 error page

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Flight Search**: Intelligent flight search with date and route matching
- **Booking Management**: Complete booking workflow with confirmation generation

### UI Components
- **Flight Search Form**: Multi-step form with airport selection, date pickers, and passenger options
- **Flight Cards**: Detailed flight information display with airline branding
- **Filters Sidebar**: Advanced filtering by price, airline, stops, and departure time
- **Booking Modal**: Secure booking form with passenger information collection

## Data Flow

1. **Search Flow**: User submits search criteria → Backend queries flight data → Results displayed with filtering options
2. **Booking Flow**: User selects flight → Booking modal opens → Form submission → Confirmation generation → Booking storage
3. **State Management**: TanStack React Query handles API calls, caching, and error states
4. **Form Validation**: Client-side validation with Zod schemas before API submission

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **wouter**: Lightweight React router
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Modern icon library
- **class-variance-authority**: Type-safe variant handling

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development
- Frontend: Vite dev server with HMR
- Backend: Node.js with tsx for TypeScript execution
- Database: Neon serverless PostgreSQL

### Production Build
- Frontend: Static files built with Vite
- Backend: Bundled with esbuild for optimal performance
- Database: Production Neon database instance

### Configuration
- Environment variables for database connection
- Drizzle migrations for schema management
- TypeScript path mapping for clean imports

## Changelog
- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.