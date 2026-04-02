import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.resolve(__dirname, '../dist/sitemap.xml');

const SITE_URL = 'top-telegram-links.web.app';
const KEY = 'a7f9b8c6e5d4a1b2c3d4e5f6a7b8c9d0';

const INDEXNOW_URL = 'https://api.indexnow.org/indexnow';

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

async function run() {
  const urlList = extractUrlsFromSitemap();
  console.log(`Found ${urlList.length} URLs in sitemap. Sending to IndexNow...`);

  const payload = {
    host: SITE_URL,
    key: KEY,
    keyLocation: `https://${SITE_URL}/${KEY}.txt`,
    urlList: urlList
  };

  try {
    const res = await fetch(INDEXNOW_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('✅ IndexNow Notification Successful!');
      console.log('Response Status:', res.status);
    } else {
      console.error('❌ IndexNow Error:', res.status, res.statusText);
      const text = await res.text();
      console.error('Details:', text);
    }
  } catch (err) {
    console.error('Failed to notify IndexNow:', err);
  }
}

run();
