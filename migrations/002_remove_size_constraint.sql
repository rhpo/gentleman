-- Migration: Remove size check constraint to allow any integer value for ml
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_size_check;
