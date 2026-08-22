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

export async function getTrip(req, res, next) {
  try {
    const result = await query(`SELECT id, title, description, start_date AS "startDate", end_date AS "endDate", is_public AS "isPublic", share_slug AS "shareSlug", budget_limit AS "budgetLimit" FROM trips WHERE id=$1 AND user_id=$2`, [req.params.tripId, req.user.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Trip not found.' });
    return res.json({ trip: result.rows[0] });
  } catch (error) { return next(error); }
}

export async function getItinerary(req, res, next) {
  try {
    const tripResult = await query(`SELECT id, title, description, start_date AS "startDate", end_date AS "endDate" FROM trips WHERE id=$1 AND user_id=$2`, [req.params.tripId, req.user.id]);
    if (!tripResult.rowCount) return res.status(404).json({ message: 'Trip not found.' });
    const stops = await query(`SELECT s.id, s.city_id AS "cityId", s.start_date AS "startDate", s.end_date AS "endDate", s.stop_order AS "stopOrder", json_build_object('id',c.id,'name',c.name,'country',c.country) AS city,
      COALESCE(json_agg(json_build_object('id',sa.id,'activityId',a.id,'name',a.name,'category',a.category,'durationHours',a.duration_hours,'cost',COALESCE(sa.custom_cost,a.estimated_cost),'scheduledDate',sa.scheduled_date,'scheduledTime',sa.scheduled_time) ORDER BY sa.scheduled_date,sa.scheduled_time) FILTER (WHERE sa.id IS NOT NULL),'[]') AS activities
      FROM trip_stops s JOIN cities c ON c.id=s.city_id LEFT JOIN stop_activities sa ON sa.trip_stop_id=s.id LEFT JOIN activities a ON a.id=sa.activity_id WHERE s.trip_id=$1 GROUP BY s.id,c.id ORDER BY s.stop_order`, [req.params.tripId]);
    return res.json({ trip: tripResult.rows[0], stops: stops.rows });
  } catch (error) { return next(error); }
}

export async function createTrip(req, res, next) {
  try {
    const { title, description = null, startDate, endDate, budgetLimit = null } = req.body;
    if (!title?.trim() || !startDate || !endDate) return res.status(400).json({ message: 'Title, startDate, and endDate are required.' });
    if (new Date(`${endDate}T00:00:00Z`) < new Date(`${startDate}T00:00:00Z`)) return res.status(400).json({ message: 'endDate must be on or after startDate.' });

    const result = await query(
      `INSERT INTO trips (user_id, title, description, start_date, end_date, budget_limit)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, start_date, end_date, is_public, share_slug, created_at, budget_limit`,
      [req.user.id, title.trim(), description?.trim() || null, startDate, endDate, budgetLimit === null || budgetLimit === '' ? null : budgetLimit],
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
