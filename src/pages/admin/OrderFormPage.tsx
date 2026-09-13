import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listCustomers, type Customer } from '@/features/customers/customerService';
import { createOrder, ensureDefaultServices, getPriorityCharge, PRIORITY_RATES, type OrderItemInput, type Priority, type ServiceOption } from '@/features/orders/orderService';
import { buildWhatsAppMessage, createOrderPdf } from '@/features/orders/orderPdf';

const blankItem = (): OrderItemInput => ({
  serviceId: '', serviceName: '', description: '', price: 0, priority: 'NORMAL',
  expectedDeliveryDate: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10), notes: '',
});

export default function OrderFormPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<OrderItemInput[]>([blankItem()]);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([listCustomers(), ensureDefaultServices()])
      .then(([customerItems, serviceItems]) => {
        setCustomers(customerItems);
        setServices(serviceItems);
      })
      .catch(() => setMessage('Unable to load customers or services. Check Firestore rules.'))
      .finally(() => setIsLoading(false));
  }, []);

  const updateItem = (index: number, field: keyof OrderItemInput, value: string | number | Priority) => {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  };

  const chooseService = (index: number, serviceId: string) => {
    const service = services.find((option) => option.id === serviceId);
    if (!service) return;
    setItems((current) => current.map((item, itemIndex) => itemIndex === index
      ? { ...item, serviceId, serviceName: service.name, price: service.defaultPrice }
      : item));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const customer = customers.find((item) => item.id === customerId);
    if (!customer) return setMessage('Select a customer first.');
    if (items.some((item) => !item.serviceId || !item.expectedDeliveryDate || item.price < 0)) {
      return setMessage('Choose a service, delivery date and valid price for every item.');
    }
    setMessage('');
    setIsSaving(true);
    try {
      const createdOrder = await createOrder(customer, items, notes);
      try {
        const pdf = createOrderPdf({ ...createdOrder, customer, items, notes, photos });
        const message = buildWhatsAppMessage({ ...createdOrder, customer, items, notes, photos });
        const blob = pdf.output('blob');
        const file = new File([blob], `${createdOrder.orderNumber}.pdf`, { type: 'application/pdf' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: `Order ${createdOrder.orderNumber}`, text: message, files: [file] });
        } else {
          pdf.save(`${createdOrder.orderNumber}.pdf`);
          window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
        }
      } catch {
        setMessage('Order saved. PDF/WhatsApp sharing was skipped; you can share it from order details.');
      }
      setPhotos([]);
      navigate(`/admin/orders/${createdOrder.id}`);
    } catch (error) {
      setMessage(error instanceof Error && error.message === 'NO_ITEMS'
        ? 'Add at least one item.'
        : 'Unable to save order. Check your connection and Firestore rules.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 3 - photos.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((current) => [...current, String(reader.result)]);
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const priorityCharge = items.reduce((total, item) => total + getPriorityCharge(item.price, item.priority), 0);

  return (
    <section className="mx-auto max-w-2xl">
      <Link to="/admin/orders" className="text-sm font-semibold text-maroon">← Orders</Link>
      <h1 className="mt-5 font-display text-3xl font-bold">New order</h1>
      {isLoading ? <p className="mt-6 text-sm text-ink/60">Loading order form...</p> : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="card p-5">
            <h2 className="font-display text-xl font-bold">1. Customer</h2>
            <label className="mt-4 block text-sm font-semibold">Choose customer
              <select required value={customerId} onChange={(event) => setCustomerId(event.target.value)} className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-4 text-base">
                <option value="">Select customer</option>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.phone}</option>)}
              </select>
            </label>
            {!customers.length && <Link to="/admin/customers/new" className="mt-4 inline-flex text-sm font-semibold text-maroon underline">Add a customer first</Link>}
          </div>
          <div className="card space-y-5 p-5">
            <div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">2. Items</h2><span className="text-sm text-ink/55">{items.length} item{items.length > 1 ? 's' : ''}</span></div>
            {items.map((item, index) => (
              <div key={index} className="rounded-card border border-paper-dim p-4">
                <p className="text-sm font-bold text-maroon">Item {index + 1}</p>
                <label className="mt-3 block text-sm font-semibold">Service
                  <select required value={item.serviceId} onChange={(event) => chooseService(index, event.target.value)} className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-4 text-base"><option value="">Select service</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name} · ₹{service.defaultPrice}</option>)}</select>
                </label>
                <label className="mt-3 block text-sm font-semibold">Description
                  <input value={item.description} onChange={(event) => updateItem(index, 'description', event.target.value)} className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-4 text-base" placeholder="Alteration details" />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <label className="text-sm font-semibold">Priority<select value={item.priority} onChange={(event) => updateItem(index, 'priority', event.target.value as Priority)} className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-3 text-base"><option value="NORMAL">Normal</option><option value="URGENT">Urgent (+15%)</option><option value="SAME_DAY">Same day (+30%)</option></select></label>
                  <label className="text-sm font-semibold">Price<input type="number" min="0" required value={item.price} onChange={(event) => updateItem(index, 'price', Number(event.target.value))} className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-3 text-base" /></label>
                  <label className="text-sm font-semibold">Delivery<input type="date" required value={item.expectedDeliveryDate} onChange={(event) => updateItem(index, 'expectedDeliveryDate', event.target.value)} className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-3 text-base" /></label>
                </div>
                <p className="mt-3 text-xs text-ink/60">Priority charge: ₹{getPriorityCharge(item.price, item.priority)} ({PRIORITY_RATES[item.priority]}% of ₹{item.price}). Customer item total: ₹{item.price + getPriorityCharge(item.price, item.priority)}.</p>
                {items.length > 1 && <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="mt-3 text-sm font-semibold text-alert underline">Remove item</button>}
              </div>
            ))}
            <button type="button" onClick={() => setItems((current) => [...current, blankItem()])} className="btn-secondary w-full">+ Add another item</button>
          </div>
          <div className="card p-5"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">3. Cloth photos</h2><span className="text-sm text-ink/55">{photos.length}/3 attached</span></div><p className="mt-2 text-sm text-ink/60">Photos are temporary. They are embedded in the PDF/share only and never saved to Firebase.</p><label className="btn-secondary mt-4 w-full cursor-pointer">+ Add photo<input type="file" accept="image/*" capture="environment" multiple onChange={handlePhotos} className="sr-only" disabled={photos.length >= 3} /></label>{photos.length > 0 && <div className="mt-4 grid grid-cols-3 gap-3">{photos.map((photo, index) => <div key={photo} className="relative"><img src={photo} alt={`Cloth reference ${index + 1}`} className="aspect-square w-full rounded-card object-cover" /><button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))} className="absolute right-1 top-1 rounded-full bg-ink px-2 py-1 text-xs text-white">×</button></div>)}</div>}</div>
          <div className="card p-5"><label className="block text-sm font-semibold">Order notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="mt-2 w-full rounded-card border border-ink/20 bg-white p-3 text-base" /></label></div>
          <div className="card p-5"><h2 className="font-display text-xl font-bold">Order total</h2><div className="mt-3 space-y-2 text-sm"><p className="flex justify-between"><span>Item subtotal</span><strong>₹{subtotal}</strong></p><p className="flex justify-between"><span>Priority charges</span><strong>₹{priorityCharge}</strong></p><p className="flex justify-between border-t border-paper-dim pt-2 text-base"><span>Total</span><strong>₹{subtotal + priorityCharge}</strong></p></div><p className="mt-3 text-xs text-ink/60">Urgent adds 15% and Same day adds 30% to that item&apos;s base price. You can review the PDF before sharing.</p></div>
          {message && <p role="alert" className="rounded-card bg-alert/10 p-4 text-sm text-alert-dark">{message}</p>}
          <button type="submit" disabled={isSaving} className="btn-primary sticky bottom-16 w-full md:static">{isSaving ? 'Saving order...' : 'Create order'}</button>
        </form>
      )}
    </section>
  );
}