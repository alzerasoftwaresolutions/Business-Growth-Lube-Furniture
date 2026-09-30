import React, { useState } from 'react';
import { SolutionModule, SolutionManifest, LeadSubmission, LeadSubmissionResult } from '../types';
import { persistenceAdapter } from '../persistence';

export const inquiryManifest: SolutionManifest = {
  id: 'inquiry-proof',
  name: 'Priority Commercial RFQ Proof',
  version: '1.0.0',
  description: 'Proof of concept commercial contract inquiry flow with custom material swatches.',
  capabilities: ['inquiry', 'persistence'],
  slots: ['inquiry:contact-form', 'inquiry:rfq-form'],
  defaultEnabled: false,
};

export const PriorityCommercialRFQ: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    scope: 'Hospitality & Boutique Hotel',
    timberFinish: 'White Oak & Natural Linen',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    const result = await persistenceAdapter.saveRecord('inquiries', {
      fullName: formData.name,
      email: formData.email,
      scope: formData.scope,
      timberFinish: formData.timberFinish,
      source: 'priority-commercial-rfq',
    });

    if (result.success) {
      setInquiryId(result.id);
      setSubmitted(true);
    } else {
      setErrorMessage(result.error || 'Failed to persist inquiry.');
    }
    setSubmitting(false);
  };

  if (submitted && inquiryId) {
    return (
      <div className="border border-clay bg-soft-white p-8 text-center" data-testid="inquiry-proof-submitted">
        <h4 className="text-xl font-semibold tracking-headline text-dark-graphite">Priority RFQ Received</h4>
        <p className="mt-2 text-sm text-secondary-text">
          Thank you, <strong>{formData.name}</strong>. Your commercial project specifications have been assigned to our Senior Contract Joiner.
        </p>
        <p className="mt-3 font-mono text-xs text-secondary-text" data-testid="inquiry-proof-id">
          Reference ID: <span className="font-semibold text-clay">{inquiryId}</span> (Persisted)
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-clay/40 bg-soft-white p-6 space-y-4" data-testid="inquiry-proof-form">
      <div className="border border-clay/30 bg-clay/5 p-3 text-xs text-clay">
        Active Solution: Priority Commercial Contract &amp; Joinery RFQ Pipeline
      </div>

      {errorMessage && (
        <div
          className="border border-red-500 bg-red-50 p-3 text-xs text-red-700"
          role="alert"
          data-testid="inquiry-proof-error"
        >
          <strong className="block font-semibold">RFQ Submission Failed</strong>
          <p>{errorMessage}</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium uppercase tracking-editorial text-secondary-text mb-1">
          Full Name / Project Director *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g. Elena Vance"
          className="w-full border border-lube-border bg-warm-ivory px-4 py-3 text-sm text-dark-graphite focus:outline-none focus:border-clay"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-editorial text-secondary-text mb-1">
          Corporate / Studio Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="elena@vancestudio.com"
          className="w-full border border-lube-border bg-warm-ivory px-4 py-3 text-sm text-dark-graphite focus:outline-none focus:border-clay"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-editorial text-secondary-text mb-1">
          Project Scope
        </label>
        <select
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
          className="w-full border border-lube-border bg-warm-ivory px-4 py-3 text-sm text-dark-graphite focus:outline-none focus:border-clay"
        >
          <option value="Hospitality & Boutique Hotel">Hospitality &amp; Boutique Hotel</option>
          <option value="Executive Workplace">Executive Workplace &amp; Boardroom</option>
          <option value="High-End Residential Compound">High-End Residential Compound</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-editorial text-secondary-text mb-1">
          Target Wood Finish
        </label>
        <input
          type="text"
          value={formData.timberFinish}
          onChange={(e) => setFormData({ ...formData, timberFinish: e.target.value })}
          className="w-full border border-lube-border bg-warm-ivory px-4 py-3 text-sm text-dark-graphite focus:outline-none focus:border-clay"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-clay px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-white hover:bg-clay-dark transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting Quotation...' : 'Submit Contract Quotation'}
      </button>
    </form>
  );
};

export const inquiryProofModule: SolutionModule = {
  manifest: inquiryManifest,
  renderSlot: (slotName: string) => {
    if (slotName === 'inquiry:contact-form' || slotName === 'inquiry:rfq-form') {
      return <PriorityCommercialRFQ />;
    }
    return null;
  },
  onLeadSubmitted: async (lead: LeadSubmission): Promise<LeadSubmissionResult> => {
    const saveResult = await persistenceAdapter.saveRecord('inquiries', {
      ...lead,
      receivedAt: Date.now(),
      solutionId: inquiryManifest.id,
    });

    if (!saveResult.success) {
      return {
        success: false,
        message: saveResult.error || 'Failed to persist inquiry.',
      };
    }

    return {
      success: true,
      message: `Inquiry intercepted and persisted by Solution "${inquiryManifest.id}" for ${lead.fullName}.`,
      leadId: saveResult.id,
      metadata: { record: saveResult.record },
    };
  },
};
