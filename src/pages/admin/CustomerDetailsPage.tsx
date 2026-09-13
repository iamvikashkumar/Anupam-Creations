import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCustomer, type Customer } from '@/features/customers/customerService';

export default function CustomerDetailsPage() {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!customerId) return;
    getCustomer(customerId)
      .then((result) => {
        setCustomer(result);
        setState(result ? 'ready' : 'error');
      })
      .catch(() => setState('error'));
  }, [customerId]);

  if (state === 'loading') return <p className="text-sm text-ink/60">Loading customer...</p>;
  if (state === 'error' || !customer) {
    return (
      <section>
        <p role="alert" className="text-sm text-alert-dark">Customer could not be found.</p>
        <Link to="/admin/customers" className="mt-4 inline-flex text-sm font-semibold text-maroon underline">Back to customers</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <Link to="/admin/customers" className="text-sm font-semibold text-maroon">← Customers</Link>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Customer details</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{customer.name}</h1>
        </div>
        <div className="flex gap-3">
          <Link to={`/admin/customers/${customer.id}/edit`} className="btn-secondary">Edit</Link>
          <a href={`tel:${customer.phone}`} className="btn-secondary">Call customer</a>
        </div>
      </div>
      <div className="card mt-6 grid gap-5 p-6 sm:grid-cols-2">
        <div><p className="text-xs font-semibold uppercase text-ink/50">Phone</p><p className="mt-1 font-semibold">{customer.phone}</p></div>
        <div><p className="text-xs font-semibold uppercase text-ink/50">Flat / Apartment</p><p className="mt-1 font-semibold">{customer.flat || 'Not added'}</p></div>
        <div className="sm:col-span-2"><p className="text-xs font-semibold uppercase text-ink/50">Address</p><p className="mt-1 font-semibold">{customer.address || 'Not added'}</p></div>
      </div>
      <div className="card mt-5 p-6">
        <h2 className="font-display text-xl font-bold">Order history</h2>
        <p className="mt-3 text-sm text-ink/55">Orders will appear here in Phase 4C.</p>
      </div>
    </section>
  );
}