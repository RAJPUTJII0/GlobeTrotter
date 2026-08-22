import { query } from '../config/db.js';

export async function findActivitiesByCity(cityId, filters = {}) {
  const values = [cityId];
  const conditions = ['city_id = $1'];
  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }
  if (filters.category) {
    values.push(filters.category);
    conditions.push(`category = $${values.length}`);
  }
  if (filters.maxCost !== undefined) {
    values.push(filters.maxCost);
    conditions.push(`estimated_cost <= $${values.length}`);
  }
  if (filters.maxDuration !== undefined) {
    values.push(filters.maxDuration);
    conditions.push(`duration_hours <= $${values.length}`);
  }
  const result = await query(
    `SELECT id, city_id, name, description, category, duration_hours, estimated_cost, image_url
     FROM activities WHERE ${conditions.join(' AND ')} ORDER BY name ASC`,
    values,
  );
  return result.rows;
}
