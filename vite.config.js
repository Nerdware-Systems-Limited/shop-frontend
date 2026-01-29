import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'

// Dynamic routes for sitemap generation
const dynamicRoutes = async () => {
  // Fetch from your API at build time
  const API_URL = process.env.VITE_API_URL || 'https://shop.nerdwaretechnologies.com/api';
  
  try {
    // Fetch products
    const productsRes = await fetch(`${API_URL}/products/?page_size=1000`);
    const productsData = await productsRes.json();
    const productRoutes = productsData.results?.map(p => `/product/${p.slug}`) || [];
    
    // Fetch categories
    const categoriesRes = await fetch(`${API_URL}/categories/`);
    const categoriesData = await categoriesRes.json();
    const categoryRoutes = categoriesData.results?.map(c => `/products?category=${c.slug}`) || [];
    
    // Fetch brands
    const brandsRes = await fetch(`${API_URL}/brands/`);
    const brandsData = await brandsRes.json();
    const brandRoutes = brandsData.results?.map(b => `/products?brand=${b.slug}`) || [];
    
    return [...productRoutes, ...categoryRoutes, ...brandRoutes];
  } catch (error) {
    console.error('Failed to fetch dynamic routes:', error);
    return [];
  }
};

// https://vite.dev/config/
export default defineConfig(async () => {
  const routes = await dynamicRoutes();
  
  return {
    plugins: [
      react(),
      tailwindcss(),
      sitemap({
        hostname: process.env.SITE_URL || 'https://soundwaveaudio.co.ke',
        dynamicRoutes: routes,
        exclude: ['/admin', '/login', '/register', '/reset-password'],
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
        robots: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api', '/*.json'],
          }
        ],
        // Custom route priorities
        routes: {
          '/': { priority: 1.0, changefreq: 'daily' },
          '/products': { priority: 0.9, changefreq: 'daily' },
          '/about': { priority: 0.8, changefreq: 'monthly' },
          '/contact': { priority: 0.8, changefreq: 'monthly' },
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'redux-vendor': ['react-redux', 'redux'],
            'ui-vendor': ['lucide-react'],
          }
        }
      }
    }
  }
})