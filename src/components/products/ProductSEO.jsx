import {
  Title,
  Meta,
  Link as HeadLink,
} from 'react-head';

/**
 * Product SEO Component
 * - Handles title, meta, OG, product price
 * - Safe defaults
 * - Google Rich Results ready
 */
const ProductSEO = ({
  product,
  imageUrl,
  currency = 'KES',
  siteName = 'Sound Wave Audio',
}) => {
  if (!product) return null;

  const title =
    product.meta_title ||
    `${product.name} - ${siteName}`;

  const description =
    product.meta_description ||
    product.description?.substring(0, 160) ||
    `${product.name} available now at ${siteName}`;

  const price = product.final_price || product.price;

  // Build JSON-LD schema
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: imageUrl ? [imageUrl] : [],
    description,
    sku: product.sku,
    brand: product.brand?.name
      ? {
          '@type': 'Brand',
          name: product.brand.name,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: currency,
      price: price,
      availability: product.is_in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      {/* Title */}
      <Title>{title}</Title>

      {/* Basic Meta */}
      <Meta name="description" content={description} />

      {/* Open Graph */}
      <Meta property="og:title" content={product.name} />
      <Meta property="og:description" content={description} />
      <Meta property="og:type" content="product" />
      {imageUrl && <Meta property="og:image" content={imageUrl} />}
      <Meta property="og:site_name" content={siteName} />

      {/* Product Price */}
      {price && (
        <>
          <Meta
            property="product:price:amount"
            content={String(price)}
          />
          <Meta
            property="product:price:currency"
            content={currency}
          />
        </>
      )}

      {/* Canonical */}
      <HeadLink rel="canonical" href={window.location.href} />

      {/* JSON-LD Product Schema - Use script tag, NOT Meta */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchema),
        }}
      />
    </>
  );
};

export default ProductSEO;