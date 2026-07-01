import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { createMogok } from "../../services/mogokService.js";
import { getPelangganById } from "../../services/pelangganService.js";
import { getMekanikAktif, getMekanikById } from "../../services/mekanikService.js";
import { formatCoordinate, getGoogleMapsUrl, getOsmEmbedUrl, hasCoordinates } from "../../utils/maps.js";

function PanggilMekanik() {
  const { user } = useAuth();
  const pelanggan = getPelangganById(user?.id);
  const mechanics = useMemo(() => getMekanikAktif(), []);
  const defaultMechanic = mechanics[0];
  const initialForm = {
    pelangganId: pelanggan?.id || user?.id || "",
    nama: pelanggan?.nama || user?.name || "",
    phone: pelanggan?.phone || user?.phone || "",
    kendaraan: pelanggan?.kendaraan || "",
    plat: pelanggan?.plat || "",
    mekanikId: defaultMechanic?.id || "",
    lokasi: "",
    keluhan: "",
    latitude: "",
    longitude: "",
    mapsUrl: ""
  };
  const [form, setForm] = useState(initialForm);
  const [created, setCreated] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const selectedMechanic = getMekanikById(form.mekanikId) || defaultMechanic || null;
  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  const handleSelectMechanic = (mekanikId) => setForm((prev) => ({ ...prev, mekanikId }));

  const handleUseCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Browser belum mendukung fitur lokasi. Silakan isi patokan lokasi secara manual.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setForm((prev) => ({
          ...prev,
          latitude,
          longitude,
          mapsUrl,
          lokasi: prev.lokasi || `Titik lokasi pelanggan: ${latitude}, ${longitude}`
        }));
        setLocating(false);
      },
      () => {
        setLocationError("Izin lokasi ditolak atau titik lokasi tidak terbaca. Aktifkan izin lokasi browser, lalu coba lagi.");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  const handleClearLocation = () => {
    setForm((prev) => ({ ...prev, latitude: "", longitude: "", mapsUrl: "" }));
    setLocationError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const mechanic = getMekanikById(form.mekanikId);
    const payload = {
      ...form,
      lokasi: form.lokasi.trim(),
      mapsUrl: getGoogleMapsUrl(form),
      mekanikNama: mechanic?.nama || "",
      mekanikPhone: mechanic?.phone || "",
      mekanikSpesialis: mechanic?.spesialis || "",
      mekanikFoto: mechanic?.foto || "",
      petugas: mechanic?.nama || ""
    };
    setCreated(createMogok(payload));
    setForm({ ...initialForm, lokasi: "", keluhan: "", latitude: "", longitude: "", mapsUrl: "" });
    setLocationError("");
  };

  return (
    <CustomerLayout>
      <section className="customer-hero-mini">
        <div className="container">
          <p className="hero-badge mb-3">Layanan Darurat</p>
          <h1 className="fw-bold mb-2">Panggil mekanik ke lokasi</h1>
          <p className="text-white-50 mb-0">Pilih montir, isi titik lokasi, lalu kirim keluhan kendaraan agar bantuan bisa diarahkan lebih cepat.</p>
        </div>
      </section>
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card customer-card">
              <div className="card-body p-4 p-md-5">
                {created && (
                  <div className="alert alert-success rounded-4">
                    <h5 className="fw-bold">Permintaan berhasil dikirim</h5>
                    <p className="mb-1">Kode permintaan: <strong>{created.id}</strong></p>
                    {created.mekanikNama && <p className="mb-2">Mekanik pilihan: <strong>{created.mekanikNama}</strong></p>}
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <StatusBadge status={created.status} />
                      <Link to="/pelanggan/status" className="btn btn-success btn-sm">Cek Status</Link>
                      {getGoogleMapsUrl(created) && <a href={getGoogleMapsUrl(created)} target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm">Lihat Titik Maps</a>}
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6"><label className="form-label fw-semibold">Nama</label><input name="nama" className="form-control" value={form.nama} onChange={handleChange} required /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Nomor HP</label><input name="phone" className="form-control" value={form.phone} onChange={handleChange} required /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Kendaraan</label><input name="kendaraan" className="form-control" value={form.kendaraan} onChange={handleChange} required /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Plat Nomor</label><input name="plat" className="form-control text-uppercase" value={form.plat} onChange={handleChange} required /></div>

                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                      <div>
                        <label className="form-label fw-semibold mb-1">Pilih Mekanik / Montir</label>
                        <p className="text-muted small mb-0">Pilih mekanik yang ingin menangani panggilan darurat Anda.</p>
                      </div>
                      {selectedMechanic && <span className="badge rounded-pill bg-warning text-dark">Terpilih: {selectedMechanic.nama}</span>}
                    </div>
                    {mechanics.length > 0 ? (
                      <div className="mechanic-choice-grid">
                        {mechanics.map((mechanic) => (
                          <button
                            type="button"
                            className={`mechanic-choice-card ${form.mekanikId === mechanic.id ? "active" : ""}`}
                            key={mechanic.id}
                            onClick={() => handleSelectMechanic(mechanic.id)}
                            aria-pressed={form.mekanikId === mechanic.id}
                          >
                            <img src={mechanic.foto} alt={mechanic.nama} className="mechanic-choice-photo" />
                            <span className="mechanic-choice-content">
                              <strong>{mechanic.nama}</strong>
                              <small>{mechanic.spesialis}</small>
                              <small>{mechanic.pengalaman} • ⭐ {mechanic.rating}</small>
                              <span>{mechanic.profil}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-warning rounded-4 mb-0">Belum ada data mekanik aktif. Hubungi admin bengkel untuk menambahkan mekanik.</div>
                    )}
                  </div>

                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                      <label className="form-label fw-semibold mb-0">Lokasi / Patokan</label>
                      <div className="d-flex gap-2 flex-wrap">
                        <button type="button" className="btn btn-soft-warning btn-sm" onClick={handleUseCurrentLocation} disabled={locating}>
                          {locating ? "Membaca lokasi..." : "Gunakan Lokasi Saya"}
                        </button>
                        {hasCoordinates(form) && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleClearLocation}>Hapus Titik</button>}
                      </div>
                    </div>
                    <textarea name="lokasi" className="form-control" rows="3" value={form.lokasi} onChange={handleChange} placeholder="Contoh: Jl. Cimanuk dekat SPBU, patokan depan minimarket" required />
                    <small className="text-muted">Pelanggan tetap bisa menulis patokan manual. Tombol lokasi akan menambahkan titik koordinat agar mekanik mudah membuka Maps.</small>
                    {locationError && <div className="alert alert-warning rounded-4 mt-3 mb-0">{locationError}</div>}
                  </div>

                  {hasCoordinates(form) && (
                    <div className="col-12">
                      <div className="map-preview-card">
                        <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                          <div>
                            <strong>Titik lokasi sudah tersimpan</strong>
                            <p className="text-muted mb-0">Lat {formatCoordinate(form.latitude)}, Lng {formatCoordinate(form.longitude)}</p>
                          </div>
                          <a href={getGoogleMapsUrl(form)} target="_blank" rel="noreferrer" className="btn btn-warning btn-sm">Buka di Google Maps</a>
                        </div>
                        <iframe title="Preview titik lokasi pelanggan" src={getOsmEmbedUrl(form)} className="map-frame" loading="lazy" />
                      </div>
                    </div>
                  )}

                  <div className="col-12"><label className="form-label fw-semibold">Keluhan</label><textarea name="keluhan" className="form-control" rows="4" value={form.keluhan} onChange={handleChange} placeholder="Jelaskan kendala kendaraan yang sedang dialami" required /></div>
                  <div className="col-12 mt-4"><button className="btn btn-warning px-4" disabled={mechanics.length === 0}>Kirim Permintaan</button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}

export default PanggilMekanik;
