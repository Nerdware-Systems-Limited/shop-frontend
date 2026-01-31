import { Title, Meta, Link as HeadLink } from 'react-head';

const CategoryBrandSEO = ({
  categorySlug,
  brandSlug,
  category,
  brand,
  productCount = 0,
  siteName = 'Sound Wave Audio',
  siteUrl = 'https://soundwaveaudio.co.ke',
}) => {
  // Generate page title - KEEPING YOUR PRIORITY SYSTEM
  const getPageTitle = () => {
    // Priority 1: Use custom meta_title if available
    if (categorySlug && brandSlug) {
      if (category?.meta_title && brand?.meta_title) {
        return `${brand.meta_title} ${category.meta_title} - ${siteName}`;
      }
    }
    
    if (categorySlug && category?.meta_title) {
      return category.meta_title;
    }
    
    if (brandSlug && brand?.meta_title) {
      return brand.meta_title;
    }
    
    // Priority 2: Fallback to generated titles
    if (categorySlug && brandSlug) {
      const categoryName = category?.name || formatSlugToName(categorySlug);
      const brandName = brand?.name || formatSlugToName(brandSlug);
      return `${brandName} ${categoryName} Products - Official Dealer | ${siteName}`;
    }
    
    if (categorySlug) {
      const categoryName = category?.name || formatSlugToName(categorySlug);
      return `${categoryName} - Shop the Best Selection | ${siteName}`;
    }
    
    if (brandSlug) {
      const brandName = brand?.name || formatSlugToName(brandSlug);
      return `${brandName} Official Products - Authorized Dealer | ${siteName}`;
    }
    
    return `All Products - Premium Car Audio & Electronics | ${siteName}`;
  };

  // Generate meta description - UPDATED for better brand SEO
  const getMetaDescription = () => {
    // Priority 1: Use custom meta_description
    if (categorySlug && category?.meta_description && brandSlug && brand?.meta_description) {
      return `${brand.meta_description} ${category.meta_description}`.substring(0, 155);
    }
    
    if (categorySlug && category?.meta_description) {
      return category.meta_description.substring(0, 155);
    }
    
    if (brandSlug && brand?.meta_description) {
      return brand.meta_description.substring(0, 155);
    }
    
    // Priority 2: Fallback to generated descriptions
    if (categorySlug && brandSlug) {
      const categoryName = category?.name || formatSlugToName(categorySlug);
      const brandName = brand?.name || formatSlugToName(brandSlug);
      return `Official ${brandName} ${categoryName} dealer in Kenya. Shop ${productCount} genuine products with warranty at ${siteName}. Free shipping on orders over KSH 5000.`;
    }
    
    if (categorySlug) {
      const categoryName = category?.name || formatSlugToName(categorySlug);
      const categoryDesc = category?.description || 
        `Discover our complete range of ${categoryName} at ${siteName}. Premium quality products from top brands. ${productCount} products available.`;
      return categoryDesc.substring(0, 155);
    }
    
    if (brandSlug) {
      const brandName = brand?.name || formatSlugToName(brandSlug);
      const brandDesc = brand?.description ||
        `Official ${brandName} authorized dealer in Kenya. Shop ${productCount} genuine ${brandName} car audio systems, speakers, amplifiers, and electronics at ${siteName}. All products come with warranty.`;
      return brandDesc.substring(0, 155);
    }
    
    return `Browse our complete collection of premium car audio systems, speakers, amplifiers, and electronics. ${productCount}+ products from leading brands. Shop online with confidence.`;
  };

  // NEW: Get brand-specific OG image
  const getOgImage = () => {
    if (brand?.logo) return brand.logo;
    if (category?.image) return category.image;
    if (brandSlug) return `${siteUrl}/brands/${brandSlug}-og.jpg`;
    return `${siteUrl}/og-image.jpg`;
  };

  // Generate canonical URL - IMPROVED for consistency
  const getCanonicalUrl = () => {
    if (categorySlug && brandSlug) {
      return `${siteUrl}/products/${categorySlug}?brand=${brandSlug}`;
    }
    
    if (categorySlug) {
      return `${siteUrl}/products/${categorySlug}`;
    }
    
    if (brandSlug) {
      return `${siteUrl}/products/brand/${brandSlug}`;
    }
    
    return `${siteUrl}/products`;
  };

  // Build JSON-LD Breadcrumb Schema - UPDATED
  const getBreadcrumbSchema = () => {
    const itemListElement = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${siteUrl}/products`,
      },
    ];

    let position = 3;

    if (categorySlug) {
      const categoryName = category?.name || formatSlugToName(categorySlug);
      itemListElement.push({
        '@type': 'ListItem',
        position: position++,
        name: categoryName,
        item: `${siteUrl}/products/${categorySlug}`,
      });
    }

    if (brandSlug) {
      const brandName = brand?.name || formatSlugToName(brandSlug);
      itemListElement.push({
        '@type': 'ListItem',
        position: position++,
        name: brandName,
        item: categorySlug 
          ? `${siteUrl}/products/${categorySlug}?brand=${brandSlug}`
          : `${siteUrl}/products/brand/${brandSlug}`,
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };
  };

  // NEW: Brand-specific Schema for better SEO
  const getBrandSchema = () => {
    if (!brandSlug) return null;
    
    const brandName = brand?.name || formatSlugToName(brandSlug);
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      '@id': `${siteUrl}/brands/${brandSlug}`,
      name: brandName,
      description: brand?.description || `Official ${brandName} products at ${siteName}`,
      logo: brand?.logo || `${siteUrl}/brands/${brandSlug}-logo.png`,
      url: brand?.website || `${siteUrl}/products/brand/${brandSlug}`,
      sameAs: [
        brand?.facebook || '',
        brand?.instagram || '',
        brand?.twitter || ''
      ].filter(Boolean),
      brandAudience: {
        '@type': 'PeopleAudience',
        geographicArea: {
          '@type': 'Country',
          name: 'Kenya'
        }
      }
    };
  };

  // UPDATED: CollectionPage Schema with brand integration
  const getCollectionSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: getPageTitle(),
      description: getMetaDescription(),
      url: getCanonicalUrl(),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: productCount,
        itemListOrder: 'https://schema.org/ItemListUnordered'
      }
    };

    // Add brand reference if present
    if (brandSlug) {
      schema.about = {
        '@type': 'Brand',
        name: brand?.name || formatSlugToName(brandSlug),
        url: `${siteUrl}/products/brand/${brandSlug}`
      };
    }

    return schema;
  };

  // Generate keywords - IMPROVED for brand SEO
  const getKeywords = () => {
    const keywords = [];
    
    // Priority 1: Use custom seo_keywords
    if (categorySlug && category?.seo_keywords) {
      keywords.push(category.seo_keywords);
    }
    
    if (brandSlug && brand?.seo_keywords) {
      keywords.push(brand.seo_keywords);
    }
    
    // Priority 2: Generate keywords if none provided
    if (categorySlug) {
      const categoryName = category?.name || formatSlugToName(categorySlug);
      keywords.push(
        categoryName,
        `${categoryName} Kenya`,
        `buy ${categoryName} Nairobi`,
        `${categoryName} online Kenya`,
        `best ${categoryName} Kenya 2024`
      );
    }
    
    if (brandSlug) {
      const brandName = brand?.name || formatSlugToName(brandSlug);
      keywords.push(
        brandName,
        `${brandName} Kenya`,
        `${brandName} products Nairobi`,
        `official ${brandName} dealer`,
        `${brandName} authorized Kenya`,
        `buy ${brandName} online`,
        `${brandName} car audio Kenya`
      );
    }
    
    // Local SEO keywords
    keywords.push(
      siteName,
      'car audio Nairobi',
      'car speakers Kenya',
      'car amplifiers Kenya',
      'audio electronics shop',
      'best car audio Kenya',
      'professional audio installation Nairobi'
    );
    
    return [...new Set(keywords)].join(', ');
  };

  const title = getPageTitle();
  const description = getMetaDescription();
  const canonicalUrl = getCanonicalUrl();
  const keywords = getKeywords();
  const ogImage = getOgImage();
  const brandSchema = getBrandSchema();

  return (
    <>
      {/* Page Title */}
      <Title>{title}</Title>

      {/* Basic Meta Tags */}
      <Meta name="description" content={description} />
      <Meta name="keywords" content={keywords} />

      {/* Open Graph Tags */}
      <Meta property="og:title" content={title} />
      <Meta property="og:description" content={description} />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content={canonicalUrl} />
      <Meta property="og:site_name" content={siteName} />
      <Meta property="og:image" content={ogImage} />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta property="og:image:alt" content={title} />
      <Meta property="og:locale" content="en_KE" />
      
      {/* Facebook App ID (Update with your actual ID) */}
      <Meta property="fb:app_id" content="YOUR_FB_APP_ID" />

      {/* Twitter Card */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:site" content="@soundwaveaudio" />
      <Meta name="twitter:creator" content="@soundwaveaudio" />
      <Meta name="twitter:title" content={title} />
      <Meta name="twitter:description" content={description} />
      <Meta name="twitter:image" content={ogImage} />
      <Meta name="twitter:image:alt" content={title} />

      {/* Canonical URL */}
      <HeadLink rel="canonical" href={canonicalUrl} />

      {/* Robots Meta */}
      <Meta name="robots" content="index, follow" />
      <Meta name="googlebot" content="index, follow" />

      {/* Viewport for mobile (already in HTML but reinforcing) */}
      <Meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* JSON-LD: Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbSchema()),
        }}
      />

      {/* JSON-LD: Brand Schema (for brand pages) */}
      {brandSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(brandSchema),
          }}
        />
      )}

      {/* JSON-LD: CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getCollectionSchema()),
        }}
      />

      {/* JSON-LD: Local Business Schema (from main HTML - kept for reference) */}
      {/* This is already in index.html, no need to duplicate here */}
    </>
  );
};

// Helper function to format slug to readable name
const formatSlugToName = (slug) => {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default CategoryBrandSEO;