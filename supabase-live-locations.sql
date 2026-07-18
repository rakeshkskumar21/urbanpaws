-- ============================================================
-- Urban Paws — Live GPS Location Tracking
-- Run in Supabase → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS live_locations (
  id           BIGSERIAL PRIMARY KEY,
  booking_id   TEXT NOT NULL,
  role         TEXT NOT NULL,   -- 'executive' or 'customer'
  user_email   TEXT,
  lat          DOUBLE PRECISION NOT NULL,
  lng          DOUBLE PRECISION NOT NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_live_locations_booking_role
  ON live_locations (booking_id, role, updated_at DESC);

-- RLS: open policies matching the rest of this app (client uses the public/publishable key only)
ALTER TABLE live_locations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='live_locations' AND policyname='Anyone can insert live_locations') THEN
    CREATE POLICY "Anyone can insert live_locations" ON live_locations FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='live_locations' AND policyname='Anyone can read live_locations') THEN
    CREATE POLICY "Anyone can read live_locations" ON live_locations FOR SELECT USING (true);
  END IF;
END $$;

-- Optional: auto-clean old location pings older than 24h (keeps the table small)
-- Run this manually or on a schedule if the table grows large:
-- DELETE FROM live_locations WHERE updated_at < now() - interval '24 hours';
