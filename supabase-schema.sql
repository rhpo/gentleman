-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo TEXT NOT NULL,
    logo_path TEXT,
    short_description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('parfum', 'montre', 'lunettes')),
    category TEXT CHECK (category IN ('Eau de Parfum', 'Eau de Toilette', 'Cologne', 'Body Mist')),
    gender TEXT NOT NULL CHECK (gender IN ('Men', 'Women', 'Unisex')),
    scent_family TEXT CHECK (scent_family IN ('Floral', 'Fruity', 'Woody', 'Oriental', 'Fresh', 'Gourmand')),
    occasion TEXT CHECK (occasion IN ('Everyday', 'Evening', 'Romantic', 'Sport', 'Luxury')),
    size INTEGER NOT NULL,
    brand_id BIGINT REFERENCES brands(id) ON DELETE SET NULL,
    image TEXT NOT NULL,
    image_path TEXT,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);



-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    address TEXT NOT NULL,
    wilaya INTEGER NOT NULL CHECK (wilaya >= 1 AND wilaya <= 69),
    products JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'completed', 'canceled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id BIGSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    reduction_percent NUMERIC(5, 2) NOT NULL CHECK (reduction_percent > 0 AND reduction_percent <= 100),
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);
