# GlobeTrotter

GlobeTrotter is a global travel-planning application for creating visual itineraries, discovering activities, tracking budgets, and sharing trips.

## Local development

Create `backend/.env` from `backend/.env.example` and set the required values locally. Create `frontend/.env` from `frontend/.env.example` when overriding the API URL. These files are ignored by Git.

Backend:

```powershell
cd backend
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:5000/api`.

## Database

GlobeTrotter uses an existing Neon PostgreSQL database. Run `database/schema.sql` in the Neon SQL Editor, then run `database/seed.sql` to add the global destination and activity catalog. The schema migrations are additive and the seed uses conflict-safe inserts for catalog data.

## Render deployment

The root `render.yaml` defines two services and keeps Neon as the database:

1. Create a Render Blueprint from this repository and the `main` branch.
2. Deploy `globetrotter-backend` as a Node web service with root directory `backend`, build command `npm install`, start command `npm start`, and health check `/health`.
3. Set backend variables `DATABASE_URL`, `JWT_SECRET`, and `FRONTEND_URL` in Render. Use the deployed frontend URL for `FRONTEND_URL`.
4. Deploy `globetrotter-frontend` as a static site with root directory `frontend`, build command `npm install && npm run build`, and publish directory `dist`.
5. Set `VITE_API_URL` on the frontend to the deployed backend API base URL, including `/api`, for example `https://your-backend.onrender.com/api`.
6. The static-site rewrite in `render.yaml` serves `index.html` for React Router routes such as `/dashboard`, `/explore`, and `/public/:slug`.
7. Run the database schema and seed scripts against Neon before using the deployed application.

Required environment variable names:

- Backend: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, optional `PORT`
- Frontend: `VITE_API_URL`

Never commit secret values.

## Folders

- `frontend/` — React/Vite user interface
- `backend/` — Express REST API
- `database/` — PostgreSQL schema and catalog seed data
- `docs/` — architecture, API contract, and demo notes
