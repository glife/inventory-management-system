# Inventory Management System
TeamName:SnackOverflow
ProblemStatement:StockMaster
ReviewerName:Aman Patel


Demo Video Link : https://drive.google.com/drive/folders/1BEsrX8lcMJQ0Drq5W99Dy70buojQKH69?usp=sharing 

A modern, full-stack inventory management system built with Next.js, Express, and Neon PostgreSQL. Manage warehouses, track stock levels, process receipts and deliveries, and monitor inventory movements in real-time.

## Features

### 📊 Dashboard
- Real-time KPI metrics (total stock, low stock items, pending operations)
- Warehouse capacity monitoring
- Fast-moving SKU tracking
- Recent activity feed
- Alerts and exceptions management

### 📦 Inventory Operations
- *Receipts*: Process incoming inventory with validation
- *Deliveries*: Manage outbound shipments
- *Transfers*: Move stock between warehouses
- *Stock Adjustments*: Handle inventory corrections

### 🏢 Warehouse Management
- Multiple warehouse support
- Location-based stock tracking
- Capacity monitoring
- Low stock alerts

### 👥 User Management
- Secure authentication with JWT
- Role-based access control
- Password reset functionality

## Tech Stack

### Frontend
- *Framework*: Next.js 16 with App Router
- *Language*: TypeScript
- *Styling*: Tailwind CSS
- *UI Components*: Lucide React icons
- *State Management*: React Hooks
- *HTTP Client*: Fetch API

### Backend
- *Runtime*: Node.js
- *Framework*: Express.js
- *Language*: TypeScript
- *Database*: Neon PostgreSQL (Serverless)
- *Authentication*: JWT + bcrypt
- *Email*: Nodemailer

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)
- Neon PostgreSQL database

### Installation

1. *Clone the repository*
   bash
   git clone <repository-url>
   cd inventory-management-system
   

2. *Install dependencies*
   bash
   # Install backend dependencies
   cd backend
   pnpm install

   # Install frontend dependencies
   cd ../frontend
   pnpm install
   

3. *Configure environment variables*

   *Backend* (backend/.env):
   env
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   JWT_SECRET="your-jwt-secret-key"
   AUTH_SECRET="your-auth-secret"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@yourdomain.com"
   

   *Frontend* (frontend/.env.local):
   env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   

4. *Run the development servers*

   *Backend*:
   bash
   cd backend
   pnpm dev
   
   Server runs on http://localhost:5000

   *Frontend*:
   bash
   cd frontend
   pnpm dev
   
   Application runs on http://localhost:3000

## Project Structure


inventory-management-system/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Auth & validation
│   ├── utils/           # Helper functions
│   └── server.ts        # Express app entry
│
└── frontend/
    ├── app/             # Next.js app router pages
    │   ├── dashboard/   # Dashboard page
    │   ├── login/       # Login page
    │   ├── signup/      # Signup page
    │   ├── receipts/    # Receipts management
    │   └── deliveries/  # Deliveries management
    ├── components/      # Reusable components
    └── lib/            # Utilities & hooks


## API Endpoints

### Authentication
- POST /auth/register - Register new user
- POST /auth/login - Login user
- POST /auth/logout - Logout user
- POST /auth/forgot-password - Request password reset
- POST /auth/reset-password - Reset password with OTP

### Dashboard
- GET /api/dashboard/stats - Get dashboard statistics

### Inventory
- GET /api/receipts - List all receipts
- POST /api/receipts - Create new receipt
- GET /api/deliveries - List all deliveries
- POST /api/deliveries - Create new delivery
- GET /api/stock - Get stock levels
- GET /api/move-history - Get movement history

## Database Schema

Key tables:
- users - User accounts and authentication
- warehouses - Warehouse locations
- products - Product catalog
- stock - Current stock levels by warehouse
- receipts / receipt_items - Incoming inventory
- deliveries / delivery_items - Outgoing shipments
- transfers / transfer_items - Inter-warehouse moves
- move_history - Complete audit trail
- stock_adjustments - Inventory corrections

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Consistent naming conventions

### Testing
bash
# Backend
cd backend
pnpm test

# Frontend
cd frontend
pnpm test


## Deployment

### Backend
1. Build the TypeScript code:
   bash
   cd backend
   pnpm build
   

2. Start production server:
   bash
   pnpm start
   

### Frontend
1. Build the Next.js application:
   bash
   cd frontend
   pnpm build
   

2. Start production server:
   bash
   pnpm start
   
