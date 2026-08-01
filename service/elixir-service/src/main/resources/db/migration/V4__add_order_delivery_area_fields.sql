ALTER TABLE orders
    ADD COLUMN delivery_district VARCHAR(100) NULL AFTER delivery_address,
    ADD COLUMN delivery_upazila VARCHAR(100) NULL AFTER delivery_district,
    ADD COLUMN delivery_area_id BIGINT NULL AFTER delivery_upazila,
    ADD INDEX idx_orders_delivery_area (delivery_area_id),
    ADD CONSTRAINT fk_orders_delivery_area FOREIGN KEY (delivery_area_id) REFERENCES delivery_areas(id);
