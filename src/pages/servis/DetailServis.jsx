import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { getServisById, servisStatus, updateServis } from "../../services/servisService.js";
import { formatRupiah } from "../../utils/format.js";

function DetailServis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    setForm(getServisById(id) || null);
  }, [id]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    updateServis(id, form);
    navigate("/admin/servis");
  };

  if (!form) return <AdminLayout><div className="empty-state">Data servis tidak ditemukan.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-4">
        <Link to="/admin/servis" className="text-decoration-none">← Kembali</Link>
        <h2 className="fw-bold mt-2 mb-1">Detail Servis</h2>
        <p className="text-muted mb-0">{form.id} • {form.bookingId}</p>
      </div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="page-card p-4 h-100">
            <h5 className="fw-bold mb-3">Informasi Kendaraan</h5>
            <p className="mb-1"><strong>Pelanggan:</strong> {form.nama}</p>
            <p className="mb-1"><strong>HP:</strong> {form.phone}</p>
            <p className="mb-1"><strong>Kendaraan:</strong> {form.kendaraan}</p>
            <p className="mb-1"><strong>Plat:</strong> {form.plat}</p>
            <p className="mb-1"><strong>Layanan:</strong> {form.layanan}</p>
            <p className="mb-3"><strong>Biaya:</strong> {formatRupiah(form.biaya)}</p>
            <StatusBadge status={form.status} />
          </div>
        </div>
        <div className="col-lg-8">
          <div className="page-card p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6"><label className="form-label fw-semibold">Mekanik</label><input name="mekanik" className="form-control" value={form.mekanik} onChange={handleChange} required /></div>
              <div className="col-md-3"><label className="form-label fw-semibold">Progress (%)</label><input type="number" min="0" max="100" name="progress" className="form-control" value={form.progress} onChange={handleChange} required /></div>
              <div className="col-md-3"><label className="form-label fw-semibold">Biaya</label><input type="number" name="biaya" className="form-control" value={form.biaya} onChange={handleChange} required /></div>
              <div className="col-md-6"><label className="form-label fw-semibold">Status</label><select name="status" className="form-select" value={form.status} onChange={handleChange}>{servisStatus.map((status) => <option key={status}>{status}</option>)}</select></div>
              <div className="col-12"><label className="form-label fw-semibold">Catatan Mekanik</label><textarea name="catatan" className="form-control" rows="5" value={form.catatan} onChange={handleChange} /></div>
              <div className="col-12"><button className="btn btn-warning px-4">Simpan Perubahan</button></div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DetailServis;
