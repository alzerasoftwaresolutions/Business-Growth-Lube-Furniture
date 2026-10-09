import { z } from 'zod';

export const resourceTypeSchema = z.enum(['PHYSICAL_SPACE', 'PERSONNEL', 'EQUIPMENT', 'VEHICLE']);
export type ResourceType = z.infer<typeof resourceTypeSchema>;

export const allocationModelSchema = z.enum(['EXCLUSIVE', 'CAPACITY_POOL']);
export type AllocationModel = z.infer<typeof allocationModelSchema>;

export const resourceSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  branchId: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: resourceTypeSchema,
  allocationModel: allocationModelSchema,
  capacity: z.number().int().positive(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
}).refine(data => {
  // EXCLUSIVE resources MUST have capacity = 1
  if (data.allocationModel === 'EXCLUSIVE' && data.capacity !== 1) {
    return false;
  }
  // CAPACITY_POOL resources MUST have capacity >= 1
  if (data.allocationModel === 'CAPACITY_POOL' && data.capacity < 1) {
    return false;
  }
  return true;
}, {
  message: 'EXCLUSIVE allocation model requires capacity = 1; CAPACITY_POOL requires capacity >= 1',
  path: ['capacity'],
});

export type Resource = z.infer<typeof resourceSchema>;

export const allocationStrategySchema = z.enum(['IMMEDIATE_AUTO_ASSIGN', 'DEFERRED_ASSIGNMENT']);
export type AllocationStrategy = z.infer<typeof allocationStrategySchema>;

export const resourcePoolSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  branchId: z.string().uuid(),
  name: z.string().min(1).max(255),
  allocationStrategy: allocationStrategySchema,
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ResourcePool = z.infer<typeof resourcePoolSchema>;

export function validatePoolMembership(pool: ResourcePool, resource: Resource): boolean {
  // Pool and member resource MUST belong to the same tenant and branch
  return pool.tenantId === resource.tenantId && pool.branchId === resource.branchId;
}
