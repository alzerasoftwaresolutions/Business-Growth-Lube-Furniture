import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Database - Migrations SQL Integrity', () => {
  const migrationsDir = path.resolve(__dirname, '../db/migrations');

  it('contains migration 001 and migration 002 files', () => {
    const files = fs.readdirSync(migrationsDir);
    expect(files).toContain('001_initial_schema.sql');
    expect(files).toContain('002_row_level_security.sql');
  });

  it('migration 001 defines all required core tables and constraints', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '001_initial_schema.sql'), 'utf8');

    // Required tables
    const requiredTables = [
      'tenants',
      'branches',
      'resources',
      'resource_pools',
      'resource_pool_members',
      'services',
      'schedules',
      'schedule_exceptions',
      'customers',
      'reservations',
      'reservation_versions',
      'reservation_audit_logs',
      'idempotency_keys',
      'outbox_events',
    ];

    for (const table of requiredTables) {
      expect(sql).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }

    // Required GiST Exclusion constraint on exclusive TIME_SLOT resources
    expect(sql).toContain('CONSTRAINT exclude_exclusive_timeslot_double_booking EXCLUDE USING gist');
    expect(sql).toContain('tstzrange(start_datetime, end_datetime, \'[)\') WITH &&');

    // Required GiST Exclusion constraint on exclusive DATE_RANGE resources
    expect(sql).toContain('CONSTRAINT exclude_exclusive_daterange_double_booking EXCLUDE USING gist');
    expect(sql).toContain('daterange(check_in_date, check_out_date, \'[)\') WITH &&');

    // Allocation model check
    expect(sql).toContain("allocation_model IN ('EXCLUSIVE', 'CAPACITY_POOL')");

    // Booking unit check
    expect(sql).toContain("booking_unit IN ('TIME_SLOT', 'DATE_RANGE')");

    // Composite Tenant Isolation Foreign Keys
    expect(sql).toContain('CONSTRAINT fk_res_branch_tenant FOREIGN KEY (branch_id, tenant_id) REFERENCES branches(id, tenant_id)');
    expect(sql).toContain('CONSTRAINT fk_res_customer_tenant FOREIGN KEY (customer_id, tenant_id) REFERENCES customers(id, tenant_id)');
    expect(sql).toContain('CONSTRAINT fk_res_service_tenant FOREIGN KEY (service_id, tenant_id) REFERENCES services(id, tenant_id)');

    // Verified lifecycle status (MUST NOT contain RESCHEDULED)
    expect(sql).toContain("'DRAFT', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'");
  });

  it('migration 002 enables PostgreSQL Row-Level Security', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '002_row_level_security.sql'), 'utf8');

    expect(sql).toContain('ALTER TABLE branches ENABLE ROW LEVEL SECURITY;');
    expect(sql).toContain('ALTER TABLE resources ENABLE ROW LEVEL SECURITY;');
    expect(sql).toContain('ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;');
    expect(sql).toContain("current_setting('app.current_tenant_id'");
  });
});
