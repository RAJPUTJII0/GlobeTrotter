-- Catalog data for activity discovery. Safe to re-run.
INSERT INTO cities (name, country, cost_index) VALUES
  ('Delhi', 'India', 1.00),
  ('Jaipur', 'India', 0.85),
  ('Mumbai', 'India', 1.20),
  ('Goa', 'India', 1.10)
ON CONFLICT (name, country) DO NOTHING;

-- Global destination catalog. Safe to re-run and preserves existing cities.
INSERT INTO cities (name, country, country_code, region, cost_index, latitude, longitude, image_url) VALUES
  ('Paris','France','FR','Europe',1.45,48.8566,2.3522,'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85'),
  ('London','United Kingdom','GB','Europe',1.55,51.5074,-0.1278,'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=85'),
  ('Rome','Italy','IT','Europe',1.30,41.9028,12.4964,'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=85'),
  ('Tokyo','Japan','JP','Asia',1.40,35.6762,139.6503,'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=900&q=85'),
  ('New York','United States','US','North America',1.70,40.7128,-74.0060,'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=85'),
  ('Dubai','United Arab Emirates','AE','Middle East',1.60,25.2048,55.2708,'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85'),
  ('Bali','Indonesia','ID','Asia',0.95,-8.3405,115.0920,'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85'),
  ('Singapore','Singapore','SG','Asia',1.50,1.3521,103.8198,'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=85'),
  ('Sydney','Australia','AU','Oceania',1.55,-33.8688,151.2093,'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=85'),
  ('Barcelona','Spain','ES','Europe',1.25,41.3874,2.1686,'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=85'),
  ('Istanbul','Turkey','TR','Middle East',0.90,41.0082,28.9784,'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=85'),
  ('Bangkok','Thailand','TH','Asia',0.80,13.7563,100.5018,'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=85'),
  ('Cape Town','South Africa','ZA','Africa',0.90,-33.9249,18.4241,'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=85'),
  ('Cairo','Egypt','EG','Africa',0.70,30.0444,31.2357,'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=85'),
  ('Rio de Janeiro','Brazil','BR','South America',1.00,-22.9068,-43.1729,'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=85'),
  ('Amsterdam','Netherlands','NL','Europe',1.45,52.3676,4.9041,'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=900&q=85'),
  ('Prague','Czech Republic','CZ','Europe',0.95,50.0755,14.4378,'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=900&q=85'),
  ('Santorini','Greece','GR','Europe',1.35,36.3932,25.4615,'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85'),
  ('Los Angeles','United States','US','North America',1.55,34.0522,-118.2437,'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=900&q=85'),
  ('Toronto','Canada','CA','North America',1.45,43.6532,-79.3832,'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=900&q=85')
ON CONFLICT (name, country) DO UPDATE SET country_code=EXCLUDED.country_code, region=EXCLUDED.region, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude, image_url=EXCLUDED.image_url;

INSERT INTO activities (city_id, name, category, duration_hours, estimated_cost, image_url)
SELECT c.id, data.name, data.category, data.duration_hours, data.estimated_cost, data.image_url
FROM (VALUES
  ('Paris','France','Eiffel Tower viewpoint','sightseeing',2.0::NUMERIC,30::NUMERIC,'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=85'),
  ('Paris','France','Louvre Museum morning','culture',3.0::NUMERIC,25::NUMERIC,'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=800&q=85'),
  ('Tokyo','Japan','Senso-ji Temple walk','culture',2.0::NUMERIC,0::NUMERIC,'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=85'),
  ('Tokyo','Japan','Shibuya food tour','food',3.0::NUMERIC,45::NUMERIC,'https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=800&q=85'),
  ('New York','United States','Central Park cycle','nature',2.0::NUMERIC,20::NUMERIC,'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=800&q=85'),
  ('New York','United States','Brooklyn food crawl','food',3.0::NUMERIC,55::NUMERIC,'https://images.unsplash.com/photo-1498579397066-22750a3cb424?auto=format&fit=crop&w=800&q=85'),
  ('Rome','Italy','Colosseum guided visit','culture',2.5::NUMERIC,35::NUMERIC,'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=85'),
  ('Dubai','United Arab Emirates','Desert sunset safari','adventure',5.0::NUMERIC,80::NUMERIC,'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=800&q=85')
) AS data(city_name,country,name,category,duration_hours,estimated_cost,image_url)
JOIN cities c ON c.name=data.city_name AND c.country=data.country
WHERE NOT EXISTS (SELECT 1 FROM activities a WHERE a.city_id=c.id AND a.name=data.name);

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

UPDATE cities SET country_code='IN', region='South Asia', latitude=28.6139, longitude=77.2090, image_url='https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=85' WHERE name='Delhi' AND country='India';
UPDATE cities SET country_code='IN', region='South Asia', latitude=26.9124, longitude=75.7873, image_url='https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=85' WHERE name='Jaipur' AND country='India';
UPDATE cities SET country_code='IN', region='South Asia', latitude=19.0760, longitude=72.8777, image_url='https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=85' WHERE name='Mumbai' AND country='India';
UPDATE cities SET country_code='IN', region='South Asia', latitude=15.2993, longitude=74.1240, image_url='https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85' WHERE name='Goa' AND country='India';
