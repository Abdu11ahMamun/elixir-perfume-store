ALTER TABLE products
    ADD COLUMN marketing_title VARCHAR(255) NULL AFTER note,
    ADD COLUMN tagline VARCHAR(255) NULL AFTER marketing_title,
    ADD COLUMN keywords TEXT NULL AFTER tagline,
    ADD COLUMN lasting VARCHAR(100) NULL AFTER keywords;
