import crypto from 'crypto';

export type OutboxEventType =
  | 'RESERVATION_CREATED'
  | 'RESERVATION_CONFIRMED'
  | 'RESERVATION_RESCHEDULED'
  | 'RESERVATION_CANCELLED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_REFUNDED';

export interface OutboxEvent {
  id: string;
  tenantId: string;
  eventType: OutboxEventType;
  aggregateId: string;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  retryCount: number;
  createdAt: Date;
}

export function createOutboxEvent(
  tenantId: string,
  eventType: OutboxEventType,
  aggregateId: string,
  payload: Record<string, unknown>
): OutboxEvent {
  return {
    id: crypto.randomUUID(),
    tenantId,
    eventType,
    aggregateId,
    payload,
    status: 'PENDING',
    retryCount: 0,
    createdAt: new Date(),
  };
}
