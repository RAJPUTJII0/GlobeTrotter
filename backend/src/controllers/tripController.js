import { query } from '../config/db.js';

export async function getTrips(req, res, next) {
  try {
    const result = await query(
      `SELECT t.id, t.title, t.description, t.start_date, t.end_date, t.is_public, t.share_slug, t.created_at,
        COUNT(s.id)::int AS destination_count
       FROM trips t LEFT JOIN trip_stops s ON s.trip_id = t.id
       WHERE t.user_id = $1
       GROUP BY t.id ORDER BY t.start_date ASC`,
      [req.user.id],
    );
    return res.json({ trips: result.rows });
  } catch (error) {
    return next(error);
  }
}

export async function createTrip(req, res, next) {
  try {
    const { title, description = null, startDate, endDate } = req.body;
    if (!title?.trim() || !startDate || !endDate) return res.status(400).json({ message: 'Title, startDate, and endDate are required.' });
    if (new Date(`${endDate}T00:00:00Z`) < new Date(`${startDate}T00:00:00Z`)) return res.status(400).json({ message: 'endDate must be on or after startDate.' });

    const result = await query(
      `INSERT INTO trips (user_id, title, description, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, start_date, end_date, is_public, share_slug, created_at`,
      [req.user.id, title.trim(), description?.trim() || null, startDate, endDate],
    );
    return res.status(201).json({ trip: { ...result.rows[0], destination_count: 0 } });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTrip(req, res, next) {
  try {
    const result = await query('DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.tripId, req.user.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Trip not found.' });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
