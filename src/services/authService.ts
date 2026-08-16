import { UserProfile } from '../types';
import { isFirebaseConfigured, auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

const LOCAL_USERS_KEY = 'ecom_users_store';
const LOCAL_CURRENT_USER_KEY = 'ecom_current_user_id';

const USERS: UserProfile[] = [
  {
    uid: 'admin-uid',
    name: 'Hean VanSak',
    email: 'heanvansak27737@gmail.com',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'customer',
    name: 'John Customer',
    email: 'john@example.com',
    role: 'customer',
    password: 'demo123',
    createdAt: new Date().toISOString()
  }
];

function getLocalUsers(): UserProfile[] {
  const stored = localStorage.getItem(LOCAL_USERS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(USERS));
    return USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return USERS;
  }
}

function saveLocalUsers(users: UserProfile[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'USERS', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Firestore user fetch failed, checking local:', err);
    }
  }

  const users = getLocalUsers();
  return users.find((u) => u.uid === uid) || null;
}

export async function registerUser(name: string, email: string, pass: string): Promise<UserProfile> {
  if (isFirebaseConfigured && auth && db) {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const userProfile: UserProfile = {
      uid: cred.user.uid,
      name,
      email,
      role: 'customer',
      password: pass,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'USERS', cred.user.uid), userProfile);
    return userProfile;
  }

  // Local fallback
  const users = getLocalUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }

  const userProfile: UserProfile = {
    uid: `user-${Date.now()}`,
    name,
    email,
    role: 'customer',
    password: pass,
    createdAt: new Date().toISOString()
  };

  users.push(userProfile);
  saveLocalUsers(users);
  localStorage.setItem(LOCAL_CURRENT_USER_KEY, userProfile.uid);
  return userProfile;
}

export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  if (isFirebaseConfigured && auth) {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await getUserProfile(cred.user.uid);
    if (!profile) {
      throw new Error('User record not found in Firestore database.');
    }
    return profile;
  }

  // Local fallback
  const users = getLocalUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!found) {
    throw new Error('Invalid email or password.');
  }

  localStorage.setItem(LOCAL_CURRENT_USER_KEY, found.uid);
  return found;
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem(LOCAL_CURRENT_USER_KEY);
}

export async function resetPassword(email: string): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await sendPasswordResetEmail(auth, email);
    return;
  }
  const users = getLocalUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!exists) {
    throw new Error('No user registered with that email address.');
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const updatedData = { ...data, updatedAt: new Date().toISOString() };
  if (isFirebaseConfigured && db) {
    const userRef = doc(db, 'USERS', uid);
    await updateDoc(userRef, updatedData);
    const refreshed = await getUserProfile(uid);
    return refreshed!;
  }

  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.uid === uid);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updatedData };
    saveLocalUsers(users);
    return users[idx];
  }
  throw new Error('User not found.');
}

export async function setAdminRole(uid: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, 'USERS', uid), { role: 'admin' });
    return;
  }
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.uid === uid);
  if (idx !== -1) {
    users[idx].role = 'admin';
    saveLocalUsers(users);
  }
}

export async function getAllCustomers(): Promise<UserProfile[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'USERS'));
      if (!snapshot.empty) {
        const firestoreUsers = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        } as UserProfile));
        // Cache in localStorage for offline/fallback
        saveLocalUsers(firestoreUsers);
        return firestoreUsers;
      }
    } catch (err) {
      console.warn('Firestore users fetch error, using local:', err);
    }
  }
  return getLocalUsers();
}

export function subscribeAuth(callback: (user: UserProfile | null) => void): () => void {
  if (isFirebaseConfigured && auth) {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        callback(profile);
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  }

  const checkCurrent = async () => {
    const curId = localStorage.getItem(LOCAL_CURRENT_USER_KEY);
    if (curId) {
      const profile = await getUserProfile(curId);
      callback(profile);
    } else {
      callback(null);
    }
  };

  checkCurrent();
  const interval = setInterval(checkCurrent, 1000);
  return () => clearInterval(interval);
}
