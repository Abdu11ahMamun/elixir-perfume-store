-- ============================================================================
-- Aurvior Product Catalogue Import — Idempotent Production Seed
-- ============================================================================
-- Source: "product-details.xlsx - Sheet1.csv" (13 products), read and mapped
--         per docs/product-import-data-review.md in this repo.
--
-- READ BEFORE RUNNING
-- --------------------------------------------------------------------------
-- 1. IDEMPOTENT: safe to run more than once. Re-running does NOT create
--    duplicate products/sizes, does NOT reset stock on an existing size,
--    and does NOT overwrite a real uploaded image with the placeholder.
--
-- 2. REQUIRED CATEGORIES: this script hard-aborts (SQL SIGNAL — a real
--    error, not just a comment) if "For Him" (slug for-him), "For Her"
--    (slug for-her), or "Luxury Oud" (slug luxury-oud) do not exist or are
--    soft-deleted. It never creates a category and never silently remaps
--    a product to a different category.
--
-- 3. SOFT-DELETED NAME CONFLICTS: if a product with a target name already
--    exists but is soft-deleted, this script aborts (SIGNAL) rather than
--    silently reviving it. Resolve manually and re-run.
--
-- 4. PLACEHOLDER IMAGE: every newly-inserted size gets
--        image_urls = ["/uploads/products/aurvior-product-placeholder.png"]
--    *** Before running this against PRODUCTION, upload the equivalent
--    *** file to the production VPS's upload directory at
--    ***   <app.upload.base-dir>/products/aurvior-product-placeholder.png
--    *** and verify it resolves with HTTP 200 BEFORE running this script.
--    A generated placeholder (parchment background, AURVIOR wordmark) has
--    already been placed in the LOCAL dev uploads folder for this repo's
--    own verification — it does not exist on production yet.
--
-- 5. PRICE UPDATE BEHAVIOUR: @update_prices_on_rerun (set below) is TRUE
--    for this first controlled import — existing size rows' PRICE will be
--    overwritten to 699.00 / 1199.00 even if the product already existed.
--    Set it to FALSE before any future rerun if prices should no longer
--    be touched.
--
-- 6. STOCK is NEVER reset on an existing size row — 100 is only used when
--    INSERTing a brand-new size row.
--
-- 7. BACKUP FIRST:
--        mysqldump -h <host> -u <user> -p <db_name> > \
--          aurvior_backup_$(date +%Y%m%d_%H%M%S).sql
--
-- 8. RUN WITHOUT --force so a SIGNAL error genuinely halts the script:
--        mysql -h <host> -u <user> -p <db_name> < seed_aurvior_products.sql
--
-- 9. This script creates a TEMPORARY stored procedure to get real
--    SIGNAL-based hard failures and a cursor loop (plain multi-statement
--    SQL has neither). The procedure and its staging temp table are
--    dropped at the end and leave no permanent schema object behind. If
--    the script aborts partway (e.g. missing category), the procedure may
--    be left registered — harmless; the next run's DROP PROCEDURE IF
--    EXISTS at the top cleans it up automatically.
-- ============================================================================

SET NAMES utf8mb4;

-- Toggle: allow this run to overwrite existing size PRICE (see note 5 above)
SET @update_prices_on_rerun = TRUE;

-- ── Reviewer preflight snapshot — read this before letting the script run ──
SELECT 'PRE-IMPORT: required categories (expect 3 rows, active=1, deleted_at=NULL)' AS check_name;
SELECT id, name, slug, active, deleted_at
FROM categories
WHERE slug IN ('for-him', 'for-her', 'luxury-oud');

SELECT 'PRE-IMPORT: existing name collisions (informational — expect 0 rows on a clean target)' AS check_name;
SELECT id, name, status, deleted_at FROM products
WHERE name IN ('Rebel','Avengers','Spirit','Midnight Alpha','Eclipse','Bloom',
               'Cherish','Ember','Imperial','Charm','Drift','Vampire Blood','SRK Blend');

SELECT 'PRE-IMPORT: existing SKU collisions (informational — expect 0 rows on a clean target)' AS check_name;
SELECT id, sku, product_id FROM product_sizes
WHERE sku IN ('REBEL-15','REBEL-30','AVENGERS-15','AVENGERS-30','SPIRIT-15','SPIRIT-30',
              'MIDNIGHT-ALPHA-15','MIDNIGHT-ALPHA-30','ECLIPSE-15','ECLIPSE-30',
              'BLOOM-15','BLOOM-30','CHERISH-15','CHERISH-30','EMBER-15','EMBER-30',
              'IMPERIAL-15','IMPERIAL-30','CHARM-15','CHARM-30','DRIFT-15','DRIFT-30',
              'VAMPIRE-BLOOD-15','VAMPIRE-BLOOD-30','SRK-BLEND-15','SRK-BLEND-30');

-- ============================================================================
-- Staging table — one row per source product. Content is the CSV's own
-- text, whitespace-cleaned only (trimmed, collapsed repeated spaces,
-- stripped accidental leading/trailing space) — no marketing copy was
-- rewritten. See docs/product-import-data-review.md for the full audit
-- of what was/wasn't changed per row, including two preserved source
-- typos ("Elegent", "Pulm") that were intentionally left as-is.
-- ============================================================================
DROP TEMPORARY TABLE IF EXISTS tmp_aurvior_seed;
CREATE TEMPORARY TABLE tmp_aurvior_seed (
    seq             INT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    category_slug   VARCHAR(120) NOT NULL,
    inspired_by     VARCHAR(150),
    marketing_title VARCHAR(255),
    description     TEXT,
    tagline         VARCHAR(255),
    keywords        TEXT,
    note            TEXT,
    lasting         VARCHAR(100),
    best_seller     TINYINT(1) NOT NULL,
    sku_prefix      VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO tmp_aurvior_seed
    (seq, name, category_slug, inspired_by, marketing_title, description, tagline, keywords, note, lasting, best_seller, sku_prefix)
VALUES
-- 1. Rebel — For Him — Best Seller
(1, 'Rebel', 'for-him', 'Bad Boy', '"CAROLINA HERRERA" Perfume for Men',
 'White Pepper, Pink Pepper; Cedarwood Tonka Bean\nA sophisticated, mass-appealing fragrance defined by warm notes of spiced Perfect for fall and winter nights, it projects a classy, mysterious vibe with excellent lasting power (sillage).',
 'Where Darkness Meets Desire',
 '1. White Pepper-Cedarwood-Tonka Bean\n2. Sophisticated & Classy',
 'White Pepper-Cedarwood-Tonka Bean · Sophisticated & Classy',
 '8 hrs +', 1, 'REBEL'),

-- 2. Avengers — For Him — Best Seller
(2, 'Avengers', 'for-him', 'Creed Aventus', '"Creed Aventus" Perfume for Men',
 'Inspired by Napoleon''s legacy, Aventus is a handcrafted, noble fragrance. Born from a father-son collaboration, it opens with bold citrus and blackcurrant, unfolding into a woody-musk base, capturing a story of power and success.',
 'Smell the Power of Victory',
 '1. Fruity citrus\n2. Vintage with Legacy',
 'Fruity citrus · Vintage with Legacy',
 '6 Hrs +', 1, 'AVENGERS'),

-- 3. Spirit — For Him
(3, 'Spirit', 'for-him', 'Hugo Boss', '"Hugo Boss" Perfume for Men',
 'A versatile, masculine cologne blending spicy vanilla and fresh-fruity notes for a sensual, classy, and clean everyday scent.',
 'Own the Day with Confidence.',
 '1. Spicy Vanilla-Fruity\n2. Classic & Sensual',
 'Spicy Vanilla-Fruity · Classic & Sensual',
 '5 Hrs +', 0, 'SPIRIT'),

-- 4. Midnight Alpha — For Him
(4, 'Midnight Alpha', 'for-him', 'Ultra Male', '"Jean Paul Gaultier" Perfume for Men',
 'It''s an intensified reinterpretation of the iconic Le Male. This contrasting fragrance, crafted by Francis Kurkdjian, opens with crisp pear and bergamot, unfolds into spicy cinnamon and cumin, and rests on a deep base of vanilla and amber. Presented in the signature dark blue torso bottle, with model Jarrod Scott as its face, it is a bold, seductive statement.',
 'Alpha Energy with pure Seduction',
 '1. Bergamot-Vanilla-Amber\n2. Seductive & Iconic',
 'Bergamot-Vanilla-Amber · Seductive & Iconic',
 '5 Hrs +', 0, 'MIDNIGHT-ALPHA'),

-- 5. Eclipse — For Him — Best Seller
(5, 'Eclipse', 'for-him', 'Sauvage Dior', '"Dior" Perfume for Men',
 'François Demachy ignites a new, untamed warmth within Dior Sauvage. The original''s signature freshness smolders into an oriental blend of star anise, nutmeg, and Papua vanilla. Embodying its mysterious, sensual fire, Johnny Depp returns—a compass point to a deeper, more enigmatic wilderness.',
 'Step Into Power. Step Into Eclips.',
 '1. Bergamot-Pepper\n2. Sensual & Wild',
 'Bergamot-Pepper · Sensual & Wild',
 'Around 4.5 Hrs', 1, 'ECLIPSE'),

-- 6. Bloom — For Her — Best Seller
(6, 'Bloom', 'for-her', 'Miss Dior Blooming Bouquet', '"Miss Dior Blooming Bouquet Dior" Perfume for women',
 'Dior''s Miss Dior Blooming Bouquet heralds spring with a silky, delicate floral accord. Perfumer François Demachy centers the fragrance on peony, sharpened with Sicilian mandarin and rose, resting on a base of white musk. A subtle zest of peach and apricot intensifies its core of soft, timeless elegance.',
 'A Bloom of Pure Femininity',
 '1. Rose-Mandarin-Musk\n2. Soft & Elegant',
 'Rose-Mandarin-Musk · Soft & Elegant',
 '5 Hrs +', 1, 'BLOOM'),

-- 7. Cherish — For Her
(7, 'Cherish', 'for-her', 'Gucci Flora', '"Gucci Flora" Perfume for women',
 'A magical potion, Gucci Flora Gorgeous Gardenia captures the radiant joy of gardenia and jasmine, sparked with pear blossom and kissed by a whisper of brown sugar. An enchanting, concentrated fragrance that turns every day into a spell of pure happiness.',
 'Softness That Speaks Volumes',
 '1. Jasmine-Floral-Sweet\n2. Gorgeous & Classic',
 'Jasmine-Floral-Sweet · Gorgeous & Classic',
 '6 Hrs +', 0, 'CHERISH'),

-- 8. Ember — Luxury Oud — Best Seller
(8, 'Ember', 'luxury-oud', 'Baccarat Rouge 540', '"Baccarat Rouge 540" Perfume for Men & woman',
 'Baccarat Rouge 540 by Maison Francis Kurkdjian is a Oriental Floral fragrance for women and men. Baccarat Rouge 540 was launched in 2015. The nose behind this fragrance is Francis Kurkdjian. Top notes are Saffron and Jasmine; middle notes are Amberwood, Ambergris and Hedione; base notes are Fir Resin, Cedar, Sugar, Ambroxan and Oakmoss.',
 'Where elegance meets obsession.',
 -- NOTE: source spelling "Elegent" preserved verbatim (not corrected to "Elegant") — see data review doc.
 '1. Oriental and Floral\n2. Elegent and Luxury',
 'Oriental and Floral · Elegent and Luxury',
 '8 hrs +', 1, 'EMBER'),

-- 9. Imperial — For Him
(9, 'Imperial', 'for-him', 'Montblanc Legend', 'Perfume for Men',
 'Legend by Montblanc is a Aromatic Fougere fragrance for men. Legend was launched in 2011. Legend was created by Olivier Pescheux and Celine Perdriel. Top notes are Lavender, Pineapple, Bergamot and Lemon Verbena; middle notes are Red Apple, Dried Fruits, oak moss, Geranium, Coumarin and Rose; base notes are Tonka Bean and Sandalwood.',
 'The scent of modern confidence.',
 '1. Woody, Oriental\n2. Masculine and Confident',
 'Woody, Oriental · Masculine and Confident',
 '5-6 Hrs', 0, 'IMPERIAL'),

-- 10. Charm — For Her
(10, 'Charm', 'for-her', 'Good Girl', '"Good Girl" Perfume for Woman',
 'Good Girl by Carolina Herrera is a Oriental Floral fragrance for women. Good Girl was launched in 2016. Good Girl was created by Louise Turner and Quentin Bisch. Top notes are Almond, Coffee, Bergamot and Lemon; middle notes are Tuberose, Jasmine Sambac, Orange Blossom, Bulgarian Rose and Orris; base notes are Tonka Bean, Cacao, Vanilla, Praline, Sandalwood, Musk, Amber, Cashmere Wood, Patchouli, Cinnamon and Cedar.',
 'Sweet by nature. Bold by choice.',
 '1. Oriental and Floral\n2. sweet, seductive, and glamorous',
 'Oriental and Floral · sweet, seductive, and glamorous',
 '5-6 Hrs', 0, 'CHARM'),

-- 11. Drift — For Him
(11, 'Drift', 'for-him', 'Rasasi Hawas', '"Rasasi Hawas" Perfume for Men',
 'Hawas for Him by Rasasi is a Aromatic Aquatic fragrance for men. Hawas for Him was launched in 2015. Top notes are Apple, Bergamot, Lemon and Cinnamon; middle notes are Watery Notes, Plum, Orange Blossom and Cardamon; base notes are Ambergris, Musk, Patchouli and Driftwood.',
 'Fresh power with a seductive edge.',
 '1. Aquatic, lemon, fresh\n2. Casual and Sporty',
 'Aquatic, lemon, fresh · Casual and Sporty',
 '5-6 Hrs', 0, 'DRIFT'),

-- 12. Vampire Blood — Luxury Oud
(12, 'Vampire Blood', 'luxury-oud', 'Vampire Blood', '"Vampire Blood" Perfume for Men & Women',
 -- NOTE: source spelling "Pulm" preserved verbatim (likely meant "Plum") — see data review doc.
 'Fruity, Sweet, Red Berry, Pulm, Fresh, Black.',
 'Blood-red passion, black-night power.',
 '1. Fruity, Sweet, Red Berry, Pulm\n2. Playful with Essence',
 'Fruity, Sweet, Red Berry, Pulm · Playful with Essence',
 '5-6 Hrs', 0, 'VAMPIRE-BLOOD'),

-- 13. SRK Blend — For Him — Best Seller
(13, 'SRK Blend', 'for-him', 'SRK Blend', '"SRK Blend" Perfume for Men',
 'Top Notes: Neroli, Bergamot, Black Pepper, Petitgrain, Middle Notes: Sandalwood, Cardamom, Lavender, Juniper Berries, Sage, Base Notes: Leather, Vetiver, Agarwood (Oud), Musk, Oakmoss.',
 'The scent of a true legend.',
 '1. rich core, Leathery and Oud\n2. Refined masculinity.',
 'rich core, Leathery and Oud · Refined masculinity.',
 '5-6 Hrs', 1, 'SRK-BLEND');

-- ============================================================================
-- Idempotent upsert procedure
-- ============================================================================
DROP PROCEDURE IF EXISTS sp_seed_aurvior_products;

DELIMITER $$

CREATE PROCEDURE sp_seed_aurvior_products()
BEGIN
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_seq             INT;
    DECLARE v_name            VARCHAR(150);
    DECLARE v_category_slug   VARCHAR(120);
    DECLARE v_inspired_by     VARCHAR(150);
    DECLARE v_marketing_title VARCHAR(255);
    DECLARE v_description     TEXT;
    DECLARE v_tagline         VARCHAR(255);
    DECLARE v_keywords        TEXT;
    DECLARE v_note            TEXT;
    DECLARE v_lasting         VARCHAR(100);
    DECLARE v_best_seller     TINYINT(1);
    DECLARE v_sku_prefix      VARCHAR(100);

    DECLARE v_for_him_id      BIGINT;
    DECLARE v_for_her_id      BIGINT;
    DECLARE v_luxury_oud_id   BIGINT;
    DECLARE v_category_id     BIGINT;

    DECLARE v_existing_id          BIGINT;
    DECLARE v_existing_deleted_at  DATETIME(6);
    DECLARE v_product_id           BIGINT;
    DECLARE v_size_id              BIGINT;
    DECLARE v_msg                  VARCHAR(500);

    DECLARE v_placeholder VARCHAR(255) DEFAULT '["/uploads/products/aurvior-product-placeholder.png"]';

    DECLARE cur CURSOR FOR
        SELECT seq, name, category_slug, inspired_by, marketing_title, description,
               tagline, keywords, note, lasting, best_seller, sku_prefix
        FROM tmp_aurvior_seed ORDER BY seq;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    -- ── Preflight: resolve required categories by slug, hard-abort if missing ──
    SELECT id INTO v_for_him_id FROM categories WHERE slug = 'for-him' AND deleted_at IS NULL LIMIT 1;
    SELECT id INTO v_for_her_id FROM categories WHERE slug = 'for-her' AND deleted_at IS NULL LIMIT 1;
    SELECT id INTO v_luxury_oud_id FROM categories WHERE slug = 'luxury-oud' AND deleted_at IS NULL LIMIT 1;

    IF v_for_him_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Required category missing or soft-deleted: "For Him" (slug=for-him). Aborting seed — no products imported.';
    END IF;
    IF v_for_her_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Required category missing or soft-deleted: "For Her" (slug=for-her). Aborting seed — no products imported.';
    END IF;
    IF v_luxury_oud_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Required category missing or soft-deleted: "Luxury Oud" (slug=luxury-oud). Aborting seed — no products imported.';
    END IF;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_seq, v_name, v_category_slug, v_inspired_by, v_marketing_title,
                       v_description, v_tagline, v_keywords, v_note, v_lasting, v_best_seller, v_sku_prefix;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET v_category_id = CASE v_category_slug
            WHEN 'for-him' THEN v_for_him_id
            WHEN 'for-her' THEN v_for_her_id
            WHEN 'luxury-oud' THEN v_luxury_oud_id
        END;

        -- Reset per-iteration lookup variables — MySQL leaves SELECT..INTO
        -- targets unchanged (not NULL) when a query matches zero rows, so
        -- without this reset a "not found" result would silently reuse the
        -- previous product's id from an earlier loop iteration.
        SET v_existing_id = NULL;
        SET v_existing_deleted_at = NULL;

        -- Scoped in its own BEGIN/END with a LOCAL "not found" handler: MySQL
        -- handler scope is per compound-statement, so this local no-op handler
        -- takes precedence over the cursor's outer NOT FOUND handler for this
        -- statement only. Without this, a "no existing product" result (the
        -- normal case for brand-new products) would incorrectly trip the same
        -- handler that drives the cursor loop, setting v_done and truncating
        -- the whole import after its first "new product" row.
        BEGIN
            DECLARE CONTINUE HANDLER FOR NOT FOUND BEGIN END;
            SELECT id, deleted_at INTO v_existing_id, v_existing_deleted_at
            FROM products WHERE name = v_name
            ORDER BY (deleted_at IS NULL) DESC, id ASC
            LIMIT 1;
        END;

        IF v_existing_id IS NOT NULL AND v_existing_deleted_at IS NOT NULL THEN
            SET v_msg = CONCAT('A soft-deleted product already exists named "', v_name, '" (id=', v_existing_id, '). Refusing to silently revive it — review manually, then re-run.');
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
        END IF;

        IF v_existing_id IS NOT NULL THEN
            -- Existing, non-deleted product → update catalogue/marketing fields only.
            UPDATE products SET
                inspired_by     = v_inspired_by,
                marketing_title = v_marketing_title,
                description     = v_description,
                tagline         = v_tagline,
                keywords        = v_keywords,
                note            = v_note,
                lasting         = v_lasting,
                status          = 'ACTIVE',
                combo           = FALSE,
                offer_tag_id    = NULL,
                best_seller     = v_best_seller,
                category_id     = v_category_id,
                updated_at      = NOW(6)
            WHERE id = v_existing_id;
            SET v_product_id = v_existing_id;
        ELSE
            INSERT INTO products
                (created_at, updated_at, deleted_at, name, inspired_by, description, note,
                 marketing_title, tagline, keywords, lasting, combo, best_seller, status, category_id, offer_tag_id)
            VALUES
                (NOW(6), NOW(6), NULL, v_name, v_inspired_by, v_description, v_note,
                 v_marketing_title, v_tagline, v_keywords, v_lasting, FALSE, v_best_seller, 'ACTIVE', v_category_id, NULL);
            SET v_product_id = LAST_INSERT_ID();
        END IF;

        -- ── 15ml size ──
        SET v_size_id = NULL;
        BEGIN
            DECLARE CONTINUE HANDLER FOR NOT FOUND BEGIN END;
            SELECT id INTO v_size_id FROM product_sizes WHERE product_id = v_product_id AND ml = 15 LIMIT 1;
        END;

        IF v_size_id IS NULL THEN
            INSERT INTO product_sizes
                (created_at, updated_at, deleted_at, product_id, ml, price, stock, image_urls, sku, active)
            VALUES
                (NOW(6), NOW(6), NULL, v_product_id, 15, 699.00, 100, CAST(v_placeholder AS JSON),
                 CONCAT(v_sku_prefix, '-15'), TRUE);
        ELSE
            UPDATE product_sizes SET
                price = CASE WHEN @update_prices_on_rerun THEN 699.00 ELSE price END,
                active = TRUE,
                -- Only touch image_urls if it's still empty/NULL/exactly the placeholder —
                -- a real image uploaded via Admin UI is never overwritten.
                image_urls = CASE
                    WHEN image_urls IS NULL OR JSON_LENGTH(image_urls) = 0 OR image_urls = CAST(v_placeholder AS JSON)
                    THEN CAST(v_placeholder AS JSON)
                    ELSE image_urls
                END,
                updated_at = NOW(6)
            WHERE id = v_size_id;
        END IF;

        -- ── 30ml size ── (identical pattern)
        SET v_size_id = NULL;
        BEGIN
            DECLARE CONTINUE HANDLER FOR NOT FOUND BEGIN END;
            SELECT id INTO v_size_id FROM product_sizes WHERE product_id = v_product_id AND ml = 30 LIMIT 1;
        END;

        IF v_size_id IS NULL THEN
            INSERT INTO product_sizes
                (created_at, updated_at, deleted_at, product_id, ml, price, stock, image_urls, sku, active)
            VALUES
                (NOW(6), NOW(6), NULL, v_product_id, 30, 1199.00, 100, CAST(v_placeholder AS JSON),
                 CONCAT(v_sku_prefix, '-30'), TRUE);
        ELSE
            UPDATE product_sizes SET
                price = CASE WHEN @update_prices_on_rerun THEN 1199.00 ELSE price END,
                active = TRUE,
                image_urls = CASE
                    WHEN image_urls IS NULL OR JSON_LENGTH(image_urls) = 0 OR image_urls = CAST(v_placeholder AS JSON)
                    THEN CAST(v_placeholder AS JSON)
                    ELSE image_urls
                END,
                updated_at = NOW(6)
            WHERE id = v_size_id;
        END IF;

    END LOOP;
    CLOSE cur;
END$$

DELIMITER ;

-- ============================================================================
-- Execute — wrapped in a transaction so a mid-run SIGNAL rolls back cleanly
-- ============================================================================
START TRANSACTION;
CALL sp_seed_aurvior_products();
COMMIT;

DROP PROCEDURE IF EXISTS sp_seed_aurvior_products;
DROP TEMPORARY TABLE IF EXISTS tmp_aurvior_seed;

-- ============================================================================
-- POST-IMPORT VERIFICATION — run these and eyeball the results
-- ============================================================================

SELECT 'POST-IMPORT: target product count (expect 13)' AS check_name;
SELECT COUNT(*) AS product_count FROM products
WHERE name IN ('Rebel','Avengers','Spirit','Midnight Alpha','Eclipse','Bloom',
               'Cherish','Ember','Imperial','Charm','Drift','Vampire Blood','SRK Blend')
  AND deleted_at IS NULL;

SELECT 'POST-IMPORT: target size count (expect 26)' AS check_name;
SELECT COUNT(*) AS size_count FROM product_sizes ps
JOIN products p ON p.id = ps.product_id
WHERE p.name IN ('Rebel','Avengers','Spirit','Midnight Alpha','Eclipse','Bloom',
                 'Cherish','Ember','Imperial','Charm','Drift','Vampire Blood','SRK Blend')
  AND p.deleted_at IS NULL AND ps.deleted_at IS NULL;

SELECT 'POST-IMPORT: every target product has exactly 15ml + 30ml (expect 13 rows, both flags = 1)' AS check_name;
SELECT p.name,
       MAX(CASE WHEN ps.ml = 15 THEN 1 ELSE 0 END) AS has_15ml,
       MAX(CASE WHEN ps.ml = 30 THEN 1 ELSE 0 END) AS has_30ml,
       COUNT(*) AS total_sizes
FROM products p
JOIN product_sizes ps ON ps.product_id = p.id AND ps.deleted_at IS NULL
WHERE p.name IN ('Rebel','Avengers','Spirit','Midnight Alpha','Eclipse','Bloom',
                 'Cherish','Ember','Imperial','Charm','Drift','Vampire Blood','SRK Blend')
  AND p.deleted_at IS NULL
GROUP BY p.name;

SELECT 'POST-IMPORT: best-seller flags (expect exactly 6: Rebel, Avengers, Eclipse, Bloom, Ember, SRK Blend)' AS check_name;
SELECT name, best_seller FROM products
WHERE name IN ('Rebel','Avengers','Spirit','Midnight Alpha','Eclipse','Bloom',
               'Cherish','Ember','Imperial','Charm','Drift','Vampire Blood','SRK Blend')
  AND deleted_at IS NULL
ORDER BY best_seller DESC, name;

SELECT 'POST-IMPORT: no duplicate SKUs' AS check_name;
SELECT sku, COUNT(*) AS occurrences FROM product_sizes
WHERE deleted_at IS NULL GROUP BY sku HAVING COUNT(*) > 1;

SELECT 'POST-IMPORT: no duplicate (product_id, ml)' AS check_name;
SELECT product_id, ml, COUNT(*) AS occurrences FROM product_sizes
WHERE deleted_at IS NULL GROUP BY product_id, ml HAVING COUNT(*) > 1;

SELECT 'POST-IMPORT: full readable catalogue view' AS check_name;
SELECT
    p.name             AS product_name,
    c.name             AS category,
    p.inspired_by      AS inspiration,
    p.best_seller      AS best_seller,
    ps.ml              AS ml,
    ps.price           AS price,
    ps.stock           AS stock,
    ps.sku             AS sku,
    ps.image_urls      AS image_urls
FROM products p
JOIN categories c ON c.id = p.category_id
JOIN product_sizes ps ON ps.product_id = p.id AND ps.deleted_at IS NULL
WHERE p.name IN ('Rebel','Avengers','Spirit','Midnight Alpha','Eclipse','Bloom',
                 'Cherish','Ember','Imperial','Charm','Drift','Vampire Blood','SRK Blend')
  AND p.deleted_at IS NULL
ORDER BY p.name, ps.ml;
