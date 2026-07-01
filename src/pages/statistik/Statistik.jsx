import AdminLayout from "../../layouts/AdminLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { getBookings } from "../../services/bookingService.js";
import { getMogok } from "../../services/mogokService.js";
import { getServis } from "../../services/servisService.js";
import { formatRupiah } from "../../utils/format.js";
import { FaCalendarCheck, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import { FaTruckMedical } from "react-icons/fa6";

function barPercent(value, total) {
  return total ? Math.round((value / total) * 100) : 0;
}

function Statistik() {
  const bookings = getBookings();
  const servis = getServis();
  const mogok = getMogok();
  const selesai = servis.filter((item) => item.status === "Selesai");
  const omzet = selesai.reduce((total, item) => total + Number(item.biaya || 0), 0);
  const statusBooking = ["Menunggu Verifikasi", "Diverifikasi", "Dikerjakan", "Selesai", "Ditolak"];

  return (
    <AdminLayout>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Statistik</h2>
        <p className="text-muted mb-0">Laporan ringkas untuk memantau performa operasional bengkel.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3"><StatCard title="Total Booking" value={bookings.length} subtitle="Semua data booking" icon={FaCalendarCheck} /></div>
        <div className="col-md-6 col-xl-3"><StatCard title="Servis Selesai" value={selesai.length} subtitle="Kendaraan selesai" icon={FaCheckCircle} /></div>
        <div className="col-md-6 col-xl-3"><StatCard title="Panggilan Darurat" value={mogok.length} subtitle="Permintaan mekanik" icon={FaTruckMedical} /></div>
        <div className="col-md-6 col-xl-3"><StatCard title="Estimasi Omzet" value={formatRupiah(omzet)} subtitle="Dari servis selesai" icon={FaMoneyBillWave} /></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="page-card p-4">
            <h5 className="fw-bold mb-4">Distribusi Status Booking</h5>
            {statusBooking.map((status) => {
              const count = bookings.filter((item) => item.status === status).length;
              const percent = barPercent(count, bookings.length);
              return (
                <div key={status} className="mb-4">
                  <div className="d-flex justify-content-between mb-1"><span>{status}</span><strong>{count}</strong></div>
                  <div className="progress"><div className="progress-bar bg-warning" style={{ width: `${percent}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-lg-5">
          <div className="page-card p-4">
            <h5 className="fw-bold mb-4">Layanan Terakhir</h5>
            {servis.slice(0, 5).map((item) => (
              <div key={item.id} className="d-flex justify-content-between border-bottom pb-3 mb-3">
                <div>
                  <strong>{item.layanan}</strong><br />
                  <small className="text-muted">{item.nama} • {item.plat}</small>
                </div>
                <strong>{formatRupiah(item.biaya)}</strong>
              </div>
            ))}
            {servis.length === 0 && <div className="empty-state">Belum ada data servis.</div>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Statistik;
