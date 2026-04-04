import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The service account JSON file from Google Cloud
const keyFile = path.resolve(__dirname, '../top-telegram-links-0ff5b28cd97a.json');
const sitemapPath = path.resolve(__dirname, '../dist/sitemap.xml');

async function extractUrlsFromSitemap() {
  if (!fs.existsSync(sitemapPath)) {
    console.error('sitemap.xml not found. Please build the project first.');
    process.exit(1);
  }

  const content = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [];
  // Basic Regex to extract <loc> contents
  const matches = content.matchAll(/<loc>(.*?)<\/loc>/g);
  for (const match of matches) {
    if (match[1]) urls.push(match[1]);
  }
  return urls;
}

async function run() {
  if (!fs.existsSync(keyFile)) {
    console.error(`Service account key file not found: ${keyFile}`);
    process.exit(1);
  }

  const urls = await extractUrlsFromSitemap();
  console.log(`\n📋 Found ${urls.length} URLs in sitemap.`);

  if (urls.length === 0) {
    console.log('No URLs to submit.');
    return;
  }

  // Set up authentication using the service account key
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFile,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  console.log('Authenticating with Google Indexing API...');
  let authClient;
  try {
    authClient = await auth.getClient();
  } catch (err) {
    console.error('Authentication failed:', err.message);
    process.exit(1);
  }

  const indexing = google.indexing({ version: 'v3', auth: authClient });

  console.log(`🚀 Submitting ${urls.length} URLs to Google Indexing API...\n`);

  // Google Indexing API allows up to 100 requests per batch, or 200 per day by default.
  // We submit them sequentially to avoid rate limiting or handle it properly.
  let successCount = 0;
  for (const url of urls) {
    try {
      const response = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        }
      });
      console.log(`  ✅ Google API (URL_UPDATED) — ${url} — OK`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ Google API Error for ${url}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Google Indexing submission complete. (${successCount} successful)`);
}

run();
