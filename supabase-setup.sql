-- ============================================================
-- Urban Paws — Supabase Setup
-- Paste this entire file into Supabase → SQL Editor → Run
-- ============================================================

-- 1. Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id             BIGSERIAL PRIMARY KEY,
  booking_id     TEXT UNIQUE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  service        TEXT,
  pet_name       TEXT,
  breed          TEXT,
  pet_age        TEXT,
  gender         TEXT,
  address        TEXT,
  booking_date   TEXT,
  time_slot      TEXT,
  phone          TEXT,
  email          TEXT,
  payment        TEXT,
  instructions   TEXT,
  allergies      TEXT,
  limping        TEXT,
  recent_surgery TEXT,
  eating_habits  TEXT,
  vaccinated     TEXT,
  temperament    TEXT,
  other_issues   TEXT,
  status         TEXT DEFAULT 'pending'
);

-- 2. Auto-generate booking_id trigger (e.g. WK10001, GR10002)
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TRIGGER AS $$
DECLARE
  code TEXT := 'UP';
BEGIN
  IF    NEW.service ILIKE '%walk%'                          THEN code := 'WK';
  ELSIF NEW.service ILIKE '%food%' OR
        NEW.service ILIKE '%feed%'                          THEN code := 'FD';
  ELSIF NEW.service ILIKE '%groom%'                         THEN code := 'GR';
  ELSIF NEW.service ILIKE '%board%'                         THEN code := 'BD';
  ELSIF NEW.service ILIKE '%vacc%'                          THEN code := 'VC';
  ELSIF NEW.service ILIKE '%taxi%'                          THEN code := 'PT';
  END IF;
  NEW.booking_id := code || (NEW.id + 10000)::TEXT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_booking_id ON bookings;
CREATE TRIGGER set_booking_id
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_booking_id();

-- 3. Disable RLS for Phase 1 (Phase 2 adds proper auth + RLS policies)
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
