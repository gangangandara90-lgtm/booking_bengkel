import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { createBooking } from "../../services/bookingService.js";
import { getLayanan } from "../../services/layananService.js";
import { getPelangganById } from "../../services/pelangganService.js";
import { formatRupiah } from "../../utils/format.js";

function BookingBaru() {
  const location = useLocation();
  const { user } = useAuth();
  const pelanggan = getPelangganById(user?.id);
  const layanan = useMemo(() => getLayanan().filter((item) => item.aktif), []);
  const initialLayananId = location.state?.layananId || layanan[0]?.id || "";
  const [created, setCreated] = useState(null);
  const [form, setForm] = useState({
    pelangganId: pelanggan?.id || user?.id || "",
    nama: pelanggan?.nama || user?.name || "",
    phone: pelanggan?.phone || user?.phone || "",
    kendaraan: pelanggan?.kendaraan || "",
    plat: pelanggan?.plat || "",
    layananId: initialLayananId,
    tanggal: "",
    jam: "",
    keluhan: ""
  });

  const selectedLayanan = layanan.find((item) => item.id === form.layananId);
  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const booking = createBooking(form);
    setCreated(booking);
  };

  return (
    <CustomerLayout>
      <section className="customer-hero-mini">
        <div className="container">
          <p className="hero-badge mb-3">Booking Servis</p>
          <h1 className="fw-bold mb-2">Pilih jadwal servis kendaraan</h1>
          <p className="text-white-50 mb-0">Admin akan memverifikasi jadwal dan layanan yang Anda pilih.</p>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-end mb-3">
          <Link to="/pelanggan/status" className="btn btn-outline-dark btn-sm">Cek Status Booking</Link>
        </div>
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card customer-card">
              <div className="card-body p-4 p-md-5">
                {created ? (
                  <div className="alert alert-success rounded-4 mb-0">
                    <h5 className="fw-bold">Booking berhasil dikirim</h5>
                    <p className="mb-2">Kode booking Anda:</p>
                    <h3 className="fw-bold">{created.id}</h3>
                    <StatusBadge status={created.status} />
                    <div className="mt-3 d-flex gap-2 flex-wrap">
                      <Link to="/pelanggan/status" className="btn btn-success">Cek Status</Link>
                      <Link to="/pelanggan/riwayat" className="btn btn-outline-success">Lihat Riwayat</Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6"><label className="form-label fw-semibold">Nama</label><input name="nama" className="form-control" value={form.nama} onChange={handleChange} required /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Nomor HP</label><input name="phone" className="form-control" value={form.phone} onChange={handleChange} required /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Kendaraan</label><input name="kendaraan" className="form-control" value={form.kendaraan} onChange={handleChange} required /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Plat Nomor</label><input name="plat" className="form-control text-uppercase" value={form.plat} onChange={handleChange} required /></div>
                    <div className="col-12"><label className="form-label fw-semibold">Layanan</label><select name="layananId" className="form-select" value={form.layananId} onChange={handleChange} required>{layanan.map((item) => <option value={item.id} key={item.id}>{item.nama} - {formatRupiah(item.harga)}</option>)}</select></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Tanggal</label><input type="date" name="tanggal" className="form-control" value={form.tanggal} onChange={handleChange} required /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Jam</label><input type="time" name="jam" className="form-control" value={form.jam} onChange={handleChange} required /></div>
                    <div className="col-12"><label className="form-label fw-semibold">Keluhan / Catatan</label><textarea name="keluhan" className="form-control" rows="4" value={form.keluhan} onChange={handleChange} required /></div>
                    <div className="col-12 mt-4"><button className="btn btn-warning px-4">Kirim Booking</button></div>
                  </form>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card customer-card h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold">Ringkasan Layanan</h5>
                {selectedLayanan ? (
                  <div className="mt-3">
                    <h4 className="fw-bold text-warning">{selectedLayanan.nama}</h4>
                    <p className="text-muted">{selectedLayanan.deskripsi}</p>
                    <div className="d-flex justify-content-between border-top pt-3 mt-3"><span>Estimasi</span><strong>{selectedLayanan.estimasi}</strong></div>
                    <div className="d-flex justify-content-between border-top pt-3 mt-3"><span>Biaya mulai</span><strong>{formatRupiah(selectedLayanan.harga)}</strong></div>
                  </div>
                ) : <p className="text-muted mb-0">Pilih layanan terlebih dahulu.</p>}
                <div className="alert alert-warning mt-4 mb-0">Datang 10 menit sebelum jadwal. Jika jadwal penuh, admin akan menghubungi nomor Anda.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}

export default BookingBaru;
