import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import {
  PersistenceAdapter,
  MemoryPersistenceStore,
  persistenceAdapter,
  type PersistenceStore,
  type PersistenceResult,
} from '../persistence';
import { SolutionRegistry } from '../registry';
import { SolutionsProvider } from '../context';
import { SolutionSlot } from '../SolutionSlot';
import { bookingProofModule } from '../proofs/bookingProof';
import { inquiryProofModule } from '../proofs/inquiryProof';

/**
 * Deterministic test double simulating an underlying storage failure
 * (e.g. disk write failure, network timeout, storage unavailable).
 */
class FailingPersistenceStore implements PersistenceStore {
  readonly name = 'failing-test-store';

  async saveRecord<T extends Record<string, unknown>>(): Promise<PersistenceResult<T>> {
    return {
      success: false,
      error: 'Storage unavailable: write rejected',
      code: 'WRITE_FAILED',
    };
  }

  async getRecord(): Promise<null> {
    return null;
  }

  async listRecords(): Promise<[]> {
    return [];
  }

  async deleteRecord(): Promise<boolean> {
    return false;
  }

  async clear(): Promise<void> {}
}

describe('Lube Furniture - Generic Solution Persistence Contract', () => {
  let adapter: PersistenceAdapter;

  beforeEach(async () => {
    adapter = new PersistenceAdapter(new MemoryPersistenceStore());
    await persistenceAdapter.clear();
    persistenceAdapter.setStore(new MemoryPersistenceStore());
  });

  // 1. Save record
  it('1. saves a record to a specified collection', async () => {
    const consultation = {
      roomType: 'Architectural Joinery & Living',
      selectedDate: '2026-11-15',
      selectedSlot: '10:00 AM',
      status: 'confirmed',
    };

    const saveResult = await adapter.saveRecord('bookings', consultation);
    expect(saveResult.success).toBe(true);
    if (saveResult.success) {
      expect(saveResult.id).toBeDefined();
      expect(saveResult.record.roomType).toBe('Architectural Joinery & Living');
    }
  });

  // 2. Real record ID
  it('2. generates a real record ID with valid created and updated timestamps', async () => {
    const saveResult = await adapter.saveRecord('bookings', { roomType: 'Executive Study' });
    expect(saveResult.success).toBe(true);
    if (saveResult.success) {
      expect(typeof saveResult.id).toBe('string');
      expect(saveResult.id.length).toBeGreaterThan(0);
      expect(typeof saveResult.record.createdAt).toBe('number');
      expect(typeof saveResult.record.updatedAt).toBe('number');
      expect(saveResult.record.createdAt).toBeGreaterThan(0);
    }
  });

  // 3. Retrieve by ID
  it('3. retrieves a saved record by collection and ID', async () => {
    const rfq = {
      fullName: 'Elena Vance',
      email: 'elena@vancestudio.com',
      scope: 'Hospitality & Boutique Hotel',
    };

    const saveResult = await adapter.saveRecord('inquiries', rfq, 'INQ-5544');
    expect(saveResult.success).toBe(true);

    const retrieved = await adapter.getRecord<typeof rfq>('inquiries', 'INQ-5544');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.fullName).toBe('Elena Vance');
    expect(retrieved?.email).toBe('elena@vancestudio.com');
  });

  // 4. List records
  it('4. lists all records stored in a collection', async () => {
    await adapter.saveRecord('showrooms', { city: 'Addis Ababa' });
    await adapter.saveRecord('showrooms', { city: 'Milan' });
    await adapter.saveRecord('showrooms', { city: 'Nairobi' });

    const all = await adapter.listRecords('showrooms');
    expect(all).toHaveLength(3);
  });

  // 5. Filtering/query
  it('5. filters records by query criteria', async () => {
    await adapter.saveRecord('orders', { status: 'pending', category: 'living' });
    await adapter.saveRecord('orders', { status: 'completed', category: 'living' });
    await adapter.saveRecord('orders', { status: 'pending', category: 'dining' });

    const pendingLiving = await adapter.listRecords('orders', {
      filter: { status: 'pending', category: 'living' },
    });

    expect(pendingLiving).toHaveLength(1);
    expect(pendingLiving[0].status).toBe('pending');
    expect(pendingLiving[0].category).toBe('living');
  });

  // 6. Delete
  it('6. deletes records cleanly from a collection', async () => {
    await adapter.saveRecord('bookings', { roomType: 'Suite' }, 'DEL-1');
    const deleteSuccess = await adapter.deleteRecord('bookings', 'DEL-1');
    expect(deleteSuccess).toBe(true);

    const retrieved = await adapter.getRecord('bookings', 'DEL-1');
    expect(retrieved).toBeNull();
  });

  // 7. Clear
  it('7. clears a single collection or the entire store', async () => {
    await adapter.saveRecord('colA', { x: 1 });
    await adapter.saveRecord('colB', { y: 2 });

    await adapter.clear('colA');
    expect(await adapter.listRecords('colA')).toHaveLength(0);
    expect(await adapter.listRecords('colB')).toHaveLength(1);

    await adapter.clear();
    expect(await adapter.listRecords('colB')).toHaveLength(0);
  });

  // 8. Collection isolation
  it('8. isolates distinct collections having identical record IDs', async () => {
    await adapter.saveRecord('bookings', { kind: 'consultation' }, 'rec-1');
    await adapter.saveRecord('inquiries', { kind: 'commercial-rfq' }, 'rec-1');

    const booking = await adapter.getRecord<{ kind: string }>('bookings', 'rec-1');
    const inquiry = await adapter.getRecord<{ kind: string }>('inquiries', 'rec-1');

    expect(booking?.kind).toBe('consultation');
    expect(inquiry?.kind).toBe('commercial-rfq');
  });

  // 9. Deterministic/sequential IDs
  it('9. generates deterministic, monotonic sequential IDs when none provided', async () => {
    const res1 = await adapter.saveRecord('leads', { name: 'Lead 1' });
    const res2 = await adapter.saveRecord('leads', { name: 'Lead 2' });

    expect(res1.success).toBe(true);
    expect(res2.success).toBe(true);
    if (res1.success && res2.success) {
      expect(res1.id).not.toEqual(res2.id);
      expect(res1.id).toBe('leads-1');
      expect(res2.id).toBe('leads-2');
    }
  });

  // 10. Failing persistence store
  it('10. correctly interfaces with a failing persistence store double', () => {
    const failingAdapter = new PersistenceAdapter(new FailingPersistenceStore());
    expect(failingAdapter.getStore().name).toBe('failing-test-store');
  });

  // 11. Failure propagation
  it('11. propagates underlying store write failures without crashing', async () => {
    const failingAdapter = new PersistenceAdapter(new FailingPersistenceStore());
    const result = await failingAdapter.saveRecord('bookings', {
      roomType: 'Penthouse Joinery',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Storage unavailable: write rejected');
      expect(result.code).toBe('WRITE_FAILED');
    }
  });

  // 12. No fake success ID on failure
  it('12. does not generate or return a fake success ID when persistence fails', async () => {
    const failingAdapter = new PersistenceAdapter(new FailingPersistenceStore());
    const result = await failingAdapter.saveRecord('inquiries', {
      fullName: 'Failing Lead',
    });

    expect(result.success).toBe(false);
    expect((result as any).id).toBeUndefined();
    expect((result as any).record).toBeUndefined();
  });

  // 13. Vendor neutrality
  it('13. is completely decoupled from any external database vendor', () => {
    expect(adapter.getStore().name).toBe('in-memory-store');
    expect(persistenceAdapter).toBeInstanceOf(PersistenceAdapter);
  });
});

describe('Lube Furniture - Booking & Inquiry Integration Seams', () => {
  let registry: SolutionRegistry;

  beforeEach(async () => {
    registry = new SolutionRegistry();
    await persistenceAdapter.clear();
    persistenceAdapter.setStore(new MemoryPersistenceStore());
  });

  // 14. Booking slot fallback when disabled
  it('14. renders Core fallback when booking solution is registered but disabled in configuration', async () => {
    registry.register(bookingProofModule);
    await registry.init({
      version: '1.0.0',
      solutions: {
        'booking-proof': { enabled: false },
      },
    });

    await act(async () => {
      render(
        <SolutionsProvider registry={registry}>
          <SolutionSlot
            name="booking:widget"
            fallback={<div data-testid="core-booking-fallback">Online Studio Booking Unavailable</div>}
          />
        </SolutionsProvider>
      );
    });

    expect(screen.getByTestId('core-booking-fallback')).toBeTruthy();
    expect(screen.queryByTestId('booking-proof-widget')).toBeNull();
  });

  // 15. Booking slot activation when enabled
  it('15. activates booking:widget when solution is enabled in configuration', async () => {
    registry.register(bookingProofModule);
    const activeConfig = {
      version: '1.0.0',
      solutions: {
        'booking-proof': { enabled: true },
      },
    };
    await registry.init(activeConfig);

    await act(async () => {
      render(
        <SolutionsProvider registry={registry} config={activeConfig}>
          <SolutionSlot
            name="booking:widget"
            fallback={<div data-testid="core-booking-fallback">Online Studio Booking Unavailable</div>}
            props={{ roomType: 'Living & Dining Environments' }}
          />
        </SolutionsProvider>
      );
    });

    expect(screen.getByTestId('booking-proof-widget')).toBeTruthy();
    expect(screen.queryByTestId('core-booking-fallback')).toBeNull();
  });

  // 16. Booking persistence success
  it('16. persists consultation bookings through the generic persistence boundary', async () => {
    const saveResult = await persistenceAdapter.saveRecord('bookings', {
      roomType: 'Commercial Suite',
      selectedDate: '2026-12-01',
      selectedSlot: '02:00 PM',
      status: 'confirmed',
    });

    expect(saveResult.success).toBe(true);
    if (saveResult.success) {
      expect(saveResult.id).toBeDefined();
      const stored = await persistenceAdapter.getRecord('bookings', saveResult.id);
      expect(stored?.roomType).toBe('Commercial Suite');
    }
  });

  // 17. Booking persistence failure
  it('17. propagates storage failure without returning a fake success ID during booking', async () => {
    persistenceAdapter.setStore(new FailingPersistenceStore());

    const result = await persistenceAdapter.saveRecord('bookings', {
      roomType: 'Master Suite',
    });

    expect(result.success).toBe(false);
    expect((result as any).id).toBeUndefined();
    if (!result.success) {
      expect(result.code).toBe('WRITE_FAILED');
    }
  });

  // 18. Inquiry persistence success
  it('18. persists RFQ inquiries through onLeadSubmitted and returns real persisted ID', async () => {
    const lead = {
      fullName: 'Marcus Stone',
      email: 'mstone@stonebridge.com',
      company: 'Stonebridge Hospitality',
      message: 'Need 40 white oak dining tables',
    };

    const submitResult = (await inquiryProofModule.onLeadSubmitted!(lead)) as any;
    expect(submitResult).toBeDefined();
    expect(submitResult?.success).toBe(true);
    if (submitResult && submitResult.success) {
      expect(submitResult.leadId).toBeDefined();
      const stored = await persistenceAdapter.getRecord('inquiries', submitResult.leadId!);
      expect(stored?.fullName).toBe('Marcus Stone');
      expect(stored?.company).toBe('Stonebridge Hospitality');
    }
  });

  // 19. Inquiry persistence failure
  it('19. returns explicit failure without leadId when persistence fails for inquiry', async () => {
    persistenceAdapter.setStore(new FailingPersistenceStore());

    const lead = {
      fullName: 'Failing Client',
      email: 'fail@example.com',
    };

    const submitResult = (await inquiryProofModule.onLeadSubmitted!(lead)) as any;
    expect(submitResult).toBeDefined();
    expect(submitResult?.success).toBe(false);
    expect(submitResult?.leadId).toBeUndefined();
  });

  // 20. Reversibility: enabled -> disabled
  it('20. cleanly reverts from active solution back to Core fallback when disabled', async () => {
    registry.register(bookingProofModule);

    // Step A: enabled
    const enabledConfig = {
      version: '1.0.0',
      solutions: {
        'booking-proof': { enabled: true },
      },
    };
    await registry.init(enabledConfig);

    let renderResult: any;
    await act(async () => {
      renderResult = render(
        <SolutionsProvider registry={registry} config={enabledConfig}>
          <SolutionSlot
            name="booking:widget"
            fallback={<div data-testid="core-booking-fallback">Core Booking Fallback</div>}
          />
        </SolutionsProvider>
      );
    });

    expect(screen.getByTestId('booking-proof-widget')).toBeTruthy();
    renderResult.unmount();

    // Step B: toggle off
    const disabledConfig = {
      version: '1.0.0',
      solutions: {
        'booking-proof': { enabled: false },
      },
    };
    await registry.init(disabledConfig);

    await act(async () => {
      render(
        <SolutionsProvider registry={registry} config={disabledConfig}>
          <SolutionSlot
            name="booking:widget"
            fallback={<div data-testid="core-booking-fallback">Core Booking Fallback</div>}
          />
        </SolutionsProvider>
      );
    });

    expect(screen.getByTestId('core-booking-fallback')).toBeTruthy();
    expect(screen.queryByTestId('booking-proof-widget')).toBeNull();
  });
});
