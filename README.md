# Leads Management Application

A modern web application built with Next.js for managing sales leads, featuring user authentication, lead tracking, and efficient data management capabilities.


### Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: TailwindCSS 4
- **State Management**: React Hooks
- **Authentication**: JWT-based auth flow
- **Form Handling**: React Hook Form
- **UI Components**: Headless UI

## Features

- **User Authentication**
  - Email & password-based authentication
  - JWT-based session management
  - Protected routes with middleware

- **Lead Management**
  - Create, view, edit, and delete leads
  - Track lead stages (Initial Contact, Meeting Scheduled, Proposal Sent, Negotiation)
  - Track engagement status
  - Record last contact date

- **Advanced Search & Filtering**
  - Search by name, email, or company
  - Filter by lead stage and engagement status
  - Sort by various fields (name, company, stage, last contacted, update time)
  - Pagination for handling large data sets

- **Export Capabilities**
  - Export leads to CSV format
  - Includes all lead information for reporting

- **Responsive UI**
  - Mobile-friendly design
  - Accessible components
  - Modern, clean interface

- **Error Handling**
  - Comprehensive error boundaries
  - User-friendly error messages
  - Snackbar notifications for user feedback

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn or pnpm or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/leads-management.git
cd leads-management
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=your_api_endpoint
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Running the Production Build

```bash
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

## Project Structure

```
leads-management/
├── public/                 # Static files
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Authentication routes
│   │   ├── (dashboard)/    # Dashboard routes
│   │   ├── api/            # API routes
│   ├── components/         # React components
│   │   ├── common/         # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   ├── leads/          # Lead-specific components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and types
│   ├── services/           # API services
├── .env.local              # Environment variables
├── package.json            # Project dependencies
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
```

## API Integration

The application is designed to work with a REST API backend. The API endpoints used include:

- **Authentication**
  - `/api/auth/login` - User login
  - `/api/auth/register` - User registration
  - `/api/auth/logout` - User logout
  - `/api/me` - Get current user

- **Leads**
  - `/api/leads/all` - Get all leads (with pagination and filters)
  - `/api/leads/create` - Create a new lead
  - `/api/leads/update` - Update an existing lead
  - `/api/leads/delete` - Delete a lead
  - `/api/leads/export` - Export leads to CSV

## Authentication Flow

1. Users sign up via the registration page
2. Login authentication generates a JWT token
3. Token is stored in both cookies and localStorage
4. API requests include the token in Authorization header
5. Token expiry is checked by middleware
6. Protected routes redirect to login if not authenticated
