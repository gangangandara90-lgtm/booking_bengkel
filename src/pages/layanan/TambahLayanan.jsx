import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import { createLayanan } from "../../services/layananService.js";

const initialForm = { nama: "", kategori: "", estimasi: "", harga: "", deskripsi: "" };

function TambahLayanan() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    createLayanan(form);
    navigate("/admin/layanan");
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <Link to="/admin/layanan" className="text-decoration-none">← Kembali</Link>
        <h2 className="fw-bold mt-2 mb-1">Tambah Layanan</h2>
        <p className="text-muted mb-0">Tambahkan pilihan layanan untuk pelanggan.</p>
      </div>
      <div className="page-card p-4">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6"><label className="form-label fw-semibold">Nama Layanan</label><input name="nama" className="form-control" value={form.nama} onChange={handleChange} required /></div>
          <div className="col-md-6"><label className="form-label fw-semibold">Kategori</label><input name="kategori" className="form-control" value={form.kategori} onChange={handleChange} required /></div>
          <div className="col-md-6"><label className="form-label fw-semibold">Estimasi</label><input name="estimasi" className="form-control" value={form.estimasi} onChange={handleChange} placeholder="Contoh: 45 menit" required /></div>
          <div className="col-md-6"><label className="form-label fw-semibold">Harga</label><input type="number" name="harga" className="form-control" value={form.harga} onChange={handleChange} required /></div>
          <div className="col-12"><label className="form-label fw-semibold">Deskripsi</label><textarea name="deskripsi" className="form-control" rows="4" value={form.deskripsi} onChange={handleChange} required /></div>
          <div className="col-12"><button className="btn btn-warning px-4">Simpan</button></div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default TambahLayanan;
