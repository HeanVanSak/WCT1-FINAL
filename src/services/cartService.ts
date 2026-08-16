import { CartItem, Product } from '../types';
import { isFirebaseConfigured, db } from '../firebase/config';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const getCartStorageKey = (userId: string) => `ecom_cart_${userId || 'guest'}`;

function getLocalCart(userId: string): CartItem[] {
  const key = getCartStorageKey(userId);
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveLocalCart(userId: string, items: CartItem[]) {
  const key = getCartStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(items));
}

export async function getCart(userId: string): Promise<CartItem[]> {
  if (isFirebaseConfigured && db && userId) {
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'cartItems'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CartItem));
    } catch (err) {
      console.warn('Firestore cart fetch error:', err);
    }
  }
  return getLocalCart(userId);
}

export async function addToCart(userId: string, product: Product, quantity: number = 1): Promise<CartItem[]> {
  const currentItems = await getCart(userId);
  const existingIndex = currentItems.findIndex((item) => item.productId === product.id);

  let updatedItems: CartItem[];

  if (existingIndex !== -1) {
    const existingItem = currentItems[existingIndex];
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new Error(`Cannot add more. Stock limit reached (${product.stock} available).`);
    }

    const updatedItem = { ...existingItem, quantity: newQuantity };
    if (isFirebaseConfigured && db && userId) {
      await updateDoc(doc(db, 'users', userId, 'cartItems', existingItem.id), { quantity: newQuantity });
    }
    updatedItems = [...currentItems];
    updatedItems[existingIndex] = updatedItem;
  } else {
    if (quantity > product.stock) {
      throw new Error(`Cannot add. Stock limit reached (${product.stock} available).`);
    }

    const cartItemId = `cart-${Date.now()}`;
    const newItem: CartItem = {
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      addedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db && userId) {
      await setDoc(doc(db, 'users', userId, 'cartItems', cartItemId), newItem);
    }
    updatedItems = [...currentItems, newItem];
  }

  saveLocalCart(userId, updatedItems);
  return updatedItems;
}

export async function updateCartQuantity(userId: string, cartItemId: string, quantity: number, maxStock: number): Promise<CartItem[]> {
  if (quantity < 1) return removeFromCart(userId, cartItemId);
  if (quantity > maxStock) {
    throw new Error(`Requested quantity exceeds available stock (${maxStock}).`);
  }

  const currentItems = await getCart(userId);
  const updatedItems = currentItems.map((item) =>
    item.id === cartItemId ? { ...item, quantity } : item
  );

  if (isFirebaseConfigured && db && userId) {
    await updateDoc(doc(db, 'users', userId, 'cartItems', cartItemId), { quantity });
  }

  saveLocalCart(userId, updatedItems);
  return updatedItems;
}

export async function removeFromCart(userId: string, cartItemId: string): Promise<CartItem[]> {
  const currentItems = await getCart(userId);
  const updatedItems = currentItems.filter((item) => item.id !== cartItemId);

  if (isFirebaseConfigured && db && userId) {
    await deleteDoc(doc(db, 'users', userId, 'cartItems', cartItemId));
  }

  saveLocalCart(userId, updatedItems);
  return updatedItems;
}

export async function clearCart(userId: string): Promise<void> {
  const currentItems = await getCart(userId);
  if (isFirebaseConfigured && db && userId) {
    for (const item of currentItems) {
      await deleteDoc(doc(db, 'users', userId, 'cartItems', item.id));
    }
  }
  localStorage.removeItem(getCartStorageKey(userId));
}
