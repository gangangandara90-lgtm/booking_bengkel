import { Router } from "express";
import { findById, getAll, insert, makeId, update } from "../db/store.js";

const router = Router();

function normalize(payload = {}, current = {}) {
  return {
    ...current,
    ...payload,
    jumlah: payload.jumlah === undefined ? Number(current.jumlah || 0) : Number(payload.jumlah || 0),
    updatedAt: new Date().toISOString()
  };
}

router.get("/", (req, res) => res.json(getAll("pembayaran")));

router.get("/:id", (req, res) => {
  const item = findById("pembayaran", req.params.id);
  if (!item) return res.status(404).json({ message: "Pembayaran tidak ditemukan." });
  res.json(item);
});

router.post("/", (req, res) => res.status(201).json(insert("pembayaran", {
  id: makeId("PAY"),
  status: "Belum Dibayar",
  metode: "",
  bukti: "",
  catatan: "",
  ...req.body,
  jumlah: Number(req.body.jumlah || 0),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})));

router.put("/:id", (req, res) => {
  const current = findById("pembayaran", req.params.id);
  if (!current) return res.status(404).json({ message: "Pembayaran tidak ditemukan." });
  res.json(update("pembayaran", req.params.id, normalize(req.body, current)));
});

export default router;
