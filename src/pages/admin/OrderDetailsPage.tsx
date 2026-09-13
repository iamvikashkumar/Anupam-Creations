import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getOrder,
  listOrderItems,
  deriveOrderStatus,
  displayOrderStatus,
  updateOrderItemStatus,
  type Order,
  type OrderItem,
  type OrderStatus,
} from '@/features/orders/orderService';
import { openWhatsAppMessage, orderStatusMessage } from '@/features/orders/orderMessaging';

const lifecycle = [
  { status: 'ACCEPTED' as OrderStatus, label: 'Accepted' },
  { status: 'IN_PROGRESS' as OrderStatus, label: 'Work in progress' },
  { status: 'DELIVERED' as OrderStatus, label: 'Product delivered' },
  { status: 'PAYMENT_DONE' as OrderStatus, label: 'Payment done' },
];

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const load = useCallback(async () => {
    if (!orderId) return;
    const [nextOrder, nextItems] = await Promise.all([getOrder(orderId), listOrderItems(orderId)]);
    setOrder(nextOrder);
    setItems(nextItems);
    setIsLoading(false);
  }, [orderId]);

  useEffect(() => {
    load().catch(() => {
      setMessage('Unable to load order details.');
      setIsLoading(false);
    });
  }, [load]);

  const updateItem = async (item: OrderItem, status: OrderStatus) => {
    if (!orderId || !order) return;
    if (status === 'CANCELLED' && !window.confirm(`Cancel item ${item.itemNumber}?`)) return;
    setIsUpdating(true);
    try {
      await updateOrderItemStatus(orderId, item.id, status);
      openWhatsAppMessage(order.customerPhone, orderStatusMessage(order, status));
      await load();
    } catch { setMessage('Unable to update item status.'); }
    finally { setIsUpdating(false); }
  };

  if (isLoading) return <p className="text-sm text-ink/60">Loading order...</p>;
  if (!order) {
    return (
      <section>
        <p role="alert" className="text-sm text-alert-dark">Order could not be found.</p>
        <Link to="/admin/orders" className="mt-4 inline-flex text-sm font-semibold text-maroon underline">Back to orders</Link>
      </section>
    );
  }

  const derivedStatus = deriveOrderStatus(items, order.status);
  const currentIndex = lifecycle.findIndex((stage) => stage.status === derivedStatus);
  return (
    <section className="mx-auto max-w-3xl">
      <Link to="/admin/orders" className="text-sm font-semibold text-maroon">← Orders</Link>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-ink/55">Order</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink/65">{order.customerName} · {order.customerPhone} · Flat {order.customerFlat || 'not added'}</p>
        </div>
        <span className="rounded-pill bg-maroon/10 px-3 py-2 text-xs font-bold text-maroon">{displayOrderStatus(derivedStatus)}</span>
      </div>
      <div className="card mt-6 p-5">
        <div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">Items</h2><span className="text-sm text-ink/55">Due {order.expectedDeliveryDate}</span></div>
        <div className="mt-4 space-y-3">{items.map((item) => <div key={item.id} className="rounded-card border border-paper-dim p-4"><div className="flex justify-between gap-4"><div><p className="text-xs font-semibold text-maroon">Item {item.itemNumber}</p><p className="mt-1 font-semibold">{item.serviceName}</p><p className="text-sm text-ink/60">{item.description || 'No description'}</p></div><div className="text-right"><p className="font-bold">₹{item.price}</p><p className="text-xs font-semibold text-maroon">{displayOrderStatus(item.status)}</p></div></div><label className="mt-4 block text-xs font-semibold text-ink/60">Update this item<select aria-label={`Update item ${item.itemNumber}`} value={item.status} onChange={(event) => updateItem(item, event.target.value as OrderStatus)} disabled={isUpdating} className="mt-1 min-h-touch w-full rounded-card border border-ink/20 bg-white px-3 text-sm font-semibold text-ink"><option value="ACCEPTED">Accepted</option><option value="IN_PROGRESS">Work in progress</option><option value="DELIVERED">Product delivered</option><option value="PAYMENT_DONE">Payment done</option><option value="CANCELLED">Cancelled</option></select></label></div>)}</div>
      </div>
      <div className="card mt-5 p-5"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">Order progress</h2><span className="text-xs font-semibold text-ink/55">Based on item status</span></div><div className="mt-5 grid grid-cols-4 gap-2">{lifecycle.map((stage, index) => { const isComplete = currentIndex >= index; const isCurrent = derivedStatus === stage.status; return <div key={stage.status} className="relative text-center">{index > 0 && <span className={`absolute -left-1/2 top-3 h-0.5 w-full ${isComplete ? 'bg-maroon' : 'bg-paper-dim'}`} aria-hidden="true" />}<span className={`relative mx-auto flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs ${isComplete ? 'border-maroon bg-maroon text-white' : 'border-paper-dim bg-paper text-ink/40'}`}>{isComplete ? '✓' : index + 1}</span><p className={`mt-2 text-[10px] leading-tight ${isCurrent ? 'font-bold text-maroon' : 'text-ink/55'}`}>{stage.label}</p></div>; })}</div></div>
      <div className="card mt-5 p-5"><h2 className="font-display text-xl font-bold">Payment summary</h2><div className="mt-4 space-y-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><strong>₹{order.subtotal}</strong></p><p className="flex justify-between"><span>Priority charges</span><strong>₹{order.priorityCharge}</strong></p><p className="flex justify-between border-t border-paper-dim pt-2 text-base"><span>Total</span><strong>₹{order.totalAmount}</strong></p><p className="flex justify-between"><span>Paid</span><strong>₹{order.paidAmount}</strong></p><p className="flex justify-between text-alert-dark"><span>Pending</span><strong>₹{order.pendingAmount}</strong></p></div></div>
      {message && <p role="alert" className="mt-5 rounded-card bg-alert/10 p-4 text-sm text-alert-dark">{message}</p>}
    </section>
  );
}
