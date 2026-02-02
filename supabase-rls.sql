-- RLS Policies for authenticated admin access

-- Products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products_authenticated" ON products;
CREATE POLICY "products_authenticated" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Brands table
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "brands_authenticated" ON brands;
CREATE POLICY "brands_authenticated" ON brands FOR ALL USING (auth.role() = 'authenticated');

-- Orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_authenticated" ON orders;
CREATE POLICY "orders_authenticated" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- Coupons table
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "coupons_authenticated" ON coupons;
CREATE POLICY "coupons_authenticated" ON coupons FOR ALL USING (auth.role() = 'authenticated');
