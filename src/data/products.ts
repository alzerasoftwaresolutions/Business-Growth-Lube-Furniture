import { Product } from '../types';

export const productsData: Product[] = [
  {
    id: 'arbor-lounge-chair',
    name: 'Arbor Lounge Chair',
    collectionId: 'living',
    shortDescription: 'Deep sculptural lounge chair with solid walnut timber frame and bouclé upholstery.',
    fullDescription: 'The Arbor Lounge Chair is defined by its exposed timber joints and enveloping back profile. Hand-finished solid walnut curves gently around textured belgian linen upholstery, delivering exceptional ergonomic support for quiet reading or living space relaxed seating.',
    image: '/assets/photo_2026-08-08_22-56-56.jpg',
    gallery: [
      '/assets/photo_2026-08-08_22-56-56.jpg',
      '/assets/photo_2026-08-08_22-57-51.jpg',
      '/assets/photo_2026-08-08_22-57-59.jpg'
    ],
    materials: ['Solid American Walnut', 'Textured Belgian Linen', 'High-Resilience Bio-Foam'],
    dimensions: 'W: 88cm × D: 92cm × H: 76cm (Seat H: 41cm)',
    isFeatured: true,
    isMainFeatured: true,
    contextTag: 'Living / Accent Seating',
    badge: 'Featured',
    swatches: ['#6B4632', '#C9BEB0', '#8A8378']
  },
  {
    id: 'form-dining-chair',
    name: 'Form Dining Chair',
    collectionId: 'dining',
    shortDescription: 'Stackable minimalist dining chair with steam-bent oak backrest and precision steel joints.',
    fullDescription: 'Designed for high-use residential and hospitality dining, the Form Dining Chair strips away excess while prioritizing back comfort. Made with sustainably sourced European oak and concealed steel hardware.',
    image: '/assets/photo_2026-08-08_22-59-42.jpg',
    gallery: [
      '/assets/photo_2026-08-08_22-59-42.jpg',
      '/assets/photo_2026-08-08_22-58-08.jpg'
    ],
    materials: ['Solid Natural Oak', 'Matte Anodized Steel Core', 'Wool Blend Cushion'],
    dimensions: 'W: 52cm × D: 54cm × H: 79cm (Seat H: 45cm)',
    isFeatured: true,
    isMainFeatured: false,
    contextTag: 'Dining / Hospitality',
    swatches: ['#D9C7A7', '#6B4632', '#3E3A36']
  },
  {
    id: 'line-coffee-table',
    name: 'Line Coffee Table',
    collectionId: 'living',
    shortDescription: 'Low horizontal coffee table featuring honed travertine marble atop a chamfered timber base.',
    fullDescription: 'A study in tactile contrast, the Line Coffee Table pairs heavy natural travertine with lightweight, floating white oak framing. Subtle shadow lines give the stone top a weightless architectural presence.',
    image: '/assets/photo_2026-08-08_23-00-39.jpg',
    gallery: [
      '/assets/photo_2026-08-08_23-00-39.jpg'
    ],
    materials: ['Honed Italian Travertine', 'Solid White Oak Base', 'Natural Wax Finish'],
    dimensions: 'W: 140cm × D: 70cm × H: 34cm',
    isFeatured: true,
    isMainFeatured: false,
    contextTag: 'Living / Central Table'
  },
  {
    id: 'haven-bed',
    name: 'Haven Bed',
    collectionId: 'bedroom',
    shortDescription: 'Low-profile upholstered platform bed with integrated oak side shelving and soft headboard.',
    fullDescription: 'The Haven Bed offers a quiet visual grounding for the bedroom. Integrated cantilevered nightstands extend smoothly from the headboard structure, reducing bedroom clutter and emphasizing clean architectural planes.',
    image: '/assets/photo_2026-08-08_23-00-27.jpg',
    gallery: [
      '/assets/photo_2026-08-08_23-00-27.jpg'
    ],
    materials: ['White Oak Timber', 'Woven Neutral Upholstery', 'Plywood Slat Support System'],
    dimensions: 'King Size: W: 210cm × L: 225cm × H: 98cm',
    isFeatured: true,
    isMainFeatured: false,
    contextTag: 'Bedroom / Platform System',
    swatches: ['#D9C7A7', '#B7AC9B', '#8A8378']
  },
  {
    id: 'column-dining-table',
    name: 'Column Dining Table',
    collectionId: 'dining',
    shortDescription: 'Monolithic oval dining table supported by dual fluted solid timber pedestal columns.',
    fullDescription: 'Designed for memorable gatherings, the Column Table combines an expansive pill-shaped top with twin cylindrical bases featuring subtle vertical fluting details.',
    image: '/assets/photo_2026-08-08_22-57-28.jpg',
    gallery: [
      '/assets/photo_2026-08-08_22-57-28.jpg'
    ],
    materials: ['Solid European Oak', 'Internal Steel Reinforcement', 'Matte Lacquer'],
    dimensions: 'W: 240cm × D: 110cm × H: 75cm',
    isFeatured: false,
    contextTag: 'Dining / Statements'
  },
  {
    id: 'modulo-desk',
    name: 'Modulo Executive Desk',
    collectionId: 'office',
    shortDescription: 'Minimalist desk system with subtle cable integration and soft tactile leather writing inset.',
    fullDescription: 'Designed for focus and professional elegance, Modulo offers concealed power channels and a hand-stitched leather writing pad inset into rich American walnut timber.',
    image: '/assets/photo_2026-08-08_22-57-32.jpg',
    gallery: [
      '/assets/photo_2026-08-08_22-57-32.jpg'
    ],
    materials: ['Solid American Walnut', 'Saddle Leather Inset', 'Powder-coated Aluminum Frame'],
    dimensions: 'W: 180cm × D: 85cm × H: 74cm',
    isFeatured: false,
    contextTag: 'Workspace / Executive'
  },
  {
    id: 'strata-sofa',
    name: 'Strata Modular Sofa',
    collectionId: 'living',
    shortDescription: 'Architectural sectional sofa with deeply cushioned seats and low natural timber trim.',
    fullDescription: 'Strata adapts to diverse living room layouts through clean modular components. Premium multi-density foam core wrapped in feather down ensures plush, enduring comfort.',
    image: '/assets/photo_2026-08-08_23-00-32.jpg',
    gallery: [
      '/assets/photo_2026-08-08_23-00-32.jpg'
    ],
    materials: ['Heavy-weight Textured Wool', 'Down Feather Blend', 'FSC Oak Plinth'],
    dimensions: 'Width Configurable: 280cm × 180cm × H: 68cm',
    isFeatured: false,
    contextTag: 'Living / Modular'
  },
  {
    id: 'atelier-credenza',
    name: 'Atelier Low Credenza',
    collectionId: 'living',
    shortDescription: 'Slatted timber sideboard with sliding acoustic felt doors and soft interior lighting.',
    fullDescription: 'Atelier brings refined storage to dining and living environments. Precision vertical slats create visual rhythm while concealing AV gear or dining accessories.',
    image: '/assets/photo_2026-08-08_22-59-50.jpg',
    gallery: [
      '/assets/photo_2026-08-08_22-59-50.jpg'
    ],
    materials: ['Smoked Ash Timber', 'Acoustic Felt Lining', 'Soft-Close Hardware'],
    dimensions: 'W: 200cm × D: 48cm × H: 62cm',
    isFeatured: false,
    contextTag: 'Living & Dining / Storage'
  },
  {
    id: 'horizon-wardrobe',
    name: 'Horizon Open Wardrobe',
    collectionId: 'bedroom',
    shortDescription: 'Minimalist open wardrobe system featuring a white marble base and integrated LED lighting.',
    fullDescription: 'Designed for a boutique display feel, the Horizon Open Wardrobe combines clear visibility with elegant structural framing, perfect for organizing and showcasing your curated wardrobe.',
    image: '/assets/photo_2026-08-08_22-57-51.jpg',
    gallery: ['/assets/photo_2026-08-08_22-57-51.jpg'],
    materials: ['White Marble', 'Powder-coated Steel', 'LED Accents'],
    dimensions: 'W: 180cm × D: 55cm × H: 220cm',
    isFeatured: false,
    contextTag: 'Bedroom / Storage'
  },
  {
    id: 'classic-double-wardrobe',
    name: 'Classic Double Wardrobe',
    collectionId: 'bedroom',
    shortDescription: 'Spacious freestanding wardrobe with clean white paneled doors and ample internal shelving.',
    fullDescription: 'A timeless storage solution for any bedroom space. This classic wardrobe features smooth-closing double doors and adjustable internal shelves for tailored organization.',
    image: '/assets/photo_2026-08-08_22-58-38.jpg',
    gallery: ['/assets/photo_2026-08-08_22-58-38.jpg'],
    materials: ['Painted MDF', 'Solid Wood Frame', 'Brushed Nickel Hardware'],
    dimensions: 'W: 120cm × D: 60cm × H: 200cm',
    isFeatured: false,
    contextTag: 'Bedroom / Storage'
  },
  {
    id: 'aura-vanity-unit',
    name: 'Aura Vanity Unit',
    collectionId: 'bedroom',
    shortDescription: 'Elegant floating vanity station with soft arched backlighting and seamless drawers.',
    fullDescription: 'Transform your morning routine with the Aura Vanity Unit. Its floating design creates an illusion of space, while the ambient backlit mirror provides the perfect glow for preparation.',
    image: '/assets/photo_2026-08-08_23-00-36.jpg',
    gallery: ['/assets/photo_2026-08-08_23-00-36.jpg'],
    materials: ['Engineered Wood', 'Mirrored Glass', 'LED Lighting'],
    dimensions: 'W: 100cm × D: 45cm × H: 180cm',
    isFeatured: false,
    contextTag: 'Bedroom / Vanity'
  },
  {
    id: 'island-kitchen-unit',
    name: 'Island Kitchen Unit',
    collectionId: 'dining',
    shortDescription: 'Custom dual-tone kitchen island featuring expansive prep space and integrated under-counter storage.',
    fullDescription: 'The centerpiece of modern dining and entertaining. This substantial island provides robust prep surfaces alongside cleverly concealed storage for a seamless culinary experience.',
    image: '/assets/photo_2026-08-08_22-58-31.jpg',
    gallery: ['/assets/photo_2026-08-08_22-58-31.jpg'],
    materials: ['Quartz Top', 'Painted Timber Cabinetry', 'Soft-Close Hinges'],
    dimensions: 'W: 240cm × D: 120cm × H: 92cm',
    isFeatured: false,
    contextTag: 'Dining / Kitchen Island'
  },
  {
    id: 'natural-timber-cabinetry',
    name: 'Natural Timber Cabinetry',
    collectionId: 'dining',
    shortDescription: 'Warm timber-finished kitchen cabinetry with a minimalist flat-panel design.',
    fullDescription: 'Bring organic warmth to your dining and kitchen spaces. This cabinetry features flat-panel doors showcasing natural wood grain, offering durable storage for culinary essentials.',
    image: '/assets/photo_2026-08-08_22-58-34.jpg',
    gallery: ['/assets/photo_2026-08-08_22-58-34.jpg'],
    materials: ['Oak Veneer', 'Plywood Core', 'Integrated Pulls'],
    dimensions: 'Custom Modular Configuration',
    isFeatured: false,
    contextTag: 'Dining / Cabinetry'
  },
  {
    id: 'archive-open-bookcase',
    name: 'Archive Open Bookcase',
    collectionId: 'office',
    shortDescription: 'Tall architectural open shelving unit crafted in crisp white.',
    fullDescription: 'Perfect for displaying books, art, and organizing office files, the Archive Bookcase offers a lightweight aesthetic with serious structural integrity for any workspace.',
    image: '/assets/photo_2026-08-08_23-00-14.jpg',
    gallery: ['/assets/photo_2026-08-08_23-00-14.jpg'],
    materials: ['Powder-coated Steel', 'Painted Wood Shelves'],
    dimensions: 'W: 160cm × D: 35cm × H: 210cm',
    isFeatured: false,
    contextTag: 'Workspace / Shelving'
  },
  {
    id: 'timber-storage-lockers',
    name: 'Timber Storage Lockers',
    collectionId: 'office',
    shortDescription: 'Modular wooden locker system designed for collaborative workspaces.',
    fullDescription: 'Providing secure and warm-toned personal storage, these timber lockers introduce natural texture into the office while keeping personal belongings organized and safe.',
    image: '/assets/photo_2026-08-08_23-00-06.jpg',
    gallery: ['/assets/photo_2026-08-08_23-00-06.jpg'],
    materials: ['Ash Veneer', 'Secure Lock Mechanisms', 'Recessed Handles'],
    dimensions: 'W: 120cm × D: 45cm × H: 180cm',
    isFeatured: false,
    contextTag: 'Workspace / Storage'
  },
  {
    id: 'studio-wall-shelving',
    name: 'Studio Wall Shelving',
    collectionId: 'office',
    shortDescription: 'Minimal wall-to-wall open shelving with adjustable tiers.',
    fullDescription: 'Designed to keep creative studios organized and inspiring. This wall-mounted system offers ultimate flexibility to adjust shelf heights based on your storage needs.',
    image: '/assets/photo_2026-08-08_23-00-51.jpg',
    gallery: ['/assets/photo_2026-08-08_23-00-51.jpg'],
    materials: ['White Melamine', 'Aluminum Wall Tracks'],
    dimensions: 'W: 240cm × D: 30cm × H: Adjustable',
    isFeatured: false,
    contextTag: 'Workspace / Wall Storage'
  }
];
