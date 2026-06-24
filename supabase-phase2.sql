-- ============================================================
-- Urban Paws — Supabase Phase 2 Setup
-- Paste this in Supabase → SQL Editor → Run
-- ============================================================

-- 1. Add user_id to link bookings to auth users
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id UUID;

-- 2. Enable Realtime so customers get live status updates (skip if already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
  END IF;
END $$;

-- 3. RLS policies for customer access
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='bookings' AND policyname='Anyone can insert bookings') THEN
    CREATE POLICY "Anyone can insert bookings" ON bookings FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='bookings' AND policyname='Customers can read own bookings') THEN
    CREATE POLICY "Customers can read own bookings" ON bookings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='bookings' AND policyname='Anyone can update bookings') THEN
    CREATE POLICY "Anyone can update bookings" ON bookings FOR UPDATE USING (true);
  END IF;
END $$;
