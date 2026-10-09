import { z } from 'zod';

export const paymentStatusSchema = z.enum([
  'NOT_REQUIRED',
  'PENDING',
  'AUTHORIZED',
  'DEPOSIT_PAID',
  'PAID_IN_FULL',
  'REFUNDED',
  'FAILED',
]);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

// Universal Payment Gateway Seam
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
