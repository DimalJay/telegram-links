import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

const API_BASE_URL = 'https://telegram-links-backend-three.vercel.app';
const SITE_URL = 'https://top-telegram-links.web.app';

async function fetchAll(type) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/${type}s?limit=1000`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch (err) {
    console.error(`Failed to fetch ${type}s:`, err);
    return [];
  }
}

function generateMetaTags(item) {
  const title = `${item.name} - Join Telegram ${item.type === 'channel' ? 'Channel' : 'Group'}`;
  const description = item.description || `Join ${item.name} Telegram ${item.type}.`;
  const url = `${SITE_URL}/${item.type}/${item.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": item.name,
    "url": url,
    "description": description,
    "logo": item.logoUrl ? `${API_BASE_URL}${item.logoUrl}` : undefined
  };

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `;
}

async function run() {
  if (!fs.existsSync(indexPath)) {
    console.error('Error: dist/index.html not found. Build the app first.');
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(indexPath, 'utf-8');
  
  const groups = await fetchAll('group');
  const channels = await fetchAll('channel');
  
  const allItems = [...groups.map(g => ({...g, type: 'group'})), ...channels.map(c => ({...c, type: 'channel'}))];
  
  let sitemapLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${SITE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `  <url><loc>${SITE_URL}/groups</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    `  <url><loc>${SITE_URL}/channels</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    `  <url><loc>${SITE_URL}/faq</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
  ];

  let rssLines = [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `  <title>Top Telegram Links</title>`,
    `  <link>${SITE_URL}</link>`,
    `  <description>Newest Telegram channels and groups</description>`,
    `  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>`
  ];

  for (const item of allItems) {
    const dir = path.join(distPath, item.type, item.id);
    fs.mkdirSync(dir, { recursive: true });
    
    const preloadedStateString = JSON.stringify(item).replace(/</g, '\\u003c');
    
    // Replace meta tags block loosely and append INITIAL DATA script inside <head>
    const injectedHeadHTML = `
      ${generateMetaTags(item)}
      <script>window.__PRELOADED_STATE__ = ${preloadedStateString};</script>
    `;
    
    // Very rudimentary insertion: place before </head>
    let newHtml = indexHtml.replace('</head>', `${injectedHeadHTML}</head>`);
    
    fs.writeFileSync(path.join(dir, 'index.html'), newHtml, 'utf-8');
    
    console.log(`Generated HTML for ${item.type}: ${item.name} (${item.id})`);

    // Add to sitemap
    sitemapLines.push(`  <url><loc>${SITE_URL}/${item.type}/${item.id}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
    
    // Add to RSS
    rssLines.push(
      '  <item>',
      `    <title><![CDATA[${item.name}]]></title>`,
      `    <link>${SITE_URL}/${item.type}/${item.id}</link>`,
      `    <description><![CDATA[${item.description || item.name}]]></description>`,
      `    <pubDate>${new Date(item.createdAt || Date.now()).toUTCString()}</pubDate>`,
      `    <guid>${SITE_URL}/${item.type}/${item.id}</guid>`,
      '  </item>'
    );
  }

  // Pre-render /faq page
  {
    const faqTitle = 'Telegram FAQ – Groups, Channels, Bots & Safety Questions Answered';
    const faqDesc = 'Find answers to the most frequently asked questions about Telegram: how to join groups and channels, what bots do, Telegram vs WhatsApp, and more.';
    const faqUrl = `${SITE_URL}/faq`;
    const faqMeta = `
    <title>${faqTitle}</title>
    <meta name="description" content="${faqDesc}" />
    <meta property="og:title" content="${faqTitle}" />
    <meta property="og:description" content="${faqDesc}" />
    <meta property="og:url" content="${faqUrl}" />
    <meta name="twitter:title" content="${faqTitle}" />
    <meta name="twitter:description" content="${faqDesc}" />
    <link rel="canonical" href="${faqUrl}" />
  `;
    const faqDir = path.join(distPath, 'faq');
    fs.mkdirSync(faqDir, { recursive: true });
    const faqHtml = indexHtml.replace('</head>', `${faqMeta}</head>`);
    fs.writeFileSync(path.join(faqDir, 'index.html'), faqHtml, 'utf-8');
    console.log('Generated HTML for /faq page');
  }

  sitemapLines.push('</urlset>');
  rssLines.push('</channel>', '</rss>');
  
  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapLines.join('\n'), 'utf-8');
  fs.writeFileSync(path.join(distPath, 'rss.xml'), rssLines.join('\n'), 'utf-8');
  console.log(`\nSuccessfully generated sitemap with ${allItems.length + 3} URLs`);
  console.log(`Successfully generated RSS feed with ${allItems.length} items`);
}

run();
