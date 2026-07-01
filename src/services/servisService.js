import { generateId, getCollection, insertItem, updateItem } from "../utils/storage.js";
import { getBookingById, updateBooking } from "./bookingService.js";
import { getLayanan } from "./layananService.js";
import { upsertPembayaranFromServis } from "./pembayaranService.js";

export const servisStatus = ["Menunggu Pengerjaan", "Dikerjakan", "Selesai"];

export function getServis() {
  return getCollection("servis");
}

export function getServisById(id) {
  return getServis().find((item) => item.id === id);
}

export function getServisByBooking(bookingId) {
  return getServis().find((item) => item.bookingId === bookingId);
}

export function createServisFromBooking(bookingId, patch = {}) {
  const existing = getServisByBooking(bookingId);
  if (existing) return patch && Object.keys(patch).length ? updateServis(existing.id, patch) : existing;

  const booking = getBookingById(bookingId);
  if (!booking) throw new Error("Data booking tidak ditemukan.");

  const layanan = getLayanan().find((item) => item.id === booking.layananId);
  const status = patch.status || "Menunggu Pengerjaan";
  const progress = status === "Selesai" ? 100 : status === "Dikerjakan" ? 25 : 0;

  const item = {
    id: generateId("SRV"),
    bookingId: booking.id,
    pelangganId: booking.pelangganId || "",
    nama: booking.nama,
    phone: booking.phone,
    kendaraan: booking.kendaraan,
    plat: booking.plat,
    layanan: booking.layanan,
    mekanik: patch.mekanik || "Belum ditentukan",
    status,
    progress: Number(patch.progress ?? progress),
    biaya: Number(patch.biaya ?? layanan?.harga ?? 0),
    catatan: patch.catatan || "",
    createdAt: new Date().toISOString()
  };

  const nextBookingStatus = status === "Selesai" ? "Selesai" : status === "Dikerjakan" ? "Dikerjakan" : "Diverifikasi";
  updateBooking(bookingId, { status: nextBookingStatus });
  const created = insertItem("servis", item);
  if (status === "Selesai") upsertPembayaranFromServis(created);
  return created;
}

export function updateServis(id, payload) {
  const current = getServisById(id);
  if (!current) return null;

  const requestedStatus = payload.status ?? current.status;
  const progressFromPayload = Number(payload.progress ?? current.progress ?? 0);
  const progress = requestedStatus === "Selesai"
    ? 100
    : requestedStatus === "Dikerjakan"
      ? Math.max(progressFromPayload, 25)
      : progressFromPayload;

  const next = updateItem("servis", id, {
    ...current,
    ...payload,
    status: requestedStatus,
    progress: Math.min(100, Math.max(0, Number(progress || 0))),
    biaya: Number(payload.biaya ?? current.biaya ?? 0)
  });

  if (next?.bookingId) {
    const statusBooking = requestedStatus === "Selesai"
      ? "Selesai"
      : requestedStatus === "Dikerjakan"
        ? "Dikerjakan"
        : "Diverifikasi";
    updateBooking(next.bookingId, { status: statusBooking });
  }

  if (requestedStatus === "Selesai") upsertPembayaranFromServis(next);
  return next;
}
