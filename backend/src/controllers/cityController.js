import { query } from '../config/db.js';

export async function getCities(req, res, next) {
  try {
    const search = req.query.search?.trim();
    const result = await query(
      `SELECT id, name, country, cost_index AS "costIndex" FROM cities
       WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%' OR country ILIKE '%' || $1 || '%')
       ORDER BY name`,
      [search || null],
    );
    return res.json(result.rows);
  } catch (error) { return next(error); }
}
