# CRM System

A Customer Relationship Management (CRM) system for businesses to manage customer interactions, sales leads, and track progress.

## Tech Stack

- **Frontend**: ReactJS, TailwindCSS, React Router, Formik, Recharts
- **Backend**: NodeJS, ExpressJS
- **Database**: MongoDB

## Features

- User authentication and authorization
- Customer management
- Lead tracking and management
- Task management
- Dashboard with analytics
- Responsive design

## Project Structure

```
CRM/
├── backend/             # Backend API
│   ├── config/          # Configuration files
│   ├── controllers/     # API controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── index.js         # Entry point
└── frontend/            # React frontend
    ├── public/          # Static files
    └── src/             # Source files
        ├── components/  # React components
        ├── contexts/    # React contexts
        ├── pages/       # Page components
        ├── services/    # API services
        └── App.jsx      # Main component
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd CRM
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the backend directory with the following variables:
     ```
     PORT=5000
     mdb_uri=mongodb://localhost:27017/CRM
     jwt_secret=your_jwt_secret
     ```
   - Create a `.env` file in the frontend directory with:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd ../frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a specific customer
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer
- `POST /api/customers/:id/interactions` - Add an interaction to a customer

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get a specific lead
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/lead-performance` - Get lead performance data
