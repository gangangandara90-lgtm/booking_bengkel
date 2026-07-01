import { generateId, getCollection, insertItem, removeItem, updateItem } from "../utils/storage.js";

const colors = ["#f59e0b", "#fb923c", "#334155", "#0f766e", "#7c3aed", "#dc2626"];

export const mekanikStatus = ["Aktif", "Tidak Aktif"];

export function makeMechanicAvatar(name = "Mekanik") {
  const initial = String(name || "M").split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "MK";
  const color = colors[Math.abs([...initial].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs><rect width="320" height="320" rx="64" fill="url(#g)"/><circle cx="160" cy="125" r="57" fill="rgba(255,255,255,.9)"/><path d="M68 278c11-56 51-88 92-88s81 32 92 88" fill="rgba(255,255,255,.9)"/><text x="160" y="290" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="#fff">${initial}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getMekanik() {
  return getCollection("mekanik");
}

export function getMekanikAktif() {
  return getMekanik().filter((item) => item.status !== "Tidak Aktif");
}

export function getMekanikById(id) {
  return getMekanik().find((item) => item.id === id);
}

export function createMekanik(payload) {
  const nama = String(payload.nama || "").trim();
  if (!nama) throw new Error("Nama mekanik wajib diisi.");

  return insertItem("mekanik", {
    id: generateId("MEK"),
    nama,
    phone: payload.phone || "",
    spesialis: payload.spesialis || "Mekanik umum",
    pengalaman: payload.pengalaman || "",
    rating: Number(payload.rating || 4.7),
    status: payload.status || "Aktif",
    foto: payload.foto || makeMechanicAvatar(nama),
    profil: payload.profil || "Mekanik bengkel yang siap membantu pelanggan sesuai jadwal dan area layanan.",
    jumlahTugas: Number(payload.jumlahTugas || 0),
    createdAt: new Date().toISOString()
  });
}

export function createMekanikBulk(text) {
  const lines = String(text || "").split("\n").map((line) => line.trim()).filter(Boolean);
  return lines.map((line) => {
    const [nama, spesialis, phone, pengalaman, profil] = line.split("|").map((item) => item?.trim() || "");
    return createMekanik({ nama, spesialis, phone, pengalaman, profil });
  });
}

export function updateMekanik(id, payload) {
  const current = getMekanikById(id);
  if (!current) return null;
  const nextName = String(payload.nama || current.nama || "").trim();
  return updateItem("mekanik", id, {
    ...current,
    ...payload,
    nama: nextName,
    rating: Number(payload.rating ?? current.rating ?? 4.7),
    jumlahTugas: Number(payload.jumlahTugas ?? current.jumlahTugas ?? 0),
    foto: payload.foto || current.foto || makeMechanicAvatar(nextName)
  });
}

export function deleteMekanik(id) {
  removeItem("mekanik", id);
}
