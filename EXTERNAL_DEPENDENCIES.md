# External Libraries Analysis

This document details the external libraries used in the backend codebase, their purpose, and how they are integrated.

---

## **Dependencies (Production)**

### **`@neondatabase/serverless` (v1.0.1)**
- **Purpose:** Provides a PostgreSQL driver specifically optimized for serverless environments like Vercel, which is used to connect to the Neon database.
- **Used In:** `src/db/index.ts`
- **Key Features Used:** `NeonPool` for creating the database connection pool in production.

### **`better-auth` (v1.3.7)**
- **Purpose:** A comprehensive authentication library that handles user sessions, social logins (OAuth), and email/password authentication.
- **Used In:** `src/utils/auth.ts` (configuration), `src/createServer.ts` (middleware), `src/middlewares/verfiyAuth.middleware.ts` (session validation).
- **Key Features Used:** `betterAuth()` for initialization, `drizzleAdapter` for database connection, `toNodeHandler()` for creating Express middleware, `auth.api.getSession()` for validating sessions.

### **`config` (v4.1.1)**
- **Purpose:** A library for managing application configuration. While present, the primary configuration loading is handled by `dotenv`.
- **Used In:** `backend/src/config/default.ts` (though `dotenv` is doing the heavy lifting).

### **`cookie-parser` (v1.4.7)**
- **Purpose:** An Express middleware that parses the `Cookie` header and populates `req.cookies`.
- **Used In:** `src/createServer.ts`
- **Key Features Used:** The default middleware `cookieParser()`.

### **`cors` (v2.8.5)**
- **Purpose:** An Express middleware to enable and configure Cross-Origin Resource Sharing.
- **Used In:** `src/createServer.ts`
- **Key Features Used:** The `cors()` middleware, configured with specific `origin` and `methods`.

### **`cron` (v4.3.3)**
- **Purpose:** A library for scheduling cron jobs (time-based tasks).
- **Used In:** `src/utils/cron.ts`
- **Key Features Used:** `CronJob` class to create a scheduled "keep-alive" ping.

### **`dayjs` (v1.11.13)**
- **Purpose:** A fast and lightweight alternative to Moment.js for date and time manipulation.
- **Used In:** `src/utils/logger.ts`
- **Key Features Used:** `dayjs().format()` for creating custom timestamp strings.

### **`dotenv` (v17.2.2)**
- **Purpose:** Loads environment variables from a `.env` file into `process.env`.
- **Used In:** `src/config/default.ts`, `src/app.ts`
- **Key Features Used:** `config()` to load environment variables.

### **`drizzle-orm` (v0.44.4)**
- **Purpose:** The primary ORM (Object-Relational Mapper) used for all database interactions. It provides a type-safe way to write SQL queries.
- **Used In:** All repository files (`src/repositories/*.ts`), `src/db/index.ts`, `src/services/payment.service.ts`.
- **Key Features Used:** `pgTable` for schema definition, `drizzle()` for initialization, `db.select()`, `db.insert()`, `db.update()`, `db.delete()`, `relations()`, `db.transaction()`, various query builders (`eq`, `and`, `ilike`, `exists`, etc.).

### **`drizzle-zod` (v0.8.3)**
- **Purpose:** A utility library to generate Zod schemas directly from Drizzle schemas.
- **Used In:** All model files (`src/models/*.ts`).
- **Key Features Used:** `createInsertSchema`, `createSelectSchema` to automatically generate validation schemas.

### **`express` (v4.18.2)**
- **Purpose:** The core web framework for building the application's REST API.
- **Used In:** Throughout the application, especially `src/createServer.ts`, all `routes`, and all `controllers`.
- **Key Features Used:** `express()`, `Router()`, `Request`, `Response`, `NextFunction`, middleware handling.

### **`jsonwebtoken` (v9.0.2)**
- **Purpose:** Used for creating and verifying JSON Web Tokens (JWTs). Likely used internally by `better-auth`.
- **Used In:** Implicitly used by `better-auth`.

### **`morgan` (v1.10.1)**
- **Purpose:** An Express middleware for logging HTTP requests.
- **Used In:** `src/createServer.ts`
- **Key Features Used:** `morgan('dev')` for a developer-friendly log format.

### **`pg` (v8.16.3)**
- **Purpose:** The standard Node.js driver for PostgreSQL. Used by Drizzle ORM for the local development environment.
- **Used In:** `src/db/index.ts`
- **Key Features Used:** `Pool` for creating the database connection pool in development.

### **`pino` (v9.9.0)**
- **Purpose:** A high-performance, low-overhead JSON logger.
- **Used In:** `src/utils/logger.ts` and throughout the application where logging is needed.
- **Key Features Used:** `pino()` for initialization.

### **`pino-pretty` (v13.1.1)**
- **Purpose:** A transport for `pino` that formats the JSON logs into a human-readable, colorized output for development.
- **Used In:** `src/utils/logger.ts`
- **Key Features Used:** Used as a `transport` target in the `pino` configuration.

### **`slugify` (v1.6.6)**
- **Purpose:** A utility library to convert strings into URL-friendly slugs.
- **Used In:** `src/utils/slugify.ts`
- **Key Features Used:** The default `slugify()` function with custom options.

### **`stripe` (v18.5.0)**
- **Purpose:** The official Node.js library for interacting with the Stripe API for payments.
- **Used In:** `src/services/payment.service.ts`
- **Key Features Used:** `new Stripe()` for initialization, `stripe.paymentIntents.create()`, `stripe.webhooks.constructEvent()`.

### **`zod` (v4.1.0)**
- **Purpose:** A TypeScript-first schema declaration and validation library.
- **Used In:** All schema files (`src/schemas/*.ts`) to define validation rules.
- **Key Features Used:** `z.object()`, `z.string()`, `z.number()`, `.optional()`, `.refine()`, `.regex()`, etc.

### **`tsx` (v4.20.4)**
- **Purpose:** A command-line tool that enhances Node.js to run TypeScript and ESM files directly without a separate build step.
- **Used In:** `package.json` scripts (`dev`, `seed`).

### **`drizzle-kit` (v0.31.4)**
- **Purpose:** A CLI tool for Drizzle ORM used to manage database migrations and schema changes.
- **Used In:** `package.json` scripts (`db:push`, `db:generate`, `db:migrate`).

## **DevDependencies (Development Only)**

- **`@types/*`**: These are type definition packages that provide TypeScript with type information for JavaScript libraries.
- **`rimraf`**: A cross-platform tool for deleting files and directories. Used in the `build` script to clean the `dist` folder.
- **`typescript`**: The TypeScript language compiler. Used in the `build` script.
