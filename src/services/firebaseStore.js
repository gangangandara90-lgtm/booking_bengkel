import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch
} from "firebase/firestore";
import { firestoreDb, shouldUseFirebase } from "../firebase/firebaseConfig.js";

const FIREBASE_COLLECTIONS = [
  "admins",
  "pelanggan",
  "mekanik",
  "layanan",
  "booking",
  "servis",
  "mogok",
  "pembayaran"
];

function canUseFirebase() {
  return shouldUseFirebase() && firestoreDb;
}

function cleanValue(value) {
  if (Array.isArray(value)) return value.map(cleanValue);

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, item]) => {
      if (item !== undefined) acc[key] = cleanValue(item);
      return acc;
    }, {});
  }

  return value ?? "";
}

export function isFirebaseActive() {
  return Boolean(canUseFirebase());
}

export async function getFirebaseState() {
  if (!canUseFirebase()) return null;

  const state = {};

  for (const name of FIREBASE_COLLECTIONS) {
    const snapshot = await getDocs(collection(firestoreDb, name));
    state[name] = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data()
    }));
  }

  return state;
}

export function subscribeFirebaseState(onCollectionChange) {
  if (!canUseFirebase()) return () => {};

  const unsubscribers = FIREBASE_COLLECTIONS.map((name) =>
    onSnapshot(
      collection(firestoreDb, name),
      (snapshot) => {
        const rows = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        onCollectionChange(name, rows);
      },
      (error) => {
        console.warn(`Listener Firebase ${name} gagal:`, error);
      }
    )
  );

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
}

export async function saveItemToFirebase(collectionName, item) {
  if (!canUseFirebase() || !item?.id) return;

  await setDoc(
    doc(firestoreDb, collectionName, item.id),
    cleanValue(item),
    { merge: true }
  );
}

export async function saveCollectionToFirebase(collectionName, rows, options = {}) {
  if (!canUseFirebase()) return;

  const batch = writeBatch(firestoreDb);
  const normalizedRows = Array.isArray(rows) ? rows : [];

  if (options.replace) {
    const snapshot = await getDocs(collection(firestoreDb, collectionName));
    snapshot.docs.forEach((item) => {
      batch.delete(doc(firestoreDb, collectionName, item.id));
    });
  }

  normalizedRows.forEach((item) => {
    if (!item?.id) return;

    batch.set(
      doc(firestoreDb, collectionName, item.id),
      cleanValue(item),
      { merge: true }
    );
  });

  await batch.commit();
}

export async function deleteItemFromFirebase(collectionName, id) {
  if (!canUseFirebase() || !id) return;

  await deleteDoc(doc(firestoreDb, collectionName, id));
}