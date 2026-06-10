-- Migration 004: Product Variants
-- Adds support for a single product having multiple size/price options.
-- 100% additive — no existing data is modified or deleted.

CREATE TABLE IF NOT EXISTS product_variants (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size        INTEGER NOT NULL,
    price       NUMERIC(10, 2) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, size)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- RLS: same policy pattern as products, brands, orders, coupons
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "product_variants_authenticated" ON product_variants;
CREATE POLICY "product_variants_authenticated" ON product_variants
    FOR ALL USING (auth.role() = 'authenticated');

-- Track which variant (size) was ordered
ALTER TABLE order_items
    ADD COLUMN IF NOT EXISTS variant_id BIGINT REFERENCES product_variants(id) ON DELETE SET NULL;
