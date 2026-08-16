import { Order, PaymentStatus, ShippingAddress, PaymentMethod, OrderItem } from '../types';
import { isFirebaseConfigured, db } from '../firebase/config';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { reduceProductStock } from './productService';
import { clearCart } from './cartService';

const LOCAL_ORDERS_KEY = 'ecom_orders_store';

function normalizeOrder(order: Order): Order {
  return {
    ...order,
    orderStatus: 'success'
  };
}

function getLocalOrders(): Order[] {
  const stored = localStorage.getItem(LOCAL_ORDERS_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as Order[];
    return parsed.map(normalizeOrder);
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: Order[]) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
}

export async function createOrder(
  userId: string,
  customerName: string,
  customerEmail: string,
  items: OrderItem[],
  subtotal: number,
  shippingFee: number,
  shippingAddress: ShippingAddress,
  paymentMethod: PaymentMethod
): Promise<Order> {
  if (items.length === 0) {
    throw new Error('Cannot place an order with an empty cart.');
  }

  // Verify and reduce product stock safely
  for (const item of items) {
    await reduceProductStock(item.productId, item.quantity);
  }

  const orderId = `ORD-${Date.now()}`;
  const now = new Date().toISOString();
  const total = subtotal + shippingFee;

  const newOrder: Order = {
    id: orderId,
    userId,
    customerName,
    customerEmail,
    items,
    subtotal,
    shippingFee,
    total,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'success',
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'orders', orderId), newOrder);
  } else {
    const orders = getLocalOrders();
    orders.unshift(newOrder);
    saveLocalOrders(orders);
  }

  // Clear customer cart after placement
  await clearCart(userId);

  return newOrder;
}

export async function getCustomerOrders(userId: string): Promise<Order[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const all = snap.docs.map((d) => normalizeOrder({ id: d.id, ...d.data() } as Order));
      return all
        .filter((o) => o.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.warn('Firestore fetch customer orders error:', err);
    }
  }

  return getLocalOrders()
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllOrders(): Promise<Order[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      return snap.docs
        .map((d) => normalizeOrder({ id: d.id, ...d.data() } as Order))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.warn('Firestore fetch all orders error:', err);
    }
  }

  return getLocalOrders().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (snap.exists()) {
        return normalizeOrder({ id: snap.id, ...snap.data() } as Order);
      }
    } catch (err) {
      console.warn('Firestore fetch single order error:', err);
    }
  }

  const orders = getLocalOrders();
  return orders.find((o) => o.id === orderId) || null;
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<Order> {
  const now = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, 'orders', orderId), { paymentStatus, updatedAt: now });
    const updated = await getOrderById(orderId);
    if (!updated) throw new Error('Order not found.');
    return updated;
  }

  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    orders[idx].paymentStatus = paymentStatus;
    orders[idx].updatedAt = now;
    saveLocalOrders(orders);
    return orders[idx];
  }

  throw new Error('Order not found.');
}
