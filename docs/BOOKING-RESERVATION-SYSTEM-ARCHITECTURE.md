# AlzerSoftware Booking & Reservation System
## Product Architecture & Foundation Specification (Phase 1)

* **Product Name:** AlzerSoftware Booking & Reservation Platform (AlzerBooking Engine)
* **Status:** Phase 1 Architecture & Foundation Specification
* **Target Integration Benchmark:** `Business-Growth-Lube-Furniture`
* **Target Audience:** Multi-industry reservation & appointment businesses (Hotels, Healthcare Clinics, Salons, Training Centers, Event Venues, Rental Providers, Professional Consultancies)
* **Author / Architecture Team:** AlzerSoftware Solutions Architecture Group

---

## Executive Summary

The **AlzerSoftware Booking & Reservation Platform** is a multi-tenant, headless, industry-agnostic reservation and capacity engine. It is engineered to solve the fragmentation of scheduling software by decoupling the **operational booking lifecycle** from **front-end presentation**.

Rather than creating separate bespoke booking systems for hotels, clinics, salons, and consultancies, this platform provides a **unified generic core** built on abstract primitives: **Tenants**, **Resources**, **Services**, **Schedules**, **Availability Windows**, **Customers**, and **Reservations**. Industry-specific models (such as hotel room nights, medical appointments, or multi-seat workshops) are lightweight configurations layered over this invariant core.

This document serves as the complete technical contract and architectural blueprint for Phase 1. It details the system topology, generic domain model, concurrency-safe availability engine, state machine, API/database schemas, security posture, and the exact integration contract with the benchmark template `Business-Growth-Lube-Furniture`.

---

## Table of Contents
1. [Product Definition & Strategic Vision](#1-product-definition--strategic-vision)
2. [Core Architecture & System Topology](#2-core-architecture--system-topology)
3. [Generic Domain Model & Entity Definitions](#3-generic-domain-model--entity-definitions)
4. [Reservation Lifecycle & State Machine](#4-reservation-lifecycle--state-machine)
5. [Availability Engine & Concurrency Control](#5-availability-engine--concurrency-control)
6. [Hotel & Hospitality Industry Mapping](#6-hotel--hospitality-industry-mapping)
7. [Healthcare & Clinical Appointment Mapping](#7-healthcare--clinical-appointment-mapping)
8. [Extended Industry Matrix](#8-extended-industry-matrix)
9. [Multi-Tenant Architecture & Data Isolation](#9-multi-tenant-architecture--data-isolation)
10. [Identity, Permissions & User Roles](#10-identity-permissions--user-roles)
11. [Public Booking Experience & Interaction Flows](#11-public-booking-experience--interaction-flows)
12. [Administrative Experience & Operational Dashboard](#12-administrative-experience--operational-dashboard)
13. [API Architecture & Endpoint Contracts](#13-api-architecture--endpoint-contracts)
14. [Database Architecture & Schema Specification](#14-database-architecture--schema-specification)
15. [Security, Privacy & PII Compliance](#15-security-privacy--pii-compliance)
16. [Vendor-Neutral Payment Abstraction](#16-vendor-neutral-payment-abstraction)
17. [Pluggable Notification & Communications Engine](#17-pluggable-notification--communications-engine)
18. [Temporal, Timezone & Calendar Representation Model](#18-temporal-timezone--calendar-representation-model)
19. [Integration Specification: Business-Growth-Lube-Furniture Template](#19-integration-specification-business-growth-lube-furniture-template)
20. [Reversibility & Zero-Core-Intrusion Proof](#20-reversibility--zero-core-intrusion-proof)
21. [Vendor Decoupling & Neutrality Guarantees](#21-vendor-decoupling--neutrality-guarantees)
22. [Product Scope & MVP Definition](#22-product-scope--mvp-definition)
23. [Phased Roadmap & Implementation Order](#23-phased-roadmap--implementation-order)
24. [Repository & Deployment Architecture Recommendation](#24-repository--deployment-architecture-recommendation)
25. [Impact Analysis on Target Template](#25-impact-analysis-on-target-template)
26. [Architectural Decision Record (ADR)](#26-architectural-decision-record-adr)

---

## 1. Product Definition & Strategic Vision

### 1.1 Product Name
**AlzerSoftware Booking & Reservation Platform** (AlzerBooking Engine).

### 1.2 Purpose & Problem Solved
Existing reservation solutions force businesses into rigid, vertical SaaS silos (e.g. specialized hotel PMS, salon SaaS, or clinical scheduling tools) that cannot adapt to brand custom frontends or cross-discipline operations. Businesses either adopt fragmented external widgets that disrupt brand continuity or build ad-hoc forms that cause double-bookings and lack operational controls.

*AlzerBooking* solves this by providing a multi-tenant, headless, unified booking engine that decouples operational availability calculations from customer-facing presentation.

### 1.3 Target Businesses & Industry Breadth
* **Showrooms & Consultancies:** Interior design walkthroughs, architectural advisory sessions.
* **Hotels & Hospitality:** Boutique hotels, resorts, guest villas, luxury suites.
* **Healthcare & Wellness:** Outpatient clinics, specialty doctors, diagnostic facilities.
* **Personal Care & Salons:** Hair salons, day spas, treatment centers.
* **Education & Training:** Workshop providers, technical academies, seminar venues.
* **Venues & Events:** Conference centers, banquet halls, private studios.
* **Vehicle & Asset Rental:** Fleet cars, equipment rentals, private aircraft charters.

### 1.4 Primary User Personas
1. **Public Booking Users (Clients / Guests / Patients):** Discover open slots, self-schedule appointments, receive instant confirmations, and manage their bookings.
2. **Business / Admin Users (Owners / Managers / Front Desk):** Define resources and operating schedules, inspect bookings on a live calendar, handle walk-ins, and manage cancellations.
3. **Staff / Service Providers:** View individual daily rosters and mark service fulfillment.
4. **Platform Administrators (AlzerSoftware):** Provision business tenants, manage global policies, and monitor platform health.

### 1.5 Separation of Concerns: Company Profile vs. Booking System
* **Company Profile (Website Front Door):** The client-facing digital showroom (e.g., `Business-Growth-Lube-Furniture`). Responsible for brand experience, catalog browsing, SEO, and inquiry routing. Holds zero booking state, transactions, or database locks.
* **Booking & Reservation System (Operational Engine):** The headless service managing business hours, resource capacities, real-time availability calculations, conflict-free transactions, confirmation tokens, and notification dispatch.

---

## 2. Core Architecture & System Topology

### 2.1 System Topology Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER                               │
│  Company Profile / Showcase (e.g. Business-Growth-Lube-Furniture)      │
│  [ Pages: /booking, /services, modals ]                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         SolutionSlot: 'booking:widget'
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  INTEGRATION ADAPTER / SDK LAYER                       │
│  @alzersoftware/booking-adapter-react                                  │
│  - Generic SolutionModule Contract                                     │
│  - Reactive Availability State Cache                                   │
│  - Resilience & SlotErrorBoundary Fallback Handling                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST / Webhooks
┌───────────────────────────────────▼────────────────────────────────────┐
│                        API GATEWAY & ROUTER                            │
│  AlzerBooking REST Gateway (Auth, Rate Limiter, Tenant Routing)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                   ALZERBOOKING OPERATIONAL CORE                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │  Availability Engine  │             │    Reservation Engine      │  │
│  │  (Atomic Slot Calc)   │             │    (State Machine / Lock)  │  │
│  └───────────┬───────────┘             └─────────────┬──────────────┘  │
│              │                                       │                 │
│  ┌───────────▼───────────┐             ┌─────────────▼──────────────┐  │
│  │ Schedule Management   │             │ Policies & Rules Engine    │  │
│  │ (Hours, Holidays)     │             │ (Lead Times, Cut-offs)     │  │
│  └───────────────────────┘             └────────────────────────────┘  │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │ Resource & Service    │             │ Customer Management        │  │
│  │ Catalog               │             │ (PII Isolation, History)   │  │
│  └───────────────────────┘             └────────────────────────────┘  │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │ Notification Dispatch │             │ Payment Gateway Abstraction│  │
│  │ (Email, SMS, Webhook) │             │ (Deposit, Invoicing, Zero) │  │
│  └───────────────────────┘             └────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Atomic Transactions / Locks
┌───────────────────────────────────▼────────────────────────────────────┐
│                        PERSISTENCE TIER                                │
│  PostgreSQL (Relational multi-tenant schema with range exclusions)     │
│  Redis (Fast transient locks & real-time session slot reservation)     │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Architectural Validation & Recommendations
* **Two-Phase Booking Protocol:** Supports an ephemeral *Hold* state (e.g. 10-minute hold window) via Redis key expiration, preventing conflicting claims while a customer completes form entry or payment.
* **Internal Event Bus:** The core emits domain events (`booking.created`, `booking.confirmed`, `booking.cancelled`) enabling decoupled asynchronous dispatch to notification and CRM adapters without slowing down user responses.

---

## 3. Generic Domain Model & Entity Definitions

To ensure complete cross-industry reusability, the domain model avoids industry jargon (such as `roomNumber`, `doctorLicense`, or `hairStyle`).

### 3.1 Business / Tenant
Represents the subscribing commercial entity or organization.
* `id` (UUID): Unique global identifier.
* `slug` (string): URL-safe identifier (e.g., `lube-furniture`, `grand-hotel`).
* `name` (string): Commercial trading name.
* `timezone` (string): Primary IANA timezone (e.g., `Africa/Addis_Ababa`, `America/New_York`).
* `currency` (string): ISO 4217 currency code (e.g., `ETB`, `USD`, `EUR`).
* `settings` (JSONB): Multi-tenant configuration (lead times, cancellation rules, notifications).
* `createdAt`, `updatedAt` (Timestamp UTC).

### 3.2 Branch / Facility
Represents a distinct physical showroom, branch, clinic campus, or hotel property.
* `id` (UUID).
* `businessId` (UUID): Foreign key to Tenant.
* `name` (string): Branch identifier (e.g., `Addis Ababa Flagship Showroom`).
* `timezone` (string): Branch-specific IANA timezone.
* `address` (JSONB): Structured street, city, country, coordinates.
* `phone`, `email` (string).

### 3.3 Resource
Something with finite capacity that can be booked or scheduled.
* `id` (UUID).
* `businessId`, `branchId` (UUID).
* `name` (string): Resource label (e.g., `Design Consultation Desk 01`, `Deluxe Suite 304`, `Dr. Al-Sabah`).
* `type` (Enum): `PHYSICAL_SPACE` | `PERSONNEL` | `EQUIPMENT` | `VIRTUAL`.
* `capacity` (Integer): Concurrent occupants/units (default: 1; for workshops: e.g., 20).
* `isActive` (Boolean).
* `metadata` (JSONB): Industry attributes (e.g., bed size, room dimensions, equipment specs).

*Decision Justification:* A single generic `Resource` model with a `type` discriminator and structured `metadata` avoids schema explosion while allowing identical availability math across people, rooms, and tools.

### 3.4 Service
The offering, session type, or lodging category selected by the customer.
* `id` (UUID).
* `businessId` (UUID).
* `name` (string): (e.g., `Private Showroom Walkthrough`, `Overnight Stay`, `Cardiology Triage`).
* `description` (string).
* `durationMinutes` (Integer): Nominal duration (e.g., 60; for multi-day lodging: 1440).
* `bufferBeforeMinutes` (Integer): Setup/turnover period before session.
* `bufferAfterMinutes` (Integer): Cleaning/rest period after session.
* `bookingUnit` (Enum): `TIMESLOT` (minute-based) | `DATE_RANGE` (night/day-based).
* `priceAmount` (Decimal), `depositRequired` (Boolean), `depositAmount` (Decimal).
* `requiredResourceTypes` (Array<ResourceType>): Resources necessary to satisfy this service.

### 3.5 Schedule
The temporal rule definition specifying when resources or services are operational.
* `id` (UUID).
* `resourceId` (UUID, nullable): Resource-specific schedule.
* `branchId` (UUID): Branch operating hours.
* `dayOfWeek` (0–6: Sunday to Saturday).
* `startTime` (Time: `08:30:00`).
* `endTime` (Time: `18:00:00`).
* `isWorking` (Boolean): Identifies regular off-days.

### 3.6 Schedule Exception / Blackout
Overrides to regular schedules (holidays, renovations, personal leave).
* `id` (UUID).
* `resourceId` (UUID, nullable).
* `startDateTime` (Timestamp UTC).
* `endDateTime` (Timestamp UTC).
* `reason` (string): (e.g., `National Holiday`, `Showroom Renovation`).
* `isUnavailable` (Boolean: true = fully blocked).

### 3.7 Customer
The contact initiating or receiving the booking.
* `id` (UUID).
* `businessId` (UUID).
* `fullName` (string).
* `email` (string).
* `phone` (string).
* `organization` (string, optional).
* `customAttributes` (JSONB): Non-PII client metadata (e.g., project type, preferred wood species).

### 3.8 Reservation
The central booking agreement record.
* `id` (UUID).
* `confirmationCode` (string): Human-friendly code (e.g., `LUB-89247`).
* `businessId`, `branchId` (UUID).
* `customerId` (UUID).
* `serviceId` (UUID).
* `resourceId` (UUID, optional or allocated upon confirmation).
* `startDateTime` (Timestamp UTC).
* `endDateTime` (Timestamp UTC).
* `partySize` / `quantity` (Integer, default 1).
* `status` (Enum): `DRAFT` | `PENDING` | `CONFIRMED` | `CHECKED_IN` | `COMPLETED` | `CANCELLED` | `RESCHEDULED` | `NO_SHOW`.
* `paymentStatus` (Enum): `NOT_REQUIRED` | `PENDING` | `DEPOSIT_PAID` | `PAID_IN_FULL` | `REFUNDED`.
* `notes` (Text).
* `cancellationReason` (Text, nullable).
* `metadata` (JSONB).
* `createdAt`, `updatedAt` (Timestamp UTC).

---

## 4. Reservation Lifecycle & State Machine

```text
                 ┌───────────────┐
                 │     DRAFT     │  (Session slot held in memory/cache)
                 └───────┬───────┘
                         │ User submits booking form
                         ▼
                 ┌───────────────┐
                 │    PENDING    │  (Awaiting admin approval or payment)
                 └───────┬───────┘
                         │
        ┌────────────────┼────────────────┐
        │ Auto-confirmed │ Payment        │ Manual rejection /
        │ or manual      │ timed out      │ Customer cancels
        ▼ approval       ▼                ▼
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │  CONFIRMED   │ │    FAILED    │ │  CANCELLED   │
 └──┬───────────┘ └──────────────┘ └──────────────┘
    │
    ├─────────────────────────────┐
    │ Customer/Staff reschedules  │ Customer cancels within policy
    ▼                             ▼
┌──────────────┐           ┌──────────────┐
│ RESCHEDULED  │           │  CANCELLED   │
└──────────────┘           └──────────────┘
    │
    │ Day of session
    ▼
┌──────────────┐
│  CHECKED_IN  │ (Arrival at showroom / hotel / clinic)
└──────┬───────┘
       │
       ├──────────────────────────┐
       │ Session completed        │ Client failed to show
       ▼                          ▼
┌──────────────┐           ┌──────────────┐
│  COMPLETED   │           │   NO_SHOW    │
└──────────────┘           └──────────────┘
```

### 4.1 State Transitions & Permissions Matrix

| From State | To State | Triggered By | Conditions & Rules |
| :--- | :--- | :--- | :--- |
| **DRAFT** | **PENDING** | Customer (Public) | Required customer fields valid, slot temporarily locked. |
| **PENDING** | **CONFIRMED** | System / Admin | Auto-confirm rule active OR deposit transaction verified OR admin approves. |
| **PENDING** | **CANCELLED** | Customer / Admin | Expired payment window (timeout) or customer aborts request. |
| **CONFIRMED** | **RESCHEDULED**| Customer / Admin | New slot passes Availability Engine rules; original slot freed atomically. |
| **CONFIRMED** | **CANCELLED** | Customer / Admin | Lead time >= `cancellationCutoffHours`. Slot returned to pool. |
| **CONFIRMED** | **CHECKED_IN** | Staff / Admin | Day of appointment arrival verification. |
| **CHECKED_IN**| **COMPLETED**  | Staff / Admin | Service fulfilled. |
| **CONFIRMED** | **NO_SHOW**    | Staff / Admin | Grace period exceeded without customer appearance. |

---

## 5. Availability Engine & Concurrency Control

The most critical technical requirement is **guaranteeing zero double-bookings under concurrent traffic**.

### 5.1 Mathematical Slot Resolution Formula

For any target Resource $R$ on Date $D$:
$$\text{Available Slots} = \Big(\text{Schedule}(R, D) \setminus \text{Blackouts}(R, D)\Big) \setminus \bigcup_{i=1}^{N} \Big(\text{Reservation}_i(R) + \text{Buffer}(S)\Big)$$

Where:
* Multi-occupancy resources (e.g. workshops) decrement available capacity:
$$\text{CapacityRemaining}(t) = \text{TotalCapacity}(R) - \sum \text{PartySize}(\text{ActiveBookingsAt}(t))$$
* A slot is available if and only if $\text{CapacityRemaining}(t) \ge \text{RequestedPartySize}$.

### 5.2 Race Condition & Concurrency Strategy

To prevent race conditions where Request A and Request B attempt to book the exact same slot at the exact same millisecond:

1. **Phase 1: Optimistic Locking in Cache (Fast Path):**
   * Before reaching the checkout stage, a 10-minute slot reservation lock is acquired via Redis:
     `SET lock:slot:{resourceId}:{slotTimestamp} {customerId} NX EX 600`
   * If `NX` returns `0`, the slot is already held; the engine immediately rejects Request B with HTTP 409 Conflict.
2. **Phase 2: Database Exclusion Constraints (Authoritative Guarantee):**
   * PostgreSQL native **Range Types** with exclusion constraints are used:
     ```sql
     ALTER TABLE reservations ADD CONSTRAINT exclude_overlapping_reservations
     EXCLUDE USING gist (
       resource_id WITH =,
       tstzrange(start_datetime, end_datetime, '[)') WITH &&
     ) WHERE (status NOT IN ('CANCELLED', 'NO_SHOW'));
     ```
   * Even under catastrophic cache failure, the database engine **physically rejects** overlapping ranges at the transaction boundary. No two transactions can commit overlapping timestamps for the same resource.

---

## 6. Hotel & Hospitality Industry Mapping

The generic architecture seamlessly satisfies hotels without altering core code:

| Generic Booking Entity | Hotel & Hospitality Mapping | Implementation Details |
| :--- | :--- | :--- |
| **Business** | Hospitality Group / Brand | `Grand Hospitality International` |
| **Branch** | Hotel Property / Location | `Bole Luxury Hotel & Suites` |
| **Resource** | Physical Room / Suite / Villa | Room 402 (Type: `PHYSICAL_SPACE`, Capacity: 2 adults, Metadata: `{ bedType: "King", oceanView: true }`) |
| **Service** | Accommodation Stay | `Deluxe King Suite Lodging` (`bookingUnit: "DATE_RANGE"`, duration: 1440 min) |
| **Customer** | Hotel Guest | Contact information, passport/ID number in `customAttributes` |
| **Reservation** | Hotel Stay | Check-in: 2026-11-01 14:00, Check-out: 2026-11-05 11:00 (4 nights) |
| **Schedule** | 24/7 Continuous Operation | Standard check-in hour: 14:00, Check-out hour: 11:00 |
| **Buffer** | Housekeeping Cleaning Window | `bufferBeforeMinutes: 0`, `bufferAfterMinutes: 180` (3-hour housekeeping turnover) |

*Core vs. Hotel Module Boundary:*
* **Core:** Resolves continuous date-range availability, stores reservations, guarantees room inventory integrity.
* **Hotel Extension (Future):** Dynamic seasonal rate tables, multi-room group checkout, housekeeping room status updates.

---

## 7. Healthcare & Clinical Appointment Mapping

The same core handles healthcare facilities while observing medical data boundaries:

| Generic Booking Entity | Healthcare Clinic Mapping | Implementation Details |
| :--- | :--- | :--- |
| **Business** | Healthcare Practice / Polyclinic | `St. George Medical Group` |
| **Branch** | Clinical Facility / Campus | `Central Specialty Clinic` |
| **Resource** | Healthcare Provider (Doctor/Specialist) | Dr. Miriam Bekele, MD (Type: `PERSONNEL`, Capacity: 1) |
| **Service** | Consultation / Medical Session | `Cardiology Consultation` (duration: 30 min, bufferAfter: 10 min) |
| **Customer** | Patient | Full name, phone, email, date of birth |
| **Reservation** | Clinical Appointment | 2026-10-15 10:30–11:00 |

### Critical Security & Medical Record Boundary:
* **The Booking System handles ONLY operational logistics:** who is seeing whom, at what time, in what room.
* **The Booking System NEVER stores:** medical history, diagnostic codes (ICD-10), prescriptions, lab results, or clinical charting.
* When booking, the patient selects a generic service category. All sensitive medical documentation remains isolated inside the healthcare facility's dedicated Electronic Health Record (EHR) system.

---

## 8. Extended Industry Matrix

| Industry | Generic Resource | Generic Service | Customer Entity | Typical Schedule & Slot Nuance |
| :--- | :--- | :--- | :--- | :--- |
| **Showroom / Furniture** *(Lube)* | Design Consultant / Studio Desk | In-Studio Consultation | Homeowner / Architect | 60-min daytime sessions, weekday/Saturday schedule. |
| **Beauty Salon & Spa** | Stylist / Treatment Chair | Haircut / Spa Therapy | Salon Client | Staggered service durations (e.g., 45-min cut, 15-min wash buffer). |
| **Training Center** | Classroom / Lab Instructor | Professional Certification | Student / Trainee | High capacity (e.g., 1 class resource with capacity = 25 seats). |
| **Event Venue** | Conference Hall / Pavilion | Full-Day Venue Rental | Event Organizer | Multi-hour blocks with 4-hour setup/teardown buffers. |
| **Restaurant** | Dining Table (2-top, 4-top) | Table Reservation | Diner / Party Host | 90-minute meal windows; capacity by table party size. |
| **Car Rental** | Vehicle Unit / Fleet Group | Vehicle Rental Period | Driver / Renter | Multi-day date ranges; pick-up/drop-off branch routing. |
| **Professional Services** | Partner / Legal Consultant | Advisory Session | Corporate Client | Calendar synchronization (Google/Outlook bridge). |


---

## 9. Multi-Tenant Architecture & Data Isolation

To support multiple enterprise businesses within the AlzerSoftware ecosystem:

1. **Row-Level Tenant Isolation:**
   * Every database table includes an indexed `tenant_id` foreign key.
   * PostgreSQL **Row-Level Security (RLS)** policies enforce that database queries automatically filter by the tenant context extracted from the authenticated JWT session:
     ```sql
     CREATE POLICY tenant_isolation_policy ON reservations
     FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
     ```
2. **Branch Federation:**
   * Businesses can manage multiple physical branches (`branch_id`) with unique operating hours and localized resources while sharing a master customer ledger.
3. **Independent Tenant Configurations:**
   * Lead times, policies, and notification templates are stored in tenant-specific JSON documents, allowing each client to configure their operational policies without schema changes.

---

## 10. Identity, Permissions & User Roles

A pragmatic role-based access control (RBAC) model is defined:

* **Platform Admin (AlzerSoftware):** Global superuser managing tenant provisioning, subscription status, and platform health.
* **Business Owner:** Full administrative control over their business, billing, branches, and staff accounts.
* **Business Admin (Manager):** Manages schedules, services, resources, and customer lists.
* **Staff Member (Provider / Stylist / Consultant):** Can view their own assigned calendar, view booking notes, and mark bookings as checked-in/completed.
* **Receptionist / Front Desk:** Can book on behalf of walk-in customers, reschedule, and handle check-in/out.
* **Customer (Public):** Self-service user authenticated via magic link or SMS OTP to view, cancel, or reschedule their personal bookings.

---

## 11. Public Booking Experience & Interaction Flows

The front-end user experience provides two distinct configuration modes:

### 11.1 Time-Slot Flow (Consultancies, Clinics, Salons)
1. **Service Selection:** Choose consultation type (e.g. *Living & Dining Space Planning*).
2. **Resource Selection (Optional):** Choose preferred specialist or select *First Available*.
3. **Date Selection:** Interactive calendar displaying dates with open capacity.
4. **Time Selection:** Dynamic grid of available slots (filtered for buffers and existing bookings).
5. **Customer Details:** Name, email, phone, and contextual requirements.
6. **Confirmation & Receipt:** Instant generation of unique reference code (e.g. `LUB-49102`) with calendar invite (.ics download) and confirmation email.

### 11.2 Date-Range Flow (Hotels, Rentals, Venues)
1. **Date Range Picker:** Check-in and check-out date selection.
2. **Party / Capacity Query:** Number of guests/units required.
3. **Inventory Availability:** List of available room/villa categories matching criteria.
4. **Guest Intake:** Primary guest contact details.
5. **Confirmation & Guarantee:** Confirmation code and stay policy guidelines.

---

## 12. Administrative Experience & Operational Dashboard

### 12.1 MVP Administration Scope (Phase 1–5)
* **Master Calendar:** Day, Week, and Month views showing scheduled bookings color-coded by resource.
* **Booking Ledger:** Filterable data table of all reservations with status management buttons (*Check-in*, *Complete*, *Cancel*, *Reschedule*).
* **Schedule Editor:** Simple UI for setting standard weekly hours and adding holiday exceptions.
* **Resource & Service Manager:** Forms to add, edit, or deactivate resources and services.
* **Manual Walk-In Booking:** Rapid booking creation tool for telephone or walk-in clients.

### 12.2 Future Enterprise Expansion
* Advanced multi-staff shift scheduling.
* Revenue and resource utilization analytics.
* Automated customer retention reporting.

---

## 13. API Architecture & Endpoint Contracts

All endpoints follow strict REST conventions, returning standard JSON with UTC ISO 8601 timestamps.

### 13.1 Endpoint Specifications

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/v1/public/{tenant}/services` | GET | Public | List active bookable services and durations. |
| `/v1/public/{tenant}/resources` | GET | Public | List available resources (staff/rooms) for a service. |
| `/v1/public/{tenant}/availability`| GET | Public | Query open time slots for a given resource/service and date range. |
| `/v1/public/{tenant}/hold` | POST | Public | Acquire temporary 10-minute lock on a target slot. |
| `/v1/public/{tenant}/reservations`| POST | Public | Commit a new reservation. |
| `/v1/public/{tenant}/reservations/{code}`| GET | Public (Auth/Token)| View reservation status using confirmation code. |
| `/v1/admin/reservations` | GET | Private (Staff) | Filter reservations by branch, status, date, or customer. |
| `/v1/admin/reservations/{id}/status`| PATCH| Private (Staff) | Update lifecycle state (`CHECKED_IN`, `CANCELLED`, etc.). |
| `/v1/admin/schedules` | PUT | Private (Admin) | Update weekly business and resource working hours. |
| `/v1/admin/resources` | POST/PUT| Private (Admin) | Create or update bookable resources. |

---

## 14. Database Architecture & Schema Specification

Built on PostgreSQL to leverage ACID guarantees, JSONB flexibility, and range exclusion indexing.

```sql
-- Core PostgreSQL Relational Schema Outline

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Tenants
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

-- Branches
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    timezone VARCHAR(64) NOT NULL,
    address JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resources
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL, -- 'PHYSICAL_SPACE', 'PERSONNEL', 'EQUIPMENT'
    capacity INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    buffer_before_minutes INTEGER NOT NULL DEFAULT 0,
    buffer_after_minutes INTEGER NOT NULL DEFAULT 0,
    booking_unit VARCHAR(16) NOT NULL DEFAULT 'TIMESLOT', -- 'TIMESLOT', 'DATE_RANGE'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    custom_attributes JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reservations with Range Overlap Exclusion
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    confirmation_code VARCHAR(32) UNIQUE NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    service_id UUID NOT NULL REFERENCES services(id),
    resource_id UUID NOT NULL REFERENCES resources(id),
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'NOT_REQUIRED',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Absolute Exclusion Constraint preventing double-booking of single-capacity resources
    CONSTRAINT exclude_double_booking EXCLUDE USING gist (
        resource_id WITH =,
        tstzrange(start_datetime, end_datetime, '[)') WITH &&
    ) WHERE (status NOT IN ('CANCELLED', 'NO_SHOW'))
);

CREATE INDEX idx_reservations_tenant ON reservations(tenant_id);
CREATE INDEX idx_reservations_start ON reservations(start_datetime);
```

---

## 15. Security, Privacy & PII Compliance

1. **Decoupled Architecture:** The public Company Profile frontend executes in user browsers and holds zero database credentials or server secret keys.
2. **Rate Limiting & Anti-Spam:** Public booking endpoints apply IP token-bucket rate limits and hidden honeypot validation to thwart automated slot scrapers.
3. **Data Minimization:** Only operational contact details are gathered. Sensitive PII is separated from analytical reporting logs.
4. **Audit Logging:** Every state transition (`CONFIRMED` → `CANCELLED`) records an append-only audit trail capturing timestamp, triggering user identity, and IP address.

---

## 16. Vendor-Neutral Payment Abstraction

Payment collection is strictly decoupled from the core lifecycle:
* **Mode 1: Zero Payment (Default for Lube Furniture):** Consultations and showroom visits require no monetary transaction.
* **Mode 2: Deposit Collection:** A fixed percentage or flat reservation fee.
* **Mode 3: Full Payment:** Accommodation stays or upfront service payments.

### Universal Payment Gateway Seam:
```typescript
export interface PaymentGatewayAdapter {
  createPaymentSession(booking: Reservation, amount: number): Promise<PaymentSessionResult>;
  verifyWebhook(payload: unknown, headers: Record<string, string>): Promise<PaymentEvent>;
  refund(transactionId: string, amount?: number): Promise<RefundResult>;
}
```
Core never imports Stripe, PayPal, or Chapa SDKs. Implementations plug into this interface.

---

## 17. Pluggable Notification & Communications Engine

A provider-agnostic notification event handler coordinates customer touchpoints:
* **Events:** `BOOKING_CONFIRMED`, `BOOKING_RESCHEDULED`, `BOOKING_REMINDER_24H`, `BOOKING_CANCELLED`.
* **Channels:** Email (HTML + .ics calendar attachment), SMS, WhatsApp Business API, and generic Webhooks.
* **Zero Core Vendor Lock:** Specific delivery agents (e.g. Resend, SendGrid, Twilio, Infobip) reside behind a generic `NotificationDispatcher` adapter.

---

## 18. Temporal, Timezone & Calendar Representation Model

1. **Storage Invariance:** All dates and times are stored in UTC (`TIMESTAMPTZ`).
2. **Business Local Calculation:** Availability slot boundaries are generated according to the Branch's registered IANA timezone (handling daylight savings shifts seamlessly).
3. **Client Local Presentation:** The front-end adapter converts UTC availability timestamps into the visitor's local browser timezone with an explicit indicator: *"All times displayed in East Africa Time (UTC+3)"*.

---

## 19. Integration Specification: Business-Growth-Lube-Furniture Template

### 19.1 Target Integration Point
The benchmark template already exposes:
* **Route:** `/booking` in `src/App.tsx`
* **Component:** `src/pages/BookingPage.tsx`
* **Slot:** `<SolutionSlot name="booking:widget" fallback={<CoreBookingFallback onContact={onContact} />} props={{ roomType: 'Living & Dining Environments' }} />`

### 19.2 The Solution Package Bridge
The future production solution package (`@alzersoftware/booking-solution`) will register into the existing `SolutionRegistry`:

```typescript
// Architectural contract for future production registration
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

### 19.3 Behavior Under All States
* **When Active & Configured:** The interactive calendar, time slots, and confirmation intake render seamlessly inside `BookingPage.tsx`.
* **When API is Unreachable / Error:** The integrated `SlotErrorBoundary` catches network exceptions and displays an isolated error card (`data-testid="solution-slot-error-booking:widget"`).
* **When Disabled:** `SolutionSlot` renders the pristine `CoreBookingFallback` prompting users to contact the studio team directly.

---

## 20. Reversibility & Zero-Core-Intrusion Proof

The integration satisfies the strict reversibility invariant:
1. Disabling or removing the Booking Solution leaves the template in a 100% operational state.
2. The `/booking` route remains functional, gracefully displaying `CoreBookingFallback`.
3. Zero application code in `src/components/`, `src/pages/`, or `src/data/` depends on Booking backend schemas or APIs.
4. Pre-existing tests in `src/solutions/__tests__/reversibility.test.ts` continue to pass without regression.

---

## 21. Vendor Decoupling & Neutrality Guarantees

The entire product architecture enforces absolute vendor neutrality:
* **No proprietary booking API dependency** (No Calendly, Cal.com, Acuity).
* **No BaaS vendor lock-in** (No Supabase, Firebase, AWS Cognito in core).
* **No database driver lock-in** (Data layer accessed via standard SQL repository interfaces).
* **No payment processor lock-in** (Provider-agnostic interface).

---

## 22. Product Scope & MVP Definition

### 22.1 MVP Scope (Must Have)
* Complete generic domain models for Tenant, Branch, Resource, Service, Schedule, and Reservation.
* Availability Engine supporting single-capacity time slots and business hours.
* Concurrency protection via database exclusion constraints.
* Public booking client widget for `booking:widget` slot.
* Basic staff calendar view and booking status update endpoint.
* Email confirmation dispatch with .ics calendar attachments.

### 22.2 Phase 2 Scope (Should Have)
* Multi-capacity group bookings (workshops/classes).
* Date-range bookings for hospitality/hotels.
* Two-phase temporary slot holds (Redis).
* SMS/WhatsApp notifications.

### 22.3 Future Scope
* Multi-staff round-robin routing.
* Advanced online payment deposit collection.
* Third-party calendar 2-way sync (Google / Outlook / Apple).

---

## 23. Phased Roadmap & Implementation Order

* **Phase 1 (Current):** Product Architecture & Foundation Specification (Contract Complete).
* **Phase 2:** Headless Backend Scaffold & Core Domain Entities (Node/TypeScript + PostgreSQL).
* **Phase 3:** Availability Engine & Concurrency Locking Algorithms.
* **Phase 4:** Reservation Lifecycle & API Gateway Implementation.
* **Phase 5:** Production React Adapter Package (`@alzersoftware/booking-adapter`).
* **Phase 6:** Integration into `Business-Growth-Lube-Furniture` replacing mock proof with live widget.
* **Phase 7:** Admin Dashboard Portal (Calendar, Schedule Manager, Walk-in intake).
* **Phase 8:** Payment & SMS Notification Extensions.
* **Phase 9:** Production Hardening, Multi-Tenant Penetration Testing & SLA Verification.

---

## 24. Repository & Deployment Architecture Recommendation

### Evaluated Options:
* **Option A (Monorepo Inside Template):** Embed backend inside Lube Furniture. *(Rejected: destroys reusability across other templates).*
* **Option B (Separate Standalone App):** A monolithic app per customer. *(Rejected: inefficient maintenance and multi-tenancy failure).*
* **Option C (Recommended: Headless API Repository + Reusable React Adapter):**
  1. `alzersoftware-booking-core`: Dedicated standalone backend repository hosting the Multi-tenant API, Database migrations, and Availability Engine.
  2. `@alzersoftware/booking-adapter`: Lightweight NPM library containing the React widget and SolutionModule connector.
  3. Template repositories (Lube Furniture, Nove Motors, Asterra, etc.) consume the adapter as a modular solution package.

---

## 25. Impact Analysis on Target Template (`Business-Growth-Lube-Furniture`)

* **Existing Assets Preserved:**
  * Zero modifications to `src/App.tsx` or existing pages.
  * Zero modifications to pre-existing `SolutionSlot` or `SolutionRegistry` logic.
  * Zero modifications to Tailwind design system or aesthetic tokens.
* **Future Integration Touchpoint:**
  * Replace the local demonstration proof (`src/solutions/proofs/bookingProof.tsx`) with the production adapter in `src/solutions/index.ts`.

---

## 26. Architectural Decision Record (ADR)

* **Decision:** Implement a headless, multi-tenant, domain-agnostic booking engine with PostgreSQL range exclusion constraints, connected to company profile templates via generic SolutionSlots.
* **Status:** **APPROVED FOR PHASE 1 SPECIFICATION**.
* **Consequences:**
  * *Positive:* Enables one unified codebase to power hotels, clinics, salons, and consultancies; ensures zero double-bookings under heavy load; maintains complete frontend reversibility.
  * *Trade-off:* Requires dedicated API deployment infrastructure separate from static template hosting; necessitates timezone normalization across client and server boundaries.
