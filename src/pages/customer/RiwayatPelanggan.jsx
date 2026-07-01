import CustomerLayout from "../../layouts/CustomerLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getBookings } from "../../services/bookingService.js";
import { getMogok } from "../../services/mogokService.js";
import { formatDateTime } from "../../utils/format.js";
import { getGoogleMapsUrl, hasCoordinates } from "../../utils/maps.js";

function RiwayatPelanggan() {
  const { user } = useAuth();
  const bookings = getBookings().filter((item) => item.pelangganId === user?.id || item.phone === user?.phone);
  const mogok = getMogok().filter((item) => item.pelangganId === user?.id || item.phone === user?.phone);

  return (
    <CustomerLayout>
      <section className="customer-hero-mini">
        <div className="container">
          <p className="hero-badge mb-3">Riwayat</p>
          <h1 className="fw-bold mb-2">Riwayat aktivitas pelanggan</h1>
          <p className="text-white-50 mb-0">Daftar booking servis dan permintaan mekanik darurat Anda.</p>
        </div>
      </section>
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="page-card p-4">
              <h5 className="fw-bold mb-3">Riwayat Booking</h5>
              {bookings.map((item) => (
                <div className="border-bottom pb-3 mb-3" key={item.id}>
                  <div className="d-flex justify-content-between flex-wrap gap-2"><strong>{item.id} • {item.layanan}</strong><StatusBadge status={item.status} /></div>
                  <small className="text-muted">{item.tanggal} {item.jam} • {item.kendaraan} • {item.plat}</small>
                  <p className="mb-0 mt-2">{item.keluhan}</p>
                </div>
              ))}
              {bookings.length === 0 && <div className="empty-state">Belum ada riwayat booking.</div>}
            </div>
          </div>
          <div className="col-lg-5">
            <div className="page-card p-4">
              <h5 className="fw-bold mb-3">Riwayat Panggilan Mekanik</h5>
              {mogok.map((item) => (
                <div className="border-bottom pb-3 mb-3" key={item.id}>
                  <div className="d-flex justify-content-between flex-wrap gap-2"><strong>{item.id}</strong><StatusBadge status={item.status} /></div>
                  <small className="text-muted">{formatDateTime(item.createdAt)} • {item.lokasi}</small>
                  <p className="mb-2 mt-2">{item.keluhan}</p>
                  <div className="mechanic-status-mini mb-2">
                    {item.mekanikFoto && <img src={item.mekanikFoto} alt={item.mekanikNama || item.petugas || "Mekanik"} />}
                    <div>
                      <strong>Mekanik:</strong> {item.mekanikNama || item.petugas || "Belum ditentukan"}
                      {item.mekanikSpesialis && <small>{item.mekanikSpesialis}</small>}
                    </div>
                  </div>
                  {hasCoordinates(item) && <a href={getGoogleMapsUrl(item)} target="_blank" rel="noreferrer" className="btn btn-outline-warning btn-sm">Buka Titik Maps</a>}
                </div>
              ))}
              {mogok.length === 0 && <div className="empty-state">Belum ada panggilan mekanik.</div>}
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}

export default RiwayatPelanggan;
