import { SolutionModule, SolutionManifest } from '../types';

export const cmsManifest: SolutionManifest = {
  id: 'cms-proof',
  name: 'Dynamic Material Specs CMS Proof',
  version: '1.0.0',
  description: 'Proof of concept CMS solution for dynamic timber specifications and bespoke finish resolution.',
  capabilities: ['cms'],
  defaultEnabled: false,
};

const dynamicWoodOverrides: Record<string, unknown> = {
  'hero:tagline': 'Handcrafted from Sustainable Ethiopian Walnut & Teak',
  'contract:leadTime': 'Standard Architectural Joinery: 4-6 Weeks Turnaround',
};

export const cmsProofModule: SolutionModule = {
  manifest: cmsManifest,
  resolveContent: async <T,>(key: string, defaultContent: T): Promise<T> => {
    if (key in dynamicWoodOverrides) {
      return dynamicWoodOverrides[key] as T;
    }
    return defaultContent;
  },
};
