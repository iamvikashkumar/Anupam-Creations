import { describe, expect, it } from 'vitest';
import { deriveOrderStatus, getPriorityCharge, PRIORITY_RATES } from '@/features/orders/orderService';

describe('order priority pricing', () => {
  it('uses the requested priority percentages', () => {
    expect(PRIORITY_RATES.URGENT).toBe(15);
    expect(PRIORITY_RATES.SAME_DAY).toBe(30);
    expect(getPriorityCharge(1000, 'URGENT')).toBe(150);
    expect(getPriorityCharge(1000, 'SAME_DAY')).toBe(300);
    expect(getPriorityCharge(1000, 'NORMAL')).toBe(0);
  });

  it('derives order progress from independent item stages', () => {
    expect(deriveOrderStatus([{ status: 'ACCEPTED' }, { status: 'IN_PROGRESS' }])).toBe('IN_PROGRESS');
    expect(deriveOrderStatus([{ status: 'CANCELLED' }, { status: 'DELIVERED' }])).toBe('DELIVERED');
    expect(deriveOrderStatus([{ status: 'CANCELLED' }, { status: 'CANCELLED' }])).toBe('CANCELLED');
    expect(deriveOrderStatus([{ status: 'DELIVERED' }, { status: 'PAYMENT_DONE' }])).toBe('DELIVERED');
  });
});