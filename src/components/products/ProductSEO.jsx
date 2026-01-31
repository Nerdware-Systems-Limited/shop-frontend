import {
  Title,
  Meta,
  Link as HeadLink,
} from 'react-head';

/**
 * God-Level Product SEO Component
 * - Comprehensive title, meta, OG, Twitter Cards
 * - Robust fallbacks for all fields
 * - Enhanced JSON-LD schema with reviews, variants, and breadcrumbs
 * - Google Rich Results optimized
 * - Mobile and social media optimized
 */
const ProductSEO = ({
  product,
  imageUrl,
  currency = 'KES',
  siteName = 'Sound Wave Audio',
  siteUrl = '',
  categoryPath = [],
}) => {
  if (!product) return null;

  console.log("SEO Product", product);

  // ========== SAFE DATA EXTRACTION ==========
  
  const productName = product.name || 'Product';
  const productSku = product.sku || `PRODUCT-${product.id || 'UNKNOWN'}`;
  const productBrand = product.brand?.name || product.manufacturer || 'Sound Wave Audio';
  const productCategory = product.category?.name || 'Products';
  
  // Price handling with multiple fallbacks
  const price = product.final_price || 
                product.current_price || 
                product.sale_price || 
                product.price || 
                0;
  
  const regularPrice = product.price || price;
  const isOnSale = product.is_on_sale || 
                   (product.sale_price && parseFloat(product.sale_price) < parseFloat(regularPrice));
  
  // Stock availability
  const isInStock = product.is_in_stock !== undefined 
    ? product.is_in_stock 
    : product.stock_status === 'in_stock' || 
      (product.stock_quantity && product.stock_quantity > 0);
  
  const availabilitySchema = isInStock
    ? 'https://schema.org/InStock'
    : product.preorder_available
    ? 'https://schema.org/PreOrder'
    : product.backorder_allowed
    ? 'https://schema.org/BackOrder'
    : 'https://schema.org/OutOfStock';

  // ========== TITLE OPTIMIZATION ==========
  
  const titleTemplate = product.meta_title || 
    `${productName} ${isOnSale ? '- Sale' : ''} | ${productBrand} | ${siteName}`;
  
  const title = titleTemplate.length > 60 
    ? `${productName} | ${siteName}`
    : titleTemplate;

  // ========== DESCRIPTION OPTIMIZATION ==========
  
  const metaDescription = product.meta_description || 
    product.short_description || 
    product.description?.substring(0, 160) || 
    `Buy ${productName} from ${productBrand}. ${isInStock ? 'In Stock' : 'Currently Out of Stock'}. ${isOnSale ? `Sale price: ${currency} ${price}` : `Price: ${currency} ${price}`}. Shop at ${siteName}.`;
  
  const description = metaDescription.length > 160 
    ? metaDescription.substring(0, 157) + '...'
    : metaDescription;

  // ========== IMAGE HANDLING ==========
  
  const primaryImage = imageUrl || 
                       product.primary_image || 
                       product.og_image ||
                       (product.images && product.images.length > 0 
                         ? product.images.find(img => img.is_primary)?.image || product.images[0]?.image
                         : null);
  
  const allImages = product.images?.map(img => img.image).filter(Boolean) || 
                    (primaryImage ? [primaryImage] : []);

  // ========== URL CONSTRUCTION ==========
  
  const productUrl = product.canonical_url || 
                     (siteUrl && product.slug 
                       ? `${siteUrl}/products/${product.slug}` 
                       : window.location.href);

  // ========== RATING & REVIEWS ==========
  
  const avgRating = product.average_rating || null;
  const reviewCount = product.review_count || product.reviews?.length || 0;
  const hasReviews = reviewCount > 0 && avgRating;

  // ========== KEYWORDS ==========
  
  const keywords = product.seo_keywords || 
                   [productName, productBrand, productCategory, siteName]
                     .filter(Boolean)
                     .join(', ');

  // ========== CONDITION ==========
  
  const condition = product.condition === 'new' 
    ? 'https://schema.org/NewCondition'
    : product.condition === 'refurbished'
    ? 'https://schema.org/RefurbishedCondition'
    : 'https://schema.org/UsedCondition';

  // ========== JSON-LD SCHEMA ==========
  
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    image: allImages,
    description: product.description || description,
    sku: productSku,
    mpn: product.model_number || productSku,
    brand: {
      '@type': 'Brand',
      name: productBrand,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: currency,
      price: parseFloat(price),
      priceValidUntil: product.sale_ends_at || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: availabilitySchema,
      itemCondition: condition,
      ...(isOnSale && {
        price: parseFloat(price),
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: parseFloat(regularPrice),
          priceCurrency: currency,
        }
      }),
      seller: {
        '@type': 'Organization',
        name: siteName,
      },
    },
    ...(hasReviews && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(product.weight && {
      weight: {
        '@type': 'QuantitativeValue',
        value: product.weight,
        unitCode: 'KGM',
      },
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

  // ========== BREADCRUMB SCHEMA ==========
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl || window.location.origin,
      },
      ...(categoryPath.length > 0 
        ? categoryPath.map((cat, idx) => ({
            '@type': 'ListItem',
            position: idx + 2,
            name: cat.name,
            item: cat.url || `${siteUrl}/category/${cat.slug}`,
          }))
        : product.category 
        ? [{
            '@type': 'ListItem',
            position: 2,
            name: productCategory,
            item: `${siteUrl}/category/${product.category.slug || 'products'}`,
          }]
        : []
      ),
      {
        '@type': 'ListItem',
        position: (categoryPath.length || 1) + 2,
        name: productName,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      {/* ========== TITLE ========== */}
      <Title>{title}</Title>

      {/* ========== BASIC META TAGS ========== */}
      <Meta name="description" content={description} />
      {keywords && <Meta name="keywords" content={keywords} />}
      <Meta name="author" content={siteName} />
      <Meta name="robots" content={product.visibility === 'public' ? 'index, follow' : 'noindex, nofollow'} />
      
      {/* Product specific meta */}
      <Meta name="product:condition" content={product.condition || 'new'} />
      <Meta name="product:availability" content={isInStock ? 'in stock' : 'out of stock'} />
      <Meta name="product:price:amount" content={String(price)} />
      <Meta name="product:price:currency" content={currency} />
      {productBrand && <Meta name="product:brand" content={productBrand} />}
      {productCategory && <Meta name="product:category" content={productCategory} />}

      {/* ========== OPEN GRAPH (Facebook, LinkedIn) ========== */}
      <Meta property="og:type" content="product" />
      <Meta property="og:title" content={productName} />
      <Meta property="og:description" content={description} />
      <Meta property="og:url" content={productUrl} />
      <Meta property="og:site_name" content={siteName} />
      <Meta property="og:locale" content="en_US" />
      
      {primaryImage && (
        <>
          <Meta property="og:image" content={primaryImage} />
          <Meta property="og:image:secure_url" content={primaryImage} />
          <Meta property="og:image:width" content="1200" />
          <Meta property="og:image:height" content="630" />
          <Meta property="og:image:alt" content={productName} />
        </>
      )}

      {/* Product-specific OG tags */}
      <Meta property="product:price:amount" content={String(price)} />
      <Meta property="product:price:currency" content={currency} />
      {productBrand && <Meta property="product:brand" content={productBrand} />}
      {isInStock && <Meta property="product:availability" content="in stock" />}
      {product.condition && <Meta property="product:condition" content={product.condition} />}
      {productCategory && <Meta property="product:category" content={productCategory} />}
      
      {isOnSale && (
        <>
          <Meta property="product:sale_price:amount" content={String(price)} />
          <Meta property="product:sale_price:currency" content={currency} />
          <Meta property="product:original_price:amount" content={String(regularPrice)} />
          <Meta property="product:original_price:currency" content={currency} />
        </>
      )}

      {/* ========== TWITTER CARD ========== */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={productName} />
      <Meta name="twitter:description" content={description} />
      {primaryImage && <Meta name="twitter:image" content={primaryImage} />}
      <Meta name="twitter:label1" content="Price" />
      <Meta name="twitter:data1" content={`${currency} ${price}`} />
      <Meta name="twitter:label2" content="Availability" />
      <Meta name="twitter:data2" content={isInStock ? 'In Stock' : 'Out of Stock'} />

      {/* ========== MOBILE OPTIMIZATION ========== */}
      <Meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <Meta name="format-detection" content="telephone=no" />
      <Meta name="theme-color" content="#000000" />
      <Meta name="apple-mobile-web-app-capable" content="yes" />
      <Meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* ========== CANONICAL URL ========== */}
      <HeadLink rel="canonical" href={productUrl} />
      
      {/* Alternate for mobile */}
      <HeadLink rel="alternate" media="only screen and (max-width: 640px)" href={productUrl} />

      {/* Preconnect to image CDN for performance */}
      {primaryImage && primaryImage.includes('s3.amazonaws.com') && (
        <>
          <HeadLink rel="preconnect" href="https://kiarie-bucket.s3.amazonaws.com" />
          <HeadLink rel="dns-prefetch" href="https://kiarie-bucket.s3.amazonaws.com" />
        </>
      )}

      {/* ========== JSON-LD SCHEMAS ========== */}
      
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchema),
        }}
      />

      {/* Breadcrumb Schema */}
      {(categoryPath.length > 0 || product.category) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}

      {/* Organization Schema (for brand trust) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteName,
            url: siteUrl || window.location.origin,
            logo: `${siteUrl || window.location.origin}/logo.png`,
          }),
        }}
      />
    </>
  );
};

export default ProductSEO;