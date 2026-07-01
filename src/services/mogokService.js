import { generateId, getCollection, insertItem, updateItem } from "../utils/storage.js";
import { getMekanikById } from "./mekanikService.js";

export const mogokStatus = ["Menunggu", "Diterima", "Dalam Perjalanan", "Selesai", "Dibatalkan"];

export function getMogok() {
  return getCollection("mogok");
}

function normalizeMechanicFields(payload) {
  const mekanik = payload.mekanikId ? getMekanikById(payload.mekanikId) : null;
  return {
    mekanikId: mekanik?.id || payload.mekanikId || "",
    mekanikNama: mekanik?.nama || payload.mekanikNama || payload.petugas || "",
    mekanikPhone: mekanik?.phone || payload.mekanikPhone || "",
    mekanikSpesialis: mekanik?.spesialis || payload.mekanikSpesialis || "",
    mekanikFoto: mekanik?.foto || payload.mekanikFoto || "",
    petugas: mekanik?.nama || payload.petugas || payload.mekanikNama || ""
  };
}

export function createMogok(payload) {
  const mechanicFields = normalizeMechanicFields(payload);

  return insertItem("mogok", {
    id: generateId("MGK"),
    ...payload,
    ...mechanicFields,
    status: "Menunggu",
    catatan: "",
    createdAt: new Date().toISOString()
  });
}

export function updateMogok(id, payload) {
  const mechanicFields = normalizeMechanicFields(payload);
  return updateItem("mogok", id, { ...payload, ...mechanicFields });
}

export function searchMogok(keyword) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return [];
  return getMogok().filter((item) =>
    [item.id, item.phone, item.nama, item.plat, item.mekanikNama]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}
