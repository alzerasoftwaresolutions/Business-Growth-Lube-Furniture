import React, { useState } from 'react';
import { SolutionModule, SolutionManifest, LeadSubmission, LeadSubmissionResult } from '../types';

export const inquiryManifest: SolutionManifest = {
  id: 'inquiry-proof',
  name: 'Priority Commercial RFQ Proof',
  version: '1.0.0',
  description: 'Proof of concept commercial contract inquiry flow with custom material swatches.',
  capabilities: ['inquiry'],
  slots: ['inquiry:contact-form', 'inquiry:rfq-form'],
  defaultEnabled: false,
};

export const PriorityCommercialRFQ: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    scope: 'Hospitality & Boutique Hotel',
    timberFinish: 'White Oak & Natural Linen',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-clay bg-soft-white p-8 text-center" data-testid="inquiry-proof-submitted">
        <h4 className="text-xl font-semibold tracking-headline text-dark-graphite">Priority RFQ Received</h4>
        <p className="mt-2 text-sm text-secondary-text">
          Thank you, <strong>{formData.name}</strong>. Your commercial project specifications have been assigned to our Senior Contract Joiner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-clay/40 bg-soft-white p-6 space-y-4" data-testid="inquiry-proof-form">
      <div className="border border-clay/30 bg-clay/5 p-3 text-xs text-clay">
        ✨ <strong>Active Solution:</strong> Priority Commercial Contract & Joinery RFQ Pipeline
      </div>
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
        className="w-full rounded-full bg-clay px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-white hover:bg-clay-dark transition-colors"
      >
        Submit Contract Quotation
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
    return {
      success: true,
      message: `Inquiry intercepted by Solution "${inquiryManifest.id}" for ${lead.fullName}.`,
      leadId: `lube-lead-${Date.now()}`,
    };
  },
};
