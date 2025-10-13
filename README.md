# SAP BTP Monitor

A comprehensive monitoring and analytics application for SAP Business Technology Platform usage and costs.

## Features

- **Usage Monitor**: Track and analyze SAP BTP service usage with detailed filtering options
- **Cost Analysis**: Monitor costs across global accounts, subaccounts, and services
- **Reporting**: Visual analytics with charts and graphs for both usage and cost data

## Architecture

This application consists of two main parts:

1. **Frontend**: React + TypeScript + Vite application
2. **Backend**: Express.js server that proxies requests to SAP APIs

## Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:3001

SAP_USERNAME=your_sap_username
SAP_PASSWORD=your_sap_password
SAP_USAGE_API_URL=your_sap_usage_api_url
SAP_COST_API_URL=your_sap_cost_api_url
```

### Installation

```bash
npm install
```

### Running the Application

You need to run both the frontend and backend servers:

1. **Start the backend server** (in one terminal):
```bash
npm run dev:server
```

2. **Start the frontend** (in another terminal):
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

### Building for Production

```bash
npm run build
```

## API Endpoints

### Backend API Routes

- `GET /api/usage?fromDate={YYYYMM}&toDate={YYYYMM}` - Fetch usage data
- `GET /api/cost` - Fetch cost data
- `GET /health` - Health check endpoint

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Express.js, Node.js
- **Build Tool**: Vite
