import { query } from '../config/db.js';

export async function addActivityToStop({ stopId, activityId, scheduledDate = null, scheduledTime = null, customCost = null, userId }) {
  const result = await query(
    `INSERT INTO stop_activities (trip_stop_id, activity_id, scheduled_date, scheduled_time, custom_cost)
     SELECT s.id, a.id, $3, $4, $5 FROM trip_stops s
     JOIN trips t ON t.id = s.trip_id AND t.user_id = $6
     JOIN activities a ON a.id = $2 AND a.city_id = s.city_id WHERE s.id = $1
     RETURNING id, trip_stop_id, activity_id, scheduled_date, scheduled_time, custom_cost, created_at`,
    [stopId, activityId, scheduledDate, scheduledTime, customCost, userId],
  );
  return result.rows[0] ?? null;
}

export async function removeActivityFromStop({ stopActivityId, userId }) {
  const result = await query(
    `DELETE FROM stop_activities sa USING trip_stops s, trips t
     WHERE sa.id = $1 AND sa.trip_stop_id = s.id AND s.trip_id = t.id AND t.user_id = $2 RETURNING sa.id`,
    [stopActivityId, userId],
  );
  return result.rowCount > 0;
}
