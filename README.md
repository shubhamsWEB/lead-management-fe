# Leads Management Application

A modern web application for managing sales leads, featuring user authentication, lead tracking, and efficient data visualization with a responsive design built on Next.js.

![Leads Management App](https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: React Query + React Hooks
- **Styling**: TailwindCSS 4
- **UI Components**: Headless UI
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios

### Development
- **Package Manager**: npm/yarn/pnpm
- **Deployment**: Compatible with Vercel
- **Code Quality**: TypeScript compiler

## Features

### User Authentication
- **Secure Login/Registration**: Email & password-based authentication
- **JWT-based Session Management**: Secure tokens stored in both cookies and localStorage
- **Protected Routes**: Middleware for route protection
- **User Profile**: Access to user info in the dashboard

### Lead Management
- **CRUD Operations**:
  - Create new leads with comprehensive forms
  - View leads with sorting and filtering options
  - Update lead information seamlessly
  - Delete leads with confirmation dialog
- **Lead Stage Tracking**: 
  - Four lead stages (Initial Contact, Meeting Scheduled, Proposal Sent, Negotiation)
  - Visual indication of current stage
- **Engagement Status**: Track if leads are actively engaged
- **Last Contact Date**: Record when leads were last contacted

### Advanced Search & Filtering
- **Text Search**: Search by lead name, email, or company
- **Stage Filtering**: Filter leads by their current stage
- **Engagement Filter**: Show only engaged or non-engaged leads
- **Sorting Options**: Sort by various fields (name, company, stage, last contacted, update time)
- **Order Toggling**: Switch between ascending and descending order

### UI/UX Features
- **Responsive Design**: Mobile-first approach for all screen sizes
- **Pagination**: Handle large datasets efficiently
- **User Feedback**: Snackbar notifications for actions
- **Loading States**: Visual indicators during data fetching
- **Error Handling**: Comprehensive error boundaries and user-friendly messages
- **Modern UI**: Clean interface with consistent design
- **Glassmorphism Modals**: Modern design for modal dialogs

### Data Management
- **Export Capability**: Export leads to CSV format
- **Bulk Selection**: Select multiple leads for batch operations
- **Optimization**: Debounced search for better performance

## Getting Started

### Prerequisites
- Node.js 18.17.0 or later
- npm, yarn, pnpm, or bun package manager
- Backend API service (or mock server)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/leads-management.git
cd leads-management
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=your_api_endpoint
```

### Running the Application

#### Development Server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

#### Production Build
```bash
# Build the application
npm run build
# or yarn build, pnpm build, bun build

# Start the production server
npm start
# or yarn start, pnpm start, bun start
```

## Project Structure

```
leads-management/
├── public/                 # Static files and assets
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Authentication routes (login, register)
│   │   ├── (dashboard)/    # Dashboard routes (leads management)
│   │   ├── api/            # API routes (auth, leads, etc.)
│   ├── components/         # React components
│   │   ├── common/         # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   ├── leads/          # Lead-specific components
│   ├── contexts/           # React contexts (snackbar)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and type definitions
│   ├── services/           # API services
├── .env.local              # Environment variables
├── package.json            # Project dependencies
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
```

## API Integration

The application is designed to work with a REST API backend. The API endpoints used include:

### Authentication
- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/auth/logout` - User logout
- `/api/me` - Get current user

### Leads
- `/api/leads/all` - Get all leads (with pagination and filters)
- `/api/leads/create` - Create a new lead
- `/api/leads/update` - Update an existing lead
- `/api/leads/delete` - Delete a lead
- `/api/leads/export` - Export leads to CSV

## Authentication Flow

1. **Registration**: Users sign up via the registration page
2. **Login**: Authentication generates a JWT token
3. **Token Storage**: Token is stored in both cookies and localStorage
4. **API Requests**: All API requests include the token in Authorization header
5. **Token Validation**: Middleware checks token validity
6. **Protected Routes**: Redirect to login if not authenticated
7. **Logout**: Removes token and redirects to login page


Built with ❤️ using Next.js