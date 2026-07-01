import { generateId, getCollection, insertItem, removeItem, updateItem } from "../utils/storage.js";
import { normalizePhone } from "../utils/format.js";

export function getPelanggan() {
  return getCollection("pelanggan");
}

export function getPelangganById(id) {
  return getPelanggan().find((item) => item.id === id);
}

export function findPelangganByPhone(phone) {
  const normalized = normalizePhone(phone);
  return getPelanggan().find((item) => normalizePhone(item.phone) === normalized);
}

export function findPelangganByUsername(username) {
  const normalized = String(username || "").trim().toLowerCase();
  return getPelanggan().find((item) => String(item.username || "").toLowerCase() === normalized);
}

export function createPelanggan(payload) {
  const existsByPhone = findPelangganByPhone(payload.phone);
  if (existsByPhone) return existsByPhone;

  const username = payload.username || normalizePhone(payload.phone);
  const existsByUsername = findPelangganByUsername(username);
  if (existsByUsername) return existsByUsername;

  return insertItem("pelanggan", {
    id: generateId("CUS"),
    username,
    password: payload.password || normalizePhone(payload.phone),
    alamat: payload.alamat || "",
    foto: payload.foto || "",
    ...payload,
    createdAt: new Date().toISOString()
  });
}

export function updatePelanggan(id, payload) {
  return updateItem("pelanggan", id, payload);
}

export function deletePelanggan(id) {
  removeItem("pelanggan", id);
}
