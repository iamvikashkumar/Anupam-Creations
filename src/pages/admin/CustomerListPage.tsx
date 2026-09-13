import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCustomers, type Customer } from '@/features/customers/customerService';

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    listCustomers()
      .then((items) => {
        setCustomers(items);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.phone, customer.flat].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  );

  return (
    <section className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Customers</h1>
          <p className="mt-1 text-sm text-ink/60">Find a customer or add someone new.</p>
        </div>
        <Link to="/admin/customers/new" className="btn-primary w-full sm:w-auto">+ New customer</Link>
      </div>

      <label className="mt-6 block text-sm font-semibold">
        Search customers
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, phone or flat"
          className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-4 text-base"
        />
      </label>

      {status === 'loading' && <p className="mt-8 text-sm text-ink/60">Loading customers...</p>}
      {status === 'error' && (
        <p role="alert" className="mt-8 rounded-card bg-alert/10 p-4 text-sm text-alert-dark">
          Unable to load customers. Confirm you are logged in and that Firestore rules allow the admin role.
        </p>
      )}
      {status === 'ready' && filteredCustomers.length === 0 && (
        <div className="card mt-8 p-6 text-center">
          <p className="font-semibold">{customers.length ? 'No customers found.' : 'No customers yet.'}</p>
          <Link to="/admin/customers/new" className="mt-4 inline-flex text-sm font-semibold text-maroon underline">
            Add your first customer
          </Link>
        </div>
      )}
      <div className="mt-6 space-y-3">
        {filteredCustomers.map((customer) => (
          <Link key={customer.id} to={`/admin/customers/${customer.id}`} className="card block p-5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold">{customer.name}</h2>
                <p className="mt-1 text-sm text-ink/65">{customer.phone}</p>
              </div>
              <span className="text-sm font-semibold text-maroon">View</span>
            </div>
            <p className="mt-4 text-sm text-ink/65">Flat {customer.flat || 'not added'}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}