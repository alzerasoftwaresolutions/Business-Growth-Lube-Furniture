import { describe, it, expect, beforeEach } from 'vitest';
import { SolutionRegistry } from '../registry';
import { sendLeadToSolution } from '../leadAdapter';
import { resolveSolutionContent } from '../contentAdapter';
import { SolutionModule, LeadSubmission } from '../types';

describe('Solution Integration Foundation - Adapters (Lube Furniture)', () => {
  let registry: SolutionRegistry;

  beforeEach(() => {
    registry = new SolutionRegistry();
  });

  describe('Lead Adapter (sendLeadToSolution)', () => {
    const sampleLead: LeadSubmission = {
      fullName: 'Marcus Vance',
      email: 'marcus@vancestudio.com',
      subject: 'Architectural Timber Joinery',
      projectType: 'Hospitality',
      message: 'Need 12 custom teak dining tables for resort renovation.',
    };

    it('falls back to Core submission function when no solution is active', async () => {
      let coreExecuted = false;
      const coreFallback = async () => {
        coreExecuted = true;
        return { success: true, message: 'Core message logged successfully.' };
      };

      const result = await sendLeadToSolution(sampleLead, coreFallback, registry);

      expect(coreExecuted).toBe(true);
      expect(result.handledBySolution).toBe(false);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Core message logged successfully.');
    });

    it('routes to active solution when solution implements onLeadSubmitted', async () => {
      let solutionReceived: LeadSubmission | null = null;
      let coreExecuted = false;

      const solutionModule: SolutionModule = {
        manifest: {
          id: 'contract-crm',
          name: 'Contract CRM Solution',
          version: '1.0.0',
          capabilities: ['inquiry'],
        },
        onLeadSubmitted: async (lead) => {
          solutionReceived = lead;
          return { success: true, message: 'Saved to Furniture Studio Pipeline.', leadId: 'lead-888' };
        },
      };

      registry.register(solutionModule);
      await registry.init({
        version: '1.0.0',
        solutions: { 'contract-crm': { enabled: true } },
      });

      const coreFallback = async () => {
        coreExecuted = true;
        return { success: true, message: 'Core fallback' };
      };

      const result = await sendLeadToSolution(sampleLead, coreFallback, registry);

      expect(solutionReceived).toEqual(sampleLead);
      expect(coreExecuted).toBe(false);
      expect(result.handledBySolution).toBe(true);
      expect(result.success).toBe(true);
      expect(result.leadId).toBe('lead-888');
      expect(result.message).toBe('Saved to Furniture Studio Pipeline.');
    });

    it('returns explicit failure and does NOT silently execute Core fallback if active solution throws', async () => {
      let coreExecuted = false;

      const crashingSolution: SolutionModule = {
        manifest: {
          id: 'crashing-sink',
          name: 'Crashing Sink',
          version: '1.0.0',
          capabilities: ['inquiry'],
        },
        onLeadSubmitted: async () => {
          throw new Error('Showroom CRM API gateway timeout');
        },
      };

      registry.register(crashingSolution);
      await registry.init({
        version: '1.0.0',
        solutions: { 'crashing-sink': { enabled: true } },
      });

      const coreFallback = async () => {
        coreExecuted = true;
        return { success: true, message: 'Core fallback' };
      };

      const result = await sendLeadToSolution(sampleLead, coreFallback, registry);

      // Must be handled by solution with explicit failure
      expect(result.handledBySolution).toBe(true);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Showroom CRM API gateway timeout');
      // Core fallback must NOT be called silently!
      expect(coreExecuted).toBe(false);
    });
  });

  describe('Content Adapter (resolveSolutionContent)', () => {
    it('returns default Core content when no solution is active', async () => {
      const result = await resolveSolutionContent('wood:grade', 'Grade A Ethiopian Teak', registry);
      expect(result).toBe('Grade A Ethiopian Teak');
    });

    it('returns dynamic solution content when active solution resolves key', async () => {
      const cmsModule: SolutionModule = {
        manifest: {
          id: 'cms-mod',
          name: 'CMS Module',
          version: '1.0.0',
          capabilities: ['cms'],
        },
        resolveContent: async <T,>(key: string, defaultVal: T): Promise<T> => {
          if (key === 'wood:grade') {
            return 'Custom Kiln-Dried Smoked Oak' as unknown as T;
          }
          return defaultVal;
        },
      };

      registry.register(cmsModule);
      await registry.init({
        version: '1.0.0',
        solutions: { 'cms-mod': { enabled: true } },
      });

      const result = await resolveSolutionContent('wood:grade', 'Grade A Ethiopian Teak', registry);
      expect(result).toBe('Custom Kiln-Dried Smoked Oak');

      const unhandled = await resolveSolutionContent('other:key', 'Fallback Finish', registry);
      expect(unhandled).toBe('Fallback Finish');
    });
  });
});
