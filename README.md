# Lube Furniture — Package 02 (Business Growth)

> **Client Instance:** Lube Furniture  
> **Package Tier:** Package 02 — Business Growth  
> **Archetype:** Modern Organic Craft & Minimalist Luxury Furniture Systems  
> **Version:** 1.0.0  
> **Production Status:** Ready for Client Review & Production Deployment  
> **Repository:** `https://github.com/alzerasoftwaresolutions/Business-Growth-Lube-Furniture`

---

## 1. Executive Summary & Brand Positioning

**Lube Furniture** is an implementation of **Package 02 (Business Growth)** from the Agency Playbook. It is engineered for modern craft furniture makers, modular interior systems designers, and high-end residential/commercial furnishing studios.

The digital platform bridges the gap between an **inspirational architectural publication** and a **high-converting B2B/B2C lead generation platform**, offering:
* **Curated Collection Storytelling**: Visual room galleries organized by living context (Living, Bedroom, Dining, Executive Workspace).
* **Deep Specification Inspector**: Quick-view product modals presenting precise dimensions, joinery details, and material certifications.
* **Context-Aware Request for Quote (RFQ)**: Multi-step lead capture modal pre-populated from any product or collection touchpoint.
* **Multi-Tier Service Pathways**: Dedicated consultation tracks for private homeowners, interior designers, and commercial hospitality fit-outs.

---

## 2. Visual Design System & Brand Tokens

The design system establishes a warm, mineral, and tactile aesthetic inspired by natural materials, solid timber, and Italian modernist proportion.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           COLOR PALETTE MATRIX                          │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│ Token             │ Hex Value         │ Role & Usage                    │
├───────────────────┼───────────────────┼─────────────────────────────────┤
│ bg-warm-ivory     │ #F7F5F1           │ Primary background canvas       │
│ text-dark-graphite│ #252321           │ Primary typographic ink         │
│ text-clay         │ #B8613A           │ Primary terracotta accent & CTA │
│ text-walnut       │ #6B4632           │ Warm secondary architectural ink│
│ bg-soft-white     │ #FFFFFF           │ Elevated card surface           │
│ border-lube-border│ #DCD7CF           │ Architectural hairline borders  │
│ bg-light-stone    │ #E5E0D8           │ Image placeholder base          │
└───────────────────┴───────────────────┴─────────────────────────────────┘
```

### Typography Hierarchy
* **Display Serif**: `Fraunces` / `Georgia` — Editorial headlines, collection titles, brand ethos callouts.
* **Body & UI Sans**: `Inter` — Technical specifications, navigation links, form labels, operational telemetry.

---

## 3. Information Architecture & Navigation

The platform provides 5 primary views with persistent navigation and deep contextual modals:

```text
                                  LUBE FURNITURE (SPA)
                                           │
         ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
         │                  │              │              │                  │
      HOMEPAGE         COLLECTIONS      SERVICES        ABOUT             CONTACT
         │                  │              │              │                  │
    • 12 Editorial     • 4 Room Types • 3 Growth     • Craft Ethos      • Showroom Map
      Chapters         • Live Filter    Stages       • Material Roots   • Inquiries
    • Hero Carousel    • Product Grid • Commercial   • 3 Core Pillars   • Direct Form
    • Space Selector   • Spec Modal     Programs     • Space Photo      • RFQ Banner
         │                  │              │              │                  │
         └──────────────────┴──────────────┼──────────────┴──────────────────┘
                                           │
                                  GLOBAL MODAL LAYER
                                  • RFQ Modal (Lead Capture)
                                  • Product Detail Modal (Inspector)
```

### Page Breakdown
1. **Homepage (`/`)**: 12 curated chapters guiding users from brand orientation (`Hero`, `CategoryStrip`) through social proof (`RealSpaces`, `Testimonials`) to lead capture (`FinalCTA`).
2. **Collections (`/collections`)**: Interactive collection switcher (Living, Bedroom, Dining, Workspace) featuring side-by-side room atmosphere imagery and individual product cards.
3. **Services (`/services`)**: Phased service tiers:
   * *Stage 01 — Single Room Consultation*: In-home material matching and layout guidance.
   * *Stage 02 — Complete Interior Package*: Turnkey furnishing for multi-room residences.
   * *Stage 03 — Commercial Fit-Out*: Contract-grade furniture programs for hotels, executive offices, and restaurants.
4. **About (`/about`)**: Brand philosophy highlighting material honesty, purpose-built proportions, and lifetime durability.
5. **Contact (`/contact`)**: Interactive Google Maps showroom locator, direct telephone/email contacts, and integrated inquiry submission.

---

## 4. Component Taxonomy & Architecture

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Sticky navigation with mobile drawer toggle
│   │   └── Footer.tsx              # Architectural site directory & copyright
│   ├── ui/
│   │   ├── SEO.tsx                 # Dynamic head tags & Schema.org JSON-LD
│   │   ├── PageHeader.tsx          # Editorial banner with eyebrow and subtitle
│   │   ├── RFQModal.tsx            # Contextual quote request multi-input form
│   │   └── ProductDetailModal.tsx  # Dimension & material inspector
│   ├── products/
│   │   └── ProductCard.tsx         # Hover-zoom product thumbnail card
│   ├── collections/
│   └── Analytics.tsx               # Client-side route & conversion telemetry
├── sections/                       # 12 Modular Homepage Section Components
├── pages/                          # 5 Top-Level Route Views
├── data/                           # Typed Content Fixtures (JSON/TS)
├── styles/                         # Tailwind & Global Styles
└── types/                          # TypeScript Interfaces
```

---

## 5. SEO & Structured Data Implementation

The `SEO.tsx` component automatically injects:
* **Canonical URL Tags**: Eliminates duplicate content penalties.
* **OpenGraph & Twitter Card Metadata**: High-resolution preview cards for social sharing.
* **Schema.org Structured Data**:
  * `FurnitureStore` / `LocalBusiness` entity markup.
  * Physical showroom postal address and operating hours.
  * Product catalog schema for rich search snippet indexing.

---

## 6. Testing & Quality Assurance

The codebase includes automated unit and end-to-end verification suites:

### Unit Tests (Vitest)
Verifies schema validity, data completeness, and collection mappings:
```bash
npm test
```
* `src/data/__tests__/collections.test.ts`
* `src/data/__tests__/products.test.ts`
* `src/data/__tests__/services.test.ts`
* `src/data/__tests__/materials.test.ts`

### End-to-End Tests (Playwright)
Validates cross-browser user flows and interactive modals:
```bash
npm run test:e2e
```
* `e2e/navigation.spec.ts` — Verifies view transitions across all 5 pages.
* `e2e/collections.spec.ts` — Verifies collection tabs and product inspection modal.
* `e2e/rfq-workflow.spec.ts` — Verifies quote request modal pre-population and submission.

---

## 7. Developer Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Run unit test suite
npm test

# 4. Build production bundle
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 8. Build & Deployment Artifacts

The production bundle compiles with zero external dependencies into `dist/`:
```text
dist/
├── index.html                   # HTML entry point with prerendered meta tags
└── assets/
    ├── index-[hash].css         # Minified Tailwind & typography CSS (~6 kB gzip)
    └── index-[hash].js          # Compressed application bundle (~73 kB gzip)
```

Deployable to any modern edge hosting environment (Vercel, Cloudflare Pages, Netlify, AWS S3 / CloudFront) with zero server-side runtime overhead.
