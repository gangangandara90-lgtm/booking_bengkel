import { Router } from "express";
import { findById, getAll, insert, makeId, remove, update } from "../db/store.js";

const router = Router();

router.get("/", (req, res) => res.json(getAll("layanan")));
router.get("/:id", (req, res) => {
  const item = findById("layanan", req.params.id);
  if (!item) return res.status(404).json({ message: "Layanan tidak ditemukan." });
  res.json(item);
});
router.post("/", (req, res) => res.status(201).json(insert("layanan", { id: makeId("LAY"), aktif: true, ...req.body, harga: Number(req.body.harga || 0) })));
router.put("/:id", (req, res) => res.json(update("layanan", req.params.id, { ...req.body, harga: Number(req.body.harga || 0) })));
router.delete("/:id", (req, res) => { remove("layanan", req.params.id); res.status(204).send(); });

export default router;
