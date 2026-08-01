CREATE TABLE delivery_areas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    deleted_at DATETIME(6),
    updated_at DATETIME(6) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    district VARCHAR(100) NOT NULL,
    upazila VARCHAR(100),
    PRIMARY KEY (id),
    INDEX idx_delivery_areas_district (district),
    INDEX idx_delivery_areas_district_upazila (district, upazila)
) ENGINE=InnoDB;
