import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CustomerFormPage from '@/pages/admin/CustomerFormPage';
import { createCustomer } from '@/features/customers/customerService';

vi.mock('@/features/customers/customerService', async () => {
  const actual = await vi.importActual<typeof import('@/features/customers/customerService')>(
    '@/features/customers/customerService',
  );
  return { ...actual, createCustomer: vi.fn() };
});

describe('CustomerFormPage', () => {
  beforeEach(() => vi.mocked(createCustomer).mockReset());

  it('saves a customer and navigates to its details', async () => {
    vi.mocked(createCustomer).mockResolvedValue('customer-1');
    render(
      <MemoryRouter initialEntries={['/admin/customers/new']}>
        <CustomerFormPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Anupam' } });
    fireEvent.change(screen.getByLabelText('phone'), { target: { value: '98765 43210' } });
    fireEvent.change(screen.getByLabelText('Flat / Apartment'), { target: { value: 'A-204' } });
    fireEvent.click(screen.getByRole('button', { name: /save customer/i }));

    await waitFor(() => expect(createCustomer).toHaveBeenCalledWith({
      name: 'Anupam',
      phone: '98765 43210',
      flat: 'A-204',
      address: '',
    }));
  });

});