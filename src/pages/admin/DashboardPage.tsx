import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrders, type Order } from '@/features/orders/orderService';

const today = new Date().toISOString().slice(0, 10);

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    listOrders().then((items) => {
      setOrders(items);
      setStatus('ready');
    }).catch(() => setStatus('error'));
  }, []);

  const activeOrders = orders.filter((order) => !['CANCELLED', 'PAYMENT_DONE'].includes(order.status));
  const cards = [
    ['Due today', activeOrders.filter((order) => order.expectedDeliveryDate === today).length, 'border-maroon/25 bg-maroon/5'],
    ['Urgent', activeOrders.filter((order) => order.priority !== 'NORMAL').length, 'border-alert/25 bg-alert/5'],
    ['In progress', activeOrders.filter((order) => order.status === 'IN_PROGRESS').length, 'border-thread/25 bg-thread/5'],
    ['Delivered', activeOrders.filter((order) => ['DELIVERED', 'READY', 'COLLECTED'].includes(order.status)).length, 'border-marigold/35 bg-marigold/10'],
    ['Payment pending', `₹${activeOrders.reduce((total, order) => total + order.pendingAmount, 0)}`, 'border-ink/15 bg-white'],
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-wide text-maroon">Admin</p><h1 className="mt-1 font-display text-3xl font-bold text-ink">Today</h1><p className="mt-1 text-sm text-ink/60">Live order overview.</p></div>
        <Link to="/admin/orders/new" className="btn-primary w-full sm:w-auto">+ New order</Link>
      </div>
      {status === 'loading' && <p className="mt-8 text-sm text-ink/60">Loading dashboard...</p>}
      {status === 'error' && <p role="alert" className="mt-8 rounded-card bg-alert/10 p-4 text-sm text-alert-dark">Unable to load dashboard data. Check Firestore rules.</p>}
      {status === 'ready' && <>
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Order summary">
          {cards.map(([label, value, tone]) => <Link key={label} to="/admin/orders" className={`rounded-card border p-4 ${tone}`}><p className="text-2xl font-bold text-ink">{value}</p><p className="mt-1 text-xs font-semibold text-ink/65">{label}</p></Link>)}
        </section>
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="card p-5"><h2 className="font-display text-xl font-bold">What needs attention</h2>{activeOrders.filter((order) => order.expectedDeliveryDate <= today || order.priority !== 'NORMAL').slice(0, 5).map((order) => <Link key={order.id} to={`/admin/orders/${order.id}`} className="mt-4 block border-b border-paper-dim pb-3 text-sm"><span className="font-bold text-maroon">{order.orderNumber}</span> · {order.customerName}<span className="block text-xs text-ink/55">{order.expectedDeliveryDate} · {order.status}</span></Link>)}{!activeOrders.length && <p className="mt-8 text-sm text-ink/55">You&apos;re all caught up.</p>}</div>
          <div className="card p-5"><h2 className="font-display text-xl font-bold">Recent orders</h2>{orders.slice(0, 5).map((order) => <Link key={order.id} to={`/admin/orders/${order.id}`} className="mt-4 flex justify-between border-b border-paper-dim pb-3 text-sm"><span><strong>{order.orderNumber}</strong><span className="block text-xs text-ink/55">{order.customerName}</span></span><strong>₹{order.totalAmount}</strong></Link>)}</div>
        </section>
      </>}
    </div>
  );
}
