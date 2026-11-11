# PayFlow AI

### Intelligent Payment Operations & Recovery Copilot for Small Merchants

PayFlow AI is a payment operations platform designed to help small merchants manage and monitor their payment transactions through a simple dashboard.

The project integrates a React frontend, Spring Boot backend, MySQL database, and PayPal Sandbox authentication.

## Problem

Small merchants need a simple way to monitor payment transactions and manage payment operations. Tracking transactions across different systems can make daily operations difficult.

## Our Solution

PayFlow AI provides a centralized dashboard for transaction management, with PayPal Sandbox integration as the foundation for payment operations.

## Current Features

- Transaction dashboard built with React.
- Spring Boot REST API backend.
- MySQL database integration.
- Save and retrieve transaction records.
- PayPal Sandbox OAuth authentication.
- Environment-based credential configuration.

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Java 21
- Spring Boot
- Maven
- Spring Data JPA

**Database**
- MySQL 8

**Payment Integration**
- PayPal Sandbox REST API

## Project Structure

```text
payflow-ai/
├── backend/
│   ├── src/
│   └── pom.xml
├── frontend/
│   ├── src/
│   └── package.json
├── docs/
├── .gitignore
└── LICENSE
```

## Prerequisites

- Java 21
- Node.js and npm
- MySQL 8
- PayPal Developer Sandbox account

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/dhilip-22-kd/payflow-ai.git
cd payflow-ai
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE payflow_ai;
```

### 3. Configure backend environment variables

In PowerShell:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:PAYPAL_CLIENT_ID="YOUR_SANDBOX_CLIENT_ID"
$env:PAYPAL_CLIENT_SECRET="YOUR_SANDBOX_CLIENT_SECRET"
```

Never commit actual credentials to GitHub.

### 4. Start the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend runs on:

`http://localhost:8080`

### 5. Start the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend health check |
| GET | `/api/transactions` | Retrieve transactions |
| POST | `/api/transactions` | Save a transaction |
| GET | `/api/paypal/test` | Test PayPal Sandbox authentication |

## PayPal Sandbox

PayFlow AI uses PayPal Sandbox credentials for development and testing.

Sandbox transactions are simulated and do not represent real-money payments.

## Project Status

The dashboard, backend transaction APIs, MySQL integration, and PayPal Sandbox authentication have been implemented and tested.

Payment order creation, payment capture, and intelligent AI-powered recovery are planned development milestones and should not be considered completed features until implemented and tested.

## Security

- Credentials are supplied through environment variables.
- Never publish PayPal Client Secrets or database passwords.
- Sandbox credentials should be used for development.

## License

This project is licensed under the MIT License.
