/**
 * NotFound.jsx — with proper noindex SEO
 *
 * Always add a Helmet block to 404 pages so crawlers don't accidentally index
 * them (the shell HTML that vite-ssg uses for unknown routes has no title,
 * which means Google would display "Untitled" in search results).
 */

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <>
    <Helmet>
      <title>404 - Page Not Found | Sound Wave Audio</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>

    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-light mb-4">404</h1>
      <p className="text-xs uppercase tracking-widest text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="inline-block px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  </>
);

export default NotFound;