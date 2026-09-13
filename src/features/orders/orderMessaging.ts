import type { Order, OrderStatus } from '@/features/orders/orderService';
import { displayOrderStatus } from '@/features/orders/orderService';

export function orderStatusMessage(order: Order, status: OrderStatus) {
  return `Hello ${order.customerName},\n\nUpdate for order ${order.orderNumber}: ${displayOrderStatus(status)}.\n\nThank you,\nAnupam Creations`;
}

export function openWhatsAppMessage(phone: string, message: string) {
  window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}