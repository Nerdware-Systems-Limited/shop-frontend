import { Title, Meta, Link } from 'react-head';
import { useLocation } from 'react-router-dom';

/**
 * Global SEO Component
 * Use this on every page that doesn't have specific SEO needs
 * For product pages, use ProductSEO.jsx instead
 */
const SEOHead = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  noindex = false,
  nofollow = false,
  canonical,
  structuredData,
}) => {
  const location = useLocation();
  const siteName = 'Sound Wave Audio';
  const siteUrl = process.env.VITE_API_URL || 'https://soundwaveaudio.co.ke';
  
  // Build full URL for canonical and OG
  const fullUrl = canonical || `${siteUrl}${location.pathname}${location.search}`;
  
  // Default values
  const defaultTitle = 'Sound Wave Audio - Premium Car Audio Systems Kenya';
  const defaultDescription = 'Kenya\'s premier destination for high-quality car audio systems. Shop speakers, subwoofers, amplifiers, and complete car audio installations.';
  const defaultImage = `${siteUrl}/og-image.jpg`; // Add a default OG image
  const defaultKeywords = 'car audio, car speakers, subwoofers, amplifiers, car audio installation, Kenya, Nairobi';
  
  const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const finalKeywords = keywords || defaultKeywords;
  
  // Organization Schema (for homepage)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+254-724-013-583",
      "contactType": "customer service",
      "areaServed": "KE",
      "availableLanguage": ["English", "Swahili"]
    },
    "sameAs": [
      "https://facebook.com/soundwaveaudio",
      "https://instagram.com/soundwaveaudio",
      "https://twitter.com/soundwaveaudio"
    ]
  };
  
  // WebSite Schema with search action
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  
  // Breadcrumb Schema
  const breadcrumbSchema = location.pathname !== '/' ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": generateBreadcrumbs(location.pathname)
  } : null;
  
  return (
    <>
      {/* Basic Meta Tags */}
      <Title>{finalTitle}</Title>
      <Meta name="description" content={finalDescription} />
      <Meta name="keywords" content={finalKeywords} />
      
      {/* Robots */}
      {(noindex || nofollow) && (
        <Meta 
          name="robots" 
          content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} 
        />
      )}
      
      {/* Canonical */}
      <Link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <Meta property="og:type" content={type} />
      <Meta property="og:title" content={finalTitle} />
      <Meta property="og:description" content={finalDescription} />
      <Meta property="og:image" content={finalImage} />
      <Meta property="og:url" content={fullUrl} />
      <Meta property="og:site_name" content={siteName} />
      <Meta property="og:locale" content="en_KE" />
      
      {/* Twitter Card */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={finalTitle} />
      <Meta name="twitter:description" content={finalDescription} />
      <Meta name="twitter:image" content={finalImage} />
      
      {/* Geographic Tags */}
      <Meta name="geo.region" content="KE" />
      <Meta name="geo.placename" content="Nairobi" />
      
      {/* Mobile */}
      <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <Meta name="theme-color" content="#000000" />
      
      {/* Structured Data */}
      {location.pathname === '/' && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema)
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema)
            }}
          />
        </>
      )}
      
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      )}
      
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </>
  );
};

// Generate breadcrumb structured data from path
const generateBreadcrumbs = (pathname) => {
  const paths = pathname.split('/').filter(Boolean);
  const siteUrl = 'https://soundwaveaudio.co.ke';
  
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    }
  ];
  
  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    breadcrumbs.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      "item": `${siteUrl}${currentPath}`
    });
  });
  
  return breadcrumbs;
};

export default SEOHead;