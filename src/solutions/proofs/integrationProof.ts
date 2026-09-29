import { SolutionModule, SolutionManifest, LeadSubmission, LeadSubmissionResult } from '../types';

export const integrationManifest: SolutionManifest = {
  id: 'integration-proof',
  name: 'Studio Telemetry Integration Proof',
  version: '1.0.0',
  description: 'Proof of concept studio telemetry sink for customer inquiries without external network calls.',
  capabilities: ['integration'],
  defaultEnabled: false,
};

export const capturedStudioEvents: Array<{ timestamp: number; payload: LeadSubmission }> = [];

export const integrationProofModule: SolutionModule = {
  manifest: integrationManifest,
  onLeadSubmitted: async (lead: LeadSubmission): Promise<LeadSubmissionResult> => {
    capturedStudioEvents.push({
      timestamp: Date.now(),
      payload: lead,
    });
    return {
      success: true,
      message: 'Studio telemetry event registered in local event sink.',
      leadId: `telemetry-${capturedStudioEvents.length}`,
    };
  },
};
