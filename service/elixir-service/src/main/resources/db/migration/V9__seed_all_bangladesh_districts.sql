-- Seeds the remaining 62 of Bangladesh's 64 districts as district-wide
-- delivery areas (upazila = NULL) at a default charge of 0.00 — the
-- previously-missing districts were the root cause of checkout being
-- blocked for any customer outside Dhaka/Chittagong. Admin can set real
-- per-district rates afterward via Admin > Delivery Areas.
--
-- Dhaka and Chittagong already exist (from earlier manual entry) and are
-- intentionally NOT re-inserted here. "Chittagong" (not "Chattogram") and
-- "Cumilla" (not "Comilla") are used to match/avoid duplicating existing
-- naming conventions for the same places.

INSERT INTO delivery_areas (created_at, updated_at, deleted_at, district, upazila, charge, active) VALUES
-- Dhaka Division
(NOW(6), NOW(6), NULL, 'Gazipur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Kishorganj', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Manikganj', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Munshiganj', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Narayanganj', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Narsingdi', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Faridpur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Gopalganj', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Madaripur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Rajbari', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Shariatpur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Tangail', NULL, 0.00, 1),

-- Chattogram (Chittagong) Division
(NOW(6), NOW(6), NULL, 'Bandarban', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Brahmanbaria', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Chandpur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Cox''s Bazar', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Cumilla', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Feni', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Khagrachhari', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Lakshmipur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Noakhali', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Rangamati', NULL, 0.00, 1),

-- Rajshahi Division
(NOW(6), NOW(6), NULL, 'Bogura', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Joypurhat', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Naogaon', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Natore', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Chapainawabganj', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Pabna', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Rajshahi', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Sirajganj', NULL, 0.00, 1),

-- Khulna Division
(NOW(6), NOW(6), NULL, 'Bagerhat', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Chuadanga', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Jashore', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Jhenaidah', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Khulna', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Kushtia', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Magura', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Meherpur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Narail', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Satkhira', NULL, 0.00, 1),

-- Rangpur Division
(NOW(6), NOW(6), NULL, 'Dinajpur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Gaibandha', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Kurigram', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Lalmonirhat', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Nilphamari', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Panchagarh', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Rangpur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Thakurgaon', NULL, 0.00, 1),

-- Barishal Division
(NOW(6), NOW(6), NULL, 'Barguna', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Barishal', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Bhola', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Jhalokati', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Patuakhali', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Pirojpur', NULL, 0.00, 1),

-- Sylhet Division
(NOW(6), NOW(6), NULL, 'Habiganj', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Moulvibazar', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Sunamganj', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Sylhet', NULL, 0.00, 1),

-- Mymensingh Division
(NOW(6), NOW(6), NULL, 'Jamalpur', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Mymensingh', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Netrokona', NULL, 0.00, 1),
(NOW(6), NOW(6), NULL, 'Sherpur', NULL, 0.00, 1);
