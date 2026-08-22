import { query } from '../config/db.js';

const stopSelect = `s.id, s.trip_id AS "tripId", s.city_id AS "cityId", s.start_date AS "startDate", s.end_date AS "endDate", s.stop_order AS "stopOrder",
  json_build_object('id', c.id, 'name', c.name, 'country', c.country, 'imageUrl', c.image_url, 'region', c.region) AS city`;

export async function getStops(req, res, next) {
  try {
    const result = await query(`SELECT ${stopSelect} FROM trip_stops s JOIN trips t ON t.id=s.trip_id JOIN cities c ON c.id=s.city_id WHERE s.trip_id=$1 AND t.user_id=$2 ORDER BY s.stop_order`, [req.params.tripId, req.user.id]);
    return res.json(result.rows);
  } catch (error) { return next(error); }
}

export async function createStop(req, res, next) {
  try {
    const { cityId, startDate, endDate, stopOrder } = req.body;
    if (!cityId || !startDate || !endDate) return res.status(400).json({ message: 'cityId, startDate, and endDate are required.' });
    if (new Date(`${endDate}T00:00:00Z`) < new Date(`${startDate}T00:00:00Z`)) return res.status(400).json({ message: 'endDate must be on or after startDate.' });
    const order = stopOrder == null ? null : Number(stopOrder);
    if (order !== null && (!Number.isInteger(order) || order < 1)) return res.status(400).json({ message: 'stopOrder must be a positive integer.' });
    const ownsTrip = await query('SELECT id FROM trips WHERE id=$1 AND user_id=$2', [req.params.tripId, req.user.id]);
    if (!ownsTrip.rowCount) return res.status(404).json({ message: 'Trip not found.' });
    const city = await query('SELECT id FROM cities WHERE id=$1', [cityId]);
    if (!city.rowCount) return res.status(404).json({ message: 'City not found.' });
    const nextOrder = order ?? (await query('SELECT COALESCE(MAX(stop_order), 0) + 1 AS value FROM trip_stops WHERE trip_id=$1', [req.params.tripId])).rows[0].value;
    if (order !== null) await query('UPDATE trip_stops SET stop_order=stop_order+1 WHERE trip_id=$1 AND stop_order >= $2', [req.params.tripId, nextOrder]);
    const result = await query(`WITH inserted AS (INSERT INTO trip_stops (trip_id,city_id,start_date,end_date,stop_order) VALUES ($1,$2,$3,$4,$5) RETURNING *) SELECT ${stopSelect} FROM inserted s JOIN cities c ON c.id=s.city_id`, [req.params.tripId, cityId, startDate, endDate, nextOrder]);
    return res.status(201).json(result.rows[0]);
  } catch (error) { return next(error); }
}

export async function deleteStop(req, res, next) {
  try {
    const result = await query('DELETE FROM trip_stops s USING trips t WHERE s.id=$1 AND s.trip_id=$2 AND t.id=s.trip_id AND t.user_id=$3 RETURNING s.id', [req.params.stopId, req.params.tripId, req.user.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Stop not found.' });
    return res.status(204).send();
  } catch (error) { return next(error); }
}
