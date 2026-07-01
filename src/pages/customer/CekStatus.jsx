import { useState } from "react";
import CustomerLayout from "../../layouts/CustomerLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { searchBooking } from "../../services/bookingService.js";
import { searchMogok } from "../../services/mogokService.js";
import { formatDateTime } from "../../utils/format.js";
import { getGoogleMapsUrl, hasCoordinates } from "../../utils/maps.js";

function CekStatus() {
  const [keyword, setKeyword] = useState("");
  const [searched, setSearched] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [mogok, setMogok] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setBookings(searchBooking(keyword));
    setMogok(searchMogok(keyword));
    setSearched(true);
  };

  return (
    <CustomerLayout>
      <section className="customer-hero-mini">
        <div className="container">
          <p className="hero-badge mb-3">Cek Status</p>
          <h1 className="fw-bold mb-2">Lacak booking dan panggilan mekanik</h1>
          <p className="text-white-50 mb-0">Masukkan kode, nomor HP, nama, atau plat kendaraan.</p>
        </div>
      </section>
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card customer-card mb-4">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit} className="d-flex gap-2 flex-column flex-md-row">
                  <input className="form-control" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Contoh: BK-260701-001 / 081234567890" required />
                  <button className="btn btn-warning px-4">Cari</button>
                </form>
              </div>
            </div>

            {searched && bookings.length === 0 && mogok.length === 0 && <div className="empty-state">Data tidak ditemukan. Pastikan kode atau nomor HP sudah benar.</div>}

            {bookings.map((item) => (
              <div className="card page-card mb-3" key={item.id}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div><h5 className="fw-bold mb-1">{item.id} • {item.layanan}</h5><p className="text-muted mb-2">{item.nama} • {item.kendaraan} • {item.plat}</p></div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="status-timeline mt-3">
                    <p className="mb-1"><strong>Jadwal:</strong> {item.tanggal} pukul {item.jam}</p>
                    <p className="mb-1"><strong>Keluhan:</strong> {item.keluhan}</p>
                    <p className="mb-0"><strong>Catatan Admin:</strong> {item.catatanAdmin || "Belum ada catatan"}</p>
                  </div>
                </div>
              </div>
            ))}

            {mogok.map((item) => (
              <div className="card page-card mb-3" key={item.id}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div><h5 className="fw-bold mb-1">{item.id} • Panggilan Mekanik</h5><p className="text-muted mb-2">{item.nama} • {item.kendaraan} • {item.plat}</p></div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="status-timeline mt-3">
                    <p className="mb-1"><strong>Dibuat:</strong> {formatDateTime(item.createdAt)}</p>
                    <p className="mb-1"><strong>Lokasi:</strong> {item.lokasi}</p>
                    {hasCoordinates(item) && <p className="mb-1"><a href={getGoogleMapsUrl(item)} target="_blank" rel="noreferrer" className="btn btn-outline-warning btn-sm">Buka Titik Maps</a></p>}
                    <p className="mb-1"><strong>Keluhan:</strong> {item.keluhan}</p>
                    <div className="mechanic-status-mini mt-2">
                      {item.mekanikFoto && <img src={item.mekanikFoto} alt={item.mekanikNama || item.petugas || "Mekanik"} />}
                      <div>
                        <strong>Mekanik:</strong> {item.mekanikNama || item.petugas || "Belum ditentukan"}
                        {item.mekanikSpesialis && <small>{item.mekanikSpesialis}</small>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}

export default CekStatus;
