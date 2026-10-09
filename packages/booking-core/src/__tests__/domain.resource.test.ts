import { describe, it, expect } from 'vitest';
import {
  resourceSchema,
  resourcePoolSchema,
  validatePoolMembership,
  Resource,
  ResourcePool,
} from '../domain/resource';

describe('Domain - Resource & Resource Pools', () => {
  it('accepts an EXCLUSIVE resource with capacity = 1', () => {
    const resource = resourceSchema.parse({
      id: crypto.randomUUID(),
      tenantId: crypto.randomUUID(),
      branchId: crypto.randomUUID(),
      name: 'Dr. Sarah Adams',
      type: 'PERSONNEL',
      allocationModel: 'EXCLUSIVE',
      capacity: 1,
    });

    expect(resource.allocationModel).toBe('EXCLUSIVE');
    expect(resource.capacity).toBe(1);
  });

  it('rejects an EXCLUSIVE resource if capacity != 1', () => {
    expect(() => {
      resourceSchema.parse({
        id: crypto.randomUUID(),
        tenantId: crypto.randomUUID(),
        branchId: crypto.randomUUID(),
        name: 'Invalid Exclusive Resource',
        type: 'PHYSICAL_SPACE',
        allocationModel: 'EXCLUSIVE',
        capacity: 5,
      });
    }).toThrow();
  });

  it('accepts a CAPACITY_POOL resource with capacity > 1', () => {
    const resource = resourceSchema.parse({
      id: crypto.randomUUID(),
      tenantId: crypto.randomUUID(),
      branchId: crypto.randomUUID(),
      name: 'Classroom 101',
      type: 'PHYSICAL_SPACE',
      allocationModel: 'CAPACITY_POOL',
      capacity: 25,
    });

    expect(resource.allocationModel).toBe('CAPACITY_POOL');
    expect(resource.capacity).toBe(25);
  });

  it('rejects an invalid allocation model', () => {
    expect(() => {
      resourceSchema.parse({
        id: crypto.randomUUID(),
        tenantId: crypto.randomUUID(),
        branchId: crypto.randomUUID(),
        name: 'Invalid Model',
        type: 'PHYSICAL_SPACE',
        allocationModel: 'UNBOUNDED' as any,
        capacity: 10,
      });
    }).toThrow();
  });

  it('validates resource pool creation', () => {
    const pool = resourcePoolSchema.parse({
      id: crypto.randomUUID(),
      tenantId: crypto.randomUUID(),
      branchId: crypto.randomUUID(),
      name: 'Economy Car Fleet',
      allocationStrategy: 'DEFERRED_ASSIGNMENT',
    });

    expect(pool.allocationStrategy).toBe('DEFERRED_ASSIGNMENT');
  });

  it('prevents cross-tenant resource pool membership', () => {
    const tenantA = crypto.randomUUID();
    const tenantB = crypto.randomUUID();
    const branchA = crypto.randomUUID();

    const pool: ResourcePool = {
      id: crypto.randomUUID(),
      tenantId: tenantA,
      branchId: branchA,
      name: 'Stylists Pool',
      allocationStrategy: 'IMMEDIATE_AUTO_ASSIGN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const crossTenantResource: Resource = {
      id: crypto.randomUUID(),
      tenantId: tenantB, // Belongs to different tenant!
      branchId: branchA,
      name: 'Hacked Stylist',
      type: 'PERSONNEL',
      allocationModel: 'EXCLUSIVE',
      capacity: 1,
      isActive: true,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(validatePoolMembership(pool, crossTenantResource)).toBe(false);
  });
});
