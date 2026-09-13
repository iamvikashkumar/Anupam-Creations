import { Link } from 'react-router-dom';

const summaryCards = [
  { label: 'Due today', value: '0', tone: 'border-maroon/25 bg-maroon/5' },
  { label: 'Urgent', value: '0', tone: 'border-alert/25 bg-alert/5' },
  { label: 'In progress', value: '0', tone: 'border-thread/25 bg-thread/5' },
  { label: 'Ready', value: '0', tone: 'border-marigold/35 bg-marigold/10' },
  { label: 'Payment pending', value: '₹0', tone: 'border-ink/15 bg-white' },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">Today</h1>
          <p className="mt-1 text-sm text-ink/60">Your work at a glance.</p>
        </div>
        <Link to="/admin/orders/new" className="btn-primary w-full sm:w-auto">
          + New order
        </Link>
      </div>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Order summary">
        {summaryCards.map((card) => (
          <Link key={card.label} to="/admin/orders" className={`rounded-card border p-4 ${card.tone}`}>
            <p className="text-2xl font-bold text-ink">{card.value}</p>
            <p className="mt-1 text-xs font-semibold text-ink/65">{card.label}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Due today</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-maroon">View all</Link>
          </div>
          <p className="mt-8 text-sm text-ink/55">No orders are due today.</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">What needs attention</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-maroon">Orders</Link>
          </div>
          <p className="mt-8 text-sm text-ink/55">You&apos;re all caught up.</p>
        </div>
      </section>
    </div>
  );
}