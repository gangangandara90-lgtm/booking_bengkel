import { useEffect, useMemo, useState } from "react";
import CustomerLayout from "../../layouts/CustomerLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  getPembayaranByPelanggan,
  konfirmasiPembayaran,
  rekeningPembayaran,
  syncPembayaranDariServis
} from "../../services/pembayaranService.js";
import { formatDateTime, formatRupiah } from "../../utils/format.js";

const emptyForm = {
  metode: "Transfer Bank Mandiri",
  bukti: "",
  buktiFileName: "",
  buktiFoto: "",
  catatan: ""
};

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function PembayaranPelanggan() {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    syncPembayaranDariServis();
  }, []);

  const pembayaran = useMemo(() => {
    refresh;
    syncPembayaranDariServis();
    return getPembayaranByPelanggan(user);
  }, [user, refresh]);

  const selected = pembayaran.find((item) => item.id === selectedId) || pembayaran[0];
  const isPaid = selected?.status === "Lunas";

  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    setFileError("");

    if (!file) {
      setForm((prev) => ({ ...prev, buktiFileName: "", buktiFoto: "" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Bukti pembayaran harus berupa foto/gambar.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError("Ukuran foto maksimal 2MB agar aman disimpan ke database.");
      event.target.value = "";
      return;
    }

    const imageData = await readImageFile(file);
    setForm((prev) => ({
      ...prev,
      buktiFileName: file.name,
      buktiFoto: imageData,
      bukti: file.name
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFileError("");
    if (!selected || isPaid) return;

    if (!form.buktiFoto) {
      setFileError("Upload foto bukti transfer terlebih dahulu.");
      return;
    }

    konfirmasiPembayaran(selected.id, {
      ...form,
      metode: "Transfer Bank Mandiri",
      rekeningTujuan: `${rekeningPembayaran.bank} ${rekeningPembayaran.nomor}`,
      bukti: form.bukti || form.buktiFileName || "Bukti transfer Mandiri"
    });
    setSelectedId(selected.id);
    setRefresh((value) => value + 1);
    setForm(emptyForm);
  };

  return (
    <CustomerLayout>
      <section className="customer-hero-mini payment-hero-clean">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <p className="hero-badge mb-3">Pembayaran Servis</p>
              <h1 className="fw-bold mb-2">Bayar setelah servis selesai</h1>
              <p className="text-white-50 mb-0">
                Tagihan muncul setelah servis selesai. Pembayaran dilakukan melalui transfer Bank Mandiri, lalu upload foto bukti pembayaran.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="hero-bank-pill">
                <img src={rekeningPembayaran.logoImage} alt="Logo Bank Mandiri" />
                <span>Transfer Bank Mandiri</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="page-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h5 className="fw-bold mb-0">Daftar Tagihan Selesai Servis</h5>
                <button className="btn btn-outline-primary btn-sm" onClick={() => setRefresh((value) => value + 1)}>Muat Ulang</button>
              </div>

              {pembayaran.map((item) => (
                <button
                  key={item.id}
                  className={`w-100 text-start border rounded-4 p-3 mb-3 bg-white payment-list-item ${selected?.id === item.id ? "border-warning" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <div>
                      <strong>{item.id}</strong><br />
                      <small className="text-muted">Servis: {item.servisId || "-"}</small><br />
                      <small className="text-muted">Diperbarui: {formatDateTime(item.updatedAt || item.createdAt)}</small>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="d-flex justify-content-between mt-3 border-top pt-2"><span>Total</span><strong>{formatRupiah(item.jumlah)}</strong></div>
                  {item.metode && <small className="text-muted d-block mt-2">Metode: {item.metode}</small>}
                  {item.buktiFileName && <small className="text-muted d-block mt-1">Bukti: {item.buktiFileName}</small>}
                  {item.catatan && <small className="text-muted d-block mt-1">Catatan: {item.catatan}</small>}
                </button>
              ))}

              {pembayaran.length === 0 && <div className="empty-state">Belum ada tagihan. Tagihan dibuat setelah status servis menjadi selesai.</div>}
            </div>
          </div>
          <div className="col-lg-5">
            <div className="page-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Rekening Pembayaran</h5>
              <div className="payment-method-card mandiri-payment-card mb-0">
                <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                  <img src={rekeningPembayaran.logoImage} alt="Logo Bank Mandiri" className="mandiri-logo" />
                  <span className="bank-chip">Transfer Bank</span>
                </div>
                <small className="text-muted d-block">Bank Tujuan</small>
                <h4 className="fw-bold mb-2">{rekeningPembayaran.bank}</h4>
                <p className="mb-1">No. Rekening</p>
                <div className="payment-account-number">{rekeningPembayaran.nomor}</div>
                <small className="text-muted d-block mt-1">a.n. {rekeningPembayaran.atasNama}</small>
              </div>
            </div>

            <div className="page-card p-4">
              <h5 className="fw-bold mb-3">Form Pembayaran</h5>
              {selected ? (
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-12"><label className="form-label fw-semibold">Kode Tagihan</label><input className="form-control" value={selected.id} disabled /></div>
                  <div className="col-12"><label className="form-label fw-semibold">Total</label><input className="form-control" value={formatRupiah(selected.jumlah)} disabled /></div>
                  <div className="col-12"><label className="form-label fw-semibold">Status Saat Ini</label><div><StatusBadge status={selected.status} /></div></div>
                  {isPaid && selected.paidAt && <div className="col-12"><div className="alert alert-success mb-0">Pembayaran sudah lunas pada {formatDateTime(selected.paidAt)}.</div></div>}
                  <div className="col-12">
                    <label className="form-label fw-semibold">Metode</label>
                    <select name="metode" className="form-select" value={form.metode} onChange={handleChange} disabled>
                      <option>Transfer Bank Mandiri</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Upload Foto Bukti Transfer</label>
                    <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} required={!isPaid} disabled={isPaid} />
                    <small className="text-muted">Format gambar JPG/PNG/WebP, maksimal 2MB.</small>
                    {fileError && <div className="text-danger small mt-2">{fileError}</div>}
                  </div>
                  {form.buktiFoto && !isPaid && (
                    <div className="col-12">
                      <div className="payment-proof-preview">
                        <img src={form.buktiFoto} alt="Preview bukti pembayaran" />
                        <small className="text-muted d-block mt-2">Preview: {form.buktiFileName}</small>
                      </div>
                    </div>
                  )}
                  {isPaid && selected.buktiFoto && (
                    <div className="col-12">
                      <div className="payment-proof-preview">
                        <img src={selected.buktiFoto} alt="Bukti pembayaran tersimpan" />
                        <small className="text-muted d-block mt-2">Bukti tersimpan: {selected.buktiFileName || selected.bukti}</small>
                      </div>
                    </div>
                  )}
                  <div className="col-12"><label className="form-label fw-semibold">Catatan</label><textarea name="catatan" className="form-control" rows="3" value={form.catatan} onChange={handleChange} placeholder="Opsional, contoh: dibayar atas nama siapa" disabled={isPaid} /></div>
                  <div className="col-12"><button className="btn btn-warning w-100" disabled={isPaid}>{isPaid ? "Pembayaran Sudah Lunas" : "Kirim Pembayaran"}</button></div>
                </form>
              ) : <div className="empty-state">Belum ada tagihan yang bisa dibayar.</div>}
              <div className="alert alert-warning mt-4 mb-0 small">
                Status admin tetap <strong>Belum Dibayar</strong> sebelum pelanggan mengirim foto bukti transfer. Setelah bukti dikirim, status berubah menjadi <strong>Lunas</strong>.
              </div>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}

export default PembayaranPelanggan;
