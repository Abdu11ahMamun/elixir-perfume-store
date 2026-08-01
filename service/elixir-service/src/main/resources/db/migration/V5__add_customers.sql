CREATE TABLE customer_types (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    display_order INT NOT NULL DEFAULT 0,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_customer_types_name (name)
) ENGINE=InnoDB;

CREATE TABLE customers (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    address TEXT,
    district VARCHAR(100),
    email VARCHAR(150),
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    upazila VARCHAR(100),
    customer_type_id BIGINT,
    PRIMARY KEY (id),
    UNIQUE KEY uk_customers_phone (phone),
    INDEX idx_customers_customer_type (customer_type_id),
    CONSTRAINT fk_customers_customer_type FOREIGN KEY (customer_type_id) REFERENCES customer_types(id)
) ENGINE=InnoDB;
