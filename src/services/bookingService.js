import { generateId, getCollection, insertItem, updateItem } from "../utils/storage.js";
import { getLayananById } from "./layananService.js";

export const bookingStatus = [
  "Menunggu Verifikasi",
  "Diverifikasi",
  "Ditolak",
  "Dikerjakan",
  "Selesai"
];

export function getBookings() {
  return getCollection("booking");
}

export function getBookingById(id) {
  return getBookings().find((item) => item.id === id);
}

export function createBooking(payload) {
  const layanan = getLayananById(payload.layananId);
  const item = {
    id: generateId("BK"),
    pelangganId: payload.pelangganId || "",
    nama: payload.nama,
    phone: payload.phone,
    kendaraan: payload.kendaraan,
    plat: payload.plat,
    layananId: payload.layananId,
    layanan: layanan?.nama || payload.layanan || "Layanan Bengkel",
    tanggal: payload.tanggal,
    jam: payload.jam,
    keluhan: payload.keluhan,
    status: "Menunggu Verifikasi",
    catatanAdmin: "",
    createdAt: new Date().toISOString()
  };
  return insertItem("booking", item);
}

export function updateBooking(id, payload) {
  return updateItem("booking", id, payload);
}

export function searchBooking(keyword) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return [];
  return getBookings().filter((booking) =>
    [booking.id, booking.phone, booking.nama, booking.plat]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}
