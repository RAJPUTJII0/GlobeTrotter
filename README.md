# GlobeTrotter

GlobeTrotter is a global travel-planning application for creating visual itineraries, discovering activities, tracking budgets, and sharing trips.

## Live deployment

- Frontend: https://globe-trotter-d6ys.vercel.app
- Backend API: https://globetrotter-api-v2.vercel.app
- API health check: https://globetrotter-api-v2.vercel.app/health
- Source: https://github.com/RAJPUTJII0/GlobeTrotter/tree/main

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

## Vercel deployment

The application is deployed as two Vercel Hobby projects from the `main` branch:

1. `globe-trotter-d6ys` uses root directory `frontend`, build command `npm run build`, and output directory `dist`.
2. `globetrotter-api-v2` uses root directory `backend` and the serverless handlers in `backend/api/`.
3. The frontend calls the backend through the configured `VITE_API_URL` value.
4. The backend uses the existing Neon PostgreSQL database through `DATABASE_URL`.

Required environment variable names:

- Backend: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, optional `PORT`
- Frontend: `VITE_API_URL`

Set these values through the Vercel dashboard. Never commit secret values.

## Folders

- `frontend/` — React/Vite user interface
- `backend/` — Express REST API
- `database/` — PostgreSQL schema and catalog seed data
- `docs/` — architecture, API contract, and demo notes
