import React from 'react';

export type SolutionCapability = 'booking' | 'inquiry' | 'cms' | 'integration' | 'admin' | string;

export type SolutionStatus = 'registered' | 'active' | 'disabled' | 'failed';

export interface SolutionManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  capabilities: SolutionCapability[];
  slots?: string[];
  dependencies?: string[];
  defaultEnabled?: boolean;
  config?: Record<string, unknown>;
}

export interface SolutionInitContext {
  config: Record<string, unknown>;
  allConfigs?: Record<string, unknown>;
}

export interface LeadSubmission {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  projectType?: string;
  timeframe?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface LeadSubmissionResult {
  success: boolean;
  message: string;
  leadId?: string;
  metadata?: Record<string, unknown>;
}

export interface SolutionModule {
  manifest: SolutionManifest;
  init?: (context: SolutionInitContext) => Promise<void> | void;
  dispose?: () => Promise<void> | void;
  renderSlot?: (slotName: string, props?: Record<string, unknown>) => React.ReactNode;
  onLeadSubmitted?: (lead: LeadSubmission) => Promise<LeadSubmissionResult | void> | LeadSubmissionResult | void;
  resolveContent?: <T>(key: string, defaultContent: T) => Promise<T> | T;
  handleAction?: (action: string, payload: unknown) => Promise<unknown> | unknown;
}

export interface SolutionRegistrationEntry {
  module: SolutionModule;
  status: SolutionStatus;
  error?: Error | string;
  config?: Record<string, unknown>;
}

export interface SolutionConfigEntry {
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface SolutionsConfig {
  version: string;
  solutions: Record<string, SolutionConfigEntry>;
}
