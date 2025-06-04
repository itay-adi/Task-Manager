# Task Manager API

A RESTful API built with **Node.js**, **TypeScript**, and **Express** to manage tasks and to-do lists. It supports user authentication with **JWT**, CRUD operations, pagination, sorting, and MongoDB for persistent storage.

## Features

- ✅ User authentication (signup/login) using JWT
- ✅ CRUD operations for to-do lists and tasks
- ✅ Pagination and sorting (ascending/descending)
- ✅ Validation using `express-validator`
- ✅ MongoDB via Mongoose ODM
- ✅ Modular structure with clear separation of concerns

## Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Mongoose** (MongoDB)
- **JWT** for auth
- **Nodemon** for dev
- **dotenv** for environment configuration

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   - https://github.com/itay-adi/Task-Manager.git
   - cd Task-Manager

2. Install dependencies:
   - npm install

3. Set up environment variables:
   - Create a .env file in the root directory and add the following:
   -- JWT_SECRET=your_jwt_secret_key
   -- MONGODB_URI=your_mongodb_connection_string
    Replace your_jwt_secret_key and your_mongodb_connection_string with your actual credentials.

4. Build the project:
   - npx tsc

5. Start the server:
   - npm start

6. The server will run on http://localhost:8080.

## API Endpoints
1. Authentication:
   - POST /auth/signup: Register a new user.
   - POST /auth/login: Authenticate a user and receive a JWT.

2. Todo Lists:
   - POST /list: Create a new todo list.
   - GET /list/:id: Retrieve a specific todo list.
   - PUT /list/:id: Update a todo list.
   - DELETE /list/:id: Delete a todo list.

3. Todo Items:
   - POST /item: Add a new todo item.
   - GET /item/:id: Retrieve a specific todo item.
   - PUT /item/:id: Update a todo item.
   - DELETE /item/:id: Delete a todo item.

## Scripts
1. npm start: Starts the server using nodemon and runs the compiled JavaScript from the dist directory.
2. npx tsc: Compiles TypeScript files to JavaScript in the dist directory.

   
## Notes
1. The dist/ directory is included in .gitignore to prevent committing compiled files. Ensure you run npx tsc before starting the server.
2. Use tools like Postman or Insomnia to test the API endpoints.
