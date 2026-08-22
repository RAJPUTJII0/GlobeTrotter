import { query } from '../config/db.js';

export async function findActivitiesByCity(cityId) {
  const result = await query(
    `SELECT id, city_id, name, category, duration_hours, estimated_cost, image_url
     FROM activities WHERE city_id = $1 ORDER BY name ASC`,
    [cityId],
  );
  return result.rows;
}
