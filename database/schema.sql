CREATE TABLE users (id UUID PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE trips (id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(150) NOT NULL, description TEXT, start_date DATE NOT NULL, end_date DATE NOT NULL, is_public BOOLEAN DEFAULT FALSE);
CREATE TABLE cities (id UUID PRIMARY KEY, name VARCHAR(120) NOT NULL, country VARCHAR(120) NOT NULL, cost_index NUMERIC(6,2));
CREATE TABLE trip_stops (id UUID PRIMARY KEY, trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE, city_id UUID NOT NULL REFERENCES cities(id), start_date DATE NOT NULL, end_date DATE NOT NULL, stop_order INTEGER NOT NULL);
CREATE TABLE activities (id UUID PRIMARY KEY, city_id UUID REFERENCES cities(id), name VARCHAR(150) NOT NULL, category VARCHAR(80), duration_hours NUMERIC(4,1), estimated_cost NUMERIC(12,2) DEFAULT 0);
CREATE TABLE stop_activities (id UUID PRIMARY KEY, trip_stop_id UUID NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE, activity_id UUID NOT NULL REFERENCES activities(id), scheduled_date DATE, scheduled_time TIME, custom_cost NUMERIC(12,2));
CREATE TABLE expenses (id UUID PRIMARY KEY, trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE, category VARCHAR(40) NOT NULL, amount NUMERIC(12,2) NOT NULL, note TEXT);
