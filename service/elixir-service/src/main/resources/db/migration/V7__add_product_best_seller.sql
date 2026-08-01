ALTER TABLE products
    ADD COLUMN best_seller BOOLEAN NOT NULL DEFAULT FALSE AFTER combo,
    ADD INDEX idx_products_best_seller (best_seller);
