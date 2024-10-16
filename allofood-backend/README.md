# Allo Media Backend

Allo Media Backend is a web application built with Node.js and Express that uses JSON Web Tokens (JWT) for authentication. It provides a secure way for users to register, log in, and access protected routes.

## Features

- User authentication and authorization (JWT + 2FA)
- User registration with email verification
- Password reset functionality
- Role-based access control (Manager, Client, Delivery Personnel)

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Two-factor authentication (2FA) using email
- Nodemailer for email services
- Bcrypt.js for password hashing
- Joi for input validation
- Jest for unit testing

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation Instructions

1. Clone the repository:
   ```
   git clone https://github.com/Echaftech23/Allo-Media
   ```

2. Navigate to the project directory:
   ```
   cd Allo-Media
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up environment variables in a `.env` file (see `.env.example` for required variables)

5. Run the development server:
   ```
   npm run dev
   ```

## Scripts

- `npm start`: Run the production server
- `npm run dev`: Run the development server with nodemon
- `npm test`: Run Jest tests

## Project Structure

```
Allo-Media/
├── config/
├── controllers/
├── middlewares/
├── models/
├── helpers/
├── tests/
├── routes/
│   └── authRoutes.js
├── seeders/
├── validations/
├── .env
├── .env.example
├── app.js
└── README.md
```

### Directory and File Descriptions

- `config/`: Contains configuration files for the application, such as database connection settings.

- `controllers/`: Houses the logic for handling requests and responses. This is where the business logic of the application resides.

- `middlewares/`: Contains middleware functions that process requests before they reach the route handlers. This might include authentication checks, error handling, etc.

- `models/`: Defines the data models for the application, typically using Mongoose schemas for MongoDB.

- `helpers/`: Includes utility functions and helper modules that can be used across the application.

- `tests/`: Contains unit and integration tests for the application.

- `routes/`: Defines the API routes for the application.
  - `authRoutes.js`: Specifies the authentication-related routes.

- `seeders/`: Contains scripts for seeding the database with initial or test data.

- `validations/`: Includes validation schemas or functions to validate input data.

- `.env`: Stores environment variables for the application. This file should not be committed to version control.

- `.env.example`: An example file showing the structure of the `.env` file, without sensitive information.

- `app.js`: The main entry point of the application where the Express app is configured and started.

- `README.md`: Provides information about the project, how to set it up, and how to use it.

## Testing

The API endpoints have been tested using Postman. You can find the Postman collection in the `postman` directory.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
MONGODB_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
OTP_SECRET=your_otp_secret
OTP_TOKEN_SECRET=your_otp_token_secret
```