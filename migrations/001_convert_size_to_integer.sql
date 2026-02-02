-- Migration: Convert product size from TEXT to INTEGER
-- Mapping: Sample = 50, Standard = 100, Large = 200

-- Step 1: Add new size_ml column
ALTER TABLE products ADD COLUMN size_ml INTEGER;

-- Step 2: Convert existing data
UPDATE products
SET size_ml = CASE
    WHEN size = 'Sample' THEN 50
    WHEN size = 'Standard' THEN 100
    WHEN size = 'Large' THEN 200
    ELSE 100
END;

-- Step 3: Drop old CHECK constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_size_check;

-- Step 4: Drop old size column
ALTER TABLE products DROP COLUMN size;

-- Step 5: Rename new column to size
ALTER TABLE products RENAME COLUMN size_ml TO size;

-- Step 6: Add NOT NULL constraint and CHECK constraint
ALTER TABLE products ALTER COLUMN size SET NOT NULL;
ALTER TABLE products ADD CONSTRAINT products_size_check CHECK (size IN (50, 100, 200));

-- Step 7: Create index for performance
CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);
