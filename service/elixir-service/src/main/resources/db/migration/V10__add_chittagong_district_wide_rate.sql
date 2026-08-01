-- The pre-existing "Chittagong" delivery area only had an upazila-specific
-- rate (Pahartali, 100.00) with no district-wide (upazila = NULL) fallback —
-- meaning any customer selecting "Chittagong" without also matching that
-- exact upazila would still fail to resolve a charge, the same class of bug
-- V9 fixed for the other 62 districts. Adds the missing district-wide row,
-- matching the already-configured Pahartali rate rather than defaulting to
-- 0.00, since an admin already decided 100.00 was the right rate for this
-- district and a district-wide fallback should not undercut it.
INSERT INTO delivery_areas (created_at, updated_at, deleted_at, district, upazila, charge, active)
VALUES (NOW(6), NOW(6), NULL, 'Chittagong', NULL, 100.00, 1);
