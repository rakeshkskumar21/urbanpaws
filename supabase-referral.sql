-- ============================================================
-- Urban Paws — Referral Tracking
-- Run in Supabase → SQL Editor
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by TEXT;
