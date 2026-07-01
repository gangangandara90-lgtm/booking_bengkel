import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  nama: "",
  username: "",
  password: "",
  phone: "",
  email: "",
  kendaraan: "",
  plat: "",
  alamat: ""
};

function RegisterPelanggan() {
  const navigate = useNavigate();
  const { registerPelanggan } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      await registerPelanggan(form);
      navigate("/pelanggan/booking");
    } catch (err) {
      setError(err.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ background: "linear-gradient(135deg,#0F172A,#1E293B,#334155)" }}>
      <div className="container">
        <Link to="/pelanggan" className="text-white text-decoration-none">← Kembali ke portal pelanggan</Link>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8">
            <div className="card customer-card">
              <div className="card-body p-4 p-md-5">
                <p className="section-label mb-2">Registrasi Pelanggan</p>
                <h2 className="fw-bold mb-2">Buat akun pelanggan</h2>
                <p className="text-muted mb-4">Akun pelanggan dipakai untuk booking, cek riwayat, dan konfirmasi pembayaran.</p>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6"><label className="form-label fw-semibold">Nama Lengkap</label><input name="nama" className="form-control" value={form.nama} onChange={handleChange} required /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Nomor HP</label><input name="phone" className="form-control" value={form.phone} onChange={handleChange} required /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Username</label><input name="username" className="form-control" value={form.username} onChange={handleChange} placeholder="Contoh: rizky" required /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Password</label><input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required /></div>
                  <div className="col-12"><label className="form-label fw-semibold">Email</label><input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} placeholder="opsional" /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Kendaraan</label><input name="kendaraan" className="form-control" value={form.kendaraan} onChange={handleChange} placeholder="Contoh: Honda Beat" required /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Nomor Plat</label><input name="plat" className="form-control text-uppercase" value={form.plat} onChange={handleChange} placeholder="D 1234 ABC" required /></div>
                  <div className="col-12"><label className="form-label fw-semibold">Alamat</label><textarea name="alamat" className="form-control" rows="3" value={form.alamat} onChange={handleChange} placeholder="Alamat pelanggan" /></div>
                  <div className="col-12 d-flex gap-2 mt-4 flex-wrap">
                    <button className="btn btn-warning px-4" disabled={loading}>{loading ? "Memproses..." : "Daftar & Masuk"}</button>
                    <Link to="/pelanggan/login" className="btn btn-outline-secondary">Sudah punya akun</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPelanggan;
