-- ============================================================
-- TinyTrend Kids — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Enable UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text NOT NULL,
  category      text NOT NULL,
  price         numeric(10,2) DEFAULT 0,
  description   text,
  images        text[] DEFAULT '{}',
  in_stock      boolean DEFAULT true,
  colors        jsonb DEFAULT '[]',
  sizes         text[] DEFAULT '{}',
  oos_sizes     text[] DEFAULT '{}',
  oos_colors    text[] DEFAULT '{}',
  material      text,
  fit_type      text,
  care_instructions text,
  age_group     text,
  gender        text,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- 3. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        text,
  customer_name   text NOT NULL,
  customer_phone  text NOT NULL,
  customer_email  text,
  address         text NOT NULL,
  city            text,
  notes           text,
  items           jsonb NOT NULL DEFAULT '[]',
  total           numeric(10,2) DEFAULT 0,
  status          text DEFAULT 'pending',
  payment_status  text DEFAULT 'unpaid',
  upi_ref         text,
  created_at      timestamptz DEFAULT now()
);

-- ============================================================
-- 4. REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    uuid REFERENCES products(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating        int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       text NOT NULL,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Public read, admin write
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are insertable by authenticated users"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Products are updatable by authenticated users"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Products are deletable by authenticated users"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- ORDERS: Public insert (checkout), admin read/update
CREATE POLICY "Orders are insertable by everyone"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders are viewable by authenticated users"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Orders are updatable by authenticated users"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- REVIEWS: Public read/insert, admin delete
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Reviews are insertable by everyone"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Reviews are deletable by authenticated users"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 6. STORAGE BUCKET
-- ============================================================
-- Create public storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: public read access
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Storage policy: authenticated upload
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Storage policy: authenticated delete
CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- ============================================================
-- 7. INDEXES (for performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- ============================================================
-- 8. SAMPLE DATA (optional — remove after testing)
-- ============================================================
INSERT INTO products (name, category, price, description, material, fit_type, care_instructions, age_group, gender, sizes, colors, images) VALUES
(
  'Rainbow Cotton T-Shirt',
  'Tops & T-Shirts',
  499,
  'A vibrant cotton t-shirt with rainbow stripes. Super soft and perfect for everyday play. Made from 100% organic cotton that''s gentle on your child''s skin.',
  'Organic Cotton',
  'Regular Fit',
  'Machine Wash Cold, Tumble Dry Low',
  'Kids (3-7Y)',
  'Unisex',
  ARRAY['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
  '[{"name": "Rainbow", "hex": "#FF6B6B"}, {"name": "Sky Blue", "hex": "#4ECDC4"}, {"name": "Sunshine", "hex": "#FFE66D"}]'::jsonb,
  ARRAY[]::text[]
),
(
  'Floral Summer Dress',
  'Dresses & Frocks',
  799,
  'Beautiful floral print dress perfect for summer outings. Features a comfortable A-line cut with a bow detail at the back. Lightweight and breathable.',
  'Cotton',
  'A-Line',
  'Hand Wash Recommended, Iron on Low',
  'Kids (3-7Y)',
  'Girls',
  ARRAY['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
  '[{"name": "Pink Floral", "hex": "#FF9B9B"}, {"name": "Lavender", "hex": "#C084FC"}, {"name": "Mint", "hex": "#6EE7B7"}]'::jsonb,
  ARRAY[]::text[]
),
(
  'Denim Cargo Shorts',
  'Bottoms & Shorts',
  599,
  'Durable denim cargo shorts with multiple pockets. Perfect for active kids who love to explore. Features an elastic waistband for easy wearing.',
  'Denim',
  'Regular Fit',
  'Machine Wash Cold',
  'Junior (7-10Y)',
  'Boys',
  ARRAY['5-6Y', '6-7Y', '7-8Y', '8-10Y'],
  '[{"name": "Classic Blue", "hex": "#3B82F6"}, {"name": "Dark Wash", "hex": "#1E3A5F"}]'::jsonb,
  ARRAY[]::text[]
),
(
  'Traditional Kurta Set',
  'Ethnic Wear',
  1299,
  'Elegant cotton kurta with matching pajama. Perfect for festivals, weddings, and special occasions. Features beautiful threadwork embroidery on the neckline.',
  'Cotton',
  'Regular Fit',
  'Hand Wash, Dry Clean Recommended',
  'Kids (3-7Y)',
  'Boys',
  ARRAY['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
  '[{"name": "Royal Blue", "hex": "#2563EB"}, {"name": "Ivory", "hex": "#FFFFF0"}, {"name": "Maroon", "hex": "#881337"}]'::jsonb,
  ARRAY[]::text[]
),
(
  'Cozy Fleece Hoodie',
  'Winter Wear',
  899,
  'Ultra-soft fleece hoodie with a kangaroo pocket. Keeps your little one warm and stylish during chilly days. Features a fun animal ear hood detail.',
  'Fleece',
  'Relaxed Fit',
  'Machine Wash Cold, Do Not Iron Print',
  'Toddler (1-3Y)',
  'Unisex',
  ARRAY['1-2Y', '2-3Y', '3-4Y'],
  '[{"name": "Teddy Brown", "hex": "#A0522D"}, {"name": "Bunny Pink", "hex": "#FFC0CB"}, {"name": "Polar White", "hex": "#F8F8FF"}]'::jsonb,
  ARRAY[]::text[]
),
(
  'Sparkle Hair Clips Set',
  'Accessories',
  249,
  'Set of 6 adorable hair clips with glitter stars, bows, and flowers. Gentle snap closure that won''t pull or tangle hair. Perfect for everyday styling.',
  NULL,
  NULL,
  NULL,
  'Kids (3-7Y)',
  'Girls',
  ARRAY['Free Size'],
  '[{"name": "Rainbow Mix", "hex": "#FF6B6B"}, {"name": "Pastel Set", "hex": "#DDD6FE"}]'::jsonb,
  ARRAY[]::text[]
);

-- Sample review
INSERT INTO reviews (reviewer_name, rating, comment) VALUES
('Priya Sharma', 5, 'Absolutely love the quality! My daughter wears the rainbow t-shirt almost every day. The colors haven''t faded even after multiple washes.'),
('Rahul Mehta', 4, 'Great kurta set for my son. The embroidery work is beautiful and the cotton is very comfortable. Would love more color options!'),
('Sneha Patel', 5, 'The fleece hoodie is SO adorable with the bear ears! My toddler looks like a little teddy bear. Super warm and cozy too.');
