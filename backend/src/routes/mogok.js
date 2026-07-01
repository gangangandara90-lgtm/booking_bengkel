import { Router } from "express";
import { getAll, insert, makeId, update } from "../db/store.js";

const router = Router();

router.get("/", (req, res) => res.json(getAll("mogok")));
router.post("/", (req, res) => res.status(201).json(insert("mogok", {
  id: makeId("MGK"),
  ...req.body,
  status: "Menunggu",
  petugas: "",
  catatan: "",
  createdAt: new Date().toISOString()
})));
router.put("/:id", (req, res) => res.json(update("mogok", req.params.id, req.body)));

export default router;
