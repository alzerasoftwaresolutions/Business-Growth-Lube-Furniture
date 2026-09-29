import { describe, it, expect, beforeEach } from 'vitest';
import { SolutionRegistry } from '../registry';
import { SolutionModule } from '../types';

describe('Solution Integration Foundation - Dynamic Future Capability (Lube Furniture)', () => {
  let registry: SolutionRegistry;

  beforeEach(() => {
    registry = new SolutionRegistry();
  });

  it('proves that a future capability (e.g. crm-sync-enterprise) registers and executes without modifying Core', async () => {
    const futureCapability = 'crm-sync-enterprise';

    let syncExecuted = false;
    const futureEnterpriseModule: SolutionModule = {
      manifest: {
        id: 'enterprise-crm-v2',
        name: 'Enterprise Contract Sync V2',
        version: '2.0.0',
        capabilities: [futureCapability],
        slots: ['enterprise:contract-ledger'],
      },
      handleAction: async (action, payload) => {
        if (action === 'sync:quotes') {
          syncExecuted = true;
          return { status: 'synced', records: payload };
        }
        return null;
      },
      renderSlot: () => 'EnterpriseContractLedgerUI',
    };

    // 1. Registry accepts the future capability
    registry.register(futureEnterpriseModule);

    await registry.init({
      version: '1.0.0',
      solutions: {
        'enterprise-crm-v2': { enabled: true },
      },
    });

    // 2. Querying by the novel capability succeeds
    const matching = registry.getByCapability(futureCapability);
    expect(matching).toHaveLength(1);
    expect(matching[0].manifest.id).toBe('enterprise-crm-v2');

    // 3. Slot is active without any new Core if/else branch
    expect(registry.isSlotActive('enterprise:contract-ledger')).toBe(true);

    // 4. Custom action executes cleanly
    const actionResult = await matching[0].handleAction?.('sync:quotes', { quoteCount: 15 });
    expect(syncExecuted).toBe(true);
    expect(actionResult).toEqual({ status: 'synced', records: { quoteCount: 15 } });
  });
});
