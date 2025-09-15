# Backend Architecture Overview

This document provides a high-level overview of the backend application's architecture, data flow, and key design patterns.

## **Core Technology Stack**

- **Language:** TypeScript
- **Web Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** `better-auth` library
- **Validation:** Zod

## **Architectural Layers & Data Flow**

The application follows a classic multi-layer architecture, which promotes a strong separation of concerns. This makes the codebase modular, easier to maintain, and scalable. A typical API request flows through the following layers:

```
Client Request
      |
      v
[ Express.js ] -> [ Middleware (Auth, Validation, etc.) ]
      |
      v
[ Routes (`/src/routes`) ]
      |
      v
[ Controllers (`/src/controllers`) ]
      |
      v
[ Services (`/src/services`) ]
      |
      v
[ Repositories (`/src/repositories`) ]
      |
      v
[ Drizzle ORM ] -> [ PostgreSQL Database ]
```

### **1. Entry Point & Middleware (`createServer.ts`)**
- The request first hits the Express server.
- It passes through a chain of middleware that handles cross-origin requests (`cors`), request logging (`morgan`), cookie parsing, and, most importantly, authentication (`better-auth`) and data validation (`zod`).
- The `validate` middleware ensures that request bodies, query parameters, and route params conform to predefined Zod schemas before any business logic is executed.
- The `verifyAuth` / `optionalAuth` middlewares protect routes or add user context to the request object.

### **2. Routing (`/src/routes`)**
- The routing layer is responsible for mapping API endpoints (e.g., `POST /api/v1/shoes`) to their corresponding controller functions.
- It is cleanly organized, with a root router (`index.routes.ts`) that aggregates and mounts routers from other files in the directory.

### **3. Controllers (`/src/controllers`)**
- The controller's job is to handle the HTTP request and response cycle.
- It acts as a thin layer, responsible for:
    1. Extracting relevant data from the request object (`req.params`, `req.body`, `req.query`, `req.user`).
    2. Calling the appropriate method in the service layer to perform the core business logic.
    3. Formatting the response (success or error) and sending it back to the client with the correct status code.
- Controllers do not contain any direct business or database logic.

### **4. Services (`/src/services`)**
- This layer contains the core business logic of the application.
- It orchestrates application-specific operations and can call one or more repository methods to fulfill a use case.
- **Example:** The `SearchService.getSearchResults()` method first calls the repository to get results, and then it *also* calls other repository methods to log the search query and update popular search terms. This orchestration is a key responsibility of the service layer.
- **Example:** The `PaymentService.createPaymentIntent()` method performs a complex, multi-step business process (verifying stock, creating an order, decrementing stock, calling Stripe) within a single database transaction. This logic belongs squarely in the service layer.

### **5. Repositories (`/src/repositories`)**
- This layer implements the **Repository Pattern**. Its sole responsibility is data access.
- It completely encapsulates all database query logic, using Drizzle ORM to interact with the PostgreSQL database.
- Services and other parts of the application do not know *how* the data is fetched or persisted; they only know that they can call a method like `ShoeRepository.getShoes()`. This separation makes it easier to change the ORM or optimize queries without affecting business logic.
- The repositories in this project are highly optimized, using transactions for data integrity, `EXISTS` subqueries for efficient filtering, and secure patterns for updates and deletes.

## **Key Design Patterns & Concepts**

- **Separation of Concerns:** The layered architecture is the most prominent pattern, ensuring each component has a single, well-defined responsibility.
- **Repository Pattern:** The data access logic is fully abstracted into the repository layer, decoupling business logic from data persistence.
- **Centralized Error Handling:** The application uses a robust error handling strategy with a custom `AppError` class for operational errors and a global error handler that distinguishes between development and production environments. This ensures consistent error responses and prevents leaking sensitive information.
- **Higher-Order Functions for Middleware:** The `validate` middleware and `catchAsync` utility are implemented as higher-order functions, which is an elegant, reusable, and declarative pattern.
- **Schema-First Validation:** By using Zod schemas to define the shape of incoming data, the application enforces data integrity at the edge, before any logic is executed.
- **Transactional Integrity:** For complex operations that touch multiple tables (like creating an order or a new shoe), the logic is correctly wrapped in a database transaction (`db.transaction`) to ensure atomicity.
- **Environment-Aware Configuration:** The application is designed to work in different environments (`development`, `production`) by using separate database drivers and error handling logic.

This architecture is robust, scalable, and maintainable, making it well-suited for a production-grade e-commerce application.
