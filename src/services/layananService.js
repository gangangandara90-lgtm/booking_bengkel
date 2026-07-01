import { generateId, getCollection, insertItem, removeItem, updateItem } from "../utils/storage.js";

export function getLayanan() {
  return getCollection("layanan");
}

export function getLayananById(id) {
  return getLayanan().find((item) => item.id === id);
}

export function createLayanan(payload) {
  return insertItem("layanan", {
    id: generateId("LAY"),
    aktif: true,
    ...payload,
    harga: Number(payload.harga || 0)
  });
}

export function updateLayanan(id, payload) {
  return updateItem("layanan", id, {
    ...payload,
    harga: Number(payload.harga || 0)
  });
}

export function deleteLayanan(id) {
  removeItem("layanan", id);
}
