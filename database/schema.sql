-- GlobeTrotter: PostgreSQL schema
-- Run this file against an empty globetrotter database.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  cost_index NUMERIC(6, 2) NOT NULL DEFAULT 1.00,
  country_code VARCHAR(8),
  region VARCHAR(80),
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  image_url TEXT,
  UNIQUE (name, country)
);

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  share_slug VARCHAR(120) UNIQUE,
  budget_limit NUMERIC(12, 2),
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  travel_styles TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date >= start_date)
  , CHECK (budget_limit IS NULL OR budget_limit >= 0)
);

CREATE TABLE trip_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  stop_order INTEGER NOT NULL,
  CHECK (end_date >= start_date),
  UNIQUE (trip_id, stop_order)
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(80) NOT NULL DEFAULT 'sightseeing',
  duration_hours NUMERIC(4, 1) NOT NULL DEFAULT 1.0,
  estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  CHECK (duration_hours > 0),
  CHECK (estimated_cost >= 0)
);

CREATE TABLE stop_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_stop_id UUID NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id),
  scheduled_date DATE,
  scheduled_time TIME,
  custom_cost NUMERIC(12, 2),
  activity_order INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (custom_cost IS NULL OR custom_cost >= 0),
  UNIQUE (trip_stop_id, activity_id, scheduled_date)
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category VARCHAR(40) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (category IN ('transport', 'stay', 'food', 'other')),
  CHECK (amount >= 0)
);

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX idx_activities_city_id ON activities(city_id);
CREATE INDEX idx_stop_activities_stop_id ON stop_activities(trip_stop_id);
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);

-- Safe migration when applying this schema to an existing Neon database.
ALTER TABLE trips ADD COLUMN IF NOT EXISTS budget_limit NUMERIC(12, 2);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE stop_activities ADD COLUMN IF NOT EXISTS activity_order INTEGER;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS country_code VARCHAR(8);
ALTER TABLE cities ADD COLUMN IF NOT EXISTS region VARCHAR(80);
ALTER TABLE cities ADD COLUMN IF NOT EXISTS latitude NUMERIC(9, 6);
ALTER TABLE cities ADD COLUMN IF NOT EXISTS longitude NUMERIC(9, 6);
ALTER TABLE cities ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'INR';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS travel_styles TEXT[] NOT NULL DEFAULT '{}';
