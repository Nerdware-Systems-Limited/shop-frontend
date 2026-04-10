/**
 * routes.jsx — single source of truth for the entire route tree.
 *
 * WHY a separate file?
 * vite-ssg needs the route list at build time (to know which paths to
 * pre-render).  Keeping routes here — instead of inline in App.jsx — means:
 * 1.  vite-ssg can import them directly.
 * 2.  The sitemap generator in vite.config.js can import them too, removing
 *     the need to duplicate the static-route list in two places.
 * 3.  Lazy-loading (React.lazy) is trivial to add per route.
 *
 * ROUTE → SEO OWNERSHIP:
 * Every page component is responsible for its own <Helmet> block.
 * The route file does NOT inject SEO — that would be the same "wrapping"
 * anti-pattern that caused the original duplication.
 */

import { lazy } from 'react';
import App from './App.jsx';

// ─── Eager (critical path) ────────────────────────────────────────────────────
import Home            from './pages/Home';
import NotFound        from './pages/NotFound';

// ─── Lazy (code-split) ────────────────────────────────────────────────────────
const Products          = lazy(() => import('./pages/Products'));
const ProductDetails    = lazy(() => import('./pages/ProductDetails'));
const Installations     = lazy(() => import('./pages/Installations'));
const InstallationDetails = lazy(() => import('./pages/InstallationDetails'));
const About             = lazy(() => import('./pages/About'));
const Contact           = lazy(() => import('./pages/Contact'));
const Cart              = lazy(() => import('./pages/customer/Cart'));
const Login             = lazy(() => import('./pages/customer/Login'));
const Register          = lazy(() => import('./pages/customer/Register'));
const Profile           = lazy(() => import('./pages/customer/Profile'));
const Shipping          = lazy(() => import('./pages/customer/Shipping'));
const Payment           = lazy(() => import('./pages/customer/Payment'));
const PlaceOrder        = lazy(() => import('./pages/customer/PlaceOrder'));
const MyOrders          = lazy(() => import('./pages/customer/MyOrders'));
const OrderDetails      = lazy(() => import('./pages/OrderDetails'));
const OrderSuccess      = lazy(() => import('./pages/customer/OrderSuccess'));
const ForgotPassword    = lazy(() => import('./pages/customer/ForgotPassword'));
const ResetPassword     = lazy(() => import('./pages/customer/ResetPassword'));
const TermsOfService    = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy     = lazy(() => import('./pages/PrivacyPolicy'));
const ShippingPolicy    = lazy(() => import('./pages/ShippingPolicy'));
const ReturnsExchanges  = lazy(() => import('./pages/ReturnsExchanges'));

/**
 * Route definitions consumed by vite-ssg AND by App.jsx (via <Outlet>).
 *
 * `meta.prerender`  – true  → vite-ssg statically renders this path at build time
 *                    false → served as the SPA shell (still SSG-capable via dynamic prerender)
 * `meta.noindex`    – true  → the SEO component will add <meta name="robots" content="noindex">
 */
export const routes = [
  {
    path: '/',
    Component: App, // ✅ NOT element
    children: [
      { path: '', Component: Home, meta: { prerender: true } },
      { path: 'products', Component: Products, meta: { prerender: true } },
      { path: 'products/brand/:brandSlug', Component: Products, meta: { prerender: false } },
      { path: 'products/:categorySlug', Component: Products, meta: { prerender: false } },
      { path: 'product/:slug', Component: ProductDetails, meta: { prerender: false } },
      { path: 'installations', Component: Installations, meta: { prerender: true } },
      { path: 'installations/:slug', Component: InstallationDetails, meta: { prerender: false } },
      { path: 'about', Component: About, meta: { prerender: true } },
      { path: 'contact', Component: Contact, meta: { prerender: true } },
      { path: 'terms', Component: TermsOfService, meta: { prerender: true } },
      { path: 'privacy', Component: PrivacyPolicy, meta: { prerender: true } },
      { path: 'shipping-policy', Component: ShippingPolicy, meta: { prerender: true } },
      { path: 'returns', Component: ReturnsExchanges, meta: { prerender: true } },

      { path: 'login', Component: Login, meta: { noindex: true } },
      { path: 'register', Component: Register, meta: { noindex: true } },
      { path: 'forgot-password', Component: ForgotPassword, meta: { noindex: true } },
      { path: 'reset-password', Component: ResetPassword, meta: { noindex: true } },

      { path: 'cart', Component: Cart, meta: { noindex: true } },
      { path: 'profile', Component: Profile, meta: { noindex: true } },
      { path: 'myorders', Component: MyOrders, meta: { noindex: true } },
      { path: 'order/:id', Component: OrderDetails, meta: { noindex: true } },
      { path: 'order/:orderNumber/success', Component: OrderSuccess, meta: { noindex: true } },
      { path: 'shipping', Component: Shipping, meta: { noindex: true } },
      { path: 'payment', Component: Payment, meta: { noindex: true } },
      { path: 'placeorder', Component: PlaceOrder, meta: { noindex: true } },

      { path: '*', Component: NotFound, meta: { noindex: true } },
    ],
  },
];


// ─── Flat list of paths to pre-render (consumed by vite.config.js) ────────────
export const prerenderPaths = routes[0].children
  .filter(r => r.meta?.prerender && !r.path.includes(':'))
  .map(r => (r.path === '' ? '/' : `/${r.path}`));

export default routes;