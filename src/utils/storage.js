import { seedData } from "../data/seedData.js";
import { deleteItemFromFirebase, saveCollectionToFirebase } from "../services/firebaseStore.js";

export const STORAGE_KEY = "booking_bengkel_state";
const AUTH_KEY = "booking_bengkel_user";
const VERSION_KEY = "booking_bengkel_state_version";
const CURRENT_VERSION = "3.0.0-firebase";

function clone(value) {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

const fallbackState = clone(seedData);
export const collectionNames = Object.keys(fallbackState);

function normalizeState(input) {
  const parsed = input && typeof input === "object" ? input : {};
  const next = {};

  collectionNames.forEach((collection) => {
    next[collection] = Array.isArray(parsed[collection]) ? parsed[collection] : clone(fallbackState[collection]);
  });

  return next;
}

function notifyDataUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("booking-bengkel-updated"));
  }
}

function queueFirebaseSync(collection, rows) {
  if (typeof window === "undefined") return;
  saveCollectionToFirebase(collection, rows).catch((error) => {
    console.warn(`Sinkronisasi Firebase untuk ${collection} gagal:`, error);
  });
}

export function ensureSeedData() {
  if (typeof window === "undefined") return;

  const current = window.localStorage.getItem(STORAGE_KEY);
  if (!current) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
    window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    return;
  }

  try {
    const parsed = JSON.parse(current);
    const normalized = normalizeState(parsed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
    window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }
}

export function getState() {
  if (typeof window === "undefined") return fallbackState;
  ensureSeedData();
  try {
    return normalizeState(JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || fallbackState);
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
    return fallbackState;
  }
}

export function saveState(nextState, options = {}) {
  if (typeof window === "undefined") return nextState;
  const normalized = normalizeState(nextState);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  if (!options.silent) notifyDataUpdate();
  return normalized;
}

export function getCollection(name) {
  return getState()[name] || [];
}

export function setCollection(name, rows, options = {}) {
  const state = getState();
  const normalizedRows = Array.isArray(rows) ? rows : [];
  const next = saveState({ ...state, [name]: normalizedRows }, options);
  if (!options.skipFirebase) queueFirebaseSync(name, next[name]);
  return next;
}

export function insertItem(collection, item) {
  const rows = getCollection(collection);
  setCollection(collection, [item, ...rows]);
  return item;
}

export function updateItem(collection, id, patch) {
  const rows = getCollection(collection).map((row) =>
    row.id === id ? { ...row, ...patch, updatedAt: patch?.updatedAt || row.updatedAt || new Date().toISOString() } : row
  );
  setCollection(collection, rows);
  return rows.find((row) => row.id === id) || null;
}

export function removeItem(collection, id) {
  const rows = getCollection(collection).filter((row) => row.id !== id);
  setCollection(collection, rows);
  deleteItemFromFirebase(collection, id).catch((error) => {
    console.warn(`Gagal menghapus ${collection}/${id} dari Firebase:`, error);
  });
}

export function generateId(prefix) {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replaceAll("-", "");
  const time = now.getTime().toString().slice(-5);
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${date}-${time}${random}`;
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    window.localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function storeUser(user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}

export function resetDemoData() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
  window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  collectionNames.forEach((name) => queueFirebaseSync(name, fallbackState[name]));
  notifyDataUpdate();
}
