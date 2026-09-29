import React from 'react';
import {
  SolutionModule,
  SolutionRegistrationEntry,
  SolutionStatus,
  SolutionsConfig,
  LeadSubmission,
  LeadSubmissionResult,
} from './types';

export class SolutionRegistry {
  private entries: Map<string, SolutionRegistrationEntry> = new Map();
  private initialized: boolean = false;

  public register(module: SolutionModule): void {
    if (!module || !module.manifest || !module.manifest.id) {
      throw new Error('[SolutionRegistry] Invalid module: manifest with id is required.');
    }
    const id = module.manifest.id;
    if (this.entries.has(id)) {
      console.warn(`[SolutionRegistry] Module "${id}" is already registered. Overwriting registration.`);
    }
    this.entries.set(id, {
      module,
      status: 'registered',
      config: module.manifest.config || {},
    });
  }

  public applyConfig(config: SolutionsConfig): void {
    if (!config || typeof config.solutions !== 'object') {
      return;
    }
    for (const [id, cfg] of Object.entries(config.solutions)) {
      const entry = this.entries.get(id);
      if (entry) {
        entry.config = { ...entry.config, ...(cfg.config || {}) };
        if (cfg.enabled === false) {
          entry.status = 'disabled';
        }
      }
    }
  }

  public async init(config?: SolutionsConfig): Promise<void> {
    if (config) {
      this.applyConfig(config);
    }

    for (const [id, entry] of this.entries.entries()) {
      if (entry.status === 'disabled') {
        continue;
      }

      try {
        if (typeof entry.module.init === 'function') {
          await entry.module.init({
            config: entry.config || {},
            allConfigs: config?.solutions,
          });
        }
        entry.status = 'active';
        entry.error = undefined;
      } catch (err: unknown) {
        entry.status = 'failed';
        entry.error = err instanceof Error ? err : new Error(String(err));
        console.error(`[SolutionRegistry] Failed to initialize solution "${id}":`, err);
      }
    }

    this.initialized = true;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getStatus(id: string): SolutionStatus | undefined {
    return this.entries.get(id)?.status;
  }

  public getAll(): SolutionRegistrationEntry[] {
    return Array.from(this.entries.values());
  }

  public getActive(): SolutionModule[] {
    return Array.from(this.entries.values())
      .filter((entry) => entry.status === 'active')
      .map((entry) => entry.module);
  }

  public getSolution(id: string): SolutionModule | undefined {
    return this.entries.get(id)?.module;
  }

  public getByCapability(capability: string): SolutionModule[] {
    return this.getActive().filter((module) =>
      module.manifest.capabilities?.includes(capability)
    );
  }

  public getSlotRenderer(slotName: string): ((props?: Record<string, unknown>) => React.ReactNode) | undefined {
    for (const entry of this.entries.values()) {
      if (entry.status === 'active' && entry.module.renderSlot) {
        if (entry.module.manifest.slots?.includes(slotName)) {
          return (props?: Record<string, unknown>) => entry.module.renderSlot!(slotName, props);
        }
      }
    }
    return undefined;
  }

  public isSlotActive(slotName: string): boolean {
    return this.getSlotRenderer(slotName) !== undefined;
  }

  public isSlotFailed(slotName: string): { failed: boolean; solutionId?: string; error?: string } {
    for (const [id, entry] of this.entries.entries()) {
      if (entry.status === 'failed' && entry.module.manifest.slots?.includes(slotName)) {
        const errorMsg = entry.error instanceof Error ? entry.error.message : String(entry.error || 'Unknown initialization error');
        return { failed: true, solutionId: id, error: errorMsg };
      }
    }
    return { failed: false };
  }

  public async dispatchLead(lead: LeadSubmission): Promise<LeadSubmissionResult | null> {
    for (const module of this.getActive()) {
      if (typeof module.onLeadSubmitted === 'function') {
        const result = await module.onLeadSubmitted(lead);
        if (result && typeof result === 'object' && 'success' in result) {
          return result;
        }
      }
    }
    return null;
  }

  public async resolveContent<T>(key: string, defaultContent: T): Promise<T> {
    for (const module of this.getActive()) {
      if (typeof module.resolveContent === 'function') {
        const resolved = await module.resolveContent(key, defaultContent);
        if (resolved !== undefined && resolved !== null) {
          return resolved;
        }
      }
    }
    return defaultContent;
  }

  public async dispose(): Promise<void> {
    for (const [id, entry] of this.entries.entries()) {
      if (entry.status === 'active' && typeof entry.module.dispose === 'function') {
        try {
          await entry.module.dispose();
        } catch (err) {
          console.error(`[SolutionRegistry] Error disposing solution "${id}":`, err);
        }
      }
      entry.status = 'registered';
    }
    this.initialized = false;
  }

  public reset(): void {
    this.entries.clear();
    this.initialized = false;
  }
}

export const defaultRegistry = new SolutionRegistry();
