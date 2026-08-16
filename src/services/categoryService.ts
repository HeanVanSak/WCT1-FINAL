import { Category } from '../types';
import { isFirebaseConfigured, db } from '../firebase/config';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getProducts } from './productService';

export async function getCategories(): Promise<Category[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category);
    } catch (err) {
      console.warn('Firestore categories fetch error:', err);
      return [];
    }
  }
  return [];
}

export async function createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }
  const newId = `cat-${Date.now()}`;
  const now = new Date().toISOString();
  const category: Category = {
    ...data,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'categories', newId), category);
  return category;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }
  const now = new Date().toISOString();
  const patch = { ...data, updatedAt: now };

  await updateDoc(doc(db, 'categories', id), patch);
  const updated = (await getCategories()).find((c) => c.id === id);
  if (!updated) {
    throw new Error('Category not found after update.');
  }
  return updated;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  // Check if products are assigned to this category
  const products = await getProducts();
  const activeProducts = products.filter((p) => p.categoryId === id);
  if (activeProducts.length > 0) {
    throw new Error(
      `Cannot delete category. There are ${activeProducts.length} product(s) linked to this category.`
    );
  }

  await deleteDoc(doc(db, 'categories', id));
}
