# Edviron Project

This project consists of two main directories: a Vite React frontend and a NestJS backend. Both are deployed on Vercel and work together to provide a transaction management system with public and private APIs.

## Table of Contents

- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Public Endpoints](#public-endpoints)
  - [Private Endpoints](#private-endpoints)
- [Development](#development)

---

## Overview

- **Frontend**: React app built with Vite. It communicates with the backend via REST APIs.
- **Backend**: NestJS app for handling transaction logic, user authentication, and database operations.
- **Database**: MongoDB for transactional data and other services.

---

## Setup Instructions

### Prerequisites
1. Node.js (>= 16.x)
2. npm or Yarn
3. MongoDB instance (local or cloud)
4. Environment variables properly configured (see below).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayusharma-ctrl/Edv.iron
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd client
   npm install
   cd backend
   npm install
   ```

3. Add environment variables to `.env` files for both the frontend and backend (see [Environment Variables](#environment-variables)).

4. Run the backend server:
   ```bash
   cd backend
   npm run start:dev
   ```

5. Run the frontend server:
   ```bash
   cd client
   npm run dev
   ```

6. Visit the frontend at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                                    | Example Value                                          |
|-----------------|------------------------------------------------|------------------------------------------------------|
| `PORT`          | Port for the backend server                   | `8000`                                               |
| `MONGO_URI`     | MongoDB connection string                     | `mongodb+srv://username:password@cluster.mongodb.net/environ` |
| `FRONTEND_URL`  | Frontend URL for CORS                         | `http://localhost:5173`                              |
| `JWT_SECRET`    | Secret for JWT token generation               | `your-secret-key`                                    |
| `PG_URI`        | Payment gateway base URL                      | `https://dev-vanilla.edviron.com`                    |
| `PG_KEY`        | Payment gateway API key                       | `your-api-key`                                       |
| `CALLBACK_URL`  | Payment callback URL                          | `http://localhost:5173`                              |
| `PAYMENT_API_KEY`| API key for payment-related actions           | `your-payment-api-key`                               |

### Frontend (`client/.env`)

| Variable           | Description                            | Example Value            |
|--------------------|----------------------------------------|--------------------------|
| `VITE_SERVER_URL`  | Base URL for the backend APIs          | `http://localhost:8000/v1` |
| `VITE_SERVER_API_KEY` | API key for authorization with backend | `your-api-key`           |

---

## API Endpoints

### Public Endpoints

#### Get Public Transactions
```bash
curl --location 'https://localhost:8000/v1/public/transactions'
```

**Sample Response:**
```json
{
  "code": "RESPONSE_SUCCESS",
  "message": "Request served successfully.",
  "type": "object",
  "data": {
    "data": "public transaction controller"
  }
}
```

#### Generate a New Token
```bash
curl --location 'http://localhost:8000/auth/generate-new-token'
```

**Sample Response:**
```json
{
  "token": "your-generated-jwt-token"
}
```

---

### Private Endpoints

> **Note**: All private endpoints require an `Authorization` header with a Bearer token.

#### Get All Transactions
```bash
curl --location 'http://localhost:8000/v1/transactions/all?page=1&limit=5' \
--header 'Authorization: Bearer <your-token>'
```

#### Get Transactions by School ID
```bash
curl --location 'http://localhost:8000/v1/transactions/school/<school_id>?page=1&limit=5' \
--header 'Authorization: Bearer <your-token>'
```

#### Check Status by Custom Order ID
```bash
curl --location 'http://localhost:8000/v1/transactions/check-status/<custom_order_id>' \
--header 'Authorization: Bearer <your-token>'
```

#### Update Transaction Status
```bash
curl --location 'http://localhost:8000/v1/transactions/update-status' \
--header 'Authorization: Bearer <your-token>' \
--header 'Content-Type: application/json' \
--data '{
  "collect_id": "<collect_id>",
  "status": "FAILED"
}'
```

#### Get Payment Page Link
```bash
curl --location 'http://localhost:8000/v1/transactions/collect-payment' \
--header 'Authorization: Bearer <your-token>' \
--data '{
    "school_id": "<school_id>",
    "amount": 100
}'
```

---

## Development

### Start Backend
```bash
cd backend
npm run start:dev
```

### Start Frontend
```bash
cd client
npm run dev
```

### Building for Production
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Serve the backend in production mode:
   ```bash
   cd backend
   npm run start:prod
   ```

---

