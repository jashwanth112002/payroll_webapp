# PayrollPro

A comprehensive payroll management system with employee management, payslip generation, meeting scheduling, and profile management features....ggg....patch 1

## Features...

- **Dashboard**: Overview of key payroll and employee metrics
- **Employee Management**: Add, edit, and manage employee information
- **Payroll Processing**: Generate and manage payslips with automatic calculations
- **Meeting Scheduling**: Schedule and manage meetings with employees
- **Profile Management**: User profile with photo upload capability
- **Settings**: Configure payroll, notification, security, and system preferences

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with Passport.js
- **State Management**: React Query
- **Routing**: Wouter for client-side routing

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

## Installation and Setup

### 1. Clone the repository

```
cd payrollpro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and other configuration options:

```
# Database connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/payrollpro

# App configuration
NODE_ENV=development
PORT=5000
SESSION_SECRET=your_session_secret_here

# File upload configuration
UPLOAD_DIR=uploads
```

### 4. Setup the database

First, create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE payrollpro;
\q
```

Then, apply the schema and seed data:

```bash
npm run db:push
npm run db:seed
```

### 5. Create uploads directory

Create a directory for file uploads:

```bash
mkdir uploads
```

### 6. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:5000](http://localhost:5000).

## Production Deployment

For production deployment:

```bash
npm run build
npm start
```

## Project Structure

- `/client` - Frontend React application
  - `/src` - Source files
    - `/components` - Reusable UI components
    - `/hooks` - Custom React hooks
    - `/lib` - Utility functions and shared code
    - `/pages` - Page components
- `/db` - Database configuration and seed data
- `/server` - Backend Express server
  - `/routes.ts` - API routes
- `/shared` - Shared code between frontend and backend
  - `/schema.ts` - Database schema definitions
- `/uploads` - Directory for uploaded files

