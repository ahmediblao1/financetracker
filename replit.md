# Restaurant Accounting System

## Overview

This is a full-stack restaurant accounting and management system built with React, Express, and PostgreSQL. The application helps restaurant owners track daily sales across multiple platforms (Trendyol, Yemeksepeti, and in-salon), manage expenses, and generate comprehensive reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI with custom shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (via Neon serverless)
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware

### Monorepo Structure
- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript types and schemas
- Database migrations in `migrations/`

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: Authentication and user management
- **Daily Sales**: Platform-specific sales tracking with automatic commission calculation
- **Expenses**: Categorized expense tracking
- **Expense Categories**: Predefined expense categories for consistency

### API Endpoints (server/routes.ts)
- `GET/POST /api/daily-sales/:date` - Sales data management
- `GET/POST/DELETE /api/expenses` - Expense management
- `GET /api/dashboard-summary/:date` - Aggregated dashboard data
- `GET /api/monthly-stats` - Monthly analytics

### Frontend Pages
- **Dashboard**: Real-time overview with sales entry, expense tracking, and summary cards
- **Daily Entry**: Dedicated data entry interface (placeholder)
- **Reports**: Analytics and reporting interface (placeholder)
- **Expenses**: Expense management interface (placeholder)
- **Settings**: Configuration interface (placeholder)

### Business Logic
- **Commission Calculation**: Automatic calculation of platform fees (Trendyol: 15%, Yemeksepeti: 18%)
- **Real-time Updates**: Live calculation of totals and commissions during data entry
- **Excel Export**: Generate downloadable reports with sales and expense data
- **Turkish Localization**: Currency formatting and date displays in Turkish format

## Data Flow

1. **Sales Entry**: Users input daily sales data for each platform
2. **Commission Calculation**: System automatically calculates platform commissions
3. **Expense Tracking**: Users categorize and record daily expenses
4. **Real-time Dashboard**: Summary cards show daily totals, expenses, and net profit
5. **Data Persistence**: All data stored in PostgreSQL with Drizzle ORM
6. **Export Generation**: Excel reports generated server-side with comprehensive data

### State Management Flow
- TanStack Query manages server state with automatic caching
- Form state handled by React Hook Form with Zod validation
- UI state managed locally with React hooks
- Toast notifications for user feedback

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection via Neon
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling with validation
- **zod**: Runtime type validation
- **xlsx**: Excel file generation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight React router

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety
- **eslint**: Code linting
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with TypeScript compilation via tsx
- Database migrations via Drizzle Kit
- Environment-based configuration

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Static file serving from Express for production deployment
- PostgreSQL database provisioned via environment variables

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- Development mode includes error overlays and debugging tools
- Production mode serves optimized static assets

### Database Management
- Schema defined in `shared/schema.ts`
- Migrations generated and applied via Drizzle Kit
- Connection pooling via Neon serverless for scalability
- Type-safe queries with automatic TypeScript inference