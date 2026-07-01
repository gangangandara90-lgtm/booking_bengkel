import { Router } from "express";
import { findById, getAll, insert, makeId, update } from "../db/store.js";

const router = Router();

router.get("/", (req, res) => res.json(getAll("booking")));
router.post("/", (req, res) => {
  const layanan = findById("layanan", req.body.layananId);
  const item = {
    id: makeId("BK"),
    ...req.body,
    layanan: layanan?.nama || req.body.layanan || "Layanan Bengkel",
    status: "Menunggu Verifikasi",
    catatanAdmin: "",
    createdAt: new Date().toISOString()
  };
  res.status(201).json(insert("booking", item));
});
router.put("/:id", (req, res) => res.json(update("booking", req.params.id, req.body)));

export default router;
