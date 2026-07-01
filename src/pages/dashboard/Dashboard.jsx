import { useEffect, useState } from "react";
import { FaCalendarCheck, FaMotorcycle, FaScrewdriverWrench, FaTruckMedical } from "react-icons/fa6";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { getBookings } from "../../services/bookingService.js";
import { getMogok } from "../../services/mogokService.js";
import { getServis } from "../../services/servisService.js";
import { formatDateTime, formatRupiah } from "../../utils/format.js";

function Dashboard() {
  const [data, setData] = useState({ booking: [], servis: [], mogok: [] });

  useEffect(() => {
    const load = () => setData({ booking: getBookings(), servis: getServis(), mogok: getMogok() });
    load();
    window.addEventListener("booking-bengkel-updated", load);
    return () => window.removeEventListener("booking-bengkel-updated", load);
  }, []);

  const pendingBooking = data.booking.filter((item) => item.status === "Menunggu Verifikasi").length;
  const activeServis = data.servis.filter((item) => item.status !== "Selesai").length;
  const activeMogok = data.mogok.filter((item) => !["Selesai", "Dibatalkan"].includes(item.status)).length;
  const omzet = data.servis.filter((item) => item.status === "Selesai").reduce((total, item) => total + Number(item.biaya || 0), 0);

  const recent = [...data.booking, ...data.mogok]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Ringkasan aktivitas booking dan servis bengkel.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3"><StatCard title="Total Booking" value={data.booking.length} subtitle={`${pendingBooking} menunggu verifikasi`} icon={FaCalendarCheck} /></div>
        <div className="col-md-6 col-xl-3"><StatCard title="Servis Aktif" value={activeServis} subtitle={`${data.servis.length} total data servis`} icon={FaScrewdriverWrench} /></div>
        <div className="col-md-6 col-xl-3"><StatCard title="Panggilan Mogok" value={activeMogok} subtitle="Masih perlu ditangani" icon={FaTruckMedical} /></div>
        <div className="col-md-6 col-xl-3"><StatCard title="Omzet Selesai" value={formatRupiah(omzet)} subtitle="Dari servis selesai" icon={FaMotorcycle} /></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="page-card p-4 h-100">
            <h5 className="fw-bold mb-3">Aktivitas Terbaru</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>Kode</th><th>Pelanggan</th><th>Keterangan</th><th>Status</th><th>Waktu</th></tr></thead>
                <tbody>
                  {recent.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.id}</td>
                      <td>{item.nama}</td>
                      <td>{item.layanan || item.keluhan}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td className="text-muted small">{formatDateTime(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="page-card p-4 h-100">
            <h5 className="fw-bold mb-3">Fokus Hari Ini</h5>
            <div className="d-grid gap-3">
              <div className="p-3 rounded-4 bg-warning-subtle"><strong>{pendingBooking}</strong> booking perlu diverifikasi.</div>
              <div className="p-3 rounded-4 bg-info-subtle"><strong>{activeServis}</strong> kendaraan sedang/menunggu pengerjaan.</div>
              <div className="p-3 rounded-4 bg-danger-subtle"><strong>{activeMogok}</strong> panggilan darurat perlu dipantau.</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
