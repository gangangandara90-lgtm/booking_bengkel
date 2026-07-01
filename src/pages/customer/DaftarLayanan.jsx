import { Link } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout.jsx";
import { getLayanan } from "../../services/layananService.js";
import { formatRupiah } from "../../utils/format.js";

function DaftarLayanan() {
  const layanan = getLayanan().filter((item) => item.aktif);

  return (
    <CustomerLayout>
      <section className="customer-hero-mini">
        <div className="container">
          <p className="hero-badge mb-3">Daftar Layanan</p>
          <h1 className="fw-bold mb-2">Pilih layanan bengkel</h1>
          <p className="text-white-50 mb-0">Lihat estimasi pengerjaan dan biaya sebelum membuat booking.</p>
        </div>
      </section>
      <section className="container py-5">
        <div className="row g-4">
          {layanan.map((item) => (
            <div className="col-md-6 col-xl-4" key={item.id}>
              <div className="card portal-card h-100">
                <div className="card-body p-4 d-flex flex-column">
                  <span className="badge text-bg-warning align-self-start mb-3">{item.kategori}</span>
                  <h4 className="fw-bold">{item.nama}</h4>
                  <p className="text-muted flex-grow-1">{item.deskripsi}</p>
                  <div className="d-flex justify-content-between border-top pt-3 mt-2"><span>Estimasi</span><strong>{item.estimasi}</strong></div>
                  <div className="d-flex justify-content-between border-top pt-3 mt-3"><span>Harga</span><strong>{formatRupiah(item.harga)}</strong></div>
                  <Link to="/pelanggan/booking" state={{ layananId: item.id }} className="btn btn-warning mt-4">Booking Layanan</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </CustomerLayout>
  );
}

export default DaftarLayanan;
