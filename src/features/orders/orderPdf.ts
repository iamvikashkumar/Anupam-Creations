import { jsPDF } from 'jspdf';
import type { Customer } from '@/features/customers/customerService';
import type { OrderItemInput } from '@/features/orders/orderService';
import { PRIORITY_RATES } from '@/features/orders/orderService';

interface ReceiptInput {
  orderNumber: string;
  customer: Customer;
  items: OrderItemInput[];
  notes: string;
  photos: string[];
  subtotal: number;
  priorityCharge: number;
  totalAmount: number;
}

const money = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

export function createOrderPdf(input: ReceiptInput) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 18;
  pdf.setTextColor('#A6205A');
  pdf.setFontSize(20);
  pdf.text('ANUPAM CREATIONS', 18, y);
  y += 7;
  pdf.setTextColor('#3B1C2E');
  pdf.setFontSize(10);
  pdf.text('Tailoring • Alteration • Customisation', 18, y);
  y += 12;
  pdf.setFontSize(12);
  pdf.text(`Order: ${input.orderNumber}`, 18, y);
  y += 6;
  pdf.setFontSize(10);
  pdf.text(`Customer: ${input.customer.name}`, 18, y);
  pdf.text(`Phone: ${input.customer.phone}`, 110, y);
  y += 5;
  pdf.text(`Flat: ${input.customer.flat || 'Not added'}`, 18, y);
  y += 10;
  pdf.setDrawColor('#D9C8C2');
  pdf.line(18, y, 192, y);
  y += 8;
  input.items.forEach((item, index) => {
    const priorityText = item.priority === 'NORMAL' ? 'Normal' : `${item.priority === 'URGENT' ? 15 : 30}% premium`;
    pdf.setFontSize(10);
    pdf.text(`${index + 1}. ${item.serviceName}`, 18, y);
    pdf.text(money(item.price), 155, y);
    y += 5;
    pdf.setFontSize(9);
    pdf.setTextColor('#665A56');
    pdf.text(`${item.description || 'No description'} • ${priorityText} • Due ${item.expectedDeliveryDate}`, 22, y);
    pdf.setTextColor('#3B1C2E');
    y += 8;
  });
  pdf.line(18, y, 192, y);
  y += 7;
  pdf.text(`Subtotal: ${money(input.subtotal)}`, 125, y);
  y += 5;
  pdf.text(`Priority charges: ${money(input.priorityCharge)}`, 125, y);
  y += 6;
  pdf.setFontSize(12);
  pdf.text(`TOTAL: ${money(input.totalAmount)}`, 125, y);
  y += 10;
  if (input.notes) {
    pdf.setFontSize(10);
    pdf.text(`Notes: ${input.notes}`, 18, y, { maxWidth: 174 });
    y += 10;
  }
  if (input.photos.length) {
    pdf.setFontSize(11);
    pdf.text('Cloth reference photos', 18, y);
    y += 5;
    input.photos.forEach((photo) => {
      if (y > 250) { pdf.addPage(); y = 18; }
      pdf.addImage(photo, 'JPEG', 18, y, 52, 40, undefined, 'FAST');
      y += 44;
    });
  }
  pdf.setFontSize(9);
  pdf.setTextColor('#665A56');
  pdf.text('Thank you for choosing Anupam Creations. Please check the fitting on delivery.', 18, 282);
  return pdf;
}

export function buildWhatsAppMessage(input: ReceiptInput) {
  const itemLines = input.items.map((item, index) => `${index + 1}. ${item.serviceName} - ${money(item.price)} (${item.priority === 'NORMAL' ? 'Normal' : `${PRIORITY_RATES[item.priority]}% premium`})`).join('\n');
  return `Hello ${input.customer.name},\n\nThank you for choosing Anupam Creations.\n\nOrder ID: ${input.orderNumber}\n${itemLines}\n\nTotal: ${money(input.totalAmount)}\nPlease find your order confirmation PDF attached.\n\nThank you,\nAnupam Creations`;
}