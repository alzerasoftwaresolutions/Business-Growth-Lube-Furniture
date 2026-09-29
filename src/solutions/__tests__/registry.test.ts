import { describe, it, expect, beforeEach } from 'vitest';
import { SolutionRegistry } from '../registry';
import { SolutionModule } from '../types';

describe('Solution Integration Foundation - Registry (Lube Furniture)', () => {
  let registry: SolutionRegistry;

  beforeEach(() => {
    registry = new SolutionRegistry();
  });

  it('registers a solution module in registered status', () => {
    const testModule: SolutionModule = {
      manifest: {
        id: 'test-module',
        name: 'Test Module',
        version: '1.0.0',
        capabilities: ['booking'],
      },
    };

    registry.register(testModule);
    expect(registry.getStatus('test-module')).toBe('registered');
    expect(registry.getSolution('test-module')).toBe(testModule);
  });

  it('initializes enabled solutions to active status', async () => {
    let initCalled = false;
    const testModule: SolutionModule = {
      manifest: {
        id: 'test-module',
        name: 'Test Module',
        version: '1.0.0',
        capabilities: ['booking'],
      },
      init: async () => {
        initCalled = true;
      },
    };

    registry.register(testModule);
    await registry.init({
      version: '1.0.0',
      solutions: {
        'test-module': { enabled: true },
      },
    });

    expect(initCalled).toBe(true);
    expect(registry.getStatus('test-module')).toBe('active');
    expect(registry.getActive()).toHaveLength(1);
  });

  it('marks disabled solutions as disabled without calling init', async () => {
    let initCalled = false;
    const testModule: SolutionModule = {
      manifest: {
        id: 'test-module',
        name: 'Test Module',
        version: '1.0.0',
        capabilities: ['booking'],
      },
      init: async () => {
        initCalled = true;
      },
    };

    registry.register(testModule);
    await registry.init({
      version: '1.0.0',
      solutions: {
        'test-module': { enabled: false },
      },
    });

    expect(initCalled).toBe(false);
    expect(registry.getStatus('test-module')).toBe('disabled');
    expect(registry.getActive()).toHaveLength(0);
  });

  it('isolates failures: failed initialization does not crash registry or block others', async () => {
    const failingModule: SolutionModule = {
      manifest: {
        id: 'failing-module',
        name: 'Failing Module',
        version: '1.0.0',
        capabilities: ['inquiry'],
        slots: ['inquiry:rfq-form'],
      },
      init: async () => {
        throw new Error('Showroom database connection failed');
      },
    };

    const healthyModule: SolutionModule = {
      manifest: {
        id: 'healthy-module',
        name: 'Healthy Module',
        version: '1.0.0',
        capabilities: ['cms'],
      },
      init: async () => {},
    };

    registry.register(failingModule);
    registry.register(healthyModule);

    await registry.init({
      version: '1.0.0',
      solutions: {
        'failing-module': { enabled: true },
        'healthy-module': { enabled: true },
      },
    });

    expect(registry.getStatus('failing-module')).toBe('failed');
    expect(registry.getStatus('healthy-module')).toBe('active');
    expect(registry.isSlotFailed('inquiry:rfq-form').failed).toBe(true);
    expect(registry.isSlotFailed('inquiry:rfq-form').solutionId).toBe('failing-module');
    expect(registry.getActive()).toHaveLength(1);
    expect(registry.getActive()[0].manifest.id).toBe('healthy-module');
  });

  it('disposes active solutions properly and resets status to registered', async () => {
    let disposed = false;
    const testModule: SolutionModule = {
      manifest: {
        id: 'test-module',
        name: 'Test Module',
        version: '1.0.0',
        capabilities: ['integration'],
      },
      dispose: async () => {
        disposed = true;
      },
    };

    registry.register(testModule);
    await registry.init({
      version: '1.0.0',
      solutions: { 'test-module': { enabled: true } },
    });

    expect(registry.getStatus('test-module')).toBe('active');
    await registry.dispose();
    expect(disposed).toBe(true);
    expect(registry.getStatus('test-module')).toBe('registered');
  });
});
