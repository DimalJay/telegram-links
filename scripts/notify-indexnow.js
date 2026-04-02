import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.resolve(__dirname, '../dist/sitemap.xml');

const SITE_URL = 'top-telegram-links.web.app';
const KEY = 'a7f9b8c6e5d4a1b2c3d4e5f6a7b8c9d0';

/**
 * All search engines that natively support the IndexNow protocol.
 * Per the spec, engines share submitted URLs with each other —
 * but submitting to every endpoint is belt-and-suspenders insurance.
 *
 * Google does NOT support IndexNow; use Google Search Console / Indexing API instead.
 */
const INDEXNOW_ENDPOINTS = [
  { name: 'IndexNow (shared relay)', url: 'https://api.indexnow.org/indexnow' },
  { name: 'Bing',                    url: 'https://www.bing.com/indexnow' },
  { name: 'Yandex',                  url: 'https://yandex.com/indexnow' },
  { name: 'Seznam.cz',               url: 'https://search.seznam.cz/indexnow' },
  { name: 'Naver',                   url: 'https://searchadvisor.naver.com/indexnow' },
  { name: 'Yep',                     url: 'https://indexnow.yep.com/indexnow' },
];

function extractUrlsFromSitemap() {
  if (!fs.existsSync(sitemapPath)) {
    console.error('sitemap.xml not found. Please build the project first.');
    process.exit(1);
  }

  const content = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [];
  const matches = content.matchAll(/<loc>(.*?)<\/loc>/g);
  for (const match of matches) {
    if (match[1]) urls.push(match[1]);
  }
  return urls;
}

async function notifyEngine({ name, url }, payload) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`  ✅ ${name} — ${res.status} OK`);
    } else {
      const text = await res.text().catch(() => '');
      console.warn(`  ⚠️  ${name} — ${res.status} ${res.statusText}${text ? ': ' + text : ''}`);
    }
  } catch (err) {
    console.error(`  ❌ ${name} — ${err.message}`);
  }
}

async function run() {
  const urlList = extractUrlsFromSitemap();
  console.log(`\n📋 Found ${urlList.length} URLs in sitemap.`);
  console.log(`🚀 Submitting to ${INDEXNOW_ENDPOINTS.length} IndexNow search engines...\n`);

  const payload = {
    host: SITE_URL,
    key: KEY,
    keyLocation: `https://${SITE_URL}/${KEY}.txt`,
    urlList,
  };

  // Submit to all engines in parallel for speed.
  await Promise.all(INDEXNOW_ENDPOINTS.map((engine) => notifyEngine(engine, payload)));

  console.log('\n🎉 IndexNow submission complete.');
  console.log('ℹ️  Note: engines share URLs with each other per the IndexNow protocol.');
  console.log('💡 Google Search Console must be notified separately (no IndexNow support).');
}

run();

