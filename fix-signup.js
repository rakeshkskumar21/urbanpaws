const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(r => setTimeout(r, ms));
const USER_DATA = path.join(require('os').homedir(), '.supabase-puppeteer-profile');
const PROJECT_REF = 'uyawcevbvxlhfbovntxh';

const FIX_SQL = `
-- Drop ALL triggers on auth.users
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT trigger_name
    FROM information_schema.triggers
    WHERE event_object_schema = 'auth' AND event_object_table = 'users'
  LOOP
    EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || ' ON auth.users';
    RAISE NOTICE 'Dropped trigger: %', r.trigger_name;
  END LOOP;
END $$;

-- Drop all functions that reference profiles insert (old triggers)
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Ensure profiles table exists with correct schema
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  phone       TEXT,
  address     TEXT,
  plan        TEXT DEFAULT 'starter',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_delete" ON profiles;

CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
`;

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: USER_DATA,
    protocolTimeout: 120000,
    args: ['--start-maximized', '--no-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    console.log('Going to Supabase dashboard...');
    await page.goto('https://supabase.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(4000);

    if (page.url().includes('sign-in')) {
      console.log('Logging in...');
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });
      await page.type('input[type="email"]', 'rakeshkskumar21@gmail.com', { delay: 60 });
      await page.type('input[type="password"]', '4957@Supabase', { delay: 60 });
      await page.click('button[type="submit"]');
      console.log('⚠️  Solve CAPTCHA if shown, then wait...');
      const deadline = Date.now() + 180000;
      while (Date.now() < deadline) {
        await sleep(2000);
        if (!page.url().includes('sign-in')) { console.log('Logged in!'); break; }
      }
    } else {
      console.log('Already logged in!');
    }

    await sleep(3000);

    // Get access token
    const accessToken = await page.evaluate(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        try {
          const val = JSON.parse(localStorage.getItem(key));
          if (val && val.access_token) return val.access_token;
          if (val && val.currentSession && val.currentSession.access_token) return val.currentSession.access_token;
        } catch(e) {}
      }
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (!key) continue;
        try {
          const val = JSON.parse(sessionStorage.getItem(key));
          if (val && val.access_token) return val.access_token;
        } catch(e) {}
      }
      return null;
    });

    if (!accessToken) {
      console.error('❌ Could not get access token.');
      await browser.close();
      process.exit(1);
    }
    console.log('Got access token!');

    // Step 1: Run SQL to drop all triggers
    console.log('\n1. Dropping all auth.users triggers and fixing profiles table...');
    const sqlResult = await page.evaluate(async (ref, token, sql) => {
      const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sql })
      });
      return { status: res.status, body: await res.text() };
    }, PROJECT_REF, accessToken, FIX_SQL);

    console.log('SQL status:', sqlResult.status);
    if (sqlResult.status >= 200 && sqlResult.status < 300) {
      console.log('✅ SQL fix applied — all triggers dropped!');
    } else {
      console.log('⚠️  SQL response:', sqlResult.body.substring(0, 500));
    }

    // Step 2: Disable email confirmation
    console.log('\n2. Disabling email confirmation requirement...');
    const authResult = await page.evaluate(async (ref, token) => {
      const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
        method: 'PATCH',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mailer_autoconfirm: true,
          enable_signup: true
        })
      });
      return { status: res.status, body: await res.text() };
    }, PROJECT_REF, accessToken);

    console.log('Auth config status:', authResult.status);
    if (authResult.status >= 200 && authResult.status < 300) {
      console.log('✅ Email confirmation disabled — signups are now auto-confirmed!');
    } else {
      console.log('⚠️  Auth config response:', authResult.body.substring(0, 500));
    }

    // Step 3: Check remaining triggers
    console.log('\n3. Checking remaining triggers on auth.users...');
    const checkResult = await page.evaluate(async (ref, token) => {
      const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `SELECT trigger_name FROM information_schema.triggers WHERE event_object_schema = 'auth' AND event_object_table = 'users'` })
      });
      return { status: res.status, body: await res.text() };
    }, PROJECT_REF, accessToken);

    console.log('Remaining triggers:', checkResult.body);

  } catch (err) {
    console.error('Error:', err.message);
  }

  console.log('\nClosing in 3 seconds...');
  await sleep(3000);
  await browser.close();
})();
