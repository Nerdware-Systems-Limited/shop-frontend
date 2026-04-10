/**
 * main.jsx — vite-react-ssg entry point
 *
 * KEY DIFFERENCES FROM vite-ssg:
 * 1. Import is `ViteReactSSG` from 'vite-react-ssg'
 * 2. Export MUST be named `createRoot` (not `createApp`) — vite-react-ssg
 *    looks for this specific export name at build time.
 * 3. The setup callback receives { router, routes, isClient, initialState }
 *    — there is NO `app` argument (that was Vue-style from vite-ssg).
 * 4. HelmetProvider cannot be applied via a callback here. It must wrap the
 *    component tree — see App.jsx where it wraps the Provider + layout.
 */

import { ViteReactSSG } from 'vite-react-ssg';
import App from './App.jsx';
import routes from './routes.jsx';
import './index.css';

export const createRoot = ViteReactSSG(
  // react-router-dom data routes
  { routes },
  // optional setup callback — no `app` param exists in vite-react-ssg
  ({ router, routes, isClient, initialState }) => {
    // Add any router guards, initialState hydration, etc. here.
    // HelmetProvider is applied in App.jsx — not here.
  },
);