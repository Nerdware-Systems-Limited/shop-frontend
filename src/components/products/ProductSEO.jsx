/**
 * ProductSEO.jsx — react-helmet-async edition
 *
 * IMPROVEMENTS OVER ORIGINAL:
 * ──────────────────────────
 * 1.  react-helmet-async → JSON-LD lands in <head>, not <main>.
 *
 * 2.  window.location removed — it doesn't exist during vite-ssg's
 *     server-side renderToString pass.  URL construction is now purely
 *     prop-based with a siteUrl fallback.
 *
 * 3.  Duplicate <meta name="viewport"> / <meta name="theme-color"> removed —
 *     these are already in index.html and don't need to be per-product.
 *
 * 4.  Duplicate <meta name="format-detection"> removed (same reason).
 *
 * 5.  <link rel="alternate" media="only screen..."> removed — this pattern
 *     is deprecated; Google no longer uses it and it clashes with canonical.
 *
 * 6.  Organization schema removed from per-product pages — it's already in
 *     index.html as a global schema.  Having it on every product page creates
 *     hundreds of duplicate entity declarations, which confuses the knowledge
 *     graph rather than reinforcing it.
 *
 * 7.  priceValidUntil now defaults to one year out (ISO date only, no time),
 *     which is what Google's Rich Results validator expects.
 *
 * 8.  hrefLang self-referencing added.
 *
 * 9.  og:locale set to en_KE (matching the site's target region).
 *
 * 10. `prioritizeSeoTags` prop added to Helmet — ensures title/canonical
 *     always appear before other tags regardless of render order.
 *
 * 11. All ?? replaced with || so that empty strings (""), 0, and other
 *     falsy API values fall through to the next fallback, not just
 *     null/undefined.  This matters for fields like canonical_url: "",
 *     seo_keywords: "", short_description: "", og_image: null, etc.
 */

import { Helmet } from 'react-helmet-async';

const SITE_URL       = 'https://soundwaveaudio.co.ke';
const SITE_NAME      = 'Sound Wave Audio';
const TWITTER_HANDLE = '@soundwaveaudio';
const CURRENCY       = 'KES';

const ProductSEO = ({
  product,
  imageUrl,
  currency = CURRENCY,
  siteName = SITE_NAME,
  siteUrl  = SITE_URL,
  categoryPath = [],
}) => {
  if (!product) return null;

  // ── Safe data extraction ───────────────────────────────────────────────────
  const productName     = product.name      || 'Product';
  const productSku      = product.sku       || `PRODUCT-${product.id || 'UNKNOWN'}`;
  const productBrand    = product.brand?.name || product.manufacturer || siteName;
  const productCategory = product.category?.name || 'Products';

  const price        = parseFloat(product.final_price || product.current_price || product.sale_price || product.price || 0);
  const regularPrice = parseFloat(product.price || price);
  const isOnSale     = product.is_on_sale || (product.sale_price && parseFloat(product.sale_price) < regularPrice);

  const isInStock =
    product.is_in_stock !== undefined
      ? product.is_in_stock
      : product.stock_status === 'in_stock' || (product.stock_quantity && product.stock_quantity > 0);

  const availability =
    isInStock                  ? 'https://schema.org/InStock'   :
    product.preorder_available ? 'https://schema.org/PreOrder'  :
    product.backorder_allowed  ? 'https://schema.org/BackOrder' :
                                 'https://schema.org/OutOfStock';

  const condition =
    product.condition === 'refurbished' ? 'https://schema.org/RefurbishedCondition' :
    product.condition === 'used'        ? 'https://schema.org/UsedCondition'        :
                                          'https://schema.org/NewCondition';

  // ── Title (≤ 60 chars) ─────────────────────────────────────────────────────
  const rawTitle = product.meta_title ||
    `${productName}${isOnSale ? ' - Sale' : ''} | ${productBrand} | ${siteName}`;
  const title = rawTitle.length > 60 ? `${productName} | ${siteName}` : rawTitle;

  // ── Description (≤ 160 chars) ──────────────────────────────────────────────
  const rawDesc = product.meta_description ||
    product.short_description ||
    product.description?.substring(0, 160) ||
    `Buy ${productName} from ${productBrand}. ${isInStock ? 'In Stock' : 'Out of Stock'}. ${isOnSale ? `Sale: ${currency} ${price}` : `Price: ${currency} ${price}`}. Shop at ${siteName}.`;
  const description = rawDesc.length > 160 ? rawDesc.substring(0, 157) + '…' : rawDesc;

  // ── Images ─────────────────────────────────────────────────────────────────
  const primaryImage =
    imageUrl ||
    product.primary_image ||
    product.og_image ||
    (product.images?.find(img => img.is_primary)?.image) ||
    product.images?.[0]?.image ||
    null;

  const allImages = (product.images?.map(img => img.image).filter(Boolean)) ||
                    (primaryImage ? [primaryImage] : []);

  // ── URL (no window.location — safe for SSG) ───────────────────────────────
  const productUrl =
    product.canonical_url ||
    (product.slug ? `${siteUrl}/product/${product.slug}` : `${siteUrl}/products`);

  // ── Rating ─────────────────────────────────────────────────────────────────
  const avgRating   = product.average_rating || null;
  const reviewCount = product.review_count || product.reviews?.length || 0;
  const hasReviews  = reviewCount > 0 && avgRating;

  // ── Keywords ───────────────────────────────────────────────────────────────
  const keywords =
    product.seo_keywords ||
    [productName, productBrand, productCategory, siteName].filter(Boolean).join(', ');

  // ── priceValidUntil: one year out, date only (Google requirement) ──────────
  const priceValidUntil =
    (product.sale_ends_at && product.sale_ends_at.split('T')[0]) ||
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // ── Product JSON-LD ────────────────────────────────────────────────────────
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: productName,
    image: allImages,
    description: product.description || description,
    sku: productSku,
    mpn: product.model_number || productSku,
    brand: { '@type': 'Brand', name: productBrand },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: currency,
      price: price,
      priceValidUntil,
      availability,
      itemCondition: condition,
      seller: { '@type': 'Organization', name: siteName, url: siteUrl },
      ...(isOnSale && {
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: regularPrice,
          priceCurrency: currency,
        },
      }),
    },
    ...(hasReviews && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(product.weight && {
      weight: { '@type': 'QuantitativeValue', value: product.weight, unitCode: 'KGM' },
    }),
    ...(product.warranty_details && {
      warranty: {
        '@type': 'WarrantyPromise',
        durationOfWarranty: {
          '@type': 'QuantitativeValue',
          value: product.warranty_period || 12,
          unitCode: 'MON',
        },
      },
    }),
    category: productCategory,
  };

  // ── Breadcrumb JSON-LD ────────────────────────────────────────────────────
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
  ];

  if (categoryPath.length > 0) {
    categoryPath.forEach((cat, idx) => {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: idx + 2,
        name: cat.name,
        item: cat.url || `${siteUrl}/products/${cat.slug}`,
      });
    });
  } else if (product.category) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: productCategory,
      item: `${siteUrl}/products/${product.category.slug || 'products'}`,
    });
  }

  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: productName,
    item: productUrl,
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${productUrl}#breadcrumb`,
    itemListElement: breadcrumbItems,
  };

  return (
    <Helmet prioritizeSeoTags>
      {/* ── Title ──────────────────────────────────────────────────────── */}
      <title>{title}</title>

      {/* ── Basic meta ─────────────────────────────────────────────────── */}
      <meta name="description"  content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author"       content={siteName} />
      <meta name="robots"       content={product.visibility === 'public' || !product.visibility ? 'index, follow' : 'noindex, nofollow'} />

      {/* Product-specific meta (used by Facebook & shopping aggregators) */}
      <meta name="product:condition"      content={product.condition || 'new'} />
      <meta name="product:availability"   content={isInStock ? 'in stock' : 'out of stock'} />
      <meta property="og:availability" content={isInStock ? "instock" : "outofstock"} />
      <meta property="product:price:amount"   content={String(price)} />
      <meta property="product:price:currency" content={currency} />
      <meta property="og:price:amount"        content={String(price)} />
      <meta property="og:price:currency"      content={currency} />
      {productBrand    && <meta name="product:brand"    content={productBrand} />}
      {productCategory && <meta name="product:category" content={productCategory} />}

      {/* ── Canonical + hrefLang ───────────────────────────────────────── */}
      <link rel="canonical"                       href={productUrl} />
      <link rel="alternate" hrefLang="en-KE"      href={productUrl} />
      <link rel="alternate" hrefLang="x-default"  href={productUrl} />

      {/* ── Open Graph ─────────────────────────────────────────────────── */}
      <meta property="og:type"            content="product" />
      <meta property="og:site_name"       content={siteName} />
      <meta property="og:title"           content={productName} />
      <meta property="og:description"     content={description} />
      <meta property="og:url"             content={productUrl} />
      <meta property="og:locale"          content="en_KE" />
      {primaryImage && <>
        <meta property="og:image"             content={primaryImage} />
        <meta property="og:image:secure_url"  content={primaryImage} />
        <meta property="og:image:width"       content="1200" />
        <meta property="og:image:height"      content="630" />
        <meta property="og:image:alt"         content={productName} />
      </>}

      {/* Product OG (used by Facebook's product catalogue) */}
      <meta property="product:price:amount"   content={String(price)} />
      <meta property="product:price:currency" content={currency} />
      {productBrand    && <meta property="product:brand"        content={productBrand} />}
      {isInStock       && <meta property="product:availability"  content="in stock" />}
      {product.condition && <meta property="product:condition"   content={product.condition} />}
      {productCategory && <meta property="product:category"      content={productCategory} />}
      {isOnSale && <>
        <meta property="product:sale_price:amount"       content={String(price)} />
        <meta property="product:sale_price:currency"     content={currency} />
        <meta property="product:original_price:amount"   content={String(regularPrice)} />
        <meta property="product:original_price:currency" content={currency} />
      </>}

      {/* ── Twitter Card ───────────────────────────────────────────────── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={TWITTER_HANDLE} />
      <meta name="twitter:creator"     content={TWITTER_HANDLE} />
      <meta name="twitter:title"       content={productName} />
      <meta name="twitter:description" content={description} />
      {primaryImage && <meta name="twitter:image" content={primaryImage} />}
      <meta name="twitter:label1"      content="Price" />
      <meta name="twitter:data1"       content={`${currency} ${price}`} />
      <meta name="twitter:label2"      content="Availability" />
      <meta name="twitter:data2"       content={isInStock ? 'In Stock' : 'Out of Stock'} />

      {/* ── JSON-LD ────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </Helmet>
  );
};

export default ProductSEO;