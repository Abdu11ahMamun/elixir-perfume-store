ALTER TABLE orders
    ADD COLUMN customer_ref_id BIGINT NULL AFTER customer_id,
    ADD INDEX idx_orders_customer_ref (customer_ref_id),
    ADD CONSTRAINT fk_orders_customer_ref FOREIGN KEY (customer_ref_id) REFERENCES customers(id);
