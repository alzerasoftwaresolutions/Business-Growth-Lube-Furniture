import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = '/assets/photo_2026-08-08_22-58-31.jpg',
  ogType = 'website',
  schema,
}) => {
  // If the title already contains "Lube Furniture", don't append it again.
  const fullTitle = title.includes('Lube Furniture') ? title : `${title} | Lube Furniture`;
  const fullUrl = `https://www.lubefurniture.com${canonicalUrl}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `https://www.lubefurniture.com${ogImage}`;

  // Default Organization & LocalBusiness schema
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'Lube Furniture',
    url: 'https://www.lubefurniture.com',
    logo: 'https://www.lubefurniture.com/assets/photo_2026-08-08_22-58-31.jpg',
    description: 'Lube Furniture designs and crafts premium, minimalist furniture and interior modular systems for residential and commercial spaces.',
    telephone: '+00 000 000 0000',
    email: 'hello@lubefurniture.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mariyam Sefer, Ayer Tena',
      addressLocality: 'Addis Ababa',
      addressCountry: 'ET',
    },
    priceRange: '$$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '18:00',
      },
    ],
  };

  const finalSchema = schema ?? defaultSchema;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={ogType} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};
