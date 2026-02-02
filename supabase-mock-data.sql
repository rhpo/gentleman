-- Mock data for testing

-- Insert sample brands
INSERT INTO brands (name, logo, short_description) VALUES
('Gentleman Paris', decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 'Luxury French perfume house'),
('Chronos', decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 'Swiss luxury timepieces'),
('Visionnaire', decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 'Italian designer eyewear');

-- Insert sample products
INSERT INTO products (name, type, category, gender, scent_family, occasion, size, brand_id, image, price, description) VALUES
('Noir Intense', 'parfum', 'Eau de Parfum', 'Men', 'Oriental', 'Evening', 'Standard', 1, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 12500.00, 'A deep, mysterious fragrance with notes of oud and amber'),
('Rose Élégante', 'parfum', 'Eau de Parfum', 'Women', 'Floral', 'Romantic', 'Standard', 1, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 11000.00, 'Delicate rose petals with hints of jasmine'),
('Sport Fresh', 'parfum', 'Eau de Toilette', 'Unisex', 'Fresh', 'Sport', 'Standard', 1, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 8500.00, 'Energizing citrus and mint blend'),
('Classic Chronograph', 'montre', NULL, 'Men', NULL, 'Luxury', 'Standard', 2, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 45000.00, 'Swiss automatic movement, sapphire crystal'),
('Diamond Collection', 'montre', NULL, 'Women', NULL, 'Luxury', 'Standard', 2, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 65000.00, 'Mother of pearl dial with diamond accents'),
('Aviator Black', 'lunettes', NULL, 'Unisex', NULL, 'Everyday', 'Standard', 3, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 8500.00, 'Classic aviator style with polarized lenses'),
('Cat Eye Luxe', 'lunettes', NULL, 'Women', NULL, 'Luxury', 'Standard', 3, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 12000.00, 'Elegant cat-eye frame with gold details'),
('Sport Shield', 'lunettes', NULL, 'Unisex', NULL, 'Sport', 'Standard', 3, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'), 9500.00, 'Wraparound design for active lifestyle');

-- Insert sample coupons
INSERT INTO coupons (code, reduction_percent, valid_from, valid_until, active) VALUES
('WELCOME20', 20.00, NOW(), NOW() + INTERVAL '30 days', true),
('SUMMER15', 15.00, NOW(), NOW() + INTERVAL '60 days', true),
('VIP30', 30.00, NOW(), NOW() + INTERVAL '90 days', true);

-- Insert sample order
INSERT INTO orders (customer_name, phone_number, address, wilaya, products, status) VALUES
('Ahmed Benali', '0555123456', '123 Rue de la Liberté', 16, '[{"product_id": 1, "quantity": 1}, {"product_id": 4, "quantity": 1}]'::jsonb, 'pending'),
('Fatima Kaddour', '0666789012', '45 Avenue Mohamed V', 31, '[{"product_id": 2, "quantity": 2}]'::jsonb, 'shipped');
