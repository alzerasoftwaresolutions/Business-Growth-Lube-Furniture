import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SolutionRegistry } from '../registry';
import { SolutionsProvider } from '../context';
import { SolutionSlot } from '../SolutionSlot';
import { SolutionModule } from '../types';

describe('Solution Integration Foundation - SolutionSlot (Lube Furniture)', () => {
  let registry: SolutionRegistry;

  beforeEach(() => {
    registry = new SolutionRegistry();
  });

  it('renders Core fallback exactly once when unprovided or no solution is registered', async () => {
    await act(async () => {
      render(
        <SolutionsProvider registry={registry}>
          <SolutionSlot
            name="unprovided:slot"
            fallback={<div data-testid="core-fallback">Core Contact Fallback</div>}
          />
        </SolutionsProvider>
      );
    });

    expect(screen.getByTestId('core-fallback')).toBeTruthy();
    expect(screen.getByText('Core Contact Fallback')).toBeTruthy();
  });

  it('renders Core fallback when solution is registered but disabled in config', async () => {
    const disabledModule: SolutionModule = {
      manifest: {
        id: 'disabled-mod',
        name: 'Disabled Module',
        version: '1.0.0',
        capabilities: ['booking'],
        slots: ['booking:widget'],
      },
      renderSlot: () => <div data-testid="solution-content">Consultation Widget</div>,
    };

    registry.register(disabledModule);
    await registry.init({
      version: '1.0.0',
      solutions: {
        'disabled-mod': { enabled: false },
      },
    });

    await act(async () => {
      render(
        <SolutionsProvider registry={registry}>
          <SolutionSlot
            name="booking:widget"
            fallback={<div data-testid="core-fallback">Core Showroom Fallback</div>}
          />
        </SolutionsProvider>
      );
    });

    expect(screen.getByTestId('core-fallback')).toBeTruthy();
    expect(screen.queryByTestId('solution-content')).toBeNull();
  });

  it('renders active solution implementation when solution is enabled', async () => {
    const activeModule: SolutionModule = {
      manifest: {
        id: 'active-mod',
        name: 'Active Module',
        version: '1.0.0',
        capabilities: ['booking'],
        slots: ['booking:widget'],
      },
      renderSlot: () => <div data-testid="solution-content">Active Custom Joinery Widget</div>,
    };

    registry.register(activeModule);
    await registry.init({
      version: '1.0.0',
      solutions: {
        'active-mod': { enabled: true },
      },
    });

    await act(async () => {
      render(
        <SolutionsProvider registry={registry}>
          <SolutionSlot
            name="booking:widget"
            fallback={<div data-testid="core-fallback">Core Showroom Fallback</div>}
          />
        </SolutionsProvider>
      );
    });

    expect(screen.getByTestId('solution-content')).toBeTruthy();
    expect(screen.getByText('Active Custom Joinery Widget')).toBeTruthy();
    expect(screen.queryByTestId('core-fallback')).toBeNull();
  });

  it('renders explicit failure state and does NOT silently render Core fallback when solution init failed', async () => {
    const failingModule: SolutionModule = {
      manifest: {
        id: 'crashed-mod',
        name: 'Crashed Module',
        version: '1.0.0',
        capabilities: ['inquiry'],
        slots: ['inquiry:rfq-form'],
      },
      init: async () => {
        throw new Error('Showroom CRM endpoint down');
      },
      renderSlot: () => <div>Never rendered</div>,
    };

    registry.register(failingModule);
    await registry.init({
      version: '1.0.0',
      solutions: {
        'crashed-mod': { enabled: true },
      },
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <SolutionsProvider registry={registry}>
          <SolutionSlot
            name="inquiry:rfq-form"
            fallback={<div data-testid="core-fallback">Core RFQ Fallback</div>}
          />
        </SolutionsProvider>
      );
    });

    expect(screen.getByTestId('solution-slot-failed-inquiry:rfq-form')).toBeTruthy();
    expect(screen.getByText(/Showroom CRM endpoint down/i)).toBeTruthy();
    // CRITICAL: Core fallback must NOT be rendered!
    expect(screen.queryByTestId('core-fallback')).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('renders explicit runtime error and does NOT silently render Core fallback when active solution throws during render', async () => {
    const throwingModule: SolutionModule = {
      manifest: {
        id: 'throwing-mod',
        name: 'Throwing Module',
        version: '1.0.0',
        capabilities: ['booking'],
        slots: ['booking:widget'],
      },
      renderSlot: () => {
        throw new Error('Runtime error in bespoke furniture 3D preview');
      },
    };

    registry.register(throwingModule);
    await registry.init({
      version: '1.0.0',
      solutions: {
        'throwing-mod': { enabled: true },
      },
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <SolutionsProvider registry={registry}>
          <SolutionSlot
            name="booking:widget"
            fallback={<div data-testid="core-fallback">Core Showroom Fallback</div>}
          />
        </SolutionsProvider>
      );
    });

    expect(screen.getByTestId('solution-slot-error-booking:widget')).toBeTruthy();
    expect(screen.getByText(/Runtime error in bespoke furniture 3D preview/i)).toBeTruthy();
    // CRITICAL: Must not silently fall back to Core!
    expect(screen.queryByTestId('core-fallback')).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
