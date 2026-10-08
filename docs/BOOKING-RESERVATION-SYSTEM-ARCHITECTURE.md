# AlzerSoftware Booking & Reservation System
## Product Architecture & Foundation Specification (Phase 1 & Phase 1.5 Validated)

**Document Reference:** `docs/BOOKING-RESERVATION-SYSTEM-ARCHITECTURE.md`  
**Target Platform:** AlzerSoftware Reusable Solution Ecosystem  
**Initial Integration Target:** `Business-Growth-Lube-Furniture`  
**Status:** **ARCHITECTURALLY VALIDATED WITH CORRECTIONS (PHASE 1.5 AUDITED)**  
**Version:** 1.5.0-SPEC  
**Last Updated:** October 2026  

---

## Executive Summary

The AlzerSoftware Booking & Reservation System (*AlzerBooking*) is a headless, multi-tenant, domain-agnostic booking and reservation platform. It is engineered to power time-slot appointments, multi-seat capacity bookings, date-range overnight stays, and resource-pool allocations across diverse commercial verticals without requiring schema changes or custom database engines.

Following the initial Phase 1 foundation design, **Phase 1.5 (Architecture Validation, Gap Analysis & Correction)** conducted an exhaustive audit of the domain model, concurrency mechanisms, PostgreSQL relational constraints, temporal/timezone representations, multi-tenancy boundaries, and lifecycle state machines.

This document serves as the **authoritative architectural contract** governing all subsequent backend implementation phases (Phases 2 through 9). It guarantees that client-facing showcase templates—beginning with `Business-Growth-Lube-Furniture`—integrate seamlessly through the standardized `SolutionSlot` architecture without backend coupling, runtime data leaks, or proprietary vendor locks.

---

## Table of Contents

* [Phase 1.5 Architecture Validation, Gap Analysis & Critical Corrections](#phase-15-architecture-validation-gap-analysis--critical-corrections)
* [1. Product Definition & Strategic Vision](#1-product-definition--strategic-vision)
* [2. Core Architecture & System Topology](#2-core-architecture--system-topology)
* [3. Generic Domain Model & Entity Definitions](#3-generic-domain-model--entity-definitions)
* [4. Reservation Lifecycle & State Machine](#4-reservation-lifecycle--state-machine)
* [5. Availability Engine & Concurrency Control](#5-availability-engine--concurrency-control)
* [6. Hotel & Date-Range Lodging Semantics](#6-hotel--date-range-lodging-semantics)
* [7. Healthcare & Clinical Appointment Semantics](#7-healthcare--clinical-appointment-semantics)
* [8. Extended 8-Industry Reusability Matrix](#8-extended-8-industry-reusability-matrix)
* [9. Multi-Tenant Architecture & Data Isolation](#9-multi-tenant-architecture--data-isolation)
* [10. Identity, Permissions & User Roles](#10-identity-permissions--user-roles)
* [11. Public Booking Experience & Interaction Flows](#11-public-booking-experience--interaction-flows)
* [12. Administrative Experience & Operational Dashboard](#12-administrative-experience--operational-dashboard)
* [13. API Architecture & Endpoint Contracts](#13-api-architecture--endpoint-contracts)
* [14. Database Architecture & Schema Specification](#14-database-architecture--schema-specification)
* [15. Security, Privacy & PII Compliance](#15-security-privacy--pii-compliance)
* [16. Vendor-Neutral Payment Abstraction & Lifecycle](#16-vendor-neutral-payment-abstraction--lifecycle)
* [17. Pluggable Notification & Communications Engine](#17-pluggable-notification--communications-engine)
* [18. Temporal, Timezone & Calendar Representation Model](#18-temporal-timezone--calendar-representation-model)
* [19. Integration Specification: Business-Growth-Lube-Furniture Template](#19-integration-specification-business-growth-lube-furniture-template)
* [20. Reversibility & Zero-Core-Intrusion Proof](#20-reversibility--zero-core-intrusion-proof)
* [21. Vendor Decoupling & Neutrality Guarantees](#21-vendor-decoupling--neutrality-guarantees)
* [22. Product Scope & MVP Definition](#22-product-scope--mvp-definition)
* [23. Phased Roadmap & Implementation Order](#23-phased-roadmap--implementation-order)
* [24. Repository & Deployment Architecture Recommendation](#24-repository--deployment-architecture-recommendation)
* [25. Impact Analysis on Target Template (Business-Growth-Lube-Furniture)](#25-impact-analysis-on-target-template-business-growth-lube-furniture)
* [26. Architectural Quality Tests (Thought Experiments A through J)](#26-architectural-quality-tests-thought-experiments-a-through-j)
* [27. Implementation & Runtime Status Matrix (False-Pass Detection)](#27-implementation--runtime-status-matrix-false-pass-detection)
* [28. Architectural Decision Record (ADR)](#28-architectural-decision-record-adr)

---


## Phase 1.5 Architecture Validation, Gap Analysis & Critical Corrections

### Executive Verdict: PASS WITH CORRECTIONS
During the Phase 1.5 audit, the foundational vision of a domain-agnostic, headless booking platform was validated. However, a rigorous technical review of the initial Phase 1 specification revealed **critical architectural flaws and hidden contradictions** that would have caused severe operational bugs or data corruption if implemented directly.

The table below documents the ten primary architectural gaps discovered during Phase 1.5 and the authoritative corrections incorporated into this specification:

| # | Architectural Domain | Phase 1 Proposed Design | Critical Flaw / Vulnerability Identified | Phase 1.5 Corrected Architectural Specification |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Resource Capacity Model** | A single `resources.capacity` integer with an unconditional PostgreSQL GIST exclusion constraint: `EXCLUDE USING gist (resource_id WITH =, tstzrange(...) WITH &&)`. | **Direct Contradiction:** A GIST exclusion constraint on `resource_id WITH =` physically rejects ANY second overlapping booking on that resource. Multi-capacity resources (e.g. 25-seat classrooms, 300-person halls) would crash with exclusion violations on the second attendee, making capacity accounting impossible. | **Explicit Dual Allocation Models:** Differentiate resources via `allocation_model`: `EXCLUSIVE` (capacity = 1) vs `CAPACITY_POOL` (capacity > 1). `EXCLUSIVE` uses native GIST exclusion constraints. `CAPACITY_POOL` enforces concurrency authoritatively via PostgreSQL `SELECT ... FOR UPDATE` row locks on the resource or capacity ledger with serialized aggregate checks (`current_consumed + party_size <= total_capacity`). |
| **2** | **Resource Pools & "Any Available" Routing** | `Reservation` schema strictly required a specific `resourceId`. | **Industry Leakage / Rigidity:** In salons (haircut with any stylist), clinics (general consultation triage), and car rentals (economy car category), customers book a service or category without selecting an individual staff member or VIN upfront. | **First-Class Resource Pools:** Introduce `ResourcePool` and `ResourcePoolMember` entities. Services can be bound to a pool. Reservations accept optional `resource_pool_id`, supporting both `IMMEDIATE_AUTO_ASSIGN` (round-robin/least-loaded) and `DEFERRED_ASSIGNMENT` (allocated at check-in or daily dispatch). |
| **3** | **Lodging & Date-Range Semantics** | Stored all bookings purely as UTC timestamps (`startDateTime`, `endDateTime` `TIMESTAMPTZ`). | **DST & Business-Date Bugs:** Hotels operate on calendar business dates (`2026-10-10` to `2026-10-14` = 4 nights). Storing pure UTC instants causes Daylight Saving Time (DST) transitions to shift checkout hours by +/- 1 hour, breaks same-day turnover (11:00 checkout vs 15:00 check-in), and corrupts night accounting. | **Explicit Booking Units & Business Dates:** Differentiate `booking_unit`: `TIME_SLOT` (intraday minutes/hours) vs `DATE_RANGE` (overnight calendar dates). Lodging bookings store `check_in_date DATE`, `check_out_date DATE`, and `nights INTEGER`. UTC operational boundaries are derived deterministically using the branch's local IANA timezone and property policy check-in/out times. |
| **4** | **Reservation Lifecycle & State Mutation** | `RESCHEDULED` was defined as a status enum value and modeled as a terminal state. | **Lifecycle Dead-End:** When an appointment is rescheduled, the booking does not terminate; it remains active at a new time! Marking status as `RESCHEDULED` prevents staff from checking in or completing the appointment. | **Rescheduling as an Atomic Operation / Event:** `RESCHEDULED` is removed from the status enum. Rescheduling is an atomic transaction that updates reservation coordinates (`start`, `end`, `resource_id`) within the database while keeping status as `CONFIRMED` (or `PENDING`), simultaneously appending an immutable entry to `reservation_versions` and `reservation_audit_logs`. |
| **5** | **Concurrency & Authority Hierarchy** | Redis caching was framed as "Phase 1 Optimistic Locking" and PostgreSQL as "Phase 2". | **Ambiguous Authority:** Implied that Redis was required for transactional correctness, and risked state corruption if Redis crashed or lost cache keys. | **Authoritative PostgreSQL Source of Truth:** PostgreSQL is the SOLE authoritative arbiter of truth. Redis is strictly an optional ephemeral performance hold (UX optimization). A complete Redis outage degrades temporary hold speed but CANNOT cause double-bookings; PostgreSQL transaction rules guarantee correctness unconditionally. |
| **6** | **Temporary Slot Holds** | Ephemeral 10-minute cache hold with vague client-side lifecycle and expiration handling. | **Race Conditions & Phantom Holds:** If payment is in flight at minute 9:59 and Redis TTL expires at 10:00, another user could book the slot before payment webhooks arrive. Relying on browser unload beacons for hold release is unreliable. | **Server-Authoritative Holds:** Holds have server-authoritative timestamps (`expires_at`). Expired holds are pruned or ignored automatically. Late payment webhook reconciliation inspects authoritative DB state; if the slot was claimed by another party, an automated gateway refund is triggered without corrupting reservations. |
| **7** | **API Idempotency** | No idempotency contract or headers defined for mutating endpoints. | **Duplicate Reservations:** Network timeouts on `POST /reservations` cause users to click "Book" repeatedly, generating duplicate reservations and erroneous charges. | **Mandatory Idempotency Contract:** Mutating endpoints require `Idempotency-Key` (UUIDv4). Backed by an `idempotency_keys` table storing request hashes, response codes, and payloads. Retries return cached responses without re-executing transactions. |
| **8** | **Payment Lifecycle Decoupling** | Mixed payment and reservation states without clear boundary or orthogonal modeling. | **Coupled Failure Modes:** Inability to model "Pay on arrival" (Reservation `CONFIRMED` + Payment `PENDING`) or "Refund after cancellation" (Reservation `CANCELLED` + Payment `REFUNDED`). | **Orthogonal State Machines:** Separate `reservation.status` from `reservation.payment_status`. Payment state machine (`NOT_REQUIRED`, `PENDING`, `AUTHORIZED`, `DEPOSIT_PAID`, `PAID_IN_FULL`, `REFUNDED`, `FAILED`) operates orthogonally. |
| **9** | **Notification Resilience & Outbox** | Notifications triggered synchronously or vaguely after booking creation. | **Transactional Vulnerability:** Third-party provider failure (e.g. SendGrid 503) could roll back a successful reservation or leave unconfirmed bookings. | **Transactional Outbox Pattern:** Booking transactions write event records to an internal `outbox_events` table inside the same PostgreSQL transaction. A decoupled worker processes notifications asynchronously with exponential backoff and dead-letter queues. |
| **10** | **Multi-Tenancy Defense-in-Depth** | Mentioned PostgreSQL Row-Level Security (RLS) in passing. | **Single Point of Security Failure:** Over-reliance on RLS without application-level guarantees risks data leaks if connection pools bypass RLS session variables. | **Dual-Layer Multi-Tenancy:** Application-level query scoping (`WHERE tenant_id = :tenant_id`) enforced on EVERY database query, backed by PostgreSQL RLS as defense-in-depth via session context (`SET LOCAL app.current_tenant_id`). Platform admin cross-tenant access requires explicit, audited impersonation scopes. |

---

## 1. Product Definition & Strategic Vision

### 1.1 Product Name
**AlzerSoftware Booking & Reservation System** (*AlzerBooking*)  
Package Namespace: `@alzersoftware/booking-core` (Headless Engine) & `@alzersoftware/booking-adapter-react` (Client Component Bridge).

### 1.2 Purpose & Problem Solved
Small and medium-sized enterprises across service, hospitality, health, wellness, and rental sectors suffer from fragmented, siloed scheduling tools. Existing commercial solutions either:
1. Force rigid calendar assumptions (e.g., treating multi-day hotel reservations as 4-day appointments),
2. Demand costly per-seat SaaS subscriptions with proprietary branding, or
3. Force developers to build bespoke, brittle reservation systems vulnerable to race conditions and double-bookings.

*AlzerBooking* solves this by providing a **headless, multi-tenant, domain-agnostic booking engine** that decouples operational availability calculations from customer-facing presentation.

### 1.3 Target Businesses & Industry Breadth
* **Showrooms & Consultancies:** Interior design walkthroughs, architectural advisory sessions, product demonstrations.
* **Hotels & Hospitality:** Boutique hotels, resorts, guest villas, serviced apartments.
* **Healthcare & Wellness:** Outpatient clinics, private medical practices, therapy centers.
* **Personal Care & Salons:** Hair salons, day spas, aesthetics studios.
* **Education & Training:** Technical workshops, certification classes, corporate seminars.
* **Venues & Events:** Conference halls, private screening rooms, banquet venues.
* **Vehicle & Asset Rental:** Fleet vehicles, construction equipment, specialized tool leasing.
* **Restaurants & Dining:** Dining table reservations, private dining room bookings.

### 1.4 Primary User Personas
1. **Public Booking Users (Clients / Guests / Patients):** Discover open slots, self-schedule appointments, reserve capacity, receive instant confirmations, and manage their bookings.
2. **Business / Admin Users (Owners / Managers / Front Desk):** Define resources and operating schedules, inspect bookings on a live calendar, handle walk-ins, and manage cancellations.
3. **Staff / Service Providers:** View individual daily rosters and mark service fulfillment.
4. **Platform Administrators (AlzerSoftware):** Provision business tenants, manage global policies, and monitor platform health.

### 1.5 Separation of Concerns: Company Profile vs. Booking Platform
* **Company Profile (Website Front Door):** The client-facing digital showcase (e.g., `Business-Growth-Lube-Furniture`). Responsible for brand experience, catalog browsing, SEO, and inquiry routing. Holds **zero** booking state, database transactions, payment gateways, or database locks.
* **Booking & Reservation System (Operational Engine):** The headless service managing business hours, resource capacities, real-time availability calculations, conflict-free transactions, confirmation tokens, and notification dispatch.

---

## 2. Core Architecture & System Topology

### 2.1 System Topology Diagram

```text
+-----------------------------------------------------------------------------------+
|                                PRESENTATION TIER                                  |
|   Company Profile / Showcase (e.g. Business-Growth-Lube-Furniture)                |
|   [ Pages: /booking, /services, modals ]                                          |
+-----------------------------------------------------------------------------------+
                                    |
                         SolutionSlot: 'booking:widget'
                                    |
+-----------------------------------------------------------------------------------+
|                     INTEGRATION ADAPTER / SDK LAYER                               |
|   @alzersoftware/booking-adapter-react                                            |
|   - Generic SolutionModule Contract                                               |
|   - Reactive Availability State Cache                                             |
|   - SlotErrorBoundary & CoreBookingFallback Handling                              |
+-----------------------------------------------------------------------------------+
                                    | HTTPS / REST / Idempotency-Key
+-----------------------------------------------------------------------------------+
|                           API GATEWAY & ROUTER                                    |
|   AlzerBooking Gateway (Rate Limiter, Tenant Routing, Auth, Idempotency Guard)    |
+-----------------------------------------------------------------------------------+
                                    |
+-----------------------------------------------------------------------------------+
|                      ALZERBOOKING OPERATIONAL CORE                                |
|   +--------------------------+             +--------------------------+           |
|   |   Availability Engine    |             |    Reservation Engine    |           |
|   |  - Dynamic Slot Matrix   |             |  - 8-Step Transaction    |           |
|   |  - Pool Aggregation      |             |  - Concurrency Lock      |           |
|   +--------------------------+             +--------------------------+           |
|                 |                                       |                         |
|   +--------------------------+             +--------------------------+           |
|   |   Schedule Management    |             |   Policies & Rules       |           |
|   |  - Hours, Blackouts, DST |             |  - Cutoffs, Lead Times   |           |
|   +--------------------------+             +--------------------------+           |
|                 |                                       |                         |
|   +--------------------------+             +--------------------------+           |
|   |   Transactional Outbox   |             |  Decoupled Payment Seam  |           |
|   |  - Async Notifications   |             |  - Vendor-Neutral State  |           |
|   +--------------------------+             +--------------------------+           |
+-----------------------------------------------------------------------------------+
                  |                                       |
    [ Ephemeral Hold Cache ]                [ Authoritative Relational DB ]
          Redis 7+                                PostgreSQL 15+
    (Advisory locks & TTL holds)            (ACID, GIST Range Exclusions,
                                             Row-Locks, Strict Relational Model)
```

### 2.2 Boundary Invariants & Guarantees
1. **Core Zero Intrusion:** The company profile repository has no knowledge of PostgreSQL, Redis, payment providers, or SMS APIs.
2. **Authoritative Storage:** All availability commitments and booking states are decided and persisted inside PostgreSQL.
3. **Pluggable Integration:** Replacing or disabling the booking system leaves the showcase template 100% functional with zero broken routes.


## 3. Generic Domain Model & Entity Definitions

To ensure multi-industry capability without database churn, *AlzerBooking* enforces a clean separation between **strongly typed core operational columns** and **extensible domain-specific metadata**.

### Operational Fields vs. Extension Metadata Boundary
* **Strongly Typed Core Columns:** Every attribute that participates in SQL joins, range exclusion indexes, capacity aggregations, date/time arithmetic, row locking, or lifecycle states MUST be a strongly typed, first-class column (e.g. `tenant_id`, `resource_id`, `resource_pool_id`, `start_datetime`, `end_datetime`, `check_in_date`, `check_out_date`, `party_size`, `status`, `payment_status`, `booking_unit`).
* **Extension Metadata (JSONB):** Attributes that are strictly informational for staff or external systems (e.g. hotel guest flight number, car rental driver license tier, salon haircut inspiration notes, furniture room dimensions) reside within structured `metadata` or `custom_attributes` JSONB columns, validated via JSON Schema / Zod at the API gateway layer. Core database engines never query unstructured JSON to compute availability or lock slots.

### 3.1 Business / Tenant
Represents the commercial entity operating the booking system.
* `id` (UUID, PK)
* `slug` (VARCHAR(64), Unique): Public URL route identifier (e.g., `lube-furniture`, `st-mary-clinic`).
* `name` (VARCHAR(255))
* `timezone` (VARCHAR(64)): Default IANA timezone (e.g., `Africa/Addis_Ababa`, `Europe/Rome`).
* `currency` (VARCHAR(3)): ISO 4217 currency code (e.g., `USD`, `EUR`, `ETB`).
* `settings` (JSONB): Tenant-level defaults (cancellation window, auto-confirm rules).

### 3.2 Branch / Facility
A distinct physical location or operational zone belonging to a tenant.
* `id` (UUID, PK)
* `tenantId` (UUID, FK -> `tenants.id`)
* `name` (VARCHAR(255)): (e.g., `Addis Ababa Flagship Showroom`, `Downtown Clinic`).
* `timezone` (VARCHAR(64)): Branch-specific IANA timezone (governs operating hours and DST transitions).
* `address` (JSONB): Physical address, coordinates, and contact details.

### 3.3 Resource
The tangible or human asset required to execute a booking.
* `id` (UUID, PK)
* `tenantId` (UUID, FK -> `tenants.id`)
* `branchId` (UUID, FK -> `branches.id`)
* `name` (VARCHAR(255)): (e.g., `Consultation Suite A`, `Dr. Sarah Adams`, `Classroom 4`, `Toyota RAV4 - Plate 384`).
* `type` (Enum): `PHYSICAL_SPACE` | `PERSONNEL` | `EQUIPMENT` | `VEHICLE`.
* `allocationModel` (Enum):
  * `EXCLUSIVE`: Exactly one active reservation may occupy the resource during an interval (capacity = 1). Enforced by PostgreSQL GIST range exclusion.
  * `CAPACITY_POOL`: Multiple reservations may occupy the resource simultaneously up to `capacity`. Enforced by PostgreSQL transactional row-locking and aggregate capacity accounting.
* `capacity` (Integer): Maximum simultaneous units/seats/occupants (1 for exclusive; >1 for capacity resources).
* `isActive` (Boolean)
* `metadata` (JSONB): Equipment details, license numbers, room specifications.

### 3.4 Resource Pool / Group (Solving "Any Available Resource")
A logical collection of interchangeable resources capable of fulfilling a service without customer-specified resource selection (e.g., "Any Available Stylist", "Economy Car Fleet", "Standard Double Room Inventory").
* `id` (UUID, PK)
* `tenantId` (UUID, FK -> `tenants.id`)
* `branchId` (UUID, FK -> `branches.id`)
* `name` (VARCHAR(255)): (e.g., `Senior Stylists Pool`, `Standard Sedan Fleet`, `General Medicine Doctors`).
* `allocationStrategy` (Enum):
  * `IMMEDIATE_AUTO_ASSIGN`: System assigns an individual resource at booking creation via round-robin, least-loaded, or random available selection.
  * `DEFERRED_ASSIGNMENT`: Reservation is created against the pool. The individual physical resource is assigned closer to fulfillment (e.g., car assigned at rental counter, hotel room assigned at check-in).
* `members` (Junction: `resource_pool_members` linking `resource_id` and `pool_id`).

### 3.5 Service
The catalog offering bookable by the client.
* `id` (UUID, PK)
* `tenantId` (UUID, FK -> `tenants.id`)
* `name` (VARCHAR(255)): (e.g., `Interior Space Consultation`, `Dental Cleaning`, `Full Day Studio Rental`).
* `bookingUnit` (Enum):
  * `TIME_SLOT`: Intraday hour/minute appointments.
  * `DATE_RANGE`: Overnight or multi-day reservations based on calendar dates.
* `durationMinutes` (Integer): For time-slot bookings.
* `bufferBeforeMinutes` (Integer): Prep / sanitization buffer prior to start.
* `bufferAfterMinutes` (Integer): Cleanup / rest buffer following end.
* `resourcePoolId` (UUID, Optional FK -> `resource_pools.id`): If service routes to a resource pool.
* `isActive` (Boolean)

### 3.6 Schedule
The regular recurring operating hours for branches or specific resources.
* `id` (UUID, PK)
* `tenantId` (UUID, FK -> `tenants.id`)
* `branchId` (UUID, FK -> `branches.id`)
* `resourceId` (UUID, Optional FK -> `resources.id`): Null if defining branch-wide hours.
* `dayOfWeek` (Integer: 0=Sunday, 6=Saturday).
* `startTime` (TIME: e.g., `09:00:00`).
* `endTime` (TIME: e.g., `18:00:00`).
* `isWorking` (Boolean)

### 3.7 Schedule Exception / Blackout
Calendar-specific overrides to regular schedules (holidays, maintenance, closures, personal leave).
* `id` (UUID, PK)
* `tenantId` (UUID, FK -> `tenants.id`)
* `branchId` (UUID, FK -> `branches.id`)
* `resourceId` (UUID, Optional FK -> `resources.id`)
* `startDateTime` (TIMESTAMPTZ UTC)
* `endDateTime` (TIMESTAMPTZ UTC)
* `reason` (VARCHAR(255))
* `isUnavailable` (Boolean: true = fully blocked).

### 3.8 Customer
The contact initiating or receiving the booking.
* `id` (UUID, PK)
* `tenantId` (UUID, FK -> `tenants.id`)
* `fullName` (VARCHAR(255))
* `email` (VARCHAR(255))
* `phone` (VARCHAR(64))
* `customAttributes` (JSONB)

### 3.9 Reservation
The central, authoritatively committed reservation agreement.
* `id` (UUID, PK)
* `confirmationCode` (VARCHAR(32), Unique): Human-friendly identifier (e.g., `LUB-89247`).
* `tenantId` (UUID, FK -> `tenants.id`)
* `branchId` (UUID, FK -> `branches.id`)
* `customerId` (UUID, FK -> `customers.id`)
* `serviceId` (UUID, FK -> `services.id`)
* `resourceId` (UUID, Nullable FK -> `resources.id`): Null if deferred pool assignment.
* `resourcePoolId` (UUID, Nullable FK -> `resource_pools.id`): Set if booked against a pool.
* `bookingUnit` (Enum): `TIME_SLOT` | `DATE_RANGE`.
* `startDateTime` (TIMESTAMPTZ UTC): Computed operational start.
* `endDateTime` (TIMESTAMPTZ UTC): Computed operational end.
* `checkInDate` (DATE, Nullable): Populated for `DATE_RANGE` bookings (e.g. `2026-10-10`).
* `checkOutDate` (DATE, Nullable): Populated for `DATE_RANGE` bookings (e.g. `2026-10-14`).
* `partySize` (Integer, Default 1): Seats or quantity consumed.
* `status` (Enum): `DRAFT` | `PENDING` | `CONFIRMED` | `CHECKED_IN` | `COMPLETED` | `CANCELLED` | `NO_SHOW`.
  *(Note: `RESCHEDULED` is NOT a status enum; rescheduling is an atomic coordinate update documented in version history).*
* `paymentStatus` (Enum): `NOT_REQUIRED` | `PENDING` | `AUTHORIZED` | `DEPOSIT_PAID` | `PAID_IN_FULL` | `REFUNDED` | `FAILED`.
* `notes` (TEXT)
* `cancellationReason` (TEXT, Nullable)
* `metadata` (JSONB): Specialized domain attributes.
* `version` (Integer, Default 1): Incremented on every rescheduling/mutation.
* `createdAt`, `updatedAt` (TIMESTAMPTZ UTC)

### 3.10 Reservation Version & Audit Event (Immutable History)
Maintains audit integrity across cancellations, rescheduling, and status modifications.
* `id` (UUID, PK)
* `reservationId` (UUID, FK -> `reservations.id`)
* `versionNumber` (Integer)
* `actorType` (Enum): `CUSTOMER` | `STAFF` | `ADMIN` | `SYSTEM`.
* `actorId` (VARCHAR(128), Nullable)
* `action` (VARCHAR(64)): (e.g., `CREATED`, `CONFIRMED`, `RESCHEDULED`, `CANCELLED`, `CHECKED_IN`).
* `previousCoordinates` (JSONB): Captures `{ startDateTime, endDateTime, resourceId, partySize }` before change.
* `newCoordinates` (JSONB): Captures new coordinates after change.
* `reason` (TEXT, Nullable)
* `ipAddress` (VARCHAR(45), Nullable)
* `createdAt` (TIMESTAMPTZ UTC)

### 3.11 Idempotency Record
Protects mutating endpoints from duplicated network submissions.
* `id` (UUID, PK)
* `tenantId` (UUID, FK -> `tenants.id`)
* `idempotencyKey` (VARCHAR(128))
* `requestHash` (VARCHAR(64)): SHA-256 hash of endpoint path and request body.
* `status` (Enum): `PROCESSING` | `RESOLVED` | `REJECTED`.
* `responseCode` (Integer, Nullable)
* `responseBody` (JSONB, Nullable)
* `expiresAt` (TIMESTAMPTZ UTC)

---

## 4. Reservation Lifecycle & State Machine

### 4.1 Persistent States vs. Transition Events
The reservation lifecycle comprises seven **persistent states** and multiple **atomic transition events**. Rescheduling is explicitly modeled as a transition event, not a persistent dead-end state.

```text
                  +---------------------------------------------------+
                  |                      DRAFT                        |
                  |     (Temporary hold in cache; form intake)        |
                  +---------------------------------------------------+
                                            |
                                            | Form submission / Checkout initiated
                                            v
                  +---------------------------------------------------+
                  |                     PENDING                       |
                  |  (Awaiting async payment verification or approval)|
                  +---------------------------------------------------+
                       /                    |                    \
      Auto-confirmed /  Payment timed out / | Customer / Admin     \
     deposit verified  payment failed       | cancels request       \ Admin rejects
                     v                      v                        v
+------------------------+  +--------------------------------------------+
|       CONFIRMED        |  |                 CANCELLED                  |
| (Authoritative active  |  |       (Terminal state; availability        |
|      reservation)      |  |         released to pool immediately)      |
+------------------------+  +--------------------------------------------+
       |          ^
       |          | Atomic Rescheduling Operation:
       +----------+ - Checks new slot availability authoritatively
                    - Swaps timestamps/resource inside single DB tx
                    - Appends record to reservation_versions
                    - Retains status as CONFIRMED
       |
       | Day of service arrival
       v
+------------------------+
|       CHECKED_IN       |
| (Guest on site / in    |
|   consultation chair)  |
+------------------------+
       |                 \
       | Service          \ Grace period exceeded
       | completed         \ without arrival
       v                    v
+------------------------+  +------------------------+
|       COMPLETED        |  |        NO_SHOW         |
|    (Terminal state;    |  |    (Terminal state;    |
|   service fulfilled)   |  |   penalties apply)     |
+------------------------+  +------------------------+
```

### 4.2 State Transitions & Permissions Matrix

| From State | To State | Trigger / Event | Allowed Actors | Capacity Effect | Payment Effect | Notification Dispatched |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *(None)* | **DRAFT** | Initiate checkout | Customer / Staff | Ephemeral hold placed in cache (TTL 600s). | None | None |
| **DRAFT** | **PENDING** | Submit intake form | Customer / Staff | Consumes capacity in DB (`PENDING`). | Creates payment intent if required. | None / Checkout initiated |
| **PENDING** | **CONFIRMED**| Payment verified OR auto-confirm policy | System / Staff | Capacity locked as confirmed. | `paymentStatus` -> `PAID_IN_FULL` or `DEPOSIT_PAID`. | `RESERVATION_CONFIRMED` (Email + .ics) |
| **PENDING** | **CANCELLED**| Timeout (TTL expiry) OR user abort | System / Customer | Capacity released back to pool immediately. | Voids pending payment intent. | `RESERVATION_EXPIRED` |
| **CONFIRMED**| **CONFIRMED**| **Atomic Reschedule** | Customer / Staff | Atomically releases old slot; claims new slot. | Retains existing payment or adjusts fee. | `RESERVATION_RESCHEDULED` |
| **CONFIRMED**| **CANCELLED**| Cancel reservation | Customer / Staff | Capacity released back to pool immediately. | Dispatches refund if within policy cutoff. | `RESERVATION_CANCELLED` |
| **CONFIRMED**| **CHECKED_IN**| Customer arrives on site | Staff / Receptionist| Capacity remains occupied. | Settles outstanding balance if pending. | `GUEST_CHECKED_IN` |
| **CHECKED_IN**| **COMPLETED** | Service completed | Staff / Specialist | Capacity freed for future intervals. | Final settlement recorded. | `SERVICE_COMPLETED` + Feedback invite |
| **CONFIRMED**| **NO_SHOW**   | Customer fails to arrive | Staff / Admin | Capacity marked missed; slot freed. | Applies no-show fee per policy. | `RESERVATION_NO_SHOW` |

### 4.3 Rescheduling Semantics & Atomic Availability Swap
When a reservation is rescheduled:
1. The request supplies `newStartDateTime`, `newEndDateTime`, and optional `newResourceId`.
2. A single PostgreSQL transaction is initiated.
3. The availability of the **new** coordinate is verified authoritatively (under row locks or exclusion constraints).
4. If unavailable, transaction rolls back and returns HTTP 409 Conflict; the original booking remains untouched and active.
5. If available, the existing reservation row is updated with new coordinates, `version` is incremented by 1, and an immutable entry is appended to `reservation_versions`.
6. Old slot availability is automatically relinquished; new slot availability is authoritatively locked.
7. Transaction commits. Status remains `CONFIRMED`.

---

## 5. Availability Engine & Concurrency Control

### 5.1 Two-Tier Concurrency Architecture
*AlzerBooking* enforces a strict two-tier concurrency hierarchy:

1. **Tier 1 — Ephemeral Performance Hold (Advisory / UX Layer):**
   * Handled by Redis.
   * When a client selects a slot and proceeds to the checkout step, a 10-minute hold key is acquired:
     `SET lock:slot:{tenantId}:{resourceId}:{slotStart} {sessionId} NX EX 600`
   * **Crucial Rule:** Redis is **never** relied upon for transactional correctness. If Redis is unavailable or experiences a network partition, the platform gracefully degrades to direct database reservations. A Redis crash **never causes double-bookings**.
2. **Tier 2 — PostgreSQL Database Engine (Authoritative Arbiter of Truth):**
   * PostgreSQL guarantees absolute ACID isolation and consistency.
   * All final booking commitments are validated and written within a PostgreSQL transaction boundary.
   * Client-side availability calculations and Redis hold queries are **informational only**. The database engine is the sole authoritative authority.

### 5.2 Mathematical Availability & Slot Resolution

For any target Resource $R$ on Date $D$:
$$	ext{Available Intervals} = Big(	ext{Schedule}(R, D) setminus 	ext{Blackouts}(R, D)Big) setminus igcup_{i=1}^{N} Big(	ext{Reservation}_i(R) + 	ext{Buffer}(S)Big)$$

Where:
* Multi-occupancy resources (capacity pools, workshops, restaurants) decrement available capacity:
$$	ext{RemainingCapacity}(t) = 	ext{ResourceCapacity}(R) - sum 	ext{PartySize}Big(	ext{ActiveBookings}(R, t)Big)$$
* A slot is available for a new request of size $P$ if and only if:
$$	ext{RemainingCapacity}(t) ge P quad orall t in [	ext{Start}, 	ext{End})$$

### 5.3 Exclusive Resource Concurrency (GIST Range Exclusion)
For exclusive resources (`allocation_model = 'EXCLUSIVE'`, capacity = 1), double-booking is physically prevented by the PostgreSQL storage engine via native **Range Types** with GiST indexes:

```sql
-- Native PostgreSQL GIST range exclusion constraint for exclusive resources
ALTER TABLE reservations ADD CONSTRAINT exclude_exclusive_double_booking
EXCLUDE USING gist (
    resource_id WITH =,
    tstzrange(start_datetime, end_datetime, '[)') WITH &&
) WHERE (
    resource_id IS NOT NULL 
    AND status NOT IN ('CANCELLED', 'NO_SHOW')
);
```

Any concurrent transaction attempting to insert an overlapping active reservation for the same `resource_id` is immediately aborted by PostgreSQL with a serialization/exclusion violation (`23P01`), which the API catches and maps to HTTP 409 Conflict.

### 5.4 Capacity Resource Concurrency (Row-Level Locking & Ledger Accounting)
For capacity resources (`allocation_model = 'CAPACITY_POOL'`, capacity > 1), multiple overlapping bookings must be allowed until aggregate capacity is exhausted. Since GIST exclusion constraints reject *any* overlap, capacity concurrency is enforced via **serialized row-level locking**:

```sql
-- Concurrency procedure inside PostgreSQL Transaction:
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Step 1: Acquire exclusive row lock on the target resource
SELECT capacity, allocation_model 
FROM resources 
WHERE id = :target_resource_id AND tenant_id = :tenant_id 
FOR UPDATE;

-- Step 2: Sum active party sizes overlapping the requested interval
SELECT COALESCE(SUM(party_size), 0) AS consumed_capacity
FROM reservations
WHERE resource_id = :target_resource_id
  AND tenant_id = :tenant_id
  AND status NOT IN ('CANCELLED', 'NO_SHOW')
  AND tstzrange(start_datetime, end_datetime, '[)') && tstzrange(:req_start, :req_end, '[)');

-- Step 3: Authoritative Verification
-- IF (consumed_capacity + :new_party_size > capacity) THEN
--     ROLLBACK;
--     RAISE EXCEPTION 'CAPACITY_EXCEEDED';
-- ELSE
--     INSERT INTO reservations (...) VALUES (...);
--     COMMIT;
-- END IF;
```

Because `SELECT ... FOR UPDATE` locks the parent resource row, concurrent transactions attempting to book the same classroom, dining area, or event hall are serialized. Two users simultaneously attempting to book the last remaining seats will execute sequentially; the first succeeds, and the second is safely rejected with HTTP 409 Conflict.

### 5.5 Resource Pool Availability ("Any Available Resource")
When booking against a `ResourcePool` (e.g. "Haircut with Any Stylist", "Economy Sedan"):
1. The engine queries all active members of the pool:
   `SELECT resource_id FROM resource_pool_members WHERE pool_id = :pool_id`.
2. For each member, the engine calculates availability over the requested interval.
3. If `allocation_strategy = 'IMMEDIATE_AUTO_ASSIGN'`:
   * The engine selects an available member using configured heuristics (e.g. least-loaded over the day, round-robin).
   * The reservation is created directly with the chosen `resource_id`.
4. If `allocation_strategy = 'DEFERRED_ASSIGNMENT'`:
   * The engine verifies that total available pool inventory at that interval $>=$ requested quantity:
     $$	ext{AvailableUnits}(	ext{Pool}, t) = sum_{r in 	ext{Pool}} 	ext{IsAvailable}(r, t)$$
   * If available, the reservation is created with `resource_pool_id = :pool_id` and `resource_id = NULL`.
   * A physical resource is assigned later during check-in or administrative dispatch.

### 5.6 Temporary Holds: Lifecycle, Expiry & Failure Modes
1. **Hold Creation:** Initiated when customer enters the booking form. An ephemeral key `hold:{tenant}:{resource}:{interval}` is placed in Redis with a 600-second TTL.
2. **Hold Visibility:** Held slots appear as "Unavailable" to other public visitors.
3. **Server-Side Expiry:** Expiry is 100% server-authoritative via Redis TTL or database `expires_at` timestamps. Browser closing, tab navigation, or network disconnection never leaves persistent orphaned locks; the key expires automatically after 10 minutes.
4. **Late Payment Webhook Race Resolution:**
   * If a customer submits payment at second 599 and the payment webhook arrives at second 605 after the hold expired:
   * The webhook handler checks if the slot was re-booked during the gap.
   * If the slot is still free, the reservation is confirmed cleanly.
   * If another customer claimed the slot, the payment handler automatically triggers a gateway refund and dispatches an explanatory email: *"Your session timed out before payment completed; your charge has been fully refunded."* No double-booking is ever permitted.

### 5.7 The 8-Step Atomic Booking Creation Sequence
Every booking submission executes the following authoritative sequence:

1. **Request Intake:** Client submits `POST /v1/public/{tenant}/reservations` with payload and `Idempotency-Key`.
2. **Idempotency Guard:** Gateway inspects `idempotency_keys`. If key exists and is resolved, cached response is returned immediately.
3. **Advisory Validation:** Availability Engine verifies operating hours, lead time policies, and blackouts.
4. **Transaction Initiation:** PostgreSQL transaction begins (`BEGIN`).
5. **Authoritative Lock & Capacity Check:**
   * For `EXCLUSIVE`: Target resource record verified; GIST range exclusion constraint active.
   * For `CAPACITY_POOL`: Parent resource row locked via `SELECT ... FOR UPDATE`; aggregate party size evaluated.
6. **Reservation Commitment:** Reservation record inserted with status `CONFIRMED` (or `PENDING`).
7. **Transactional Outbox Record:** Event payload (`RESERVATION_CREATED`) written to `outbox_events` table inside the same transaction.
8. **Transaction Commit & Idempotency Storage:** Transaction commits (`COMMIT`). Response is returned to client, and asynchronous outbox worker dispatches notifications.


## 6. Hotel & Date-Range Lodging Semantics

A critical flaw in naive booking engines is treating hotel reservations as continuous timestamp spans. Hotel stays are fundamentally governed by **business calendar dates** and **local turnover rules**:

### 6.1 Business Dates vs. UTC Instants
* **Calendar Date Invariant:** A reservation from `2026-10-10` to `2026-10-14` represents exactly 4 nights, regardless of whether Daylight Saving Time (DST) shifts the clock by +1 or -1 hour during the stay.
* **Storage Distinction:** Lodging reservations store `booking_unit = 'DATE_RANGE'`, `check_in_date = '2026-10-10'`, and `check_out_date = '2026-10-14'`.
* **Turnover & Operational Windows:** The physical property defines local operational check-in and check-out times in its IANA timezone (e.g. Check-in: 15:00, Check-out: 11:00 in `Africa/Addis_Ababa`).
* **Same-Day Turnover Guarantee:** Because Guest A departs at 11:00 and Guest B arrives at 15:00 on `2026-10-14`, the system allows both bookings for the same room on the turnover date without a collision. The 4-hour gap is reserved for housekeeping and turnover.

---

## 7. Healthcare & Clinical Appointment Semantics

Healthcare environments require strict operational separation between scheduling logistics and clinical medical data:

### 7.1 Provider Scheduling & Buffer Times
* **Doctor Resource:** Modeled as an `EXCLUSIVE` resource of type `PERSONNEL`.
* **Preparation & Sanitization Buffers:** Services enforce mandatory buffers (e.g., `bufferBeforeMinutes = 5`, `bufferAfterMinutes = 15` for exam room sanitization). The Availability Engine blocks the entire buffer window from public booking.

### 7.2 Critical Security & Medical Record Boundary
* *AlzerBooking* strictly manages **appointment logistics, calendars, and confirmations**.
* **Zero Medical Record Intrusion:** Electronic Health Records (EHR), clinical diagnoses, prescription histories, and sensitive medical notes are **strictly prohibited** from the booking schema.
* Appointment booking payloads only collect operational contact details and generic triage categories (e.g. `Routine Dental Checkup`, `Initial Orthopedic Consultation`), ensuring full HIPAA / GDPR compliance.

---

## 8. Extended 8-Industry Reusability Matrix

The generic core domain model powers eight distinct commercial industries without requiring schema modifications, custom tables, or specialized database branches:

### 8.1 Hotel / Lodging
* **Resource:** Room 304, Villa 12, Penthouse Suite.
* **Resource Type:** `PHYSICAL_SPACE`.
* **Capacity Model:** `EXCLUSIVE` (capacity = 1 per room unit).
* **Service:** Standard King Stay, Luxury Weekend Package.
* **Schedule:** Standard check-in 15:00, check-out 11:00, 365 days/year.
* **Customer:** Hotel Guest.
* **Reservation:** Check-in: `2026-10-10`, Check-out: `2026-10-14`, 4 nights.
* **Booking Unit:** `DATE_RANGE`.
* **Example Availability Rule:** Requires 2-night minimum stay on weekends; 4-hour housekeeping gap between check-out and next check-in.
* **Example Concurrency Problem:** Two guests attempt to book Room 304 for overlapping nights simultaneously.
* **Generic Core Solution:** Stored with `check_in_date` and `check_out_date`. PostgreSQL GIST exclusion constraint rejects overlapping date ranges for the same physical room.

### 8.2 Hospital / Outpatient Clinic
* **Resource:** Dr. Michael Chen (Cardiologist), Examination Room 2.
* **Resource Type:** `PERSONNEL` / `PHYSICAL_SPACE`.
* **Capacity Model:** `EXCLUSIVE` (1 patient per doctor per slot).
* **Service:** Cardiac Consultation (45 min + 15 min sanitization buffer).
* **Schedule:** Mon–Thu 08:30–16:30 with lunch blackout 12:30–13:30.
* **Customer:** Patient.
* **Reservation:** Time-slot: 2026-10-12 10:00:00 to 10:45:00 UTC.
* **Booking Unit:** `TIME_SLOT`.
* **Example Availability Rule:** Cannot book within 12 hours of appointment start; doctor schedule exceptions override availability.
* **Example Concurrency Problem:** Two patients click "Confirm" on the 10:00 AM slot at the exact same millisecond.
* **Generic Core Solution:** Database transaction locks the slot; PostgreSQL range exclusion constraint guarantees exactly one patient transaction commits; second transaction receives 409 Conflict.

### 8.3 Beauty Salon / Day Spa
* **Resource:** Hair Styling Station 3, Stylist Sarah, Spa Treatment Suite.
* **Resource Type:** `PERSONNEL` / `PHYSICAL_SPACE`.
* **Capacity Model:** `EXCLUSIVE`.
* **Service:** Balayage Hair Coloring (120 min duration, 15 min cleanup).
* **Schedule:** Tue–Sat 10:00–19:00.
* **Customer:** Salon Client.
* **Reservation:** Time-slot: 2026-10-13 14:00:00 to 16:00:00 UTC.
* **Booking Unit:** `TIME_SLOT`.
* **Example Availability Rule:** Customer requests "Haircut with Any Stylist" without selecting a specific person.
* **Generic Core Solution:** Handled via `ResourcePool` ("Senior Stylists"). Engine queries all pool members, finds open slots, and applies `IMMEDIATE_AUTO_ASSIGN` (round-robin) to allocate an available stylist.

### 8.4 Training Center / Educational Academy
* **Resource:** Lab Classroom 102 (24 student workstations).
* **Resource Type:** `PHYSICAL_SPACE`.
* **Capacity Model:** `CAPACITY_POOL` (capacity = 24).
* **Service:** Full-Stack Web Development Workshop (3-hour session).
* **Schedule:** Saturdays 09:00–12:00.
* **Customer:** Student / Trainee.
* **Reservation:** Session reservation with `partySize = 1` (or group registration with `partySize = 4`).
* **Booking Unit:** `TIME_SLOT`.
* **Example Availability Rule:** Workshop capacity is capped at 24. Bookings accepted until aggregate party size reaches 24.
* **Example Concurrency Problem:** 2 remaining seats; two students simultaneously attempt to reserve 2 seats each.
* **Generic Core Solution:** Handled via PostgreSQL `SELECT ... FOR UPDATE` row lock on the classroom resource. First transaction reads consumed=22, adds 2 (total 24), and commits. Second transaction is serialized, reads consumed=24, detects $24 + 2 > 24$, and is rejected with 409 Conflict.

### 8.5 Event Venue / Banquet Hall
* **Resource:** Grand Ballroom (350 guest capacity).
* **Resource Type:** `PHYSICAL_SPACE`.
* **Capacity Model:** Dual model: `EXCLUSIVE` when rented for a private wedding; `CAPACITY_POOL` when hosting a ticketed seminar.
* **Service:** Full-Day Private Wedding Rental; Public Speaker Symposium.
* **Schedule:** Daily 08:00–23:00.
* **Customer:** Event Organizer / Ticket Holder.
* **Reservation:** Private rental: 2026-11-20 08:00 to 23:00 UTC.
* **Booking Unit:** `TIME_SLOT` (full-day block).
* **Example Availability Rule:** Requires 4-hour setup buffer before event and 3-hour teardown buffer after event.
* **Example Concurrency Problem:** Two corporate clients place holds on the same weekend date.
* **Generic Core Solution:** Service defines `bufferBeforeMinutes = 240` and `bufferAfterMinutes = 180`. GIST exclusion constraint enforces non-overlapping blocks inclusive of setup/teardown buffers.

### 8.6 Restaurant / Dining Space
* **Resource:** Table 14 (4-top booth), Main Dining Room Area (capacity 60).
* **Resource Type:** `PHYSICAL_SPACE`.
* **Capacity Model:** `EXCLUSIVE` for specific tables; `CAPACITY_POOL` for general dining room seating.
* **Service:** Dinner Reservation (90 min dining duration).
* **Schedule:** Mon–Sun 17:00–23:00 in 15-minute slot intervals.
* **Customer:** Diner / Party Organizer.
* **Reservation:** 2026-10-15 19:30:00 to 21:00:00 UTC, `partySize = 4`.
* **Booking Unit:** `TIME_SLOT`.
* **Example Availability Rule:** Party size must not exceed table capacity; dining duration automatically locked for 90 minutes.
* **Example Concurrency Problem:** Multiple diners competing for 19:30 seating during peak rush.
* **Generic Core Solution:** Handled by resource pools (e.g. "4-Top Tables Pool"). Engine evaluates table inventory and assigns an available table, preventing overbooking.

### 8.7 Car Rental / Fleet Lease
* **Resource:** Toyota RAV4 (VIN: 4T1B... / Plate 4821), Economy SUV Fleet Pool.
* **Resource Type:** `VEHICLE`.
* **Capacity Model:** `EXCLUSIVE` per physical vehicle; managed via pool.
* **Service:** 3-Day Weekend SUV Rental.
* **Schedule:** Open Mon–Sun 07:00–21:00 for pickup and return.
* **Customer:** Driver / Renter.
* **Reservation:** Check-in: `2026-10-16`, Check-out: `2026-10-19`.
* **Booking Unit:** `DATE_RANGE`.
* **Example Availability Rule:** Customer books "Compact SUV Category", not a specific vehicle plate.
* **Generic Core Solution:** Reservation is created with `resource_pool_id = 'suv-compact-pool'` and `resource_id = NULL` (`DEFERRED_ASSIGNMENT`). The fleet desk assigns the specific VIN plate upon customer arrival at the rental counter.

### 8.8 General Service Business (Furniture Showroom / Interior Advisory)
* **Target Benchmark:** `Business-Growth-Lube-Furniture`.
* **Resource:** Senior Interior Architect, Showroom Design Lounge A.
* **Resource Type:** `PERSONNEL` / `PHYSICAL_SPACE`.
* **Capacity Model:** `EXCLUSIVE`.
* **Service:** Living & Dining Space Planning (60 min duration, 15 min rest buffer).
* **Schedule:** Mon–Sat 09:00–18:00.
* **Customer:** Homeowner / Architect Client.
* **Reservation:** Time-slot: 2026-10-14 11:00:00 to 12:00:00 UTC.
* **Booking Unit:** `TIME_SLOT`.
* **Example Availability Rule:** Appointment requires 24-hour advance booking lead time; client inputs room architectural dimensions in `metadata`.
* **Example Concurrency Problem:** Two showroom visitors book the same 11:00 slot while touring furniture displays.
* **Generic Core Solution:** Client widget interacts via `SolutionSlot: 'booking:widget'`. PostgreSQL exclusion constraint locks slot authoritatively; second user is offered alternative slots cleanly.


## 9. Multi-Tenant Architecture & Data Isolation

### 9.1 Tenant Scoping & Identity Resolution
*AlzerBooking* enforces strict data partitioning across all commercial clients:
* **Public Booking Routing:** Customer requests identify the tenant via clean URL path slugs:
  `/v1/public/{tenantSlug}/services` (e.g. `/v1/public/lube-furniture/...`).
* **Administrative Routing:** Administrative and staff users authenticate via OAuth2 / JWT. The authenticated JWT includes the user's `tenant_id` and assigned `branch_id` in its claims.

### 9.2 Defense-in-Depth Isolation Model
A core finding of Phase 1.5 is that PostgreSQL Row-Level Security (RLS) must **never** be used as the sole protection mechanism. Connection pooling proxies (e.g. PgBouncer) or misconfigured sessions can leak state if session variables fail to reset. Therefore, *AlzerBooking* mandates a **dual-layer defense-in-depth model**:

1. **Layer 1: Application-Level Query Scoping (Primary Defense):**
   * Every SQL query generated by the repository layer MUST explicitly include `WHERE tenant_id = :tenant_id`.
   * Cross-tenant joins are physically impossible because tenant ID parameters are injected automatically by the repository factory.
2. **Layer 2: PostgreSQL Row-Level Security (Secondary Defense-in-Depth):**
   * PostgreSQL RLS policies are enabled on all multi-tenant tables.
   * Prior to query execution, the database session sets `SET LOCAL app.current_tenant_id = :tenant_id`.
   * Even if application code contains a programming defect or accidental missing `WHERE` clause, PostgreSQL physically blocks access to any row belonging to another tenant.

### 9.3 Platform Administration & Cross-Tenant Access
* Global AlzerSoftware administrators manage tenant lifecycles, billing, and system metrics.
* Platform admins accessing a specific tenant's data must generate an explicit, short-lived **impersonation session token**.
* All impersonated actions are immutably logged in the audit trail with `actor_type = 'PLATFORM_ADMIN'`, capturing the admin identity, reason, and timestamp.

---

## 10. Identity, Permissions & User Roles

Access control follows strict Role-Based Access Control (RBAC):

| Role | Scope | Permitted Actions |
| :--- | :--- | :--- |
| **Platform Administrator** | Global / Multi-Tenant | Provision tenants, adjust platform feature flags, inspect system telemetry. |
| **Tenant Owner** | Tenant-Wide | Manage tenant settings, branches, payment gateways, staff credentials, billing. |
| **Branch Manager** | Branch-Specific | Configure branch operating hours, blackout dates, resources, and services. |
| **Staff / Resource** | Assigned Resource | View personal appointment calendar, mark attendance (`CHECKED_IN`, `COMPLETED`). |
| **Receptionist / Front Desk** | Branch-Specific | Create walk-in bookings, reschedule appointments, process arrival check-ins. |
| **Public Customer** | Self / Single Booking | Query public availability, place holds, create reservations, cancel within policy. |

---

## 11. Public Booking Experience & Interaction Flows

### 11.1 Time-Slot Flow (Showrooms, Clinics, Salons)
1. **Service Selection:** Client picks a service (e.g. *Showroom Advisory Walkthrough*).
2. **Resource or Pool Selection:** Client selects a preferred specialist or chooses *"Any Available Specialist"* (Resource Pool).
3. **Date & Slot Grid:** Client selects an available calendar date; Availability Engine returns real-time open slots.
4. **Checkout & Hold:** Slot is temporarily locked (10-minute hold); intake form collects client details.
5. **Confirmation & .ics:** Instant confirmation code generated (e.g. `LUB-89247`), calendar invite (.ics) attached, confirmation email dispatched.

### 11.2 Date-Range Flow (Hotels, Rentals, Venues)
1. **Date Range Selection:** Client selects check-in and check-out calendar dates (night calculation displayed).
2. **Category / Unit Selection:** Client reviews available room or vehicle categories matching requested party size.
3. **Hold & Deposit:** Category inventory is temporarily held; deposit payment session established if required.
4. **Fulfillment Receipt:** Confirmed booking issued; specific room number or vehicle VIN allocated immediately or deferred to check-in.

---

## 12. Administrative Experience & Operational Dashboard

### 12.1 MVP Administration Scope
* **Master Calendar:** Day, Week, and Month views showing bookings color-coded by resource or staff member.
* **Booking Ledger:** Filterable table of reservations with quick-action buttons (*Check-in*, *Complete*, *Cancel*, *Reschedule*).
* **Schedule Editor:** Intuitive UI to configure recurring weekly business hours and emergency blackout dates.
* **Manual Walk-In Modal:** Front-desk interface to book walk-in clients rapidly with conflict detection.

---

## 13. API Architecture & Endpoint Contracts

All API endpoints follow RESTful conventions, communicating via UTF-8 JSON. Every state-mutating endpoint mandates an `Idempotency-Key` header.

### 13.1 Mandatory Idempotency Contract
* **Header:** `Idempotency-Key: <UUIDv4>`
* **Applicability:** Required on all `POST`, `PUT`, and `PATCH` operations.
* **Behavior:** If a client retries a request due to network timeout, the gateway detects the existing key in `idempotency_keys`. If the original request has resolved, the gateway immediately returns the cached response code and payload without re-executing business logic or charging payments.

### 13.2 Endpoint Specifications

| Endpoint | Method | Access | Idempotency Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/v1/public/{tenant}/services` | GET | Public | No | List active bookable services and durations. |
| `/v1/public/{tenant}/resources` | GET | Public | No | List public resources or resource pools. |
| `/v1/public/{tenant}/availability`| GET | Public | No | Query open time slots or date ranges. |
| `/v1/public/{tenant}/hold` | POST | Public | **Yes** | Acquire temporary 10-minute hold on a slot. |
| `/v1/public/{tenant}/reservations`| POST | Public | **Yes** | Commit a new reservation. |
| `/v1/public/{tenant}/reservations/{code}`| GET | Public (Token)| No | Retrieve booking status using confirmation code. |
| `/v1/public/{tenant}/reservations/{code}/cancel`| POST | Public (Token)| **Yes** | Customer self-cancellation within policy. |
| `/v1/admin/reservations` | GET | Staff / Admin | No | Filter reservations by branch, date, or status. |
| `/v1/admin/reservations/{id}/status`| PATCH | Staff / Admin | **Yes** | Transition status (`CHECKED_IN`, `COMPLETED`, `CANCELLED`). |
| `/v1/admin/reservations/{id}/reschedule`| POST | Staff / Admin | **Yes** | Atomic coordinate update to new slot/resource. |
| `/v1/admin/schedules` | PUT | Admin | **Yes** | Update weekly recurring operating hours. |
| `/v1/admin/blackouts` | POST | Admin | **Yes** | Add calendar blackout exceptions. |
| `/v1/webhooks/payments/{provider}`| POST | Webhook | **Yes** | Ingest payment gateway webhook events. |

### 13.3 Standard HTTP Error Responses
* **`400 Bad Request`:** Invalid input schema or malformed JSON.
* **`404 Not Found`:** Resource, service, or reservation confirmation code not found.
* **`409 Conflict`:** Slot is already booked or capacity has been exhausted (`SLOT_UNAVAILABLE`, `CAPACITY_EXCEEDED`).
* **`422 Unprocessable Entity`:** Business policy violation (e.g. attempting to cancel past policy cutoff, minimum stay not met).
* **`429 Too Many Requests`:** Rate limit exceeded.

---

## 14. Database Architecture & Schema Specification

The authoritative relational schema is built on **PostgreSQL 15+** utilizing the `uuid-ossp` and `btree_gist` extensions.

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. Tenants
CREATE TABLE tenants (
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
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    timezone VARCHAR(64) NOT NULL,
    address JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Resources
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL, -- 'PHYSICAL_SPACE', 'PERSONNEL', 'EQUIPMENT', 'VEHICLE'
    allocation_model VARCHAR(32) NOT NULL DEFAULT 'EXCLUSIVE', -- 'EXCLUSIVE', 'CAPACITY_POOL'
    capacity INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Resource Pools
CREATE TABLE resource_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    allocation_strategy VARCHAR(32) NOT NULL DEFAULT 'IMMEDIATE_AUTO_ASSIGN', -- 'IMMEDIATE_AUTO_ASSIGN', 'DEFERRED_ASSIGNMENT'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Resource Pool Members (Junction)
CREATE TABLE resource_pool_members (
    pool_id UUID NOT NULL REFERENCES resource_pools(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    PRIMARY KEY (pool_id, resource_id)
);

-- 6. Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    resource_pool_id UUID REFERENCES resource_pools(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    booking_unit VARCHAR(16) NOT NULL DEFAULT 'TIME_SLOT', -- 'TIME_SLOT', 'DATE_RANGE'
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    buffer_before_minutes INTEGER NOT NULL DEFAULT 0,
    buffer_after_minutes INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Schedules (Recurring weekly hours)
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_working BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT check_schedule_times CHECK (start_time < end_time)
);

-- 8. Schedule Exceptions / Blackouts
CREATE TABLE schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    reason VARCHAR(255) NOT NULL,
    is_unavailable BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT check_exception_times CHECK (start_datetime < end_datetime)
);

-- 9. Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    custom_attributes JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Reservations
CREATE TABLE reservations (
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
    -- Valid statuses: 'DRAFT', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'
    payment_status VARCHAR(32) NOT NULL DEFAULT 'NOT_REQUIRED',
    -- Valid payment statuses: 'NOT_REQUIRED', 'PENDING', 'AUTHORIZED', 'DEPOSIT_PAID', 'PAID_IN_FULL', 'REFUNDED', 'FAILED'
    notes TEXT,
    cancellation_reason TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Authoritative exclusion constraint for exclusive resources ONLY
    CONSTRAINT exclude_exclusive_double_booking EXCLUDE USING gist (
        resource_id WITH =,
        tstzrange(start_datetime, end_datetime, '[)') WITH &&
    ) WHERE (
        resource_id IS NOT NULL 
        AND status NOT IN ('CANCELLED', 'NO_SHOW')
    )
);

-- 11. Reservation Versions (Immutable Rescheduling & Mutation History)
CREATE TABLE reservation_versions (
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

-- 12. Idempotency Records
CREATE TABLE idempotency_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    idempotency_key VARCHAR(128) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PROCESSING',
    response_code INTEGER,
    response_body JSONB,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_idempotency_key UNIQUE (tenant_id, idempotency_key)
);

-- 13. Transactional Outbox Events (Async Event-Driven Dispatch)
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL, -- 'RESERVATION_CONFIRMED', 'RESERVATION_CANCELLED', 'RESERVATION_RESCHEDULED'
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PROCESSED', 'FAILED'
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Essential Performance & Foreign Key Indexes
CREATE INDEX idx_reservations_tenant_branch ON reservations(tenant_id, branch_id);
CREATE INDEX idx_reservations_dates ON reservations(start_datetime, end_datetime);
CREATE INDEX idx_reservations_resource_active ON reservations(resource_id, status);
CREATE INDEX idx_outbox_pending ON outbox_events(status, created_at) WHERE status = 'PENDING';
CREATE INDEX idx_idempotency_expiry ON idempotency_keys(expires_at);

-- Row-Level Security Enablement (Defense-in-Depth)
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_reservations ON reservations
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
```


## 15. Security, Privacy & PII Compliance

1. **Strict Architectural Decoupling:** The client-facing showcase frontend (e.g. `Business-Growth-Lube-Furniture`) executes entirely within the client's browser and maintains zero database credentials, server API keys, or administrative access tokens.
2. **Public vs. Private API Isolation:** Public booking routes (/v1/public/...) only expose non-sensitive availability and service catalog data. Administrative endpoints (/v1/admin/...) require cryptographically verified JWT bearer tokens with strict RBAC scopes.
3. **Rate Limiting & Anti-Abuse:** Public endpoints enforce IP-based token-bucket rate limits and invisible honeypot parameters to block malicious automated slot scrapers.
4. **Data Minimization & PII Protection:** The system stores only essential operational contact data. Sensitive payment cards, CVVs, or health diagnoses are strictly excluded.
5. **Sanitized Audit Trail:** All database modifications append to `reservation_audit_logs`. Auditing strictly censors authentication tokens, authorization headers, and financial cardholder information.

---

## 16. Vendor-Neutral Payment Abstraction & Lifecycle

### 16.1 Decoupled Payment State Machine
Payment lifecycle states are managed in an independent, orthogonal state machine rather than coupled directly to reservation status:

* `NOT_REQUIRED`: Free consultation or zero-cost walkthrough.
* `PENDING`: Deposit or full payment session created; awaiting gateway confirmation.
* `AUTHORIZED`: Funds held on card; settlement captured upon completion or check-in.
* `DEPOSIT_PAID`: Required partial commitment received; remaining balance due upon arrival.
* `PAID_IN_FULL`: 100% of service charge settled.
* `REFUNDED`: Funds returned to client following cancellation within policy.
* `FAILED`: Card declined or payment gateway transaction rejected.

### 16.2 Orthogonal Relationship Matrix
Reservation and payment state machines operate orthogonally, permitting valid commercial scenarios that monolithic architectures fail to represent:

| Reservation Status | Payment Status | Commercial Scenario |
| :--- | :--- | :--- |
| **CONFIRMED** | **NOT_REQUIRED** | Free showroom design consultation (e.g., Lube Furniture). |
| **CONFIRMED** | **PENDING** | "Pay on Arrival" / Cash at front-desk appointment. |
| **CONFIRMED** | **DEPOSIT_PAID** | Hotel booking with 20% advance deposit; balance due at check-out. |
| **CONFIRMED** | **PAID_IN_FULL** | Prepaid salon service or workshop seat. |
| **CANCELLED** | **REFUNDED** | Timely client cancellation triggering automated deposit refund. |
| **CANCELLED** | **DEPOSIT_PAID** | Late cancellation violating cutoff policy; deposit forfeited. |
| **DRAFT / PENDING**| **FAILED** | Credit card declined during checkout; slot released after TTL. |

### 16.3 Universal Payment Gateway Seam
Core business logic communicates with payment processors exclusively through an abstract adapter interface:

```typescript
export interface PaymentGatewayAdapter {
  createPaymentSession(params: {
    tenantId: string;
    reservationId: string;
    amount: number;
    currency: string;
    customerEmail: string;
    returnUrl: string;
  }): Promise<{ sessionId: string; checkoutUrl: string }>;

  verifyWebhook(
    payload: unknown, 
    headers: Record<string, string>
  ): Promise<{ 
    eventType: 'PAYMENT_SUCCEEDED' | 'PAYMENT_FAILED'; 
    transactionId: string; 
    reservationId: string; 
    amount: number; 
  }>;

  refund(params: {
    transactionId: string;
    amount?: number;
    reason: string;
  }): Promise<{ refundId: string; status: 'SUCCESS' | 'FAILED' }>;
}
```

The core platform never imports Stripe, PayPal, Square, or Chapa SDKs directly. Third-party processors plug into this contract without modifying core reservation tables.

---

## 17. Pluggable Notification & Communications Engine

### 17.1 Transactional Outbox Pattern & Resilience
To prevent third-party notification outages (e.g., SendGrid 503, Twilio network timeout) from rolling back valid reservation commitments, notifications are managed asynchronously via the **Transactional Outbox Pattern**:

```text
[ Client Submits Booking ]
             |
             v
[ PostgreSQL Transaction ] ----------------------------------------------+
| 1. Verify availability authoritatively                                 |
| 2. Insert into 'reservations'                                          |
| 3. Insert event into 'outbox_events' (status: 'PENDING')               |
+------------------------------------------------------------------------+
             | COMMIT
             v
[ Transaction Committed Successfully ] -> Returns HTTP 201 to Client
             |
             v (Asynchronous Background Polling / CDC)
[ Outbox Worker Process ]
| - Reads pending events from 'outbox_events'
| - Invokes NotificationDispatcher adapter
| - Transmits Email / SMS / WhatsApp / Webhook
| - Updates 'outbox_events' status to 'PROCESSED'
| - On failure: Retries with exponential backoff; pushes to DLQ on max retries
+------------------------------------------------------------------------+
```

**Core Architectural Invariant:** An email or SMS provider outage **never rolls back a successful booking**. The booking remains safely committed in PostgreSQL, and notification dispatch retries independently.

### 17.2 Notification Events & Channels
* **Events:** `RESERVATION_CONFIRMED`, `RESERVATION_RESCHEDULED`, `RESERVATION_CANCELLED`, `REMINDER_24H`, `ARRIVAL_WELCOME`.
* **Channels:** Email (HTML + MIME .ics calendar invite attachment), SMS, WhatsApp Business API, and generic Webhooks.
* **Provider Adapters:** Handled via a generic `NotificationDispatcher` adapter interface (e.g. Resend, SendGrid, Twilio, Infobip).

---

## 18. Temporal, Timezone & Calendar Representation Model

Scheduling across global users and physical facilities mandates a strict **4-tier temporal architecture**:

1. **Storage Tier (UTC Instants & Calendar Dates):**
   * All point-in-time timestamps (`start_datetime`, `end_datetime`, `created_at`) are stored strictly in UTC (`TIMESTAMPTZ`).
   * Lodging and date-range reservations store discrete calendar dates (`check_in_date DATE`, `check_out_date DATE`) to prevent timezone drift across day boundaries.
2. **Business Operating Tier (Facility IANA Timezone):**
   * Branch business hours and resource schedules are defined and resolved against the facility's registered IANA timezone (e.g., `Africa/Addis_Ababa`, `America/New_York`, `Europe/Rome`).
   * Working hour slot grids are computed locally within that timezone before being projected to UTC.
3. **Client Presentation Tier (Visitor Local Browser Timezone):**
   * The front-end adapter converts UTC availability timestamps into the visitor's local browser timezone.
   * To prevent miscommunication, the UI explicitly displays both: *"10:00 AM (Your local time) — 12:00 PM (Showroom local time, UTC+3)"*.
4. **Daylight Saving Time (DST) Invariance:**
   * Recurring schedules use civil wall-clock time (`TIME: 09:00:00`) in the branch timezone. When DST transitions occur (clocks spring forward or fall back), the local business hours remain 09:00 local time, while the derived UTC instants adjust automatically without manual schedule re-entry.


## 19. Integration Specification: Business-Growth-Lube-Furniture Template

### 19.1 Target Integration Seam
The benchmark template (`Business-Growth-Lube-Furniture`) integrates with the booking platform exclusively through the pre-existing **Solution Integration Foundation**:
* **Route:** `/booking` in `src/App.tsx`.
* **Component:** `src/pages/BookingPage.tsx`.
* **Standardized Slot:**
  ```tsx
  <SolutionSlot
    name="booking:widget"
    fallback={<CoreBookingFallback onContact={onContact} />}
    props={{ roomType: 'Living & Dining Environments' }}
  />
  ```

### 19.2 The Solution Package Bridge
The future production solution package (`@alzersoftware/booking-adapter-react`) registers cleanly into the existing `SolutionRegistry`:

```typescript
export const productionBookingSolution: SolutionModule = {
  manifest: {
    id: 'alzer-booking-production',
    name: 'AlzerSoftware Booking & Reservation System',
    version: '1.0.0',
    capabilities: ['booking', 'persistence'],
    slots: ['booking:widget'],
    defaultEnabled: true,
  },
  renderSlot: (slotName: string, props?: Record<string, unknown>) => {
    if (slotName === 'booking:widget') {
      return (
        <AlzerBookingWidget
          tenantSlug="lube-furniture"
          defaultService="showroom-consultation"
          theme={{ primaryColor: '#b45309' }}
          contextProps={props}
        />
      );
    }
    return null;
  },
};
```

### 19.3 Behavior Under All Runtime States
* **Active & Connected:** Interactive booking UI mounts inside `BookingPage.tsx`, communicates with the Headless Booking API, and confirms appointments seamlessly.
* **Network Partition / API Down:** Integrated `SlotErrorBoundary` catches network failures and renders the isolated error state (`data-testid="solution-slot-error-booking:widget"`).
* **Disabled / Unregistered:** `SolutionSlot` seamlessly renders `CoreBookingFallback`, allowing visitors to submit standard inquiries to the studio team.

---

## 20. Reversibility & Zero-Core-Intrusion Proof

The architecture guarantees 100% reversibility and zero core intrusion:
1. Disabling or deregistering the booking solution leaves the showcase website fully operational.
2. The `/booking` route remains active, displaying `CoreBookingFallback`.
3. Zero application code in `src/components/`, `src/pages/`, or `src/data/` imports booking backend packages or references database schemas.
4. Pre-existing tests in `src/solutions/__tests__/reversibility.test.ts` continue to pass without regression.

---

## 21. Vendor Decoupling & Neutrality Guarantees

*AlzerBooking* enforces absolute vendor neutrality across its entire stack:
* **No SaaS Scheduling Lock-in:** Zero dependence on Calendly, Cal.com, or Acuity.
* **No Backend-as-a-Service Lock-in:** Zero dependence on Supabase, Firebase, or AWS Cognito.
* **No Payment Gateway Lock-in:** Universal `PaymentGatewayAdapter` isolates payment vendors.
* **No Messaging Lock-in:** Universal `NotificationDispatcher` isolates email/SMS providers.

---

## 22. Product Scope & MVP Definition

To ensure rapid delivery of a robust platform without premature enterprise bloat, product scope is stratified into three distinct tiers:

### 22.1 MVP Scope (Phase 1–5: Must Have)
The minimum viable platform must support three core archetypes:
1. **One Exclusive-Resource Archetype:** Single-capacity appointment scheduling (e.g., 1-on-1 Interior Design Walkthrough or Doctor Consultation) protected by PostgreSQL GIST exclusion constraints.
2. **One Capacity-Resource Archetype:** Multi-seat group booking (e.g., 20-seat Furniture Finishing Workshop or Classroom) protected by PostgreSQL row-locking and capacity ledger arithmetic.
3. **One Date-Range Lodging Archetype:** Discrete calendar night stays (e.g., Guest Suite Stay) with business date semantics and turnover buffer windows.
4. **Core Infrastructure:**
   * Multi-tenant data model with branch hierarchy and dual-layer isolation.
   * Two-tier concurrency engine (PostgreSQL authoritative; Redis temporary holds).
   * Mandatory `Idempotency-Key` support on mutating API endpoints.
   * Decoupled payment lifecycle with "Pay on Arrival" and mock gateway adapter.
   * Transactional Outbox pattern with asynchronous email dispatch (.ics attachments).
   * Minimal staff dashboard: Master Calendar (Day/Week views), Booking Ledger, and Walk-in booking modal.
   * Client-facing React adapter package bridging to `SolutionSlot: 'booking:widget'`.

### 22.2 Phase 2+ Scope (Should Have)
* Advanced resource pool assignment heuristics (least-loaded, weighted distribution).
* SMS and WhatsApp Business API notification adapters.
* Live production payment gateway adapters (Stripe, PayPal, Chapa).
* Multi-staff shift management and split operating hours.

### 22.3 Future Enterprise Scope (Could Have / Defer)
* Bi-directional external calendar sync (Google Calendar, Microsoft Outlook 365, Apple iCloud via CalDAV).
* Dynamic pricing rules, weekend surge rates, and discount coupon codes.
* Multi-language localized notification templates.
* Advanced predictive analytics and resource utilization reports.

---

## 23. Phased Roadmap & Implementation Order

* **Phase 1 (Complete):** Product Architecture & Foundation Specification.
* **Phase 1.5 (Complete):** Architecture Validation, Gap Analysis & Critical Corrections (Contract Audited).
* **Phase 2 (Next):** Headless Backend Repository Scaffold & PostgreSQL Relational Migrations.
* **Phase 3:** Availability Engine, Range Arithmetic & Concurrency Locking Algorithms.
* **Phase 4:** Reservation Lifecycle Engine, Idempotency Guard & REST API Gateway.
* **Phase 5:** Production React Adapter Package (`@alzersoftware/booking-adapter-react`).
* **Phase 6:** Template Integration in `Business-Growth-Lube-Furniture` via `SolutionSlot`.
* **Phase 7:** Operational Admin Dashboard (Master Calendar, Ledger, Walk-in Modal).
* **Phase 8:** Production Payment & Multi-Channel Notification Adapters.
* **Phase 9:** Production Multi-Tenant Hardening, Chaos Testing & Performance Benchmarks.

---

## 24. Repository & Deployment Architecture Recommendation

### Evaluated Options
* **Option A (Monorepo Inside Template):** Embed backend inside `Business-Growth-Lube-Furniture`. *(REJECTED: Destroys cross-template reusability and couples presentation to backend runtime).*
* **Option B (Separate Standalone Monolith per Customer):** Bespoke deployment per business. *(REJECTED: High maintenance overhead and violates multi-tenancy).*
* **Option C (Approved: Headless Core API Repository + Lightweight React Adapter):**
  1. `alzersoftware-booking-core`: Standalone repository hosting the Node.js/TypeScript REST API Gateway, PostgreSQL database migrations, Availability Engine, and Transactional Outbox worker.
  2. `@alzersoftware/booking-adapter-react`: Lightweight NPM package providing the client-facing booking UI, state caching, and `SolutionModule` integration contract.
  3. Template repositories (`Business-Growth-Lube-Furniture`, `Business-Growth-Nove-Motors`, etc.) consume the adapter strictly as an external solution module.

---

## 25. Impact Analysis on Target Template (Business-Growth-Lube-Furniture)

* **Preserved Codebase Integrity:**
  * Zero modifications to `src/App.tsx` or application routing.
  * Zero modifications to `src/solutions/registry.ts`, `slot.tsx`, or foundation contracts.
  * Zero modifications to pre-existing UI components, design tokens, or tailwind configurations.
* **Integration Seam:**
  * The template integrates purely by replacing `src/solutions/proofs/bookingProof.tsx` with `@alzersoftware/booking-adapter-react` in `src/solutions/index.ts`.

---

## 26. Architectural Quality Tests (Thought Experiments A through J)

To ensure unassailable architectural correctness, the validated design was subjected to ten rigorous operational thought experiments:

### Test A — Doctor 1-on-1 Race Condition
* **Scenario:** Two patients attempt to book Dr. Chen for the exact same 10:00 AM slot simultaneously.
* **Execution:** Both transactions submit requests to PostgreSQL. The resource has `allocation_model = 'EXCLUSIVE'`.
* **Result:** PostgreSQL's GiST range exclusion constraint (`exclude_exclusive_double_booking`) allows exactly one transaction to commit. The second transaction triggers a constraint violation (`23P01`), is caught by the API gateway, and returns HTTP 409 Conflict. **Zero double-booking occurs.**

### Test B — Classroom Capacity Race Condition
* **Scenario:** Classroom capacity = 20. Current active bookings = 0. Customer A and Customer B simultaneously attempt to book 12 seats each.
* **Execution:** Both transactions attempt to insert. Both target the same resource with `allocation_model = 'CAPACITY_POOL'`.
* **Result:** Transaction 1 acquires the exclusive row lock via `SELECT ... FOR UPDATE` on the resource row. It evaluates $0 + 12 le 20$, inserts 12 seats, and commits. Transaction 2 acquires the lock immediately after, reads current consumed = 12, evaluates $12 + 12 = 24 > 20$, rolls back, and returns HTTP 409 Conflict. **Capacity limit is strictly enforced.**

### Test C — Hotel Date Overlap Race Condition
* **Scenario:** Two guests simultaneously attempt to book Suite 101 from `2026-10-10` to `2026-10-14`.
* **Execution:** Stored as `check_in_date` and `check_out_date`. PostgreSQL GiST exclusion constraint evaluates the date range interval.
* **Result:** Exactly one guest transaction commits; the second is physically rejected by PostgreSQL. **Overlapping stays are impossible.**

### Test D — Salon "Any Stylist" Pool Booking
* **Scenario:** Client books "Haircut" without selecting a specific stylist.
* **Execution:** Service routes to "Senior Stylists Pool" (`allocation_strategy = 'IMMEDIATE_AUTO_ASSIGN'`).
* **Result:** The Availability Engine queries pool members, identifies open stylist slots, and assigns the least-loaded stylist atomically. Client receives immediate confirmation with stylist name.

### Test E — Car Rental Category Pool Booking
* **Scenario:** Customer reserves "Compact SUV" category for next weekend.
* **Execution:** Handled via `ResourcePool` with `allocation_strategy = 'DEFERRED_ASSIGNMENT'`.
* **Result:** The engine verifies that total fleet count for the pool exceeds reservations across the weekend. Reservation is confirmed with `resource_pool_id = 'suv-compact'` and `resource_id = NULL`. Physical vehicle VIN is assigned upon pickup at the rental counter.

### Test F — Network Timeout Retry & Idempotency
* **Scenario:** Customer submits booking; network connection drops before receiving the response; customer clicks "Book" again.
* **Execution:** Client library sends the second request with the identical `Idempotency-Key`.
* **Result:** Gateway detects the key in `idempotency_keys`, verifies the identical request hash, and returns the cached HTTP 201 response with the original confirmation code without re-running the booking transaction. **Zero duplicate reservations or duplicate charges.**

### Test G — Redis Failure Resiliency
* **Scenario:** The Redis cache instance crashes or becomes unreachable during peak booking traffic.
* **Execution:** Client requests bypass the ephemeral hold layer and submit directly to the API gateway.
* **Result:** The system enters degraded mode (temporary holds disabled); all reservations are evaluated and locked directly inside PostgreSQL transactions. **Zero state corruption and zero double-bookings occur.**

### Test H — Email Provider Outage Resiliency
* **Scenario:** Customer successfully books, but the external transactional email provider (e.g. SendGrid) returns HTTP 503 Service Unavailable.
* **Execution:** Reservation transaction commits successfully, writing an event to `outbox_events`.
* **Result:** The HTTP 201 confirmation is returned to the customer immediately. The asynchronous outbox worker detects the email delivery failure, retains the event as `PENDING`, and retries delivery using exponential backoff until the provider recovers. **The booking is never lost or rolled back.**

### Test I — Multi-Tenant Cross-Access Isolation
* **Scenario:** A compromised user from Tenant A attempts to access or cancel a reservation belonging to Tenant B by spoofing `reservation_id`.
* **Execution:** The request enters the API gateway.
* **Result:** Layer 1 application query scoping injects `WHERE tenant_id = 'tenant-a-uuid'`, returning HTTP 404 Not Found. Layer 2 PostgreSQL Row-Level Security independently blocks row visibility. **Cross-tenant data leakage is completely prevented.**

### Test J — Atomic Rescheduling & Availability Swap
* **Scenario:** A customer reschedules their confirmed Tuesday 10:00 AM appointment to Thursday 2:00 PM.
* **Execution:** The rescheduling endpoint executes a single database transaction.
* **Result:** The engine verifies Thursday 2:00 PM availability authoritatively. It updates the reservation coordinates, increments `version`, appends an entry to `reservation_versions`, and releases the Tuesday 10:00 AM availability. If Thursday was already occupied, the transaction rolls back completely and Tuesday remains safely confirmed. **Availability swap is 100% atomic.**

---

## 27. Implementation & Runtime Status Matrix (False-Pass Detection)

To guarantee complete technical integrity and prevent false-pass claims, the status of every architectural capability is explicitly categorized:

* **DOCUMENTED:** Formally designed in the specification.
* **ARCHITECTURALLY VALIDATED:** Rigorously audited, stress-tested in thought experiments, and verified for mathematical and database correctness.
* **IMPLEMENTED:** Active, working code exists in the current repository.
* **TESTED:** Automated tests verify runtime behavior in the current repository.

| Capability / Architectural Area | Architectural Status | Runtime Implementation Status (Phase 1.5) | Target Implementation Phase |
| :--- | :--- | :--- | :--- |
| **Exclusive Resource GIST Exclusion** | ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 2 (Core DB) |
| **Capacity Resource Row-Locking Ledger**| ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 3 (Concurrency) |
| **Resource Pool / Group Allocation** | ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 3 (Availability Engine) |
| **Lodging Business Date Semantics** | ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 3 (Availability Engine) |
| **Lifecycle State Machine (Versioned)** | ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 4 (Lifecycle API) |
| **PostgreSQL Authoritative Engine** | ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 2 (Core DB) |
| **Redis Advisory Temporary Holds** | ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 3 (Hold Engine) |
| **API Idempotency-Key Protection** | ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 4 (REST Gateway) |
| **Decoupled Payment State Machine** | ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 8 (Payments) |
| **Transactional Outbox Notifications**| ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 4 (Outbox Worker) |
| **Dual-Layer Multi-Tenancy (RLS + App)**| ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 2 (Core DB) |
| **4-Tier Temporal & Timezone Model** | ARCHITECTURALLY VALIDATED | **NOT IMPLEMENTED — ARCHITECTURE VALIDATED** | Phase 3 (Availability Engine) |
| **Solution Integration Slot Seam** | ARCHITECTURALLY VALIDATED | **IMPLEMENTED & TESTED** (Lube Furniture) | Phase 1 Complete (Foundation) |

---

## 28. Architectural Decision Record (ADR)

### ADR-001: Headless, Multi-Tenant Domain-Agnostic Architecture
* **Status:** APPROVED (Phase 1 Baseline).
* **Context:** The booking system must serve multiple commercial templates without database divergence or platform-specific forks.
* **Decision:** Scaffolding `alzersoftware-booking-core` as an independent headless REST engine consumed via client adapter packages.

### ADR-002: Dual Resource Concurrency & PostgreSQL Authority Model
* **Status:** APPROVED (Phase 1.5 Validated).
* **Context:** Naive range exclusion constraints crash on multi-capacity resources (classrooms, venues), and reliance on Redis creates race conditions during network partitions.
* **Decision:**
  1. Formalize `allocation_model`: `EXCLUSIVE` (native GIST range exclusions) vs `CAPACITY_POOL` (PostgreSQL `SELECT ... FOR UPDATE` row locks + capacity ledger verification).
  2. Establish PostgreSQL as the sole authoritative arbiter of truth, treating Redis strictly as an advisory, ephemeral user-experience hold layer.
  3. Model rescheduling as an atomic coordinate update with immutable audit versioning rather than a terminal status enum.
  4. Mandate `Idempotency-Key` headers on all state-mutating endpoints and the Transactional Outbox pattern for decoupled notification dispatch.
