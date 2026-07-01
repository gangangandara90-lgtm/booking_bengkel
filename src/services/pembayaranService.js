import { generateId, getCollection, insertItem, setCollection, updateItem } from "../utils/storage.js";

export const pembayaranStatus = ["Belum Dibayar", "Lunas"];
export const rekeningPembayaran = {
  bank: "MANDIRI",
  nomor: "1770024320449",
  atasNama: "Bengkel Chuyyy",
  logoImage: "/mandiri-logo.svg"
};

function byNewest(a, b) {
  return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
}

function normalizePembayaran(item = {}) {
  return {
    id: item.id || generateId("PAY"),
    servisId: item.servisId || "",
    bookingId: item.bookingId || "",
    pelangganId: item.pelangganId || "",
    nama: item.nama || "-",
    phone: item.phone || "",
    jumlah: Number(item.jumlah || 0),
    metode: item.metode || "",
    rekeningTujuan: item.rekeningTujuan || `${rekeningPembayaran.bank} ${rekeningPembayaran.nomor}`,
    status: item.status === "Lunas" ? "Lunas" : "Belum Dibayar",
    bukti: item.bukti || "",
    buktiFileName: item.buktiFileName || "",
    buktiFoto: item.buktiFoto || "",
    catatan: item.catatan || "",
    paidAt: item.paidAt || item.verifiedAt || "",
    verifiedAt: item.verifiedAt || item.paidAt || "",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  };
}

export function getPembayaran() {
  return getCollection("pembayaran").map(normalizePembayaran).sort(byNewest);
}

export function getPembayaranById(id) {
  return getPembayaran().find((item) => item.id === id);
}

export function findPembayaranByServis(servisId) {
  return getPembayaran().find((item) => item.servisId === servisId);
}

export function getPembayaranByPelanggan(user) {
  if (!user) return [];
  const userName = String(user.name || "").toLowerCase();
  const userPhone = String(user.phone || "").toLowerCase();
  return getPembayaran().filter((item) =>
    item.pelangganId === user.id ||
    String(item.nama || "").toLowerCase() === userName ||
    String(item.phone || "").toLowerCase() === userPhone
  );
}

export function createPembayaran(payload) {
  const exists = payload.servisId ? findPembayaranByServis(payload.servisId) : null;
  if (exists) return exists;

  return insertItem("pembayaran", normalizePembayaran({
    id: generateId("PAY"),
    status: "Belum Dibayar",
    metode: "",
    rekeningTujuan: `${rekeningPembayaran.bank} ${rekeningPembayaran.nomor}`,
    bukti: "",
    buktiFileName: "",
    buktiFoto: "",
    catatan: "",
    ...payload,
    createdAt: payload.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
}

export function updatePembayaran(id, payload) {
  const current = getPembayaranById(id);
  if (!current) return null;

  const nextStatus = payload.status === "Lunas" ? "Lunas" : "Belum Dibayar";
  const paidAt = nextStatus === "Lunas"
    ? (payload.paidAt || payload.verifiedAt || current.paidAt || new Date().toISOString())
    : "";

  return updateItem("pembayaran", id, normalizePembayaran({
    ...current,
    ...payload,
    status: nextStatus,
    paidAt,
    verifiedAt: paidAt,
    jumlah: payload.jumlah === undefined ? current.jumlah : Number(payload.jumlah || 0),
    updatedAt: new Date().toISOString()
  }));
}

export function upsertPembayaranFromServis(servis) {
  if (!servis) return null;

  const existing = findPembayaranByServis(servis.id);
  const payload = {
    servisId: servis.id,
    bookingId: servis.bookingId || "",
    pelangganId: servis.pelangganId || "",
    nama: servis.nama,
    phone: servis.phone || "",
    jumlah: Number(servis.biaya || 0)
  };

  if (existing) {
    return updatePembayaran(existing.id, {
      ...payload,
      status: existing.status || "Belum Dibayar",
      metode: existing.metode || "",
      rekeningTujuan: existing.rekeningTujuan || `${rekeningPembayaran.bank} ${rekeningPembayaran.nomor}`,
      bukti: existing.bukti || "",
      buktiFileName: existing.buktiFileName || "",
      buktiFoto: existing.buktiFoto || "",
      catatan: existing.catatan || "",
      paidAt: existing.paidAt || "",
      verifiedAt: existing.verifiedAt || existing.paidAt || ""
    });
  }

  return createPembayaran({
    ...payload,
    status: "Belum Dibayar"
  });
}

export function syncPembayaranDariServis() {
  if (typeof window === "undefined") return getPembayaran();
  const state = JSON.parse(window.localStorage.getItem("booking_bengkel_state") || "{}");
  const servisRows = Array.isArray(state.servis) ? state.servis : [];
  let pembayaranRows = Array.isArray(state.pembayaran) ? state.pembayaran.map(normalizePembayaran) : [];
  let changed = false;

  servisRows
    .filter((servis) => servis.status === "Selesai")
    .forEach((servis) => {
      const existingIndex = pembayaranRows.findIndex((item) => item.servisId === servis.id);
      const previous = existingIndex >= 0 ? pembayaranRows[existingIndex] : null;
      const base = normalizePembayaran({
        id: previous?.id || generateId("PAY"),
        servisId: servis.id,
        bookingId: servis.bookingId || "",
        pelangganId: servis.pelangganId || "",
        nama: servis.nama,
        phone: servis.phone || "",
        jumlah: Number(servis.biaya || 0),
        status: previous?.status || "Belum Dibayar",
        metode: previous?.metode || "",
        rekeningTujuan: previous?.rekeningTujuan || `${rekeningPembayaran.bank} ${rekeningPembayaran.nomor}`,
        bukti: previous?.bukti || "",
        buktiFileName: previous?.buktiFileName || "",
        buktiFoto: previous?.buktiFoto || "",
        catatan: previous?.catatan || "",
        paidAt: previous?.paidAt || previous?.verifiedAt || "",
        verifiedAt: previous?.verifiedAt || previous?.paidAt || "",
        createdAt: previous?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (existingIndex >= 0) pembayaranRows[existingIndex] = base;
      else pembayaranRows = [base, ...pembayaranRows];
      changed = true;
    });

  if (changed) setCollection("pembayaran", pembayaranRows);
  return getPembayaran();
}

export function konfirmasiPembayaran(id, payload) {
  return updatePembayaran(id, {
    metode: payload.metode,
    rekeningTujuan: payload.rekeningTujuan || `${rekeningPembayaran.bank} ${rekeningPembayaran.nomor}`,
    bukti: payload.bukti || payload.buktiReferensi || payload.buktiFileName || "Bukti foto terunggah",
    buktiFileName: payload.buktiFileName || "",
    buktiFoto: payload.buktiFoto || "",
    catatan: payload.catatan || "Pembayaran dilakukan oleh pelanggan.",
    status: "Lunas",
    paidAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString()
  });
}

export function tandaiLunas(id, catatan = "Pembayaran sudah lunas.") {
  return updatePembayaran(id, {
    status: "Lunas",
    catatan,
    paidAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString()
  });
}

export function tandaiBelumDibayar(id, catatan = "Pembayaran belum diterima.") {
  return updatePembayaran(id, {
    status: "Belum Dibayar",
    metode: "",
    bukti: "",
    buktiFileName: "",
    buktiFoto: "",
    catatan,
    paidAt: "",
    verifiedAt: ""
  });
}

export const verifikasiPembayaran = tandaiLunas;
export const tolakPembayaran = tandaiBelumDibayar;
