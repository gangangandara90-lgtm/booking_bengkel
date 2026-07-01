/* global process */
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/booking.js";
import layananRoutes from "./routes/layanan.js";
import mekanikRoutes from "./routes/mekanik.js";
import mogokRoutes from "./routes/mogok.js";
import pelangganRoutes from "./routes/pelanggan.js";
import pembayaranRoutes from "./routes/pembayaran.js";
import servisRoutes from "./routes/servis.js";
import statistikRoutes from "./routes/statistik.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ name: "Booking Bengkel API", status: "running" }));
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/pelanggan", pelangganRoutes);
app.use("/api/layanan", layananRoutes);
app.use("/api/mekanik", mekanikRoutes);
app.use("/api/servis", servisRoutes);
app.use("/api/mogok", mogokRoutes);
app.use("/api/pembayaran", pembayaranRoutes);
app.use("/api/statistik", statistikRoutes);

app.use((req, res) => res.status(404).json({ message: "Endpoint tidak ditemukan." }));

app.listen(port, () => {
  console.log(`Booking Bengkel API berjalan di http://localhost:${port}`);
});
