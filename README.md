
# Fullstack Shop Example

This project is split into two folders:

- **backend/** → Node.js + TypeScript + Drizzle ORM + Neon PostgreSQL + Better Auth  
- **frontend/** → Next.js + TypeScript + TailwindCSS + Zustand + ESLint  

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. Set up `.env` with your Neon Postgres connection string and Better Auth secret.
4. Run migrations: `npm run db:push`
5. Seed sample products: `npm run seed`
6. Start server: `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Frontend will query `http://localhost:4000/api/products` to fetch product data.
