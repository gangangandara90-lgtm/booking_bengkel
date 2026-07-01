import { Link } from "react-router-dom";
import { FaClipboardCheck, FaHistory, FaPhoneAlt, FaTools } from "react-icons/fa";
import mekanikImage from "../../assets/images/mekanik.svg";

function LandingPage() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark px-5 py-3" style={{ backgroundColor: "#0F172A" }}>
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap">
          <Link to="/" className="text-decoration-none">
            <h2 className="fw-bold text-warning m-0 brand-title">Bengkel Cihuyyy</h2>
          </Link>
          <div className="mt-2 mt-md-0 d-flex gap-2 flex-wrap">
            <Link to="/pelanggan/login" className="btn btn-outline-light">Login Pelanggan</Link>
            <Link to="/pelanggan/register" className="btn btn-warning">Registrasi</Link>
          </div>
        </div>
      </nav>

      <section className="hero-section text-white d-flex align-items-center">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="hero-badge">Portal pelanggan • Booking cepat • Status jelas</div>
              <h1 className="fw-bold mb-4 hero-title">Servis Motor Jadi Lebih Mudah</h1>
              <p className="fs-5 mb-4 hero-desc">
                Booking servis online, pantau status kendaraan, dan panggil mekanik darurat langsung dari smartphone Anda.
              </p>
              <div className="hero-buttons">
                <Link to="/pelanggan/booking" className="btn btn-warning btn-lg me-3 hero-button">Booking Sekarang</Link>
                <Link to="/pelanggan/mogok" className="btn btn-outline-light btn-lg hero-button">Panggil Mekanik</Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img src={mekanikImage} alt="Mekanik Bengkel" className="motor-animation img-fluid" style={{ maxWidth: "560px", width: "100%" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <p className="section-label text-center mb-2">Fitur Pelanggan</p>
          <h2 className="text-center fw-bold mb-5">Semua kebutuhan servis dari satu halaman</h2>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow h-100 feature-card">
                <div className="card-body text-center p-4">
                  <FaTools size={45} color="#F59E0B" />
                  <h5 className="mt-3">Booking Servis</h5>
                  <p className="text-muted">Tentukan jadwal servis tanpa harus antre di bengkel.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow h-100 feature-card">
                <div className="card-body text-center p-4">
                  <FaClipboardCheck size={45} color="#F59E0B" />
                  <h5 className="mt-3">Status Booking</h5>
                  <p className="text-muted">Pantau verifikasi, pengerjaan, hingga servis selesai.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow h-100 feature-card">
                <div className="card-body text-center p-4">
                  <FaPhoneAlt size={45} color="#F59E0B" />
                  <h5 className="mt-3">Mekanik Darurat</h5>
                  <p className="text-muted">Ajukan bantuan mekanik saat kendaraan mogok di jalan.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow h-100 feature-card">
                <div className="card-body text-center p-4">
                  <FaHistory size={45} color="#F59E0B" />
                  <h5 className="mt-3">Riwayat Servis</h5>
                  <p className="text-muted">Cari kembali data booking dan catatan servis kendaraan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 text-center text-white" style={{ backgroundColor: "#1E293B" }}>
        <div className="container">
          <h2 className="fw-bold mb-3 cta-title">Siap Servis Kendaraan Anda?</h2>
          <p className="mb-4 text-white-50">Pilih layanan, isi data kendaraan, lalu tunggu verifikasi admin bengkel.</p>
          <Link to="/pelanggan/booking" className="btn btn-warning btn-lg me-3 hero-button">Mulai Booking</Link>
          <Link to="/pelanggan/status" className="btn btn-outline-light btn-lg hero-button">Cek Status</Link>
        </div>
      </section>

      <footer className="text-center text-white py-4" style={{ backgroundColor: "#0F172A" }}>
        <h5>Bengkel Cihuyyy</h5>
        <p className="mb-0 text-white-50">Sistem Booking Bengkel Motor Berbasis Web</p>
      </footer>
    </div>
  );
}

export default LandingPage;
