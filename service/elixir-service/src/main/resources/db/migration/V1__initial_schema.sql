CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    email VARCHAR(150),
    name VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('ADMIN','CUSTOMER') NOT NULL,
    status ENUM('ACTIVE','BLOCKED','DELETED') NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_phone (phone),
    UNIQUE KEY uk_users_email (email),
    INDEX idx_users_phone (phone),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
) ENGINE=InnoDB;

CREATE TABLE categories (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    description VARCHAR(500),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_categories_name (name),
    UNIQUE KEY uk_categories_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE offer_tags (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    color_code VARCHAR(20),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_offer_tags_name (name),
    UNIQUE KEY uk_offer_tags_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE products (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    combo TINYINT(1) NOT NULL DEFAULT 0,
    description TEXT,
    inspired_by VARCHAR(150),
    name VARCHAR(150) NOT NULL,
    note TEXT,
    status ENUM('ACTIVE','ARCHIVED','DRAFT','OUT_OF_STOCK') NOT NULL,
    category_id BIGINT NOT NULL,
    offer_tag_id BIGINT,
    PRIMARY KEY (id),
    INDEX idx_products_category (category_id),
    INDEX idx_products_status (status),
    INDEX idx_products_combo (combo),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_products_offer_tag FOREIGN KEY (offer_tag_id) REFERENCES offer_tags(id)
) ENGINE=InnoDB;

CREATE TABLE product_sizes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    image_urls JSON,
    ml INT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    sku VARCHAR(100) NOT NULL,
    stock INT NOT NULL,
    product_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_product_size_ml (product_id, ml),
    UNIQUE KEY uk_product_sizes_sku (sku),
    INDEX idx_product_sizes_product (product_id),
    INDEX idx_product_sizes_sku (sku),
    CONSTRAINT chk_product_size_ml CHECK (ml IN (6, 15, 30)),
    CONSTRAINT fk_product_sizes_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE orders (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    customer_email VARCHAR(150),
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    order_number VARCHAR(30) NOT NULL,
    order_status ENUM('CANCELLED','CONFIRMED','DELIVERED','PENDING','PROCESSING','SHIPPED') NOT NULL,
    payment_method ENUM('BKASH','CARD','COD','NAGAD') NOT NULL,
    payment_status ENUM('FAILED','PAID','REFUNDED','UNPAID') NOT NULL,
    priority TINYINT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    customer_id BIGINT,
    PRIMARY KEY (id),
    UNIQUE KEY uk_orders_order_number (order_number),
    INDEX idx_orders_order_number (order_number),
    INDEX idx_orders_customer (customer_id),
    INDEX idx_orders_customer_phone (customer_phone),
    INDEX idx_orders_status (order_status),
    INDEX idx_orders_created_at (created_at),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE order_items (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    line_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    product_name_snapshot VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    selected_ml_snapshot INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    order_id BIGINT NOT NULL,
    product_size_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product_size (product_size_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_order_items_product_size FOREIGN KEY (product_size_id) REFERENCES product_sizes(id)
) ENGINE=InnoDB;

CREATE TABLE admin_settings (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    description VARCHAR(500),
    setting_key VARCHAR(120) NOT NULL,
    setting_value TEXT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_admin_settings_setting_key (setting_key)
) ENGINE=InnoDB;