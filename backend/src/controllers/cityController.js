import { query } from '../config/db.js';

export async function getCities(req, res, next) {
  try {
    const search = req.query.search?.trim();
    const country = req.query.country?.trim();
    const maxCostIndex = req.query.maxCostIndex !== undefined && Number.isFinite(Number(req.query.maxCostIndex)) ? Number(req.query.maxCostIndex) : null;
    const result = await query(
      `SELECT id, name, country, country_code AS "countryCode", region, latitude, longitude, image_url AS "imageUrl", cost_index AS "costIndex" FROM cities
      WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%' OR country ILIKE '%' || $1 || '%')
      AND ($2::text IS NULL OR country ILIKE '%' || $2 || '%')
      AND ($3::numeric IS NULL OR cost_index <= $3)
       ORDER BY name`,
          [search || null, country || null, maxCostIndex],
    );
    return res.json(result.rows);
  } catch (error) { return next(error); }
}
