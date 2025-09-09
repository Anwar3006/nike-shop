
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

## Deployment to Render

This project is configured for deployment to Render using the `render.yaml` file.

1.  **Create a new Blueprint on Render.**
    -   Go to the [Render Dashboard](https://dashboard.render.com/) and click "New" > "Blueprint".
    -   Connect your GitHub repository.
    -   Render will automatically detect the `render.yaml` file and configure the services.

2.  **Set your environment variables.**
    -   In the Render dashboard, go to the "Environment" section for your backend service.
    -   The `render.yaml` file is configured to not sync the following secret environment variables. You must set these manually in the dashboard.
        -   `BETTER_AUTH_SECRET`
        -   `GOOGLE_CLIENT_ID`
        -   `GOOGLE_CLIENT_SECRET`
        -   `GITHUB_CLIENT_ID`
        -   `GITHUB_CLIENT_SECRET`
        -   `STRIPE_SECRET_KEY`
        -   `STRIPE_WEBHOOK_SECRET`
    -   You also need to replace the placeholder values for `API_URL` and `FRONTEND_URL` with the actual URLs of your deployed services.

3.  **Deploy!**
    -   Click "Create" to deploy your services. Render will build and deploy your backend and database.
