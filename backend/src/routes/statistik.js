import { Router } from "express";
import { getAll } from "../db/store.js";

const router = Router();

router.get("/", (req, res) => {
  const booking = getAll("booking");
  const servis = getAll("servis");
  const mogok = getAll("mogok");
  const omzet = servis.filter((item) => item.status === "Selesai").reduce((total, item) => total + Number(item.biaya || 0), 0);
  res.json({
    totalBooking: booking.length,
    totalServis: servis.length,
    totalMogok: mogok.length,
    omzet
  });
});

export default router;
