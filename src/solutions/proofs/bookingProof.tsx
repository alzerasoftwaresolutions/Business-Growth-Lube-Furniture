import React, { useState } from 'react';
import { SolutionModule, SolutionManifest } from '../types';

export const bookingManifest: SolutionManifest = {
  id: 'booking-proof',
  name: 'Showroom Consultation Booking Proof',
  version: '1.0.0',
  description: 'Proof of concept showroom appointment and custom furniture consultation scheduler.',
  capabilities: ['booking'],
  slots: ['booking:widget'],
  defaultEnabled: false,
};

export const ConsultationBookingWidget: React.FC<{ roomType?: string }> = ({ roomType = 'Living & Dining' }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedSlot) {
      setConfirmed(true);
    }
  };

  if (confirmed) {
    return (
      <div className="border border-clay bg-soft-white p-6 text-center" data-testid="booking-proof-confirmed">
        <h4 className="text-lg font-semibold tracking-headline text-dark-graphite">Consultation Reserved</h4>
        <p className="mt-2 text-sm text-secondary-text">
          Your in-studio consultation for <strong>{roomType}</strong> is booked on <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-lube-border bg-soft-white p-6" data-testid="booking-proof-widget">
      <h3 className="text-lg font-semibold tracking-headline text-dark-graphite">Book Studio Consultation</h3>
      <p className="mt-1 text-xs text-secondary-text">
        Schedule a private design session with our joinery specialists for {roomType}.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-editorial text-secondary-text mb-1">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            className="w-full border border-lube-border bg-warm-ivory px-3 py-2 text-xs text-dark-graphite focus:outline-none focus:border-clay"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-editorial text-secondary-text mb-1">
            Time Slot
          </label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            required
            className="w-full border border-lube-border bg-warm-ivory px-3 py-2 text-xs text-dark-graphite focus:outline-none focus:border-clay"
          >
            <option value="">-- Choose Time --</option>
            <option value="10:00 AM">10:00 AM (Material & Swatch Review)</option>
            <option value="02:00 PM">02:00 PM (Architectural Space Planning)</option>
            <option value="04:30 PM">04:30 PM (Private Showroom Walkthrough)</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-clay px-4 py-2.5 text-xs font-semibold uppercase tracking-editorial text-white hover:bg-clay-dark transition-colors"
        >
          Confirm Consultation
        </button>
      </form>
    </div>
  );
};

export const bookingProofModule: SolutionModule = {
  manifest: bookingManifest,
  renderSlot: (slotName: string, props?: Record<string, unknown>) => {
    if (slotName === 'booking:widget') {
      return <ConsultationBookingWidget roomType={props?.roomType as string} />;
    }
    return null;
  },
};
