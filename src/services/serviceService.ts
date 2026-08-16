import { ServiceItem } from '../types';
import { isFirebaseConfigured, db } from '../firebase/config';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function getServices(): Promise<ServiceItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'services'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceItem);
    } catch (err) {
      console.warn('Firestore services fetch error:', err);
      return [];
    }
  }
  return [];
}

export async function createService(
  data: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServiceItem> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }
  const newId = `srv-${Date.now()}`;
  const now = new Date().toISOString();
  const service: ServiceItem = {
    ...data,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'services', newId), service);
  return service;
}

export async function updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }
  const now = new Date().toISOString();
  const patch = { ...data, updatedAt: now };

  await updateDoc(doc(db, 'services', id), patch);
  const updated = (await getServices()).find((s) => s.id === id);
  if (!updated) {
    throw new Error('Service not found after update.');
  }
  return updated;
}

export async function deleteService(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }
  await deleteDoc(doc(db, 'services', id));
}
