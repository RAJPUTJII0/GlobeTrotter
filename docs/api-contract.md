# GlobeTrotter API contract

Base URL: `http://localhost:5000/api`

All responses and request bodies use JSON. Protected endpoints require `Authorization: Bearer <token>`.

## Auth

### `POST /auth/signup`

```json
{ "name": "Arpit", "email": "arpit@example.com", "password": "secret123" }
```

Success (`201`):

```json
{ "token": "<jwt>", "user": { "id": "uuid", "name": "Arpit", "email": "arpit@example.com", "created_at": "2026-08-22T00:00:00.000Z" } }
```

### `POST /auth/login`

```json
{ "email": "arpit@example.com", "password": "secret123" }
```

Success (`200`) uses the same response shape as signup.

## Trips

### `GET /trips`

Returns `200`:

```json
{ "trips": [{ "id": "uuid", "title": "Rajasthan Escape", "description": "...", "start_date": "2026-10-10", "end_date": "2026-10-14", "is_public": false, "share_slug": null, "destination_count": 0 }] }
```

### `POST /trips`

```json
{ "title": "Rajasthan Escape", "description": "Delhi to Jaipur", "startDate": "2026-10-10", "endDate": "2026-10-14" }
```

Returns `201`:

```json
{ "trip": { "id": "uuid", "title": "Rajasthan Escape", "description": "Delhi to Jaipur", "start_date": "2026-10-10", "end_date": "2026-10-14", "is_public": false, "share_slug": null, "destination_count": 0 } }
```

### `DELETE /trips/:tripId`

Returns `204` with no response body.

## Activities

### `GET /activities?cityId=:cityId`

No authentication is required. `cityId` is required; no other search or filter parameters are supported.

```json
{ "activities": [{ "id": "uuid", "city_id": "uuid", "name": "Amber Fort Visit", "category": "sightseeing", "duration_hours": "3.0", "estimated_cost": "500.00", "image_url": null }] }
```

### `POST /stops/:stopId/activities`

Authentication is required. The activity must belong to the same city as the stop.

```json
{ "activityId": "uuid", "scheduledDate": "2026-10-11", "scheduledTime": "10:00", "customCost": 600 }
```

Returns `201`:

```json
{ "stopActivity": { "id": "uuid", "trip_stop_id": "uuid", "activity_id": "uuid", "scheduled_date": "2026-10-11", "scheduled_time": "10:00:00", "custom_cost": "600.00", "created_at": "2026-08-22T00:00:00.000Z" } }
```

### `DELETE /stop-activities/:id`

Authentication is required. `id` is the returned `stopActivity.id`, not the catalog `activityId`. Returns `204` with no response body.

## Cities, stops, itinerary, and budget

- `GET /cities?search=` returns an array of `{ id, name, country, costIndex }`.
- `GET /trips/:tripId/stops` returns an array of stops with camelCase IDs/dates and nested `city`.
- `POST /trips/:tripId/stops` accepts `{ cityId, startDate, endDate, stopOrder? }` and returns the created stop (`201`).
- `DELETE /trips/:tripId/stops/:stopId` returns `204`.
- `GET /trips/:tripId/itinerary` returns `{ trip, stops }`, where every stop contains `city` and `activities`.
- `GET /trips/:tripId/expenses` returns `{ expenses }`.
- `POST /trips/:tripId/expenses` accepts `{ category, amount, note? }` where category is `transport`, `stay`, `food`, or `other`; returns `{ expense }` (`201`).
- `DELETE /trips/:tripId/expenses/:expenseId` returns `204`.
- `GET /trips/:tripId/budget` returns `{ breakdown, total, budgetLimit, remaining, averagePerDay }`. Activity costs are calculated from stop activities.
- `POST /trips/:tripId/share` returns `{ shareSlug }`; `GET /public/trips/:shareSlug` is a read-only public trip view.

## Errors

```json
{ "message": "Human-readable error message." }
```

Common status codes: `400` invalid input, `401` missing/invalid token, `404` resource missing, `409` email already registered, `500` server error.
