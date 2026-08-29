import React, { useEffect, useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { RFQFormData } from '../../types';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: { productName?: string; collectionName?: string };
}

const projectTypes: Array<RFQFormData['projectType']> = ['Home', 'Office', 'Hospitality', 'Other'];

export const RFQModal: React.FC<RFQModalProps> = ({ isOpen, onClose, context }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<RFQFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    selectedCollection: context?.collectionName,
    selectedProduct: context?.productName,
    message: '',
    timeframe: ''
  });

  useEffect(() => {
    setForm((f) => ({
      ...f,
      selectedCollection: context?.collectionName,
      selectedProduct: context?.productName
    }));
  }, [context]);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        projectType: '',
        selectedCollection: context?.collectionName,
        selectedProduct: context?.productName,
        message: '',
        timeframe: ''
      });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, context]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    'w-full border border-lube-border bg-soft-white px-4 py-3 text-sm text-dark-graphite placeholder:text-secondary-text/60 focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay transition-colors rounded-none';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-dark-graphite/60 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Request a Quote"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto bg-warm-ivory shadow-2xl sm:max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center text-secondary-text transition-colors hover:bg-light-stone hover:text-dark-graphite"
        >
          <X size={20} strokeWidth={1.75} />
        </button>

        {!submitted ? (
          <div className="p-6 sm:p-10">
            <p className="text-xs font-medium uppercase tracking-editorial text-clay">Request a Quote</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-headline sm:text-3xl">
              Tell us about your space
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary-text">
              Share a few details about your project. Our team will follow up with guidance,
              recommendations, and a tailored quotation.
            </p>

            {(context?.productName || context?.collectionName) && (
              <div className="mt-5 flex items-center gap-3 border border-lube-border bg-soft-white px-4 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-editorial text-clay">Enquiry</span>
                <span className="text-sm text-dark-graphite">
                  {context?.productName ?? ''} {context?.collectionName ? `— ${context.collectionName} Collection` : ''}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="rfq-name" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                  Full Name *
                </label>
                <input id="rfq-name" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="rfq-email" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                  Email *
                </label>
                <input id="rfq-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label htmlFor="rfq-company" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                  Company
                </label>
                <input id="rfq-company" name="company" value={form.company} onChange={handleChange} placeholder="Optional" className={inputClass} />
              </div>
              <div>
                <label htmlFor="rfq-phone" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                  Phone
                </label>
                <input id="rfq-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Optional" className={inputClass} />
              </div>
              <div>
                <label htmlFor="rfq-type" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                  Project Type *
                </label>
                <select id="rfq-type" name="projectType" required value={form.projectType} onChange={handleChange} className={inputClass}>
                  <option value="" disabled>Select project type</option>
                  {projectTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="rfq-timeframe" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                  Timeframe
                </label>
                <select id="rfq-timeframe" name="timeframe" required value={form.timeframe} onChange={handleChange} className={inputClass}>
                  <option value="" disabled>Select timeframe</option>
                  <option value="not-sure">Not sure yet</option>
                  <option value="asap">As soon as possible</option>
                  <option value="1-3m">1–3 months</option>
                  <option value="3-6m">3–6 months</option>
                  <option value="6m+">6+ months</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="rfq-message" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                  About Your Space *
                </label>
                <textarea
                  id="rfq-message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what you're working with — rooms, dimensions, style direction, or pieces you're interested in."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="sm:col-span-2 mt-2">
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay/50"
                >
                  Submit Request
                  <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-3 text-center text-xs text-secondary-text">
                  We'll respond within one business day.
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-clay/10">
              <Check size={28} strokeWidth={2} className="text-clay" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-headline">Request Received</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-secondary-text">
              Thank you, {form.name.split(' ')[0] || 'there'}. Your enquiry has been noted and our
              team will be in touch shortly to discuss your space.
            </p>
            <button
              onClick={onClose}
              className="mt-8 inline-flex items-center gap-2 border-b border-dark-graphite pb-0.5 text-sm font-medium text-dark-graphite transition-colors hover:border-clay hover:text-clay"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
