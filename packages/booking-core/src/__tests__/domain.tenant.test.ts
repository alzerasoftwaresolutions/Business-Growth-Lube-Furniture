import { describe, it, expect } from 'vitest';
import { tenantSchema, branchSchema } from '../domain/tenant';

describe('Domain - Tenant & Branch', () => {
  it('validates a correct tenant entity', () => {
    const validTenant = {
      id: crypto.randomUUID(),
      slug: 'lube-furniture',
      name: 'Lube Furniture Showrooms',
      timezone: 'Africa/Addis_Ababa',
      currency: 'USD',
      settings: { cancellationLeadHours: 24 },
    };

    const parsed = tenantSchema.parse(validTenant);
    expect(parsed.slug).toBe('lube-furniture');
    expect(parsed.timezone).toBe('Africa/Addis_Ababa');
  });

  it('rejects an invalid tenant slug with uppercase letters or special chars', () => {
    expect(() => {
      tenantSchema.parse({
        id: crypto.randomUUID(),
        slug: 'LUBE_FURNITURE!',
        name: 'Invalid Slug Tenant',
        timezone: 'UTC',
        currency: 'USD',
      });
    }).toThrow();
  });

  it('rejects an invalid IANA timezone', () => {
    expect(() => {
      tenantSchema.parse({
        id: crypto.randomUUID(),
        slug: 'invalid-tz',
        name: 'Invalid Timezone Tenant',
        timezone: 'Mars/Curiosity',
        currency: 'USD',
      });
    }).toThrow();
  });

  it('validates a branch scoped to a tenant', () => {
    const tenantId = crypto.randomUUID();
    const branch = branchSchema.parse({
      id: crypto.randomUUID(),
      tenantId,
      name: 'Flagship Showroom',
      timezone: 'Africa/Addis_Ababa',
      address: { city: 'Addis Ababa', street: 'Bole Road' },
    });

    expect(branch.tenantId).toBe(tenantId);
    expect(branch.name).toBe('Flagship Showroom');
  });
});
