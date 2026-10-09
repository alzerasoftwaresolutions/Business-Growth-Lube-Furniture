-- Migration 001: Initial Core Schema (Phase 2B Refined)
-- Platform: AlzerSoftware Booking & Reservation System Core

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. Tenants
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Branches
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    timezone VARCHAR(64) NOT NULL,
    address JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_branches_id_tenant UNIQUE (id, tenant_id)
);

-- 3. Resources
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL, -- 'PHYSICAL_SPACE', 'PERSONNEL', 'EQUIPMENT', 'VEHICLE'
    allocation_model VARCHAR(32) NOT NULL DEFAULT 'EXCLUSIVE', -- 'EXCLUSIVE', 'CAPACITY_POOL'
    capacity INTEGER NOT NULL DEFAULT 1 CHECK (capacity >= 1),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_allocation_model CHECK (allocation_model IN ('EXCLUSIVE', 'CAPACITY_POOL')),
    CONSTRAINT uq_resources_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT fk_resources_branch_tenant FOREIGN KEY (branch_id, tenant_id) REFERENCES branches(id, tenant_id) ON DELETE CASCADE
);

-- 4. Resource Pools
CREATE TABLE IF NOT EXISTS resource_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    allocation_strategy VARCHAR(32) NOT NULL DEFAULT 'IMMEDIATE_AUTO_ASSIGN', -- 'IMMEDIATE_AUTO_ASSIGN', 'DEFERRED_ASSIGNMENT'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_allocation_strategy CHECK (allocation_strategy IN ('IMMEDIATE_AUTO_ASSIGN', 'DEFERRED_ASSIGNMENT')),
    CONSTRAINT uq_resource_pools_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT fk_pools_branch_tenant FOREIGN KEY (branch_id, tenant_id) REFERENCES branches(id, tenant_id) ON DELETE CASCADE
);

-- 5. Resource Pool Members (Junction)
CREATE TABLE IF NOT EXISTS resource_pool_members (
    pool_id UUID NOT NULL REFERENCES resource_pools(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    PRIMARY KEY (pool_id, resource_id)
);

-- 6. Services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    resource_pool_id UUID REFERENCES resource_pools(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    booking_unit VARCHAR(16) NOT NULL DEFAULT 'TIME_SLOT', -- 'TIME_SLOT', 'DATE_RANGE'
    duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
    buffer_before_minutes INTEGER NOT NULL DEFAULT 0 CHECK (buffer_before_minutes >= 0),
    buffer_after_minutes INTEGER NOT NULL DEFAULT 0 CHECK (buffer_after_minutes >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_booking_unit CHECK (booking_unit IN ('TIME_SLOT', 'DATE_RANGE')),
    CONSTRAINT uq_services_id_tenant UNIQUE (id, tenant_id)
);

-- 7. Schedules (Recurring weekly hours)
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_working BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_schedule_times CHECK (start_time < end_time),
    CONSTRAINT fk_schedules_branch_tenant FOREIGN KEY (branch_id, tenant_id) REFERENCES branches(id, tenant_id) ON DELETE CASCADE
);

-- 8. Schedule Exceptions / Blackouts
CREATE TABLE IF NOT EXISTS schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    reason VARCHAR(255) NOT NULL,
    is_unavailable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_exception_times CHECK (start_datetime < end_datetime),
    CONSTRAINT fk_exceptions_branch_tenant FOREIGN KEY (branch_id, tenant_id) REFERENCES branches(id, tenant_id) ON DELETE CASCADE
);

-- 9. Customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    custom_attributes JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_customers_id_tenant UNIQUE (id, tenant_id)
);

-- 10. Reservations
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    confirmation_code VARCHAR(32) UNIQUE NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    service_id UUID NOT NULL REFERENCES services(id),
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    resource_pool_id UUID REFERENCES resource_pools(id) ON DELETE SET NULL,
    booking_unit VARCHAR(16) NOT NULL DEFAULT 'TIME_SLOT',
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    party_size INTEGER NOT NULL DEFAULT 1 CHECK (party_size > 0),
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'NOT_REQUIRED',
    notes TEXT,
    cancellation_reason TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_reservation_status CHECK (status IN (
        'DRAFT', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'
    )),
    CONSTRAINT check_payment_status CHECK (payment_status IN (
        'NOT_REQUIRED', 'PENDING', 'AUTHORIZED', 'DEPOSIT_PAID', 'PAID_IN_FULL', 'REFUNDED', 'FAILED'
    )),
    CONSTRAINT check_reservation_dates CHECK (
        (booking_unit = 'TIME_SLOT' AND start_datetime < end_datetime) OR
        (booking_unit = 'DATE_RANGE' AND check_in_date IS NOT NULL AND check_out_date IS NOT NULL AND check_in_date < check_out_date)
    ),
    -- Composite tenant foreign keys guaranteeing cross-tenant isolation at schema level
    CONSTRAINT fk_res_branch_tenant FOREIGN KEY (branch_id, tenant_id) REFERENCES branches(id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_res_customer_tenant FOREIGN KEY (customer_id, tenant_id) REFERENCES customers(id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_res_service_tenant FOREIGN KEY (service_id, tenant_id) REFERENCES services(id, tenant_id) ON DELETE CASCADE,

    -- Exclusion constraint 1: TIME_SLOT bookings (intraday timestamp range)
    CONSTRAINT exclude_exclusive_timeslot_double_booking EXCLUDE USING gist (
        resource_id WITH =,
        tstzrange(start_datetime, end_datetime, '[)') WITH &&
    ) WHERE (
        resource_id IS NOT NULL 
        AND booking_unit = 'TIME_SLOT'
        AND status NOT IN ('CANCELLED', 'NO_SHOW')
    ),

    -- Exclusion constraint 2: DATE_RANGE bookings (calendar date discrete nights, permits same-day turnover)
    CONSTRAINT exclude_exclusive_daterange_double_booking EXCLUDE USING gist (
        resource_id WITH =,
        daterange(check_in_date, check_out_date, '[)') WITH &&
    ) WHERE (
        resource_id IS NOT NULL 
        AND booking_unit = 'DATE_RANGE'
        AND check_in_date IS NOT NULL
        AND check_out_date IS NOT NULL
        AND status NOT IN ('CANCELLED', 'NO_SHOW')
    )
);

-- 11. Reservation Versions (Immutable Rescheduling & Mutation History)
CREATE TABLE IF NOT EXISTS reservation_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    actor_type VARCHAR(32) NOT NULL, -- 'CUSTOMER', 'STAFF', 'ADMIN', 'SYSTEM'
    actor_id VARCHAR(128),
    action VARCHAR(64) NOT NULL, -- 'CREATED', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'STATUS_CHANGE'
    previous_coordinates JSONB NOT NULL DEFAULT '{}',
    new_coordinates JSONB NOT NULL DEFAULT '{}',
    reason TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Reservation Audit Logs
CREATE TABLE IF NOT EXISTS reservation_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    actor_type VARCHAR(32) NOT NULL,
    actor_id VARCHAR(128),
    action VARCHAR(64) NOT NULL,
    previous_state VARCHAR(32),
    new_state VARCHAR(32),
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Idempotency Records
CREATE TABLE IF NOT EXISTS idempotency_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    idempotency_key VARCHAR(128) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PROCESSING',
    response_code INTEGER,
    response_body JSONB,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_idempotency_key UNIQUE (tenant_id, idempotency_key),
    CONSTRAINT check_idempotency_status CHECK (status IN ('PROCESSING', 'RESOLVED', 'REJECTED'))
);

-- 14. Transactional Outbox Events
CREATE TABLE IF NOT EXISTS outbox_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_outbox_status CHECK (status IN ('PENDING', 'PROCESSED', 'FAILED'))
);

-- Performance & Foreign Key Indexes
CREATE INDEX IF NOT EXISTS idx_reservations_tenant_branch ON reservations(tenant_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(start_datetime, end_datetime);
CREATE INDEX IF NOT EXISTS idx_reservations_daterange ON reservations(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_reservations_resource_active ON reservations(resource_id, status);
CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox_events(status, created_at) WHERE status = 'PENDING';
CREATE INDEX IF NOT EXISTS idx_idempotency_expiry ON idempotency_keys(expires_at);
