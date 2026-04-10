// scripts/prerender.mjs
import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../dist');
const SITE_URL = process.env.VITE_SITE_URL || 'https://soundwaveaudio.co.ke';
const API_URL = process.env.VITE_API_URL || 'https://shop.nerdwaretechnologies.com/api';

// ── Fetch your routes from the API (mirrors your vite.config logic) ──────────
async function fetchRoutes() {
  const routes = [
    '/',
    '/products',
    '/installations',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/shipping-policy',
    '/returns',
  ];

  const endpoints = [
    { path: '/products/?page_size=1000', urlPrefix: '/product/', slugKey: 'slug' },
    { path: '/categories/',              urlPrefix: '/products/',         slugKey: 'slug' },
    { path: '/brands/',                  urlPrefix: '/products/brand/',   slugKey: 'slug' },
    { path: '/installations/jobs/?page_size=1000', urlPrefix: '/installations/', slugKey: 'slug' },
  ];

  for (const endpoint of endpoints) {
    try {
      let nextUrl = `${API_URL}${endpoint.path}`;
      while (nextUrl) {
        const res = await fetch(nextUrl, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'Prerender-Script' }
        });
        if (!res.ok) break;
        const data = await res.json();
        (data.results || []).forEach(item => {
          if (item[endpoint.slugKey]) {
            routes.push(`${endpoint.urlPrefix}${item[endpoint.slugKey]}`);
          }
        });
        nextUrl = data.next || null;
      }
      console.log(`✅ Fetched ${endpoint.path}`);
    } catch (e) {
      console.warn(`⚠️  Skipped ${endpoint.path}: ${e.message}`);
    }
  }

  return routes;
}

// ── Serve the dist folder locally then crawl with Puppeteer ──────────────────
async function prerender() {
  console.log('\n🚀 Starting prerender...\n');

  // Spin up Vite preview server pointing at dist/
  const server = await createServer({
    root: DIST_DIR,
    server: { port: 3333 },
    appType: 'spa',
  });
  await server.listen();
  console.log('🌐 Preview server running on http://localhost:3333\n');

  const routes = await fetchRoutes();
  console.log(`\n📋 Rendering ${routes.length} routes...\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let success = 0;
  let failed = 0;

  for (const route of routes) {
    const outputPath = path.join(
      DIST_DIR,
      route === '/' ? 'index.html' : `${route}/index.html`
    );

    try {
      // Ensure directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      const page = await browser.newPage();
      
      // Block unnecessary requests to speed up rendering
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'font', 'media'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(`http://localhost:3333${route}`, {
        waitUntil: 'networkidle0',  // wait for API calls to finish
        timeout: 30000,
      });

      // Wait for h1 to appear (confirms React rendered)
      await page.waitForSelector('h1', { timeout: 10000 }).catch(() => {
        console.warn(`  ⚠️  No <h1> found on ${route}`);
      });

      const html = await page.content();
      fs.writeFileSync(outputPath, html);
      await page.close();

      console.log(`  ✓ ${route}`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${route}: ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  await server.close();

  console.log(`\n📊 Done: ${success} succeeded, ${failed} failed\n`);
}

prerender().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});