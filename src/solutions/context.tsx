import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { SolutionRegistry, defaultRegistry } from './registry';
import {
  SolutionModule,
  SolutionStatus,
  SolutionsConfig,
  LeadSubmission,
  LeadSubmissionResult,
} from './types';
import solutionsConfigData from '../../configuration/solutions.config.json';

export interface SolutionsContextValue {
  registry: SolutionRegistry;
  isReady: boolean;
  activeSolutions: SolutionModule[];
  statusMap: Record<string, SolutionStatus>;
  getSlotRenderer: (slotName: string) => ((props?: Record<string, unknown>) => React.ReactNode) | undefined;
  isSlotActive: (slotName: string) => boolean;
  isSlotFailed: (slotName: string) => { failed: boolean; solutionId?: string; error?: string };
  dispatchLead: (lead: LeadSubmission) => Promise<LeadSubmissionResult | null>;
  resolveContent: <T>(key: string, fallback: T) => Promise<T>;
}

const SolutionsContext = createContext<SolutionsContextValue | null>(null);

export interface SolutionsProviderProps {
  children: React.ReactNode;
  config?: SolutionsConfig;
  registry?: SolutionRegistry;
  modules?: SolutionModule[];
}

export const SolutionsProvider: React.FC<SolutionsProviderProps> = ({
  children,
  config,
  registry = defaultRegistry,
  modules,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, SolutionStatus>>({});

  useEffect(() => {
    let isCancelled = false;

    if (modules && modules.length > 0) {
      for (const mod of modules) {
        try {
          registry.register(mod);
        } catch {
          // ignore already registered
        }
      }
    }

    const effectiveConfig = config || (solutionsConfigData as unknown as SolutionsConfig);

    const runInit = async () => {
      await registry.init(effectiveConfig);
      if (!isCancelled) {
        const statuses: Record<string, SolutionStatus> = {};
        for (const entry of registry.getAll()) {
          statuses[entry.module.manifest.id] = entry.status;
        }
        setStatusMap(statuses);
        setIsReady(true);
      }
    };

    runInit();

    return () => {
      isCancelled = true;
    };
  }, [registry, config, modules]);

  const value = useMemo<SolutionsContextValue>(() => {
    return {
      registry,
      isReady,
      activeSolutions: registry.getActive(),
      statusMap,
      getSlotRenderer: (slotName: string) => registry.getSlotRenderer(slotName),
      isSlotActive: (slotName: string) => registry.isSlotActive(slotName),
      isSlotFailed: (slotName: string) => registry.isSlotFailed(slotName),
      dispatchLead: (lead: LeadSubmission) => registry.dispatchLead(lead),
      resolveContent: <T,>(key: string, fallback: T) => registry.resolveContent(key, fallback),
    };
  }, [registry, isReady, statusMap]);

  return <SolutionsContext.Provider value={value}>{children}</SolutionsContext.Provider>;
};

export function useSolutions(): SolutionsContextValue {
  const ctx = useContext(SolutionsContext);
  if (!ctx) {
    return {
      registry: defaultRegistry,
      isReady: defaultRegistry.isInitialized(),
      activeSolutions: defaultRegistry.getActive(),
      statusMap: {},
      getSlotRenderer: (slotName: string) => defaultRegistry.getSlotRenderer(slotName),
      isSlotActive: (slotName: string) => defaultRegistry.isSlotActive(slotName),
      isSlotFailed: (slotName: string) => defaultRegistry.isSlotFailed(slotName),
      dispatchLead: (lead: LeadSubmission) => defaultRegistry.dispatchLead(lead),
      resolveContent: <T,>(key: string, fallback: T) => defaultRegistry.resolveContent(key, fallback),
    };
  }
  return ctx;
}
