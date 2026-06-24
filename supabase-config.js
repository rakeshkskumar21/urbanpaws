const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');
puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(r => setTimeout(r, ms));
const USER_DATA = path.join(require('os').homedir(), '.supabase-puppeteer-profile');

const PROJECT_REF = 'uyawcevbvxlhfbovntxh';
const REDIRECT_URLS = [
  'http://127.0.0.1:5500/**',
  'http://localhost:8000/**',
  'https://urbanpaws.app/**',
];

// SQL to create profiles table + triggers + RLS
const PROFILES_SQL = fs.readFileSync(path.join(__dirname, 'supabase-profiles.sql'), 'utf8');

(async () => {
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
    // ── Step 1: Get logged in ──
    console.log('Checking login state...');
    await page.goto('https://supabase.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(3000);

    if (page.url().includes('sign-in')) {
      console.log('Not logged in — filling credentials...');
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });
      await page.type('input[type="email"]', 'rakeshkskumar21@gmail.com', { delay: 60 });
      await page.type('input[type="password"]', '4957@Supabase', { delay: 60 });
      await page.click('button[type="submit"]');
      console.log('\n⚠️  Solve CAPTCHA in the browser window then wait...\n');
      const deadline = Date.now() + 180000;
      while (Date.now() < deadline) {
        await sleep(2000);
        if (!page.url().includes('sign-in')) { console.log('Logged in!'); break; }
      }
    } else {
      console.log('Already logged in!');
    }

    await sleep(2000);

    // ── Step 2: Extract access token ──
    const accessToken = await page.evaluate(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        try {
          const val = JSON.parse(localStorage.getItem(key));
          if (val && val.access_token) return val.access_token;
          if (val && val.currentSession && val.currentSession.access_token) return val.currentSession.access_token;
          if (val && val.token && val.token.access_token) return val.token.access_token;
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
      console.log('⚠️  No access token found — cannot call Management API.');
    } else {
      console.log('Got access token! (' + accessToken.substring(0, 20) + '...)');
    }

    // ── Step 3: Run profiles SQL via Management API ──
    if (accessToken) {
      console.log('\nRunning supabase-profiles.sql via Management API...');
      const sqlResult = await page.evaluate(async (ref, token, sql) => {
        const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: sql })
        });
        const text = await res.text();
        return { status: res.status, body: text };
      }, PROJECT_REF, accessToken, PROFILES_SQL);

      console.log('SQL result:', sqlResult.status, sqlResult.body.substring(0, 300));
      if (sqlResult.status >= 200 && sqlResult.status < 300) {
        console.log('✅ profiles table created/updated!');
      } else {
        console.log('⚠️  SQL via API failed. Please run supabase-profiles.sql manually in the Supabase SQL Editor.');
        console.log('URL: https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql/new');
      }
    }

    // ── Step 4: Update redirect URLs ──
    if (accessToken) {
      console.log('\nUpdating redirect URLs...');
      const result = await page.evaluate(async (ref, token, urls) => {
        const getRes = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
        });
        if (!getRes.ok) return { error: 'GET failed: ' + getRes.status + ' ' + await getRes.text() };
        const config = await getRes.json();
        const existing = (config.uri_allow_list || '').split(',').map(s => s.trim()).filter(Boolean);
        const toAdd = urls.filter(u => !existing.includes(u));
        if (!toAdd.length) return { ok: true, msg: 'All URLs already present', existing };
        const newList = [...existing, ...toAdd].join(',');
        const patchRes = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
          method: 'PATCH',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ uri_allow_list: newList })
        });
        if (!patchRes.ok) return { error: 'PATCH failed: ' + patchRes.status + ' ' + await patchRes.text() };
        return { ok: true, added: toAdd, newList };
      }, PROJECT_REF, accessToken, REDIRECT_URLS);

      console.log('Auth config result:', JSON.stringify(result, null, 2));
      if (result.ok) console.log('✅ Redirect URLs OK!');
      else console.log('⚠️  Auth config update failed:', result.error);
    }

  } catch (err) {
    console.error('Error:', err.message);
  }

  console.log('\nClosing in 3 seconds...');
  await sleep(3000);
  await browser.close();
})();
