import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_URL = process.env.VITE_API_URL || 'https://shop.nerdwaretechnologies.com/api';
const SITE_URL = process.env.VITE_SITE_URL || 'https://soundwaveaudio.co.ke';

// ============================================================================
// FETCH HELPERS
// ============================================================================

async function fetchWithRetry(url, retries = 3, timeout = 10000) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vite-Sitemap-Generator'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn(`Attempt ${i + 1}/${retries} failed for ${url}:`, error.message);
      
      if (i === retries - 1) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}

async function fetchAllPages(endpoint, maxPages = 10) {
  const items = [];
  let nextUrl = `${API_URL}${endpoint}`;
  let pageCount = 0;
  
  while (nextUrl && pageCount < maxPages) {
    try {
      const data = await fetchWithRetry(nextUrl);
      
      if (data.results && Array.isArray(data.results)) {
        items.push(...data.results);
      }
      
      nextUrl = data.next;
      pageCount++;
      
      console.log(`  ✓ Fetched page ${pageCount} (${items.length} items total)`);
    } catch (error) {
      console.error(`  ✗ Failed to fetch page ${pageCount + 1}:`, error.message);
      break;
    }
  }
  
  return items;
}

// ============================================================================
// SITEMAP GENERATION
// ============================================================================

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemapXML(routes) {
  const urls = routes.map(route => {
    return `  <url>
    <loc>${escapeXml(SITE_URL)}${escapeXml(route.url)}</loc>
    <lastmod>${route.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq || 'weekly'}</changefreq>
    <priority>${route.priority || 0.7}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`;
}

function generateRobotsTxt() {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
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

User-agent: bingbot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml`;
}

async function generateAllRoutes() {
  console.log('\n🗺️  Generating sitemap routes...');
  console.log(`📡 API: ${API_URL}`);
  console.log(`🌐 Site: ${SITE_URL}\n`);
  
  const routes = [];
  const now = new Date().toISOString();
  
  // Add static routes
  routes.push(
    { url: '/', changefreq: 'daily', priority: 1.0, lastmod: now },
    { url: '/products', changefreq: 'daily', priority: 0.9, lastmod: now },
    { url: '/about', changefreq: 'monthly', priority: 0.8, lastmod: now },
    { url: '/contact', changefreq: 'monthly', priority: 0.8, lastmod: now },
    { url: '/terms', changefreq: 'yearly', priority: 0.5, lastmod: now },
    { url: '/privacy', changefreq: 'yearly', priority: 0.5, lastmod: now },
    { url: '/shipping-policy', changefreq: 'monthly', priority: 0.6, lastmod: now },
    { url: '/returns', changefreq: 'monthly', priority: 0.6, lastmod: now }
  );
  
  try {
    // Fetch products
    console.log('📦 Fetching products...');
    try {
      const products = await fetchAllPages('/products/?page_size=1000');
      
      products.forEach(product => {
        if (product.slug) {
          routes.push({
            url: `/product/${product.slug}`,
            changefreq: 'weekly',
            priority: product.is_featured ? 0.9 : 0.8,
            lastmod: product.updated_at || product.created_at || now,
          });
        }
      });
      
      console.log(`✅ Added ${products.length} product routes\n`);
    } catch (error) {
      console.error('❌ Failed to fetch products:', error.message);
      console.log('⚠️  Continuing without product routes...\n');
    }
    
    // Fetch categories
    console.log('📂 Fetching categories...');
    try {
      const categories = await fetchAllPages('/categories/');
      
      categories.forEach(category => {
        if (category.slug) {
          routes.push({
            url: `/products/${category.slug}`,
            changefreq: 'daily',
            priority: 0.85,
            lastmod: now,
          });
        }
      });
      
      console.log(`✅ Added ${categories.length} category routes\n`);
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error.message);
      console.log('⚠️  Continuing without category routes...\n');
    }
    
    // Fetch brands
    console.log('🏷️  Fetching brands...');
    try {
      const brands = await fetchAllPages('/brands/');
      
      brands.forEach(brand => {
        if (brand.slug) {
          routes.push({
            url: `/products/brand/${brand.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: now,
          });
        }
      });
      
      console.log(`✅ Added ${brands.length} brand routes\n`);
    } catch (error) {
      console.error('❌ Failed to fetch brands:', error.message);
      console.log('⚠️  Continuing without brand routes...\n');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during route generation:', error);
  }
  
  console.log(`📊 Total routes: ${routes.length}\n`);
  
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
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async buildStart() {
      // Generate routes at build start
      if (config.command === 'build') {
        routes = await generateAllRoutes();
      }
    },
    async closeBundle() {
      // Write sitemap and robots.txt after build
      if (config.command === 'build') {
        const outDir = config.build.outDir || 'dist';
        
        console.log('📝 Writing sitemap.xml...');
        const sitemapContent = generateSitemapXML(routes);
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapContent);
        console.log(`✅ Sitemap written with ${routes.length} URLs\n`);
        
        console.log('📝 Writing robots.txt...');
        const robotsContent = generateRobotsTxt();
        fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsContent);
        console.log('✅ Robots.txt written\n');
      }
    }
  };
}

// ============================================================================
// VITE CONFIG - FIXED FOR REACT DUPLICATION ISSUE
// ============================================================================

export default defineConfig({
  plugins: [
    react({
      // Ensure React is properly deduplicated
      exclude: /\.stories\.(t|j)sx?$/,
      include: '**/*.{jsx,tsx}',
    }),
    tailwindcss(),
    customSitemapPlugin(),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Force single React instance
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
  },
  
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'react-redux', 
      '@reduxjs/toolkit',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'framer-motion',
      'lucide-react',
      'axios',
      'clsx',
      'tailwind-merge',
      'class-variance-authority'
    ],
    exclude: [],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // CRITICAL: Keep all React-related packages together to avoid hook mismatches
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/scheduler/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }
          
          // Redux - must be separate but ensure it uses the same React instance
          if (id.includes('node_modules/redux/') || 
              id.includes('node_modules/react-redux/') || 
              id.includes('node_modules/@reduxjs/toolkit/') ||
              id.includes('node_modules/immer/') ||
              id.includes('node_modules/redux-thunk/')) {
            return 'vendor-redux';
          }
          
          // UI Components - split by type
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-ui-icons';
          }
          
          if (id.includes('node_modules/@radix-ui/')) {
            // Group all Radix UI components together
            return 'vendor-ui-radix';
          }
          
          // Form libraries
          if (id.includes('node_modules/react-hook-form/') || 
              id.includes('node_modules/@hookform/') || 
              id.includes('node_modules/zod/')) {
            return 'vendor-forms';
          }
          
          // Animation
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-animation';
          }
          
          // API and utilities
          if (id.includes('node_modules/axios/')) {
            return 'vendor-api';
          }
          
          if (id.includes('node_modules/clsx/') || 
              id.includes('node_modules/tailwind-merge/') || 
              id.includes('node_modules/class-variance-authority/')) {
            return 'vendor-utils';
          }
          
          if (id.includes('node_modules/vaul/')) {
            return 'vendor-vaul';
          }
          
          // Only create a separate chunk for other dependencies if they're large enough
          if (id.includes('node_modules')) {
            // Check if it's a significant size by looking at common large packages
            if (id.includes('node_modules/@emotion/') ||
                id.includes('node_modules/@babel/') ||
                id.includes('node_modules/@swc/')) {
              return 'vendor-other';
            }
            // Otherwise, include with main vendor chunk to avoid too many chunks
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 600,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  
  server: {
    port: 5173,
    strictPort: false,
  },
  
  preview: {
    port: 4173,
    strictPort: false,
  },
});