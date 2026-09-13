import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase/firebase';
import type { Customer } from '@/features/customers/customerService';

export type Priority = 'NORMAL' | 'URGENT' | 'SAME_DAY';
export type OrderStatus = 'ACCEPTED' | 'IN_PROGRESS' | 'DELIVERED' | 'PAYMENT_DONE' | 'CANCELLED' | 'RECEIVED' | 'READY' | 'COLLECTED' | 'COMPLETED';

export const PRIORITY_RATES: Record<Priority, number> = {
  NORMAL: 0,
  URGENT: 15,
  SAME_DAY: 30,
};

export function getPriorityCharge(price: number, priority: Priority) {
  return Math.round(price * PRIORITY_RATES[priority] / 100);
}

export function displayOrderStatus(status: OrderStatus) {
  if (status === 'RECEIVED') return 'Accepted';
  if (status === 'READY' || status === 'COLLECTED' || status === 'COMPLETED' || status === 'DELIVERED') return 'Product delivered';
  if (status === 'PAYMENT_DONE') return 'Payment done';
  if (status === 'IN_PROGRESS') return 'Work in progress';
  return 'Cancelled';
}

export function deriveOrderStatus(items: Pick<OrderItem, 'status'>[], fallback: OrderStatus = 'ACCEPTED'): OrderStatus {
  if (!items.length) return fallback;
  const statuses = items.map((item) => item.status);
  const activeStatuses = statuses.filter((status) => status !== 'CANCELLED');
  if (!activeStatuses.length) return 'CANCELLED';
  if (activeStatuses.every((status) => status === 'PAYMENT_DONE')) return 'PAYMENT_DONE';
  if (activeStatuses.every((status) => status === 'DELIVERED' || status === 'PAYMENT_DONE')) return 'DELIVERED';
  if (activeStatuses.some((status) => status === 'IN_PROGRESS')) return 'IN_PROGRESS';
  return 'ACCEPTED';
}

export interface ServiceOption {
  id: string;
  name: string;
  defaultPrice: number;
  active: boolean;
}

export interface OrderItemInput {
  serviceId: string;
  serviceName: string;
  description: string;
  price: number;
  priority: Priority;
  expectedDeliveryDate: string;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerFlat: string;
  createdAt?: unknown;
  expectedDeliveryDate: string;
  priority: Priority;
  status: OrderStatus;
  subtotal: number;
  priorityCharge: number;
  additionalCharges: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING';
  notes: string;
}

export interface OrderItem extends OrderItemInput {
  id: string;
  itemNumber: number;
  orderId: string;
  status: OrderStatus;
}

const defaultServices = [
  ['Blouse Stitching', 500], ['Blouse Alteration', 250], ['Blouse Resizing', 300],
  ['Blouse Redesign', 600], ['Blouse Customisation', 700], ['Petticoat', 350],
  ['Fall', 100], ['Pico', 80], ['Fall + Pico', 180], ['Dress Alteration', 300],
  ['Saree Alteration', 250], ['Other', 200],
];

function requireDb() {
  if (!firestoreDb) throw new Error('Firebase is not configured.');
  return firestoreDb;
}

export async function listServices() {
  const snapshot = await getDocs(collection(requireDb(), 'services'));
  return snapshot.docs.map((item) => ({
    id: item.id,
    name: String(item.data().name ?? ''),
    defaultPrice: Number(item.data().defaultPrice ?? 0),
    active: item.data().active !== false,
  })).filter((service) => service.active).sort((first, second) => first.name.localeCompare(second.name));
}

export async function ensureDefaultServices() {
  const services = await listServices();
  const existingIds = new Set(services.map((service) => service.id));
  const missingServices = defaultServices.filter(([name]) => {
    const id = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return !existingIds.has(id);
  });
  for (const [name, defaultPrice] of missingServices) {
    const id = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await setDoc(doc(requireDb(), 'services', id), {
      name,
      defaultPrice,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return listServices();
}

function toOrder(id: string, data: DocumentData): Order {
  return {
    id, orderNumber: String(data.orderNumber ?? ''), customerId: String(data.customerId ?? ''),
    customerName: String(data.customerName ?? ''), customerPhone: String(data.customerPhone ?? ''),
    customerFlat: String(data.customerFlat ?? ''), createdAt: data.createdAt,
    expectedDeliveryDate: String(data.expectedDeliveryDate ?? ''), priority: data.priority ?? 'NORMAL',
    status: data.status ?? 'RECEIVED', subtotal: Number(data.subtotal ?? 0),
    priorityCharge: Number(data.priorityCharge ?? 0), additionalCharges: Number(data.additionalCharges ?? 0),
    discount: Number(data.discount ?? 0), totalAmount: Number(data.totalAmount ?? 0),
    paidAmount: Number(data.paidAmount ?? 0), pendingAmount: Number(data.pendingAmount ?? 0),
    paymentStatus: data.paymentStatus ?? 'PENDING', notes: String(data.notes ?? ''),
  };
}

export async function listOrders() {
  const snapshot = await getDocs(collection(requireDb(), 'orders'));
  return snapshot.docs.map((item) => toOrder(item.id, item.data())).sort((first, second) =>
    second.expectedDeliveryDate.localeCompare(first.expectedDeliveryDate));
}

export async function getOrder(orderId: string) {
  const snapshot = await getDoc(doc(requireDb(), 'orders', orderId));
  return snapshot.exists() ? toOrder(snapshot.id, snapshot.data()) : null;
}

export async function listOrderItems(orderId: string) {
  const snapshot = await getDocs(collection(requireDb(), 'orderItems'));
  return snapshot.docs.filter((item) => item.data().orderId === orderId).map((item) => ({
    id: item.id, orderId, itemNumber: Number(item.data().itemNumber ?? 0),
    serviceId: String(item.data().serviceId ?? ''), serviceName: String(item.data().serviceName ?? ''),
    description: String(item.data().description ?? ''), price: Number(item.data().price ?? 0),
    priority: item.data().priority ?? 'NORMAL', expectedDeliveryDate: String(item.data().expectedDeliveryDate ?? ''),
    notes: String(item.data().notes ?? ''), status: item.data().status ?? 'RECEIVED',
  } satisfies OrderItem)).sort((first, second) => first.itemNumber - second.itemNumber);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const db = requireDb();
  await runTransaction(db, async (transaction) => {
    transaction.update(doc(db, 'orders', orderId), { status, updatedAt: serverTimestamp() });
    const items = await getDocs(collection(db, 'orderItems'));
    items.docs.filter((item) => item.data().orderId === orderId).forEach((item) => {
      transaction.update(item.ref, { status, updatedAt: serverTimestamp() });
    });
  });
}

export async function updateOrderItemStatus(orderId: string, itemId: string, status: OrderStatus) {
  const db = requireDb();
  await runTransaction(db, async (transaction) => {
    transaction.update(doc(db, 'orderItems', itemId), { status, updatedAt: serverTimestamp() });
    const items = await getDocs(collection(db, 'orderItems'));
    const remaining = items.docs.filter((item) => item.data().orderId === orderId && item.id !== itemId);
    const nextOrderStatus = deriveOrderStatus([...remaining.map((item) => ({ status: item.data().status as OrderStatus })), { status }]);
    transaction.update(doc(db, 'orders', orderId), { status: nextOrderStatus, updatedAt: serverTimestamp() });
  });
}

export async function createOrder(customer: Customer, items: OrderItemInput[], notes: string) {
  if (!items.length) throw new Error('NO_ITEMS');
  if (items.some((item) => item.price < 0)) throw new Error('INVALID_PRICE');
  const db = requireDb();
  const orderRef = doc(collection(db, 'orders'));
  const counterRef = doc(db, 'counters', 'orders');
  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const priority = items.some((item) => item.priority === 'SAME_DAY') ? 'SAME_DAY'
    : items.some((item) => item.priority === 'URGENT') ? 'URGENT' : 'NORMAL';
  const priorityCharge = items.reduce((total, item) => total + getPriorityCharge(item.price, item.priority), 0);
  const totalAmount = subtotal + priorityCharge;

  let orderNumber = '';
  await runTransaction(db, async (transaction) => {
    const counter = await transaction.get(counterRef);
    const nextNumber = Number(counter.exists() ? counter.data().nextNumber ?? 1001 : 1001);
    transaction.set(counterRef, { nextNumber: nextNumber + 1, updatedAt: serverTimestamp() }, { merge: true });
    orderNumber = `AC-${nextNumber}`;
    transaction.set(orderRef, {
      orderNumber, customerId: customer.id, customerName: customer.name,
      customerPhone: customer.phone, customerFlat: customer.flat, createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(), expectedDeliveryDate: items.map((item) => item.expectedDeliveryDate).sort()[0],
      priority, status: 'ACCEPTED', subtotal, priorityCharge, additionalCharges: 0, discount: 0,
      totalAmount, paidAmount: 0, pendingAmount: totalAmount, paymentStatus: 'PENDING', notes,
    });
    items.forEach((item, index) => transaction.set(doc(db, 'orderItems', `${orderRef.id}-${String(index + 1).padStart(2, '0')}`), {
      ...item, id: `${orderRef.id}-${String(index + 1).padStart(2, '0')}`, orderId: orderRef.id,
      itemNumber: index + 1, status: 'ACCEPTED', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    }));
  });
  return { id: orderRef.id, orderNumber, subtotal, priorityCharge, totalAmount };
}