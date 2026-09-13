import { describe, expect, it } from 'vitest';
import { isValidIndianMobile, normalizePhone } from '@/features/customers/customerService';

describe('customer service', () => {
  it('normalizes a ten-digit Indian phone number', () => {
    expect(normalizePhone('98765 43210')).toBe('+919876543210');
  });

  it('keeps an international Indian number consistent', () => {
    expect(normalizePhone('+91-9876543210')).toBe('+919876543210');
    expect(normalizePhone('919876543210')).toBe('+919876543210');
  });

  it('removes separators from other phone values', () => {
    expect(normalizePhone('001-234')).toBe('001234');
  });

  it('validates only Indian mobile numbers', () => {
    expect(isValidIndianMobile('98765 43210')).toBe(true);
    expect(isValidIndianMobile('987654321')).toBe(false);
  });
});
