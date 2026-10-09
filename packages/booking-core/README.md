# AlzerSoftware Booking & Reservation System — Core Engine

**Repository:** `alzersoftware-booking-core`  
**Namespace:** `@alzersoftware/booking-core`  
**Status:** **PHASE 2A BACKEND FOUNDATION ESTABLISHED**  
**Architecture Contract:** Defined in `docs/BOOKING-RESERVATION-SYSTEM-ARCHITECTURE.md` (Commit: `576e364`)  

## Overview
`alzersoftware-booking-core` is the headless, domain-agnostic, multi-tenant Booking and Reservation operational engine for the AlzerSoftware platform. It powers appointments, workshops, and lodging across diverse commercial sectors:
- Hotels & Lodging
- Hospitals & Outpatient Clinics
- Beauty Salons & Spas
- Training Centers & Educational Academies
- Event Venues & Banquet Halls
- Restaurants & Dining Rooms
- Car Rental & Fleet Leasing
- General Service Businesses (Furniture Showrooms & Consultancies)

## Phase 2A Scope & Capabilities
1. **Database Foundation:** PostgreSQL 15+ schema with 14 core tables, GiST range exclusion constraints for exclusive resources, and Row-Level Security (RLS) policies.
2. **Resource Allocation Models:**
   - `EXCLUSIVE`: Capacity = 1, protected by PostgreSQL GiST range exclusion.
   - `CAPACITY_POOL`: Capacity >= 1, protected by PostgreSQL transactional row locks (`SELECT ... FOR UPDATE`) and capacity ledger accounting.
3. **Resource Pools:** Support for interchangeable resource groups with `IMMEDIATE_AUTO_ASSIGN` and `DEFERRED_ASSIGNMENT`. Cross-tenant membership strictly prevented.
4. **Lodging Date-Range Semantics:** Native `DATE_RANGE` booking unit with calendar dates (`check_in_date`, `check_out_date`) and discrete night calculation.
5. **Reservation Lifecycle & State Machine:**
   - Valid persistent states: `DRAFT`, `PENDING`, `CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`, `NO_SHOW`.
   - `RESCHEDULED` is eliminated from status enums; rescheduling is an atomic coordinate update appending to immutable `reservation_versions`.
6. **Decoupled Payment Lifecycle:** Vendor-neutral payment state machine operating orthogonally alongside reservation status.
7. **Idempotency Guard:** `Idempotency-Key` fingerprinting and replay cache.
8. **Transactional Outbox Pattern:** Atomic event emission to `outbox_events` for asynchronous notification dispatch.
9. **API Health Endpoint:** `GET /health` and `GET /api/v1/health`.

## Getting Started

### Installation
```bash
npm install
```

### Build
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Run Migrations (Requires PostgreSQL)
```bash
npm run migrate
```

### Start Development Server
```bash
npm run dev
```
