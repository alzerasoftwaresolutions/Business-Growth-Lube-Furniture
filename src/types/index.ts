export type PageType = 'home' | 'collections' | 'services' | 'about' | 'contact';

export type CollectionCategory = 'living' | 'bedroom' | 'dining' | 'office';

export interface Collection {
  id: CollectionCategory;
  name: string;
  tagline: string;
  description: string;
  image: string;
  editorialSize: 'large' | 'small' | 'wide' | 'medium';
  itemCountLabel: string;
}

export interface Product {
  id: string;
  name: string;
  collectionId: CollectionCategory;
  shortDescription: string;
  fullDescription: string;
  image: string;
  gallery: string[];
  materials: string[];
  dimensions: string;
  isFeatured?: boolean;
  isMainFeatured?: boolean;
  contextTag?: string;
  badge?: string;
  swatches?: string[];
}

export interface Service {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  details: string[];
  suitableFor: string;
  image: string;
}

export interface MaterialDetail {
  id: string;
  title: string;
  category: 'Wood' | 'Fabric' | 'Joinery' | 'Finish';
  description: string;
  image: string;
}

export interface RFQFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType: 'Home' | 'Office' | 'Hospitality' | 'Other' | '';
  selectedCollection?: string;
  selectedProduct?: string;
  message: string;
  timeframe?: string;
}
