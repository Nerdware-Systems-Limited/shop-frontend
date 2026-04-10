/**
 * CategoryBrandSEO.jsx — react-helmet-async edition
 *
 * IMPROVEMENTS OVER ORIGINAL:
 * ──────────────────────────
 * 1.  react-helmet-async → tags land in <head> during SSG, not inside <main>.
 *
 * 2.  Removed duplicate <meta name="viewport"> — already in index.html.
 *     Helmet would just overwrite it, but it's noise.
 *
 * 3.  Removed fb:app_id placeholder ("YOUR_FB_APP_ID") — a literal placeholder
 *     in production HTML breaks Facebook's OG debugger.  Add the real ID or
 *     remove entirely.  We omit it here; add it back when you have the value.
 *
 * 4.  hrefLang self-referencing added (en-KE + x-default).
 *
 * 5.  og:updated_time + article:publisher added for social re-crawl and
 *     brand attribution.
 *
 * 6.  CollectionPage schema now references the BreadcrumbList by @id instead
 *     of duplicating breadcrumb data, keeping the graph clean.
 *
 * 7.  Brand schema sameAs array construction is null-safe (no empty strings
 *     in the array).
 *
 * 8.  Keywords capped at 10 unique terms — Google ignores the keywords meta
 *     anyway, but very long values bloat the HTML.
 */

import { Helmet } from 'react-helmet-async';

const SITE_URL        = 'https://soundwaveaudio.co.ke';
const SITE_NAME       = 'Sound Wave Audio';
const TWITTER_HANDLE  = '@soundwaveaudio';
const FB_PAGE         = 'https://www.facebook.com/soundwaveaudio';
const DEFAULT_OG      = `${SITE_URL}/og-image.jpg`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatSlugToName = (slug = '') =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const truncate = (str = '', max = 155) =>
  str.length > max ? str.substring(0, max - 1) + '…' : str;

// ─── Component ────────────────────────────────────────────────────────────────
const CategoryBrandSEO = ({
  categorySlug,
  brandSlug,
  category,
  brand,
  productCount = 0,
}) => {

  // ── Title ──────────────────────────────────────────────────────────────────
  const getTitle = () => {
    if (categorySlug && brandSlug) {
      if (category?.meta_title && brand?.meta_title)
        return `${brand.meta_title} ${category.meta_title} - ${SITE_NAME}`;
      const catName   = category?.name   ?? formatSlugToName(categorySlug);
      const brandName = brand?.name      ?? formatSlugToName(brandSlug);
      return `${brandName} ${catName} Products - Official Dealer | ${SITE_NAME}`;
    }
    if (categorySlug) {
      if (category?.meta_title) return category.meta_title;
      return `${category?.name ?? formatSlugToName(categorySlug)} - Shop the Best Selection | ${SITE_NAME}`;
    }
    if (brandSlug) {
      if (brand?.meta_title) return brand.meta_title;
      return `${brand?.name ?? formatSlugToName(brandSlug)} Official Products - Authorized Dealer | ${SITE_NAME}`;
    }
    return `All Products - Premium Car Audio & Electronics | ${SITE_NAME}`;
  };

  // ── Description ────────────────────────────────────────────────────────────
  const getDescription = () => {
    if (categorySlug && brandSlug) {
      if (category?.meta_description && brand?.meta_description)
        return `${brand.meta_description} ${category.meta_description}`;
        const catName   = category?.name   ?? formatSlugToName(categorySlug);
        const brandName = brand?.name      ?? formatSlugToName(brandSlug);
        return `Official ${brandName} ${catName} dealer in Kenya. Shop ${productCount} genuine products with warranty at ${SITE_NAME}. Free shipping on orders over KSH 5,000.`;
      }
      if (categorySlug) {
        if (category?.meta_description) return category.meta_description;
        const catName = category?.name ?? formatSlugToName(categorySlug);
        return (
          category?.description ??
          `Discover our complete range of ${catName} at ${SITE_NAME}. Premium quality products from top brands. ${productCount} products available.`
        );
      }
      if (brandSlug) {
        if (brand?.meta_description) return brand.meta_description;
        const brandName = brand?.name ?? formatSlugToName(brandSlug);
        return (
          brand?.description ??
          `Official ${brandName} authorized dealer in Kenya. Shop ${productCount} genuine ${brandName} car audio systems, speakers, amplifiers, and electronics at ${SITE_NAME}. All products include warranty.`
        );
      }
    return `Browse our complete collection of premium car audio systems, speakers, amplifiers, and electronics. ${productCount}+ products from leading brands. Shop online with confidence.`;
  };

  // ── Canonical ──────────────────────────────────────────────────────────────
  const getCanonical = () => {
    if (categorySlug && brandSlug) return `${SITE_URL}/products/${categorySlug}?brand=${brandSlug}`;
    if (categorySlug)               return `${SITE_URL}/products/${categorySlug}`;
    if (brandSlug)                  return `${SITE_URL}/products/brand/${brandSlug}`;
    return `${SITE_URL}/products`;
  };

  // ── OG Image ───────────────────────────────────────────────────────────────
  const getOgImage = () =>
    brand?.logo ?? category?.image ?? (brandSlug ? `${SITE_URL}/brands/${brandSlug}-og.jpg` : DEFAULT_OG);

  // ── Keywords (capped at 10) ─────────────────────────────────────────────────
  const getKeywords = () => {
    const kw = [];
    if (category?.seo_keywords) kw.push(...category.seo_keywords.split(',').map(k => k.trim()));
    if (brand?.seo_keywords)    kw.push(...brand.seo_keywords.split(',').map(k => k.trim()));

    if (categorySlug) {
      const catName = category?.name ?? formatSlugToName(categorySlug);
      kw.push(catName, `${catName} Kenya`, `buy ${catName} Nairobi`);
    }
    if (brandSlug) {
      const brandName = brand?.name ?? formatSlugToName(brandSlug);
      kw.push(brandName, `${brandName} Kenya`, `official ${brandName} dealer`, `${brandName} car audio Kenya`);
    }
    kw.push('car audio Nairobi', 'car speakers Kenya', SITE_NAME);

    return [...new Set(kw)].slice(0, 10).join(', ');
  };

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const canonical = getCanonical();
  const title     = getTitle();
  const desc      = getDescription();

  const breadcrumbSchema = (() => {
    const items = [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
    ];
    let pos = 3;
    if (categorySlug) {
      items.push({
        '@type': 'ListItem', position: pos++,
        name: category?.name ?? formatSlugToName(categorySlug),
        item: `${SITE_URL}/products/${categorySlug}`,
      });
    }
    if (brandSlug) {
      items.push({
        '@type': 'ListItem', position: pos++,
        name: brand?.name ?? formatSlugToName(brandSlug),
        item: categorySlug
          ? `${SITE_URL}/products/${categorySlug}?brand=${brandSlug}`
          : `${SITE_URL}/products/brand/${brandSlug}`,
      });
    }
    return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: items };
  })();

  const brandSchema = brandSlug
    ? {
        '@context': 'https://schema.org',
        '@type': 'Brand',
        '@id': `${SITE_URL}/brands/${brandSlug}`,
        name: brand?.name ?? formatSlugToName(brandSlug),
        description: brand?.description ?? `Official ${brand?.name ?? formatSlugToName(brandSlug)} products at ${SITE_NAME}`,
        logo: brand?.logo ?? `${SITE_URL}/brands/${brandSlug}-logo.png`,
        url: brand?.website ?? `${SITE_URL}/products/brand/${brandSlug}`,
        // Only include sameAs values that actually exist
        sameAs: [brand?.facebook, brand?.instagram, brand?.twitter].filter(Boolean),
      }
    : null;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonical}#collectionpage`,
    name: title,
    description: desc,
    url: canonical,
    inLanguage: 'en-KE',
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: productCount,
      itemListOrder: 'https://schema.org/ItemListUnordered',
    },
    ...(brandSlug && {
      about: {
        '@type': 'Brand',
        '@id': `${SITE_URL}/brands/${brandSlug}`,
        name: brand?.name ?? formatSlugToName(brandSlug),
      },
    }),
  };

  const ogImage    = getOgImage();
  const keywords   = getKeywords();
  const updatedAt  = new Date().toISOString();

  return (
    <Helmet prioritizeSeoTags>
      {/* ── Title ──────────────────────────────────────────────────────── */}
      <title>{title}</title>

      {/* ── Basic meta ─────────────────────────────────────────────────── */}
      <meta name="description"  content={desc} />
      <meta name="keywords"     content={keywords} />
      <meta name="robots"       content="index, follow" />
      <meta name="googlebot"    content="index, follow" />

      {/* ── Canonical + hrefLang ───────────────────────────────────────── */}
      <link rel="canonical"                       href={canonical} />
      <link rel="alternate" hrefLang="en-KE"      href={canonical} />
      <link rel="alternate" hrefLang="x-default"  href={canonical} />

      {/* ── Open Graph ─────────────────────────────────────────────────── */}
      <meta property="og:type"            content="website" />
      <meta property="og:site_name"       content={SITE_NAME} />
      <meta property="og:title"           content={title} />
      <meta property="og:description"     content={desc} />
      <meta property="og:url"             content={canonical} />
      <meta property="og:image"           content={ogImage} />
      <meta property="og:image:width"     content="1200" />
      <meta property="og:image:height"    content="630" />
      <meta property="og:image:alt"       content={title} />
      <meta property="og:locale"          content="en_KE" />
      <meta property="og:updated_time"    content={updatedAt} />
      <meta property="article:publisher"  content={FB_PAGE} />

      {/* ── Twitter ────────────────────────────────────────────────────── */}
      <meta name="twitter:card"           content="summary_large_image" />
      <meta name="twitter:site"           content={TWITTER_HANDLE} />
      <meta name="twitter:creator"        content={TWITTER_HANDLE} />
      <meta name="twitter:title"          content={title} />
      <meta name="twitter:description"    content={desc} />
      <meta name="twitter:image"          content={ogImage} />
      <meta name="twitter:image:alt"      content={title} />

      {/* ── JSON-LD ────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {brandSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
    </Helmet>
  );
};

export default CategoryBrandSEO;