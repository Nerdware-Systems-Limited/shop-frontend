/**
 * vite.config.js — vite-react-ssg edition
 *
 * WHAT CHANGED FROM vite-ssg VERSION:
 * ─────────────────────────────────────
 * 1.  The SSG engine is now vite-react-ssg.  No change is needed in this file
 *     for the plugin itself — vite-react-ssg reads the same `ssgOptions` key
 *     and the same `includedRoutes` callback shape as vite-ssg did.
 *
 * 2.  Everything else (sitemap plugin, robots.txt, fetch helpers, chunk
 *     splitting, resolve aliases) is unchanged.
 *
 * PACKAGE CHANGE IN package.json (not this file):
 *   - Remove:  "vite-ssg": "..."
 *   + Add:     "vite-react-ssg": "..."
 *
 * INSTALL:
 *   npm remove vite-ssg && npm install vite-react-ssg
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';

const API_URL  = process.env.VITE_API_URL  || 'https://shop.nerdwaretechnologies.com/api';
const SITE_URL = process.env.VITE_SITE_URL || 'https://www.soundwaveaudio.co.ke';

// ============================================================================
// FETCH HELPERS (unchanged)
// ============================================================================

async function fetchWithRetry(url, retries = 3, timeout = 10000) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json', 'User-Agent': 'Vite-Sitemap-Generator' },
      });
      clearTimeout(tid);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.warn(`Attempt ${i + 1}/${retries} failed for ${url}:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * 2 ** i));
    }
  }
}

async function fetchAllPages(endpoint, maxPages = 10) {
  const items = [];
  let nextUrl = `${API_URL}${endpoint}`;
  let page = 0;
  while (nextUrl && page < maxPages) {
    try {
      const data = await fetchWithRetry(nextUrl);
      if (Array.isArray(data.results)) items.push(...data.results);
      nextUrl = data.next;
      page++;
      console.log(`  ✓ page ${page} (${items.length} items)`);
    } catch (e) {
      console.error(`  ✗ page ${page + 1}:`, e.message);
      break;
    }
  }
  return items;
}

// ============================================================================
// SITEMAP / ROBOTS
// ============================================================================

const escapeXml = s =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function generateSitemapXML(routes) {
  const now = new Date().toISOString();
  const urls = routes.map(r => `  <url>
    <loc>${escapeXml(SITE_URL)}${escapeXml(r.url)}</loc>
    <lastmod>${r.lastmod || now}</lastmod>
    <changefreq>${r.changefreq || 'weekly'}</changefreq>
    <priority>${r.priority || 0.7}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api
Disallow: /api/*
Disallow: /*.json
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /myorders
Disallow: /order/*

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml`;
}

async function generateAllRoutes() {
  console.log('\n🗺️  Generating sitemap routes...');
  const now    = new Date().toISOString();
  const routes = [];

  routes.push(
    { url: '/',                changefreq: 'daily',   priority: 1.0,  lastmod: now },
    { url: '/products',        changefreq: 'daily',   priority: 0.9,  lastmod: now },
    { url: '/installations',   changefreq: 'weekly',  priority: 0.85, lastmod: now },
    { url: '/about',           changefreq: 'monthly', priority: 0.8,  lastmod: now },
    { url: '/contact',         changefreq: 'monthly', priority: 0.8,  lastmod: now },
    { url: '/terms',           changefreq: 'yearly',  priority: 0.5,  lastmod: now },
    { url: '/privacy',         changefreq: 'yearly',  priority: 0.5,  lastmod: now },
    { url: '/shipping-policy', changefreq: 'monthly', priority: 0.6,  lastmod: now },
    { url: '/returns',         changefreq: 'monthly', priority: 0.6,  lastmod: now },
  );

  try {
    console.log('📦 Fetching products...');
    const products = await fetchAllPages('/products/?page_size=20').catch(() => []);
    products.forEach(p => {
      if (!p.slug) return;
      const d = new Date(p.updated_at || p.created_at);
      routes.push({
        url: `/product/${p.slug}`,
        changefreq: 'weekly',
        priority: p.is_featured ? 0.9 : 0.8,
        lastmod: isNaN(d) ? now : d.toISOString(),
      });
    });
    console.log(`✅ ${products.length} product routes`);

    console.log('📂 Fetching categories...');
    const categories = await fetchAllPages('/categories/').catch(() => []);
    categories.forEach(c => {
      if (c.slug) routes.push({ url: `/products/${c.slug}`, changefreq: 'daily', priority: 0.85, lastmod: now });
    });
    console.log(`✅ ${categories.length} category routes`);

    console.log('🏷️  Fetching brands...');
    const brands = await fetchAllPages('/brands/').catch(() => []);
    brands.forEach(b => {
      if (b.slug) routes.push({ url: `/products/brand/${b.slug}`, changefreq: 'weekly', priority: 0.8, lastmod: now });
    });
    console.log(`✅ ${brands.length} brand routes`);

    console.log('🔧 Fetching installations...');
    const jobs = await fetchAllPages('/installations/jobs/?page_size=1000').catch(() => []);
    jobs.forEach(j => {
      if (!j.slug) return;
      const d = new Date(j.updated_at || j.job_date);
      routes.push({
        url: `/installations/${j.slug}`,
        changefreq: 'monthly',
        priority: j.is_featured ? 0.85 : 0.75,
        lastmod: isNaN(d) ? now : d.toISOString(),
      });
    });
    console.log(`✅ ${jobs.length} installation routes`);
  } catch (e) {
    console.error('❌ Unexpected error:', e);
  }

  console.log(`\n📊 Total sitemap URLs: ${routes.length}\n`);
  return routes;
}

// ============================================================================
// CUSTOM SITEMAP PLUGIN
// ============================================================================

function customSitemapPlugin() {
  let config;
  let routes = [];

  return {
    name: 'custom-sitemap-plugin',
    configResolved(c) { config = c; },
    async buildStart() {
      if (config.command === 'build') routes = await generateAllRoutes();
    },
    async closeBundle() {
      if (config.command !== 'build') return;
      const outDir = config.build.outDir || 'dist';
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), generateSitemapXML(routes));
      console.log(`✅ sitemap.xml written (${routes.length} URLs)`);
      fs.writeFileSync(path.join(outDir, 'robots.txt'), generateRobotsTxt());
      console.log('✅ robots.txt written');
    },
  };
}

// ============================================================================
// VITE CONFIG
// ============================================================================

export default defineConfig({
  plugins: [
    react({
      exclude: /\.stories\.(t|j)sx?$/,
      include: '**/*.{jsx,tsx}',
    }),
    tailwindcss(),
    customSitemapPlugin(),
  ],

  // vite-react-ssg reads this key to know which pages to pre-render.
  // Identical shape to the vite-ssg `ssgOptions` — no changes needed here.
  ssgOptions: {
    script: 'async',            // defer hydration script for performance
    formatting: 'minify',       // minify the generated HTML
    includedRoutes: async (paths, routes) => {
      const staticPaths = [
        '/',
        '/products',
        '/about',
        '/contact',
        '/installations',
        '/terms',
        '/privacy',
        '/shipping-policy',
        '/returns',
      ];

      try {
        const products = await fetchAllPages('/products/?page_size=20').catch(() => []);
        products.forEach(p => { if (p.slug) staticPaths.push(`/product/${p.slug}`); });

        const categories = await fetchAllPages('/categories/').catch(() => []);
        categories.forEach(c => { if (c.slug) staticPaths.push(`/products/${c.slug}`); });

        const brands = await fetchAllPages('/brands/').catch(() => []);
        brands.forEach(b => { if (b.slug) staticPaths.push(`/products/brand/${b.slug}`); });
      } catch (_) { /* fallback to static-only */ }

      return staticPaths;
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react':     path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
  },

  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react-router-dom',
      'react-redux', '@reduxjs/toolkit',
      'react-helmet-async',
      'react-hook-form', '@hookform/resolvers', 'zod',
      'framer-motion', 'lucide-react', 'axios',
      'clsx', 'tailwind-merge', 'class-variance-authority',
    ],
    esbuildOptions: { target: 'es2020' },
  },

  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (/node_modules\/(react|react-dom|scheduler|react-router(?:-dom)?)\//.test(id))
            return 'vendor-react';
          if (/node_modules\/(redux|react-redux|@reduxjs\/toolkit|immer|redux-thunk)\//.test(id))
            return 'vendor-redux';
          if (id.includes('node_modules/react-helmet-async/'))
            return 'vendor-react';
          if (id.includes('node_modules/lucide-react/'))
            return 'vendor-ui-icons';
          if (id.includes('node_modules/@radix-ui/'))
            return 'vendor-ui-radix';
          if (/node_modules\/(react-hook-form|@hookform|zod)\//.test(id))
            return 'vendor-forms';
          if (id.includes('node_modules/framer-motion/'))
            return 'vendor-animation';
          if (id.includes('node_modules/axios/'))
            return 'vendor-api';
          if (/node_modules\/(clsx|tailwind-merge|class-variance-authority)\//.test(id))
            return 'vendor-utils';
          if (id.includes('node_modules/vaul/'))
            return 'vendor-vaul';
        },
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
        assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 600,
    commonjsOptions: { transformMixedEsModules: true },
  },

  server:  { port: 5173, strictPort: false },
  preview: { port: 4173, strictPort: false },
});