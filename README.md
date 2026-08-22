# GlobeTrotter

Hackathon travel-planning application.

## Run locally

1. Configure Neon following `database/README.md` and set `DATABASE_URL`, `JWT_SECRET`, and optionally `PORT` in `backend/.env`.
2. Run `npm install` then `npm run dev` in `backend/`.
3. Run `npm install` then `npm run dev` in `frontend/`.

The frontend defaults to `http://localhost:5000/api`; override it with `VITE_API_URL` when needed.

## Folders

- `frontend/` — React user interface
- `backend/` — Express REST API
- `database/` — PostgreSQL schema and demo data
- `docs/` — architecture, API contract, and demo notes
