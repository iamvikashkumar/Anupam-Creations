import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase/firebase';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  flat: string;
  address: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CustomerInput {
  name: string;
  phone: string;
  flat: string;
  address: string;
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  if (phone.trim().startsWith('+')) return `+${digits}`;
  return digits;
}

export function isValidIndianMobile(phone: string) {
  return /^\+91\d{10}$/.test(normalizePhone(phone));
}

function requireDb() {
  if (!firestoreDb) throw new Error('Firebase is not configured.');
  return firestoreDb;
}

function toCustomer(id: string, data: DocumentData): Customer {
  return {
    id,
    name: String(data.name ?? ''),
    phone: String(data.phone ?? ''),
    flat: String(data.flat ?? ''),
    address: String(data.address ?? ''),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function listCustomers() {
  const snapshot = await getDocs(collection(requireDb(), 'customers'));
  return snapshot.docs
    .map((document) => toCustomer(document.id, document.data()))
    .sort((first, second) => first.name.localeCompare(second.name));
}

export async function findCustomerByPhone(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  const snapshot = await getDocs(
    query(collection(requireDb(), 'customers'), where('phone', '==', normalizedPhone), limit(1)),
  );
  const document = snapshot.docs[0];
  return document ? toCustomer(document.id, document.data()) : null;
}

export async function getCustomer(customerId: string) {
  const customers = await listCustomers();
  return customers.find((customer) => customer.id === customerId) ?? null;
}

export async function createCustomer(input: CustomerInput) {
  const normalizedPhone = normalizePhone(input.phone);
  const existingCustomer = await findCustomerByPhone(normalizedPhone);
  if (existingCustomer) throw new Error('DUPLICATE_CUSTOMER');

  const reference = await addDoc(collection(requireDb(), 'customers'), {
    name: input.name.trim(),
    phone: normalizedPhone,
    flat: input.flat.trim(),
    address: input.address.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return reference.id;
}

export async function updateCustomer(customerId: string, input: CustomerInput) {
  const normalizedPhone = normalizePhone(input.phone);
  const existingCustomer = await findCustomerByPhone(normalizedPhone);
  if (existingCustomer && existingCustomer.id !== customerId) {
    throw new Error('DUPLICATE_CUSTOMER');
  }

  await updateDoc(doc(requireDb(), 'customers', customerId), {
    name: input.name.trim(),
    phone: normalizedPhone,
    flat: input.flat.trim(),
    address: input.address.trim(),
    updatedAt: serverTimestamp(),
  });
}