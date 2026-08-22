import { query } from '../config/db.js';

export async function getTrips(req, res, next) {
  try {
    const result = await query(
      `SELECT t.id, t.title, t.description, t.start_date AS "startDate", t.end_date AS "endDate", t.is_public AS "isPublic", t.share_slug AS "shareSlug", t.created_at AS "createdAt", t.budget_limit AS "budgetLimit", t.cover_image AS "coverImage", t.currency, t.travel_styles AS "travelStyles",
        COUNT(s.id)::int AS "destinationCount"
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
    const result = await query(`SELECT id, title, description, start_date AS "startDate", end_date AS "endDate", is_public AS "isPublic", share_slug AS "shareSlug", budget_limit AS "budgetLimit", currency, travel_styles AS "travelStyles" FROM trips WHERE id=$1 AND user_id=$2`, [req.params.tripId, req.user.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Trip not found.' });
    return res.json({ trip: result.rows[0] });
  } catch (error) { return next(error); }
}

export async function getItinerary(req, res, next) {
  try {
    const tripResult = await query(`SELECT id, title, description, start_date AS "startDate", end_date AS "endDate", currency, travel_styles AS "travelStyles" FROM trips WHERE id=$1 AND user_id=$2`, [req.params.tripId, req.user.id]);
    if (!tripResult.rowCount) return res.status(404).json({ message: 'Trip not found.' });
    const stops = await query(`SELECT s.id, s.city_id AS "cityId", s.start_date AS "startDate", s.end_date AS "endDate", s.stop_order AS "stopOrder", json_build_object('id',c.id,'name',c.name,'country',c.country,'imageUrl',c.image_url,'region',c.region,'latitude',c.latitude,'longitude',c.longitude) AS city,
      COALESCE(json_agg(json_build_object('id',sa.id,'activityId',a.id,'name',a.name,'description',a.description,'category',a.category,'durationHours',a.duration_hours,'cost',COALESCE(sa.custom_cost,a.estimated_cost),'imageUrl',a.image_url,'scheduledDate',sa.scheduled_date,'scheduledTime',sa.scheduled_time,'activityOrder',sa.activity_order) ORDER BY sa.activity_order NULLS LAST, sa.scheduled_date NULLS LAST,sa.scheduled_time NULLS LAST) FILTER (WHERE sa.id IS NOT NULL),'[]') AS activities
      FROM trip_stops s JOIN cities c ON c.id=s.city_id LEFT JOIN stop_activities sa ON sa.trip_stop_id=s.id LEFT JOIN activities a ON a.id=sa.activity_id WHERE s.trip_id=$1 GROUP BY s.id,c.id ORDER BY s.stop_order`, [req.params.tripId]);
    return res.json({ trip: tripResult.rows[0], stops: stops.rows });
  } catch (error) { return next(error); }
}

export async function reorderStop(req, res, next) {
  try {
    const stopOrder = Number(req.body.stopOrder);
    if (!Number.isInteger(stopOrder) || stopOrder < 1) return res.status(400).json({ message: 'stopOrder must be a positive integer.' });
    const owned = await query('SELECT s.id, s.stop_order AS "stopOrder" FROM trip_stops s JOIN trips t ON t.id=s.trip_id WHERE s.id=$1 AND s.trip_id=$2 AND t.user_id=$3', [req.params.stopId, req.params.tripId, req.user.id]);
    if (!owned.rowCount) return res.status(404).json({ message: 'Stop not found.' });
    await query('UPDATE trip_stops SET stop_order = stop_order + 10000 WHERE trip_id=$1', [req.params.tripId]);
    await query(`WITH ordered AS (SELECT id, ROW_NUMBER() OVER (ORDER BY CASE WHEN id=$2 THEN $3 WHEN stop_order - 10000 > $4 AND stop_order - 10000 <= $3 THEN stop_order - 10001 WHEN stop_order - 10000 < $4 AND stop_order - 10000 >= $3 THEN stop_order - 9999 ELSE stop_order - 10000 END, id) AS next_order FROM trip_stops WHERE trip_id=$1) UPDATE trip_stops s SET stop_order=o.next_order FROM ordered o WHERE s.id=o.id`, [req.params.tripId, req.params.stopId, stopOrder, owned.rows[0].stopOrder]);
    return res.json({ message: 'Stop order updated.' });
  } catch (error) { return next(error); }
}

export async function createTrip(req, res, next) {
  try {
    const { title, description = null, startDate, endDate, budgetLimit = null, currency = 'INR', travelStyles = [] } = req.body;
    const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AED', 'AUD'];
    const validStyles = ['Culture', 'Food', 'Adventure', 'Nature', 'Nightlife', 'Shopping', 'Relaxation', 'Photography'];
    if (!title?.trim() || !startDate || !endDate) return res.status(400).json({ message: 'Title, startDate, and endDate are required.' });
    if (!currencies.includes(currency) || !Array.isArray(travelStyles) || travelStyles.some((style) => !validStyles.includes(style))) return res.status(400).json({ message: 'Invalid currency or travel styles.' });
    if (new Date(`${endDate}T00:00:00Z`) < new Date(`${startDate}T00:00:00Z`)) return res.status(400).json({ message: 'endDate must be on or after startDate.' });

    const result = await query(
      `INSERT INTO trips (user_id, title, description, start_date, end_date, budget_limit, currency, travel_styles)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, description, start_date AS "startDate", end_date AS "endDate", is_public AS "isPublic", share_slug AS "shareSlug", created_at AS "createdAt", budget_limit AS "budgetLimit", currency, travel_styles AS "travelStyles"`,
      [req.user.id, title.trim(), description?.trim() || null, startDate, endDate, budgetLimit === null || budgetLimit === '' ? null : budgetLimit, currency, travelStyles],
    );
    return res.status(201).json({ trip: { ...result.rows[0], destinationCount: 0 } });
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
