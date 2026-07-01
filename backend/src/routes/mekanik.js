import express from "express";
import { getAll, insert, makeId, remove, update } from "../db/store.js";

const router = express.Router();

router.get("/", (req, res) => res.json(getAll("mekanik")));

router.post("/", (req, res) => {
  const item = {
    id: makeId("MEK"),
    status: "Aktif",
    jumlahTugas: 0,
    rating: 4.7,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.status(201).json(insert("mekanik", item));
});

router.put("/:id", (req, res) => res.json(update("mekanik", req.params.id, req.body)));
router.delete("/:id", (req, res) => {
  remove("mekanik", req.params.id);
  res.json({ message: "Mekanik berhasil dihapus." });
});

export default router;
