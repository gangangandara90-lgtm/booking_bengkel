import { Router } from "express";
import { findById, getAll, insert, makeId, update } from "../db/store.js";

const router = Router();

function syncPembayaran(servis) {
  if (!servis || servis.status !== "Selesai") return null;
  const existing = getAll("pembayaran").find((item) => item.servisId === servis.id);
  const payload = {
    servisId: servis.id,
    bookingId: servis.bookingId || "",
    pelangganId: servis.pelangganId || "",
    nama: servis.nama,
    jumlah: Number(servis.biaya || 0),
    updatedAt: new Date().toISOString()
  };

  if (existing) return update("pembayaran", existing.id, { ...existing, ...payload });

  return insert("pembayaran", {
    id: makeId("PAY"),
    ...payload,
    status: "Belum Dibayar",
    metode: "",
    bukti: "",
    catatan: "",
    createdAt: new Date().toISOString()
  });
}

router.get("/", (req, res) => res.json(getAll("servis")));
router.get("/:id", (req, res) => {
  const item = findById("servis", req.params.id);
  if (!item) return res.status(404).json({ message: "Servis tidak ditemukan." });
  res.json(item);
});

router.post("/from-booking/:bookingId", (req, res) => {
  const booking = findById("booking", req.params.bookingId);
  if (!booking) return res.status(404).json({ message: "Booking tidak ditemukan." });
  const layanan = findById("layanan", booking.layananId);
  const existing = getAll("servis").find((item) => item.bookingId === booking.id);
  if (existing) return res.json(existing);

  update("booking", booking.id, { status: "Diverifikasi" });
  const item = insert("servis", {
    id: makeId("SRV"),
    bookingId: booking.id,
    pelangganId: booking.pelangganId || "",
    nama: booking.nama,
    phone: booking.phone,
    kendaraan: booking.kendaraan,
    plat: booking.plat,
    layanan: booking.layanan,
    mekanik: "Belum ditentukan",
    status: "Menunggu Pengerjaan",
    progress: 0,
    biaya: layanan?.harga || 0,
    catatan: "",
    createdAt: new Date().toISOString()
  });
  res.status(201).json(item);
});

router.put("/:id", (req, res) => {
  const current = findById("servis", req.params.id);
  if (!current) return res.status(404).json({ message: "Servis tidak ditemukan." });

  const status = req.body.status || current.status;
  const progress = status === "Selesai" ? 100 : Number(req.body.progress ?? current.progress ?? 0);
  const next = update("servis", req.params.id, {
    ...current,
    ...req.body,
    status,
    progress,
    biaya: Number(req.body.biaya ?? current.biaya ?? 0),
    updatedAt: new Date().toISOString()
  });

  if (next.bookingId) update("booking", next.bookingId, { status: status === "Selesai" ? "Selesai" : status === "Dikerjakan" ? "Dikerjakan" : "Diverifikasi" });
  syncPembayaran(next);
  res.json(next);
});

export default router;
