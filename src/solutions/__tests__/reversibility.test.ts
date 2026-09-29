import { describe, it, expect, beforeEach } from 'vitest';
import { SolutionRegistry } from '../registry';
import { SolutionModule } from '../types';

describe('Solution Integration Foundation - Reversibility (Lube Furniture)', () => {
  let registry: SolutionRegistry;

  beforeEach(() => {
    registry = new SolutionRegistry();
  });

  it('toggling a solution off in configuration immediately restores Core baseline behavior', async () => {
    const customModule: SolutionModule = {
      manifest: {
        id: 'custom-mod',
        name: 'Custom Module',
        version: '1.0.0',
        capabilities: ['booking'],
        slots: ['booking:widget'],
      },
      renderSlot: () => 'CustomWidget',
    };

    registry.register(customModule);

    // Step 1: Solution enabled
    await registry.init({
      version: '1.0.0',
      solutions: {
        'custom-mod': { enabled: true },
      },
    });
    expect(registry.isSlotActive('booking:widget')).toBe(true);

    // Step 2: Solution disabled
    await registry.dispose();
    await registry.init({
      version: '1.0.0',
      solutions: {
        'custom-mod': { enabled: false },
      },
    });

    expect(registry.isSlotActive('booking:widget')).toBe(false);
    expect(registry.getSlotRenderer('booking:widget')).toBeUndefined();
    expect(registry.getActive()).toHaveLength(0);
  });
});
