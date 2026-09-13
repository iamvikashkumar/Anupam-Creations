import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createCustomer,
  getCustomer,
  isValidIndianMobile,
  updateCustomer,
  type CustomerInput,
} from '@/features/customers/customerService';

export default function CustomerFormPage() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const isEditing = Boolean(customerId);
  const [form, setForm] = useState<CustomerInput>({ name: '', phone: '', flat: '', address: '' });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!customerId) return;
    getCustomer(customerId)
      .then((customer) => {
        if (!customer) {
          setMessage('Customer could not be found.');
          return;
        }
        setForm({
          name: customer.name,
          phone: customer.phone,
          flat: customer.flat,
          address: customer.address,
        });
      })
      .catch(() => setMessage('Unable to load customer details.'))
      .finally(() => setIsLoading(false));
  }, [customerId]);

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    if (!isValidIndianMobile(form.phone)) {
      setMessage('Enter a valid 10-digit mobile number.');
      return;
    }
    setIsSaving(true);
    try {
      if (customerId) {
        await updateCustomer(customerId, form);
        navigate(`/admin/customers/${customerId}`);
      } else {
        const newCustomerId = await createCustomer(form);
        navigate(`/admin/customers/${newCustomerId}`);
      }
    } catch (error) {
      const errorCode = error && typeof error === 'object' && 'code' in error
        ? String(error.code)
        : '';
      setMessage(error instanceof Error && error.message === 'DUPLICATE_CUSTOMER'
        ? 'A customer with this phone number already exists.'
        : errorCode === 'permission-denied'
          ? 'Firestore permission denied. Add role: admin to your users document and publish the rules.'
          : 'Something went wrong while saving the customer. Please check your internet connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl">
      <Link to="/admin/customers" className="text-sm font-semibold text-maroon">← Customers</Link>
      <h1 className="mt-5 font-display text-3xl font-bold">
        {isEditing ? 'Edit customer' : 'New customer'}
      </h1>
      {isLoading ? (
        <p className="mt-6 text-sm text-ink/60">Loading customer...</p>
      ) : (
      <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-6">
        {(['name', 'phone', 'flat', 'address'] as const).map((field) => (
          <label key={field} className="block text-sm font-semibold capitalize">
            {field === 'flat' ? 'Flat / Apartment' : field}
            <input
              type={field === 'phone' ? 'tel' : 'text'}
              inputMode={field === 'phone' ? 'tel' : undefined}
              required={field === 'name' || field === 'phone'}
              value={form[field]}
              onChange={(event) => update(field, event.target.value)}
              className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-4 text-base"
            />
          </label>
        ))}
        {message && <p role="alert" className="rounded-card bg-alert/10 p-3 text-sm text-alert-dark">{message}</p>}
        <button type="submit" disabled={isSaving} className="btn-primary w-full">
          {isSaving ? 'Saving customer...' : isEditing ? 'Update customer' : 'Save customer'}
        </button>
      </form>
      )}
    </section>
  );
}