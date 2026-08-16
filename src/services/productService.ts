import { Product } from '../types';
import { isFirebaseConfigured, db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

// 🔥 REAL-TIME LISTENER – returns all products from Firestore
export function listenToProducts(callback: (products: Product[]) => void): () => void {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
        callback(products);
      },
      (error) => {
        console.warn('Firestore real‑time error:', error);
        callback([]); // return empty array on error
      }
    );
    return unsubscribe;
  }
  // If Firebase is not configured, return empty array
  callback([]);
  return () => {};
}

// 🔥 GET (one‑time fetch) – returns all products from Firestore
export async function getProducts(): Promise<Product[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'products'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
    } catch (err) {
      console.warn('Firestore products fetch error:', err);
      return [];
    }
  }
  return [];
}

// 🔥 SINGLE PRODUCT real‑time listener
export function listenToProduct(
  id: string,
  callback: (product: Product | null) => void
): () => void {
  if (isFirebaseConfigured && db) {
    const unsub = onSnapshot(
      doc(db, 'products', id),
      (snap) => {
        if (snap.exists()) {
          callback({ id: snap.id, ...snap.data() } as Product);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.warn('Firestore single doc error:', error);
        callback(null);
      }
    );
    return unsub;
  }
  callback(null);
  return () => {};
}

// 🛠️ CRUD operations – Firestore only

export async function getProductById(id: string): Promise<Product | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'products', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Product;
      }
    } catch (err) {
      console.warn('Firestore single product fetch error:', err);
    }
  }
  return null;
}

export async function createProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }
  const newId = `prod-${Date.now()}`;
  const now = new Date().toISOString();
  const product: Product = {
    ...productData,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'products', newId), product);
  return product;
}

export async function updateProduct(
  id: string,
  productData: Partial<Product>
): Promise<Product> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }
  const now = new Date().toISOString();
  const patch = { ...productData, updatedAt: now };

  await updateDoc(doc(db, 'products', id), patch);
  const updated = await getProductById(id);
  if (!updated) {
    throw new Error('Product not found after update.');
  }
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }
  await deleteDoc(doc(db, 'products', id));
}

export async function reduceProductStock(productId: string, quantity: number): Promise<void> {
  const product = await getProductById(productId);
  if (!product) throw new Error(`Product ${productId} not found.`);
  if (product.stock < quantity) {
    throw new Error(
      `Insufficient stock for ${product.name}. Only ${product.stock} available.`
    );
  }
  await updateProduct(productId, { stock: product.stock - quantity });
}
