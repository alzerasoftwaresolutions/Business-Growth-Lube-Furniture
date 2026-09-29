import { defaultRegistry, SolutionRegistry } from './registry';
import { LeadSubmission, LeadSubmissionResult } from './types';

export interface LeadSubmissionResponse {
  success: boolean;
  message: string;
  handledBySolution: boolean;
  leadId?: string;
  metadata?: Record<string, unknown>;
}

export async function sendLeadToSolution(
  lead: LeadSubmission,
  fallbackFn?: () => Promise<{ success: boolean; message: string }> | { success: boolean; message: string },
  registryInstance: SolutionRegistry = defaultRegistry
): Promise<LeadSubmissionResponse> {
  const activeSolutions = registryInstance.getActive();
  const handler = activeSolutions.find((mod) => typeof mod.onLeadSubmitted === 'function');

  if (handler) {
    try {
      const result = await handler.onLeadSubmitted!(lead);
      if (result && typeof result === 'object') {
        return {
          success: result.success,
          message: result.message,
          leadId: result.leadId,
          metadata: result.metadata,
          handledBySolution: true,
        };
      }
      return {
        success: true,
        message: 'Lead processed by active solution.',
        handledBySolution: true,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[LeadAdapter] Active solution "${handler.manifest.id}" failed processing lead:`, err);
      // Explicit failure: do NOT silently fallback when an active solution fails
      return {
        success: false,
        message: `Active lead solution failed: ${errorMsg}`,
        handledBySolution: true,
      };
    }
  }

  // No active solution handler: invoke Core fallback submission behavior
  if (fallbackFn) {
    const fallbackResult = await fallbackFn();
    return {
      success: fallbackResult.success,
      message: fallbackResult.message,
      handledBySolution: false,
    };
  }

  return {
    success: true,
    message: 'Lead received (Core fallback).',
    handledBySolution: false,
  };
}
