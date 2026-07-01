import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaMapMarkedAlt, FaMoneyCheckAlt, FaMotorcycle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

function CustomerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginPelanggan } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      await loginPelanggan(form);
      navigate(location.state?.from || "/pelanggan/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login pelanggan gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-customer">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />
      <div className="container position-relative">
        <div className="row min-vh-100 align-items-center g-5 py-5">
          <div className="col-lg-5">
            <form className="auth-card" onSubmit={handleSubmit}>
              <Link to="/pelanggan" className="text-decoration-none text-muted mb-3 d-inline-block">← Kembali ke portal pelanggan</Link>
              <p className="section-label mb-2">Portal Pelanggan</p>
              <h2 className="fw-bold mb-2">Login Pelanggan</h2>
              <p className="text-muted mb-4">Masuk untuk booking, cek status, riwayat, dan pembayaran.</p>
              {error && <div className="alert alert-danger">{error}</div>}
              <label className="form-label fw-semibold">Username / Nomor HP</label>
              <input name="username" className="form-control mb-3" value={form.username} onChange={handleChange} placeholder="Masukkan username atau nomor HP" required />
              <label className="form-label fw-semibold">Password</label>
              <input type="password" name="password" className="form-control mb-4" value={form.password} onChange={handleChange} placeholder="Password akun" required />
              <button className="btn btn-warning fw-semibold py-2 w-100" disabled={loading}>{loading ? "Memproses..." : "Login Pelanggan"}</button>
              <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                <Link to="/pelanggan/register" className="text-decoration-none">Belum punya akun? Daftar</Link>
                <Link to="/pelanggan" className="text-decoration-none text-muted">Beranda pelanggan</Link>
              </div>
            </form>
          </div>
          <div className="col-lg-7 text-white">
            <div className="auth-visual-panel ms-lg-auto">
              <span className="auth-kicker">Portal Pelanggan</span>
              <h1 className="fw-bold display-5 mb-3">Booking servis dan pantau kendaraan lebih mudah</h1>
              <p className="fs-5 text-white-50 mb-4">
                Area pelanggan dibuat khusus untuk mengatur booking, panggilan mekanik, status servis, pembayaran, dan profil akun.
              </p>
              <div className="auth-feature-grid">
                <div className="auth-feature-item"><FaCalendarCheck /><span>Booking jadwal</span></div>
                <div className="auth-feature-item"><FaMotorcycle /><span>Status servis</span></div>
                <div className="auth-feature-item"><FaMapMarkedAlt /><span>Panggil mekanik</span></div>
                <div className="auth-feature-item"><FaMoneyCheckAlt /><span>Bayar setelah selesai</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
