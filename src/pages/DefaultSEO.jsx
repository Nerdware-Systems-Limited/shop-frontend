import { useLocation } from 'react-router-dom';
import { Title, Meta, Link } from 'react-head';

const DefaultSEO = () => {
  const location = useLocation();
  const { pathname } = location;

  // Default SEO data
  const defaultSEO = {
    title: 'Sound Wave Audio - Premium Car Audio Systems Nairobi Kenya',
    description: 'Shop premium car audio systems at Sound Wave Audio Nairobi. Professional installation of speakers, subwoofers, amplifiers & head units.',
    canonical: 'https://soundwaveaudio.co.ke/',
    ogImage: 'https://soundwaveaudio.co.ke/og-image.jpg',
    twitterImage: 'https://soundwaveaudio.co.ke/twitter-image.jpg',
  };

  // Route-specific SEO configurations
  const routeSEO = {
    '/': {
      title: 'Sound Wave Audio - Premium Car Audio Systems Nairobi Kenya',
      description: 'Shop premium car audio systems at Sound Wave Audio Nairobi. Professional installation of speakers, subwoofers, amplifiers & head units. Free delivery in CBD.',
      keywords: 'car audio nairobi, car audio kenya, car speakers, subwoofers, amplifiers, head units',
    },
    '/about': {
      title: 'About Sound Wave Audio - Kenya\'s Car Audio Specialists',
      description: 'Learn about Sound Wave Audio - Nairobi\'s premier car audio installation experts with over 10 years experience in premium audio systems.',
      keywords: 'about sound wave audio, car audio specialists nairobi, our story, professional installers',
    },
    '/contact': {
      title: 'Contact Sound Wave Audio - Car Audio Experts in Nairobi',
      description: 'Get in touch with Sound Wave Audio for car audio consultations, installations, and support. Visit our Ngara showroom.',
      keywords: 'contact car audio nairobi, visit showroom, car audio support, installation appointment',
    },
    '/cart': {
      title: 'Shopping Cart - Sound Wave Audio',
      description: 'Review your car audio products before checkout. Premium speakers, subwoofers, amplifiers and more.',
      noindex: true,
    },
    '/login': {
      title: 'Login to Sound Wave Audio',
      description: 'Access your Sound Wave Audio account to track orders, save favorites, and manage your profile.',
      noindex: true,
    },
    '/register': {
      title: 'Create Account - Sound Wave Audio',
      description: 'Register for a Sound Wave Audio account to enjoy faster checkout, order tracking, and exclusive offers.',
      noindex: true,
    },
    '/forgot-password': {
      title: 'Reset Password - Sound Wave Audio',
      description: 'Reset your Sound Wave Audio account password.',
      noindex: true,
    },
    '/reset-password': {
      title: 'Create New Password - Sound Wave Audio',
      description: 'Create a new password for your Sound Wave Audio account.',
      noindex: true,
    },
    '/profile': {
      title: 'My Account - Sound Wave Audio',
      description: 'Manage your Sound Wave Audio account, orders, and preferences.',
      noindex: true,
    },
    '/shipping': {
      title: 'Shipping Information - Sound Wave Audio',
      description: 'Enter your shipping details for car audio delivery in Nairobi and across Kenya.',
      noindex: true,
    },
    '/payment': {
      title: 'Payment Options - Sound Wave Audio',
      description: 'Complete your car audio purchase with secure payment options including M-Pesa and cards.',
      noindex: true,
    },
    '/placeorder': {
      title: 'Place Order - Sound Wave Audio',
      description: 'Review and confirm your car audio purchase.',
      noindex: true,
    },
    '/myorders': {
      title: 'My Orders - Sound Wave Audio',
      description: 'View your car audio order history and track current orders.',
      noindex: true,
    },
    '/order/:id': {
      title: 'Order Details - Sound Wave Audio',
      description: 'View detailed information about your car audio order.',
      noindex: true,
    },
    '/order/:orderNumber/success': {
      title: 'Order Confirmed - Sound Wave Audio',
      description: 'Your car audio order has been successfully placed. Thank you for shopping with Sound Wave Audio!',
      noindex: true,
    },
    '/terms': {
      title: 'Terms of Service - Sound Wave Audio',
      description: 'Read the Terms of Service for Sound Wave Audio car audio purchases and services.',
      keywords: 'terms of service, car audio terms, purchase agreement',
    },
    '/privacy': {
      title: 'Privacy Policy - Sound Wave Audio',
      description: 'Learn how Sound Wave Audio protects your personal information and privacy.',
      keywords: 'privacy policy, data protection, car audio privacy',
    },
    '/shipping-policy': {
      title: 'Shipping Policy - Sound Wave Audio Nairobi',
      description: 'Information about car audio delivery options, shipping times, and delivery charges in Kenya.',
      keywords: 'shipping policy, delivery nairobi, car audio delivery',
    },
    '/returns': {
      title: 'Returns & Exchanges - Sound Wave Audio',
      description: 'Learn about our returns and exchange policy for car audio products.',
      keywords: 'returns policy, exchanges, car audio warranty',
    },
  };

  // Helper to get SEO for current route with fallbacks
  const getSEOForRoute = () => {
    // Check exact matches first
    let seoData = routeSEO[pathname];
    
    // Check for dynamic routes (like /order/:id)
    if (!seoData) {
      for (const [route, config] of Object.entries(routeSEO)) {
        if (route.includes(':') && pathname.match(new RegExp(`^${route.replace(/:[^\s/]+/g, '([^/]+)')}$`))) {
          seoData = config;
          break;
        }
      }
    }

    return {
      ...defaultSEO,
      ...seoData,
      canonical: seoData?.canonical || `https://soundwaveaudio.co.ke${pathname}`,
    };
  };

  const seo = getSEOForRoute();
  const { title, description, keywords, canonical, noindex, ogImage, twitterImage } = seo;

  // Check if this is a products-related route that should use default SEO
  const isProductsRoute = 
    pathname.startsWith('/products/') || 
    pathname.startsWith('/product/') ||
    pathname === '/products';

  if (isProductsRoute) {
    // Return null for products routes to allow ProductSEO component to handle them
    return null;
  }

  return (
    <>
      <Title>{title}</Title>
      <Meta name="description" content={description} />
      {keywords && <Meta name="keywords" content={keywords} />}
      {noindex ? (
        <Meta name="robots" content="noindex, nofollow" />
      ) : (
        <Meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph */}
      <Meta property="og:title" content={title} />
      <Meta property="og:description" content={description} />
      <Meta property="og:url" content={canonical} />
      <Meta property="og:image" content={ogImage} />
      <Meta property="og:type" content="website" />
      <Meta property="og:site_name" content="Sound Wave Audio" />
      <Meta property="og:locale" content="en_KE" />
      
      {/* Twitter */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={title} />
      <Meta name="twitter:description" content={description} />
      <Meta name="twitter:image" content={twitterImage} />
      <Meta name="twitter:site" content="@soundwaveaudio" />
      <Meta name="twitter:creator" content="@soundwaveaudio" />
      
      {/* Canonical */}
      <Link rel="canonical" href={canonical} />
      
      {/* Alternate language versions */}
      <Link rel="alternate" hreflang="en-ke" href={canonical} />
      <Link rel="alternate" hreflang="sw-ke" href={canonical} />
      <Link rel="alternate" hreflang="x-default" href={canonical} />
      
      {/* Structured Data for non-product pages */}
      {pathname === '/' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Sound Wave Audio",
            "url": "https://soundwaveaudio.co.ke/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://soundwaveaudio.co.ke/products?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
      
      {pathname === '/contact' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Sound Wave Audio",
            "description": "Contact page for car audio inquiries",
            "url": "https://soundwaveaudio.co.ke/contact"
          })}
        </script>
      )}
      
      {pathname === '/about' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Sound Wave Audio",
            "description": "Information about Sound Wave Audio car audio services",
            "url": "https://soundwaveaudio.co.ke/about"
          })}
        </script>
      )}
    </>
  );
};

export default DefaultSEO;