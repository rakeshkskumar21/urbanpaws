-- ============================================================
-- Urban Paws — Structured address fields on profiles
-- Run in Supabase → SQL Editor
--
-- The address used to be a single free-text column. It is now captured as
-- five mandatory parts. The original `address` column is kept and still
-- written with the composed one-line address, because invoices, the sheet
-- export and the admin/executive views read it.
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS flat_no TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS street  TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS area    TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city    TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pincode TEXT;

-- Backfill: best-effort split of existing single-line addresses.
-- Mirrors addrFromLegacy() in my-bookings.html — trailing 6-digit pincode,
-- then first comma-part as flat, last as city, second as street, rest as area.
-- Only touches rows that have not been split yet.
UPDATE profiles
SET
  pincode = COALESCE(pincode, NULLIF((regexp_match(address, '(\d{6})\s*$'))[1], '')),
  flat_no = COALESCE(flat_no, NULLIF(btrim(split_part(address, ',', 1)), '')),
  street  = COALESCE(street,  NULLIF(btrim(split_part(address, ',', 2)), '')),
  area    = COALESCE(area,    NULLIF(btrim(split_part(address, ',', 3)), '')),
  city    = COALESCE(city,    NULLIF(btrim(regexp_replace(
              split_part(address, ',', 4), '[\s,–-]*\d{6}\s*$', '')), ''))
WHERE address IS NOT NULL
  AND btrim(address) <> ''
  AND flat_no IS NULL AND street IS NULL AND area IS NULL
  AND city IS NULL AND pincode IS NULL;

-- Check what the backfill produced before relying on it:
--   SELECT address, flat_no, street, area, city, pincode FROM profiles
--   WHERE address IS NOT NULL LIMIT 20;
