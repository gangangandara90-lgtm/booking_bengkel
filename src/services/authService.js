import api from "./Api.js";
import { createPelanggan, findPelangganByPhone, findPelangganByUsername } from "./pelangganService.js";
import { getCollection } from "../utils/storage.js";
import { normalizePhone } from "../utils/format.js";

const demoAdmin = {
  id: "ADM-260701-001",
  username: "admin",
  password: "admin123",
  name: "Admin Bengkel",
  role: "admin"
};

function findAdminByUsername(username) {
  const normalized = String(username || "").trim().toLowerCase();
  return getCollection("admins").find((item) => String(item.username || "").toLowerCase() === normalized);
}

export async function loginAdmin({ username, password }) {
  const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

  if (useBackend) {
    const { data } = await api.post("/auth/login", { username, password, role: "admin" });
    return data.user;
  }

  await new Promise((resolve) => setTimeout(resolve, 250));
  const admin = findAdminByUsername(username) || (username === demoAdmin.username ? demoAdmin : null);
  const normalizedPassword = String(password || "").trim();

  if (admin && admin.password === normalizedPassword) {
    return {
      id: admin.id || "USR-ADMIN",
      name: admin.nama || admin.name || "Admin Bengkel",
      username: admin.username,
      role: "admin",
      token: "demo-admin-session-token"
    };
  }

  throw new Error("Username atau password admin salah.");
}

export async function loginPelanggan({ username, password }) {
  const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

  if (useBackend) {
    const { data } = await api.post("/auth/login", { username, password, role: "pelanggan" });
    return data.user;
  }

  await new Promise((resolve) => setTimeout(resolve, 200));
  const account = findPelangganByUsername(username) || findPelangganByPhone(username);
  const normalizedPassword = String(password || "").trim();
  const phonePassword = account ? normalizePhone(account.phone) : "";

  if (account && (account.password === normalizedPassword || phonePassword === normalizedPassword)) {
    return {
      id: account.id,
      name: account.nama,
      username: account.username || account.phone,
      phone: account.phone,
      foto: account.foto || "",
      role: "pelanggan",
      token: "demo-customer-session-token"
    };
  }

  throw new Error("Akun pelanggan tidak ditemukan atau password salah.");
}

export async function registerPelanggan(payload) {
  const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

  if (useBackend) {
    const { data } = await api.post("/auth/register", payload);
    return data.user;
  }

  await new Promise((resolve) => setTimeout(resolve, 200));
  const pelanggan = createPelanggan(payload);
  return {
    id: pelanggan.id,
    name: pelanggan.nama,
    username: pelanggan.username || pelanggan.phone,
    phone: pelanggan.phone,
    foto: pelanggan.foto || "",
    role: "pelanggan",
    token: "demo-customer-session-token"
  };
}
