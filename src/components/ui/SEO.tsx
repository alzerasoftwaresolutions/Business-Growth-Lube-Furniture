import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = '/assets/photo_2026-08-08_22-58-31.jpg',
  ogType = 'website',
}) => {
  // If the title already contains "Lube Furniture", don't append it again.
  const fullTitle = title.includes('Lube Furniture') ? title : `${title} | Lube Furniture`;
  const fullUrl = `https://www.lubefurniture.com${canonicalUrl}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://www.lubefurniture.com${ogImage}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={ogType} />
    </Helmet>
  );
};
