-- Catalog data for activity discovery. Safe to re-run.
INSERT INTO cities (name, country, cost_index) VALUES
  ('Delhi', 'India', 1.00),
  ('Jaipur', 'India', 0.85),
  ('Mumbai', 'India', 1.20),
  ('Goa', 'India', 1.10)
ON CONFLICT (name, country) DO NOTHING;

INSERT INTO activities (city_id, name, category, duration_hours, estimated_cost, image_url)
SELECT c.id, data.name, data.category, data.duration_hours, data.estimated_cost, data.image_url
FROM (
  VALUES
    ('Delhi', 'India Gate Walk', 'sightseeing', 1.5::NUMERIC, 0::NUMERIC, NULL::TEXT),
    ('Delhi', 'Old Delhi Food Tour', 'food', 3.0::NUMERIC, 1200::NUMERIC, NULL::TEXT),
    ('Jaipur', 'Amber Fort Visit', 'sightseeing', 3.0::NUMERIC, 500::NUMERIC, NULL::TEXT),
    ('Jaipur', 'Block Printing Workshop', 'culture', 2.0::NUMERIC, 900::NUMERIC, NULL::TEXT),
    ('Mumbai', 'Gateway of India', 'sightseeing', 1.0::NUMERIC, 0::NUMERIC, NULL::TEXT),
    ('Mumbai', 'Marine Drive Food Walk', 'food', 2.5::NUMERIC, 700::NUMERIC, NULL::TEXT),
    ('Goa', 'Baga Beach Day', 'beach', 4.0::NUMERIC, 0::NUMERIC, NULL::TEXT),
    ('Goa', 'Dudhsagar Waterfall Tour', 'adventure', 7.0::NUMERIC, 1800::NUMERIC, NULL::TEXT)
) AS data(city_name, name, category, duration_hours, estimated_cost, image_url)
JOIN cities c ON c.name = data.city_name AND c.country = 'India'
WHERE NOT EXISTS (
  SELECT 1 FROM activities a WHERE a.city_id = c.id AND a.name = data.name
);
