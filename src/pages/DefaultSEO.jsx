/**
 * DefaultSEO.jsx — react-helmet-async edition
 *
 * KEY IMPROVEMENTS OVER react-head VERSION:
 * ─────────────────────────────────────────
 * 1.  react-helmet-async flushes tags into <head> during SSG (vite-ssg calls
 *     renderToString which triggers HelmetProvider.renderStatic()).
 *     react-head used portals which only work client-side → that is why JSON-LD
 *     was showing up inside <main> in your original build.
 *
 * 2.  Duplicate-tag prevention: Helmet deduplicates by attribute key.
 *     Every <meta name="..."> replaces any earlier tag with the same name,
 *     so even if this component re-mounts you never get two description tags.
 *
 * 3.  FAQPage schema is now ONLY on '/'.  '/about' uses AboutPage.
 *     Having FAQPage on both caused Google Search Console "duplicate rich result"
 *     warnings.
 *
 * 4.  WebPage schema added for every static page — this fills the "WebPage"
 *     entity gap that was missing, helping Google understand page purpose.
 *
 * 5.  hrefLang self-referencing added (en-KE + x-default) — small signal but
 *     prevents "missing hrefLang" warnings in GSC for a geo-targeted site.
 *
 * 6.  og:updated_time added — helps Facebook/LinkedIn re-crawl when content
 *     changes.
 *
 * 7.  "article:publisher" OG tag added — ties pages to your Facebook Page for
 *     branded article cards.
 *
 * USAGE:
 *   Each static page imports and renders <DefaultSEO /> directly — no wrapper
 *   needed in App.jsx or routes.jsx.  Product / category pages import their own
 *   specialised SEO component instead.
 */

import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SITE_URL   = 'https://soundwaveaudio.co.ke';
const SITE_NAME  = 'Sound Wave Audio';
const FB_PAGE    = 'https://www.facebook.com/soundwaveaudio';
const TWITTER_HANDLE = '@soundwaveaudio';
const DEFAULT_OG_IMAGE     = `${SITE_URL}/og-image.jpg`;
const DEFAULT_TWITTER_IMAGE = `${SITE_URL}/twitter-image.jpg`;

// ─── Per-route SEO data ────────────────────────────────────────────────────────
const ROUTE_SEO = {
  '/': {
    title: `${SITE_NAME} - Premium Car Audio Systems Nairobi Kenya | Official Store`,
    description:
      "Kenya's #1 car audio shop. Professional installation of Pioneer, Sony, Kenwood, Nakamichi car speakers, subwoofers, amplifiers & head units. Free CBD delivery. Visit our Ngara showroom.",
    keywords:
      'car audio nairobi, car speakers kenya, subwoofers nairobi, amplifiers kenya, head units, car audio installation, pioneer kenya, sony car audio',
    schemaType: 'WebPage',
    includeFAQ: true,
  },
  '/about': {
    title: `About ${SITE_NAME} - Kenya's Premier Car Audio Specialists`,
    description:
      "Discover Sound Wave Audio's story. Over 13 years of excellence in car audio installation, premium brands, and expert service in Nairobi. Meet our team of certified technicians.",
    keywords:
      'about sound wave audio, car audio specialists nairobi, our story, professional installers kenya',
    schemaType: 'AboutPage',
  },
  '/contact': {
    title: `Contact ${SITE_NAME} - Visit Our Ngara Showroom | Car Audio Nairobi`,
    description:
      'Get in touch with Sound Wave Audio. Visit our Ngara showroom, call +254 724 013 583, or book a car audio consultation. Open Mon-Sat 8AM-6PM.',
    keywords:
      'contact car audio nairobi, visit showroom ngara, car audio support, installation appointment',
    schemaType: 'ContactPage',
  },
  '/terms': {
    title: `Terms of Service - ${SITE_NAME} Kenya`,
    description:
      'Read the Terms of Service for Sound Wave Audio car audio purchases, warranties, and services in Kenya.',
    keywords: 'terms of service, car audio terms, purchase agreement, warranty terms kenya',
    schemaType: 'WebPage',
  },
  '/privacy': {
    title: `Privacy Policy - How ${SITE_NAME} Protects Your Data`,
    description:
      'Learn how Sound Wave Audio protects your personal information, handles data, and respects your privacy in Kenya.',
    keywords: 'privacy policy, data protection kenya, personal information',
    schemaType: 'WebPage',
  },
  '/shipping-policy': {
    title: `Shipping & Delivery Policy - ${SITE_NAME} Kenya`,
    description:
      'Car audio delivery across Kenya. Free CBD delivery on orders over KSH 5,000. 24-48hr Nairobi delivery. Nationwide shipping available.',
    keywords: 'shipping policy, delivery nairobi, car audio delivery kenya, free shipping cbd',
    schemaType: 'WebPage',
  },
  '/returns': {
    title: `Returns & Exchange Policy - ${SITE_NAME} Warranty`,
    description:
      '14-day return policy on car audio products. All items come with manufacturer warranty. Learn about our exchange process.',
    keywords: 'returns policy, exchanges, car audio warranty, money back guarantee',
    schemaType: 'WebPage',
  },
  // ─── noindex pages (minimal SEO, no schema needed) ──────────────────────────
  '/cart':            { title: `Shopping Cart - ${SITE_NAME}`,                noindex: true },
  '/login':           { title: `Login - ${SITE_NAME} Account`,                noindex: true },
  '/register':        { title: `Create Account - Join ${SITE_NAME}`,          noindex: true },
  '/forgot-password': { title: `Reset Password - ${SITE_NAME}`,               noindex: true },
  '/reset-password':  { title: `Create New Password - ${SITE_NAME}`,          noindex: true },
  '/profile':         { title: `My Account - ${SITE_NAME}`,                   noindex: true },
  '/shipping':        { title: `Shipping Information - ${SITE_NAME} Checkout`,noindex: true },
  '/payment':         { title: `Payment - Secure Checkout | ${SITE_NAME}`,    noindex: true },
  '/placeorder':      { title: `Confirm Order - ${SITE_NAME}`,                noindex: true },
  '/myorders':        { title: `My Orders - ${SITE_NAME} Account`,            noindex: true },
};

// ─── Shared FAQ data (home page only) ─────────────────────────────────────────
const HOME_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you install car audio systems in Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Sound Wave Audio provides professional car audio installation in Nairobi and surrounding areas. Book via +254 724 013 583.',
      },
    },
    {
      '@type': 'Question',
      name: 'What car audio brands do you stock?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We stock Pioneer, Sony, Kenwood, Nakamichi, JVC, Blaupunkt, Skar Audio, and Taramps — all 100% genuine with manufacturer warranty.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer delivery in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Free delivery within Nairobi CBD for orders over KSH 5,000. Nationwide shipping is also available; Nairobi orders arrive within 24-48 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'M-Pesa, Visa, Mastercard, and cash. All online payments go through our encrypted payment gateway.',
      },
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────
const DefaultSEO = () => {
  const { pathname } = useLocation();

  // Skip: product/category routes manage their own SEO
  if (
    pathname === '/products' ||
    pathname.startsWith('/products/') ||
    pathname.startsWith('/product/')
  ) {
    return null;
  }

  const routeConfig = ROUTE_SEO[pathname] ?? {};

  const title       = routeConfig.title       ?? `${SITE_NAME} - Car Audio Nairobi Kenya`;
  const description = routeConfig.description ?? `Shop premium car audio systems at ${SITE_NAME} Nairobi. Professional installation of speakers, subwoofers, amplifiers & head units.`;
  const keywords    = routeConfig.keywords    ?? '';
  const noindex     = routeConfig.noindex     ?? false;
  const schemaType  = routeConfig.schemaType  ?? null;
  const includeFAQ  = routeConfig.includeFAQ  ?? false;

  const canonical   = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
  const ogImage     = DEFAULT_OG_IMAGE;
  const updatedTime = new Date().toISOString();

  // ─── Breadcrumb ─────────────────────────────────────────────────────────────
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
  ];
  if (pathname !== '/') {
    const pageName =
      routeConfig.title?.split('-')[0]?.trim() ??
      pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ??
      'Page';
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: pageName,
      item: `${SITE_URL}${pathname}`,
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  // ─── WebPage / AboutPage / ContactPage schema ────────────────────────────────
  const webPageSchema = schemaType
    ? {
        '@context': 'https://schema.org',
        '@type': schemaType,
        '@id': `${canonical}#webpage`,
        name: title,
        description,
        url: canonical,
        inLanguage: 'en-KE',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...(schemaType === 'ContactPage' && {
          mainEntity: {
            '@type': 'LocalBusiness',
            '@id': `${SITE_URL}/#localbusiness`,
          },
        }),
      }
    : null;

  return (
    <Helmet prioritizeSeoTags>
      {/* ── Title ────────────────────────────────────────────────────────── */}
      <title>{title}</title>

      {/* ── Basic meta ───────────────────────────────────────────────────── */}
      <meta name="description"        content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author"             content={SITE_NAME} />

      {/* ── Robots ───────────────────────────────────────────────────────── */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* ── Canonical + hrefLang ─────────────────────────────────────────── */}
      {!noindex && <link rel="canonical"                          href={canonical} />}
      {!noindex && <link rel="alternate" hrefLang="en-KE"        href={canonical} />}
      {!noindex && <link rel="alternate" hrefLang="x-default"    href={canonical} />}

      {/* ── Open Graph ───────────────────────────────────────────────────── */}
      <meta property="og:type"            content="website" />
      <meta property="og:site_name"       content={SITE_NAME} />
      <meta property="og:title"           content={title} />
      <meta property="og:description"     content={description} />
      <meta property="og:url"             content={canonical} />
      <meta property="og:image"           content={ogImage} />
      <meta property="og:image:width"     content="1200" />
      <meta property="og:image:height"    content="630" />
      <meta property="og:image:alt"       content={title} />
      <meta property="og:locale"          content="en_KE" />
      <meta property="og:updated_time"    content={updatedTime} />
      <meta property="article:publisher"  content={FB_PAGE} />

      {/* ── Twitter ──────────────────────────────────────────────────────── */}
      <meta name="twitter:card"           content="summary_large_image" />
      <meta name="twitter:site"           content={TWITTER_HANDLE} />
      <meta name="twitter:creator"        content={TWITTER_HANDLE} />
      <meta name="twitter:title"          content={title} />
      <meta name="twitter:description"    content={description} />
      <meta name="twitter:image"          content={DEFAULT_TWITTER_IMAGE} />

      {/* ── JSON-LD: Breadcrumb ───────────────────────────────────────────── */}
      {!noindex && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      {webPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      )}

      {includeFAQ && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ) }}
        />
      )}
    </Helmet>
  );
};

export default DefaultSEO;