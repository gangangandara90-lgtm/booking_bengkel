import { Router } from "express";
import { findById, getAll, insert, makeId, remove, update } from "../db/store.js";

const router = Router();

router.get("/", (req, res) => res.json(getAll("pelanggan")));
router.get("/:id", (req, res) => {
  const item = findById("pelanggan", req.params.id);
  if (!item) return res.status(404).json({ message: "Pelanggan tidak ditemukan." });
  res.json(item);
});
router.post("/", (req, res) => res.status(201).json(insert("pelanggan", {
  id: makeId("CUS"),
  ...req.body,
  createdAt: new Date().toISOString()
})));
router.put("/:id", (req, res) => res.json(update("pelanggan", req.params.id, req.body)));
router.delete("/:id", (req, res) => { remove("pelanggan", req.params.id); res.status(204).send(); });

export default router;
