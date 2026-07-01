import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChartLine, FaClipboardCheck, FaMoneyBillWave, FaTools } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      await loginAdmin(form);
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login gagal. Periksa kembali data akun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-admin">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />
      <div className="container position-relative">
        <div className="row min-vh-100 align-items-center g-5 py-5">
          <div className="col-lg-5">
            <form className="auth-card" onSubmit={handleSubmit}>
              <p className="section-label text-center mb-2">Area Admin</p>
              <h2 className="text-center fw-bold mb-2">Login Admin</h2>
              <p className="text-center text-muted mb-4">Masuk untuk mengelola operasional bengkel.</p>
              {error && <div className="alert alert-danger">{error}</div>}
              <label className="form-label fw-semibold">Username</label>
              <input type="text" name="username" className="form-control mb-3" placeholder="Masukkan username" value={form.username} onChange={handleChange} />
              <label className="form-label fw-semibold">Password</label>
              <input type="password" name="password" className="form-control mb-4" placeholder="Masukkan password" value={form.password} onChange={handleChange} />
              <button className="btn btn-warning fw-semibold py-2 w-100" disabled={loading}>{loading ? "Memproses..." : "Login Admin"}</button>
              <p className="text-muted small text-center mt-3 mb-0">Akses ini hanya untuk administrator bengkel.</p>
            </form>
          </div>

          <div className="col-lg-7 text-white">
            <div className="auth-visual-panel ms-lg-auto">
              <span className="auth-kicker">Bengkel Cihuyyy</span>
              <h1 className="fw-bold display-5 mb-3">Panel Admin Bengkel yang rapi dan terpusat</h1>
              <p className="fs-5 text-white-50 mb-4">
                Kelola booking, layanan, servis, panggilan darurat, pembayaran, dan statistik operasional dari satu dashboard khusus admin.
              </p>
              <div className="auth-feature-grid">
                <div className="auth-feature-item"><FaClipboardCheck /><span>Verifikasi booking</span></div>
                <div className="auth-feature-item"><FaTools /><span>Monitoring servis</span></div>
                <div className="auth-feature-item"><FaMoneyBillWave /><span>Pembayaran pelanggan</span></div>
                <div className="auth-feature-item"><FaChartLine /><span>Laporan statistik</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
