import React from 'react';
import { SEO } from '../components/ui/SEO';
import { Hero } from '../sections/Hero';
import { CategoryStrip } from '../sections/CategoryStrip';
import { BrandStory } from '../sections/BrandStory';
import { CollectionsShowcase } from '../sections/CollectionsShowcase';
import { FeaturedFurniture } from '../sections/FeaturedFurniture';
import { MaterialsCraft } from '../sections/MaterialsCraft';
import { RealSpaces } from '../sections/RealSpaces';
import { Testimonials } from '../sections/Testimonials';
import { ServicesBridge } from '../sections/ServicesBridge';
import { StartWithSpace } from '../sections/StartWithSpace';
import { FinalCTA } from '../sections/FinalCTA';

interface HomePageProps {
  onExploreCollections: () => void;
  onExploreCollection: (collectionId: string) => void;
  onExploreServices: () => void;
  onRequestQuote: () => void;
  onContact: () => void;
  onViewProduct: (product: import('../types').Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onExploreCollections,
  onExploreCollection,
  onExploreServices,
  onRequestQuote,
  onContact,
  onViewProduct,
}) => {
  return (
    <>
      <SEO
        title="Modern Furniture for Living & Workspaces"
        description="Lube Furniture designs and crafts premium, minimalist furniture. Explore our timeless collections for residential and commercial interior spaces."
        canonicalUrl="/"
      />
      <Hero onExploreCollections={onExploreCollections} onRequestQuote={onRequestQuote} />
      <CategoryStrip onExploreCollection={onExploreCollection} />
      <BrandStory onExploreCollections={onExploreCollections} />
      <CollectionsShowcase onExploreCollection={onExploreCollection} />
      <FeaturedFurniture onViewProduct={onViewProduct} />
      <MaterialsCraft />
      <RealSpaces />
      <Testimonials />
      <ServicesBridge onExploreServices={onExploreServices} onRequestQuote={onRequestQuote} />
      <StartWithSpace onRequestQuote={onRequestQuote} onContact={onContact} />
      <FinalCTA onRequestQuote={onRequestQuote} onExploreCollections={onExploreCollections} />
    </>
  );
};
