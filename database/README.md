# Neon database setup

1. Create a project in the [Neon Console](https://console.neon.tech).
2. In the project dashboard, select **Connect** and copy the connection string for your database.
3. Copy `backend/.env.example` to `backend/.env` and replace `DATABASE_URL` with the copied connection string. If its query parameters include `sslmode=require`, change that value to `sslmode=verify-full`. Never commit `.env`.
4. Open the Neon **SQL Editor**, paste and run `database/schema.sql`.
5. Run `database/seed.sql` after sample data has been added.

The backend uses the `pg` driver and connects only through `DATABASE_URL`; no local database is required.
