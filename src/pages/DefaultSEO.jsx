import { useLocation } from 'react-router-dom';
import { Title, Meta, Link } from 'react-head';

/**
 * DefaultSEO Component
 * 
 * USAGE RULES:
 * - Only use on static pages (Home, About, Contact, Terms, Privacy, etc.)
 * - DO NOT use on: /products/*, /product/*, (handled by CategoryBrandSEO and ProductSEO)
 * - Provides fallback SEO when specialized components aren't present
 */
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
      title: 'Sound Wave Audio - Premium Car Audio Systems Nairobi Kenya | Official Store',
      description: 'Kenya\'s #1 car audio shop. Professional installation of Pioneer, Sony, Kenwood, Nakamichi car speakers, subwoofers, amplifiers & head units. Free CBD delivery. Visit our Ngara showroom.',
      keywords: 'car audio nairobi, car speakers kenya, subwoofers nairobi, amplifiers kenya, head units, car audio installation, pioneer kenya, sony car audio',
    },
    '/about': {
      title: 'About Sound Wave Audio - Kenya\'s Premier Car Audio Specialists',
      description: 'Discover Sound Wave Audio\'s story. Over 13 years of excellence in car audio installation, premium brands, and expert service in Nairobi. Meet our team of certified technicians.',
      keywords: 'about sound wave audio, car audio specialists nairobi, our story, professional installers kenya, certified technicians',
    },
    '/contact': {
      title: 'Contact Sound Wave Audio - Visit Our Ngara Showroom | Car Audio Nairobi',
      description: 'Get in touch with Sound Wave Audio. Visit our Ngara showroom, call +254 724 013 583, or book a car audio consultation. Open Mon-Sat 8AM-6PM.',
      keywords: 'contact car audio nairobi, visit showroom ngara, car audio support, installation appointment, sound wave audio location',
    },
    '/cart': {
      title: 'Shopping Cart - Sound Wave Audio',
      description: 'Review your car audio products before checkout. Secure payment via M-Pesa, cards. Free delivery on orders over KSH 5,000.',
      noindex: true,
    },
    '/login': {
      title: 'Login - Sound Wave Audio Account',
      description: 'Access your Sound Wave Audio account to track orders, save favorites, and manage your profile.',
      noindex: true,
    },
    '/register': {
      title: 'Create Account - Join Sound Wave Audio',
      description: 'Register for a Sound Wave Audio account to enjoy faster checkout, exclusive offers, and order tracking.',
      noindex: true,
    },
    '/forgot-password': {
      title: 'Reset Password - Sound Wave Audio',
      description: 'Reset your Sound Wave Audio account password securely.',
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
      title: 'Shipping Information - Sound Wave Audio Checkout',
      description: 'Enter your shipping details for car audio delivery in Nairobi and across Kenya.',
      noindex: true,
    },
    '/payment': {
      title: 'Payment - Secure Checkout | Sound Wave Audio',
      description: 'Complete your purchase with M-Pesa, Visa, or Mastercard. 100% secure payment.',
      noindex: true,
    },
    '/placeorder': {
      title: 'Confirm Order - Sound Wave Audio',
      description: 'Review and confirm your car audio purchase.',
      noindex: true,
    },
    '/myorders': {
      title: 'My Orders - Sound Wave Audio Account',
      description: 'View your order history and track current car audio orders.',
      noindex: true,
    },
    '/terms': {
      title: 'Terms of Service - Sound Wave Audio Kenya',
      description: 'Read the Terms of Service for Sound Wave Audio car audio purchases, warranties, and services in Kenya.',
      keywords: 'terms of service, car audio terms, purchase agreement, warranty terms kenya',
    },
    '/privacy': {
      title: 'Privacy Policy - How Sound Wave Audio Protects Your Data',
      description: 'Learn how Sound Wave Audio protects your personal information, handles data, and respects your privacy in Kenya.',
      keywords: 'privacy policy, data protection kenya, car audio privacy, personal information',
    },
    '/shipping-policy': {
      title: 'Shipping & Delivery Policy - Sound Wave Audio Kenya',
      description: 'Car audio delivery across Kenya. Free CBD delivery on orders over KSH 5,000. 24-48hr Nairobi delivery. Nationwide shipping available.',
      keywords: 'shipping policy, delivery nairobi, car audio delivery kenya, free shipping cbd',
    },
    '/returns': {
      title: 'Returns & Exchange Policy - Sound Wave Audio Warranty',
      description: '14-day return policy on car audio products. All items come with manufacturer warranty. Learn about our exchange process.',
      keywords: 'returns policy, exchanges, car audio warranty, money back guarantee',
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

  // ❌ IMPORTANT: Return null for routes handled by specialized SEO components
  const isProductsRoute = 
    pathname.startsWith('/products/') || 
    pathname.startsWith('/product/') ||
    pathname === '/products';

  if (isProductsRoute) {
    // Let ProductSEO or CategoryBrandSEO handle these routes
    return null;
  }

  // ✅ Generate breadcrumb for non-product pages
  const getBreadcrumbSchema = () => {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://soundwaveaudio.co.ke/',
      },
    ];

    // Add current page to breadcrumb if not home
    if (pathname !== '/') {
      const pageName = routeSEO[pathname]?.title?.split('-')[0]?.trim() || 
                       pathname.split('/').pop().replace(/-/g, ' ');
      
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: pageName,
        item: `https://soundwaveaudio.co.ke${pathname}`,
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };
  };

  // ✅ Generate FAQ schema for specific pages
  const getFAQSchema = () => {
    if (pathname === '/' || pathname === '/about') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Do you install car audio systems in Nairobi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Sound Wave Audio provides professional car audio installation services in Nairobi and surrounding areas. Our certified technicians install speakers, subwoofers, amplifiers, and head units. Book an appointment by calling +254 724 013 583.',
            },
          },
          {
            '@type': 'Question',
            name: 'What car audio brands do you stock?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We stock premium brands including Pioneer, Sony, Kenwood, Nakamichi, JVC, Blaupunkt, Skar Audio, and Taramps. All products are 100% genuine with manufacturer warranty.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer delivery in Kenya?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! We offer free delivery within Nairobi CBD for orders over KSH 5,000. We also deliver nationwide across Kenya. Nairobi orders typically arrive within 24-48 hours.',
            },
          },
          {
            '@type': 'Question',
            name: 'What payment methods do you accept?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We accept M-Pesa, Visa, Mastercard, and cash payments. All online payments are processed securely through our encrypted payment gateway.',
            },
          },
        ],
      };
    }
    return null;
  };

  const breadcrumbSchema = getBreadcrumbSchema();
  const faqSchema = getFAQSchema();

  return (
    <>
      {/* Page Title */}
      <Title>{title}</Title>

      {/* Basic Meta Tags */}
      <Meta name="description" content={description} />
      {keywords && <Meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      {noindex ? (
        <Meta name="robots" content="noindex, nofollow" />
      ) : (
        <Meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Open Graph */}
      <Meta property="og:title" content={title} />
      <Meta property="og:description" content={description} />
      <Meta property="og:url" content={canonical} />
      <Meta property="og:image" content={ogImage} />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta property="og:image:alt" content={title} />
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
      
      {/* JSON-LD: Breadcrumb */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}

      {/* JSON-LD: FAQ (for home/about) */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
      
      {/* JSON-LD: WebPage for specific pages */}
      {pathname === '/contact' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: 'Contact Sound Wave Audio',
              description: description,
              url: canonical,
            }),
          }}
        />
      )}
      
      {pathname === '/about' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AboutPage',
              name: 'About Sound Wave Audio',
              description: description,
              url: canonical,
            }),
          }}
        />
      )}
    </>
  );
};

export default DefaultSEO;