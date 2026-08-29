import { Service } from '../types';

export const servicesData: Service[] = [
  {
    id: 'furniture-consultation',
    number: '01',
    title: 'Furniture Consultation',
    tagline: 'Talk through your space, needs, and direction.',
    description: 'A personal or virtual session with our design specialists to evaluate floor plans, spatial flow, material pairings, and acoustic requirements for your specific interior environment.',
    details: [
      'Spatial layout analysis & proportion guidance',
      'Material swatch & finish selection',
      'Custom sizing & upholstery consultations',
      'Architectural drawing review'
    ],
    suitableFor: 'Homeowners, Interior Architects, Private Studios',
    image: '/assets/photo_2026-08-08_22-58-31.jpg'
  },
  {
    id: 'furniture-solutions',
    number: '02',
    title: 'Furniture Solutions',
    tagline: 'Explore pieces and combinations suited to your environment.',
    description: 'Tailored curation packages that combine complementary furniture families across living, dining, or workspace environments with unified finishes and guaranteed delivery schedules.',
    details: [
      'Complete room & multi-room furniture packages',
      'Unified wood grain & fabric color matching',
      'White-glove delivery & professional installation',
      'Long-term maintenance & care documentation'
    ],
    suitableFor: 'Full Home Renovations, Boutique Offices, Executive Suites',
    image: '/assets/photo_2026-08-08_22-58-34.jpg'
  },
  {
    id: 'commercial-hospitality',
    number: '03',
    title: 'Commercial & Hospitality',
    tagline: 'Furniture solutions for larger and professionally designed spaces.',
    description: 'High-durability, contract-grade specifications tailored for hotels, restaurants, shared corporate hubs, and high-traffic public spaces requiring rigorous performance standard certifications.',
    details: [
      'Contract-grade upholstery & fire-retardant foam standards',
      'Volume pricing & commercial RFQ fulfillment',
      'Custom dimension adaptations for public scale',
      'Dedicated project account management'
    ],
    suitableFor: 'Hotels, Restaurants, Commercial Offices, Real Estate Developments',
    image: '/assets/photo_2026-08-08_22-58-38.jpg'
  }
];
