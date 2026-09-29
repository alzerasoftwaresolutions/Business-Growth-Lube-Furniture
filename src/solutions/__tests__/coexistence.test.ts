import { describe, it, expect, beforeEach } from 'vitest';
import { SolutionRegistry } from '../registry';
import { SolutionModule } from '../types';

describe('Solution Integration Foundation - Coexistence (Lube Furniture)', () => {
  let registry: SolutionRegistry;

  beforeEach(() => {
    registry = new SolutionRegistry();
  });

  it('allows multiple distinct solutions to coexist and operate independently', async () => {
    const bookingModule: SolutionModule = {
      manifest: {
        id: 'booking-solution',
        name: 'Booking Solution',
        version: '1.0.0',
        capabilities: ['booking'],
        slots: ['booking:widget'],
      },
      renderSlot: () => 'ConsultationUI',
    };

    const cmsModule: SolutionModule = {
      manifest: {
        id: 'cms-solution',
        name: 'CMS Solution',
        version: '1.0.0',
        capabilities: ['cms'],
      },
      resolveContent: async <T,>(key: string, fallback: T): Promise<T> =>
        key === 'tagline' ? ('Bespoke Studio Joinery' as unknown as T) : fallback,
    };

    const telemetryModule: SolutionModule = {
      manifest: {
        id: 'telemetry-solution',
        name: 'Telemetry Solution',
        version: '1.0.0',
        capabilities: ['integration'],
      },
    };

    registry.register(bookingModule);
    registry.register(cmsModule);
    registry.register(telemetryModule);

    await registry.init({
      version: '1.0.0',
      solutions: {
        'booking-solution': { enabled: true },
        'cms-solution': { enabled: true },
        'telemetry-solution': { enabled: true },
      },
    });

    expect(registry.getActive()).toHaveLength(3);
    expect(registry.getByCapability('booking')).toHaveLength(1);
    expect(registry.getByCapability('cms')).toHaveLength(1);
    expect(registry.getByCapability('integration')).toHaveLength(1);

    expect(registry.isSlotActive('booking:widget')).toBe(true);
    expect(await registry.resolveContent('tagline', 'Core Default')).toBe('Bespoke Studio Joinery');
  });
});
