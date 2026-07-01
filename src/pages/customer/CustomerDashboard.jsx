import { Link } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getBookings } from "../../services/bookingService.js";
import { getMogok } from "../../services/mogokService.js";
import { getPembayaranByPelanggan } from "../../services/pembayaranService.js";
import { FaCalendarCheck, FaClockRotateLeft, FaMoneyBillWave, FaMotorcycle, FaUser } from "react-icons/fa6";

function CustomerDashboard() {
  const { user } = useAuth();
  const bookings = getBookings().filter((item) => item.pelangganId === user?.id || item.phone === user?.phone);
  const mogok = getMogok().filter((item) => item.pelangganId === user?.id || item.phone === user?.phone);
  const pembayaran = getPembayaranByPelanggan(user);
  const lastBooking = bookings[0];
  const avatar = user?.foto || "";

  return (
    <CustomerLayout>
      <section className="customer-hero-mini">
        <div className="container">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {avatar ? <img src={avatar} alt="Foto profil" className="customer-hero-avatar" /> : <div className="customer-hero-avatar customer-hero-avatar-empty"><FaUser /></div>}
            <div>
              <p className="hero-badge mb-3">Portal Pelanggan</p>
              <h1 className="fw-bold mb-2">Halo, {user?.name || "Pelanggan"}</h1>
              <p className="text-white-50 mb-0">Kelola booking servis, panggilan mekanik, status pengerjaan, dan pembayaran dari halaman pelanggan.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-xl-3"><StatCard title="Booking Saya" value={bookings.length} subtitle="Total booking servis" icon={FaCalendarCheck} /></div>
          <div className="col-md-6 col-xl-3"><StatCard title="Panggilan Darurat" value={mogok.length} subtitle="Permintaan mekanik" icon={FaMotorcycle} /></div>
          <div className="col-md-6 col-xl-3"><StatCard title="Riwayat" value={bookings.filter((item) => item.status === "Selesai").length} subtitle="Servis selesai" icon={FaClockRotateLeft} /></div>
          <div className="col-md-6 col-xl-3"><StatCard title="Pembayaran" value={pembayaran.length} subtitle="Tagihan dan konfirmasi" icon={FaMoneyBillWave} /></div>
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="page-card p-4 h-100">
              <h5 className="fw-bold mb-3">Status Booking Terbaru</h5>
              {lastBooking ? (
                <div className="p-3 rounded-4 bg-light border">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <div>
                      <h5 className="fw-bold mb-1">{lastBooking.id} • {lastBooking.layanan}</h5>
                      <p className="text-muted mb-0">{lastBooking.kendaraan} • {lastBooking.plat}</p>
                    </div>
                    <StatusBadge status={lastBooking.status} />
                  </div>
                  <div className="status-timeline mt-3">
                    <p className="mb-1"><strong>Jadwal:</strong> {lastBooking.tanggal} pukul {lastBooking.jam}</p>
                    <p className="mb-1"><strong>Keluhan:</strong> {lastBooking.keluhan}</p>
                    <p className="mb-0"><strong>Catatan admin:</strong> {lastBooking.catatanAdmin || "Belum ada catatan"}</p>
                  </div>
                </div>
              ) : (
                <div className="empty-state">Belum ada booking. Buat booking servis pertama Anda.</div>
              )}
            </div>
          </div>
          <div className="col-lg-5">
            <div className="page-card p-4 h-100">
              <h5 className="fw-bold mb-3">Aksi Cepat</h5>
              <div className="d-grid gap-2">
                <Link to="/pelanggan/booking" className="btn btn-warning">Booking Servis</Link>
                <Link to="/pelanggan/mogok" className="btn btn-outline-danger">Panggil Mekanik</Link>
                <Link to="/pelanggan/status" className="btn btn-outline-dark">Cek Status</Link>
                <Link to="/pelanggan/pembayaran" className="btn btn-outline-success">Pembayaran</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}

export default CustomerDashboard;
