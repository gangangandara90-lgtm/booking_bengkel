import { Router } from "express";
import { getAll, insert, makeId } from "../db/store.js";

const router = Router();

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

router.post("/login", (req, res) => {
  const { username, password, role = "admin" } = req.body;
  const normalizedUsername = normalize(username);
  const normalizedPassword = String(password || "").trim();

  if (role === "pelanggan") {
    const pelanggan = getAll("pelanggan").find((item) =>
      normalize(item.username) === normalizedUsername || normalize(item.phone) === normalizedUsername
    );

    if (pelanggan && String(pelanggan.password || "").trim() === normalizedPassword) {
      return res.json({
        user: {
          id: pelanggan.id,
          name: pelanggan.nama,
          username: pelanggan.username || pelanggan.phone,
          phone: pelanggan.phone,
          foto: pelanggan.foto || "",
          role: "pelanggan",
          token: "local-customer-token"
        }
      });
    }

    return res.status(401).json({ message: "Username atau password pelanggan salah." });
  }

  const admins = getAll("admins");
  const admin = admins.find((item) => normalize(item.username) === normalizedUsername) || {
    id: "ADM-DEFAULT",
    nama: "Admin Bengkel",
    username: "admin",
    password: "admin123"
  };

  if (admin && String(admin.password || "").trim() === normalizedPassword) {
    return res.json({
      user: {
        id: admin.id,
        name: admin.nama || "Admin Bengkel",
        username: admin.username,
        role: "admin",
        token: "local-admin-token"
      }
    });
  }

  return res.status(401).json({ message: "Username atau password admin salah." });
});

router.post("/register", (req, res) => {
  const { username, phone } = req.body;
  const exists = getAll("pelanggan").some((item) =>
    normalize(item.username) === normalize(username) || normalize(item.phone) === normalize(phone)
  );

  if (exists) return res.status(409).json({ message: "Akun pelanggan sudah terdaftar." });

  const pelanggan = insert("pelanggan", {
    id: makeId("CUS"),
    username: username || phone,
    foto: "",
    ...req.body,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ user: { ...pelanggan, name: pelanggan.nama, role: "pelanggan" } });
});

export default router;
