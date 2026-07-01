import { useEffect, useRef, useState } from "react";
import CustomerLayout from "../../layouts/CustomerLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getPelangganById, updatePelanggan } from "../../services/pelangganService.js";
import { drawAvatarCanvas, loadImage } from "../../utils/photoEditor.js";
import { FaCamera, FaRotateLeft, FaRotateRight, FaTrashCan, FaUser } from "react-icons/fa6";

const initialEditor = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0
};

function ProfilPelanggan() {
  const { user, updateUser } = useAuth();
  const pelanggan = getPelangganById(user?.id);
  const previewCanvasRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [photoNotice, setPhotoNotice] = useState("");
  const [rawPhoto, setRawPhoto] = useState("");
  const [editor, setEditor] = useState(initialEditor);
  const [form, setForm] = useState({
    nama: pelanggan?.nama || user?.name || "",
    phone: pelanggan?.phone || user?.phone || "",
    email: pelanggan?.email || "",
    kendaraan: pelanggan?.kendaraan || "",
    plat: pelanggan?.plat || "",
    alamat: pelanggan?.alamat || "",
    foto: pelanggan?.foto || user?.foto || ""
  });

  const photoSource = rawPhoto || form.foto;
  const hasPhoto = Boolean(photoSource);

  useEffect(() => {
    let active = true;

    if (!photoSource || !previewCanvasRef.current) return () => { active = false; };

    loadImage(photoSource)
      .then((image) => {
        if (active) drawAvatarCanvas(previewCanvasRef.current, image, editor);
      })
      .catch(() => {
        if (active) setPhotoNotice("Foto tidak bisa dipreview. Coba unggah gambar lain.");
      });

    return () => {
      active = false;
    };
  }, [editor, photoSource]);

  const handleChange = (event) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoNotice("File harus berupa gambar JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoNotice("Ukuran foto maksimal 5 MB agar aplikasi tetap ringan.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawPhoto(String(reader.result || ""));
      setEditor(initialEditor);
      setSaved(false);
      setPhotoNotice("Atur posisi foto, lalu klik Terapkan Crop sebelum menyimpan profil.");
    };
    reader.readAsDataURL(file);
  };

  const updateEditor = (name, value) => {
    setEditor((prev) => ({ ...prev, [name]: Number(value) }));
    setSaved(false);
  };

  const rotatePhoto = (amount) => {
    setEditor((prev) => ({ ...prev, rotation: (prev.rotation + amount + 360) % 360 }));
    setSaved(false);
  };

  const applyCrop = () => {
    if (!previewCanvasRef.current || !hasPhoto) return;
    const croppedPhoto = previewCanvasRef.current.toDataURL("image/jpeg", 0.9);
    setForm((prev) => ({ ...prev, foto: croppedPhoto }));
    setRawPhoto("");
    setPhotoNotice("Crop foto sudah diterapkan. Klik Simpan Profil agar tersimpan permanen.");
    setSaved(false);
  };

  const removePhoto = () => {
    setRawPhoto("");
    setForm((prev) => ({ ...prev, foto: "" }));
    setEditor(initialEditor);
    setPhotoNotice("Foto profil dihapus. Klik Simpan Profil agar perubahan tersimpan.");
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      nama: form.nama.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      kendaraan: form.kendaraan.trim(),
      plat: form.plat.trim().toUpperCase(),
      alamat: form.alamat.trim()
    };

    updatePelanggan(user.id, payload);
    updateUser({ name: payload.nama, phone: payload.phone, foto: payload.foto });
    setForm(payload);
    setRawPhoto("");
    setSaved(true);
    setPhotoNotice("");
  };

  return (
    <CustomerLayout>
      <section className="customer-hero-mini">
        <div className="container">
          <p className="hero-badge mb-3">Profil</p>
          <h1 className="fw-bold mb-2">Data pelanggan dan kendaraan</h1>
          <p className="text-white-50 mb-0">Perbarui data, foto profil, dan kendaraan yang dipakai saat booking atau panggil mekanik.</p>
        </div>
      </section>
      <section className="container py-5">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-4">
            <div className="page-card p-4 h-100">
              <div className="text-center mb-4">
                <div className="profile-preview-box mx-auto mb-3">
                  {hasPhoto ? (
                    <canvas ref={previewCanvasRef} className="profile-editor-canvas" aria-label="Preview foto profil" />
                  ) : (
                    <div className="profile-empty-avatar">
                      <FaUser />
                    </div>
                  )}
                </div>
                <h5 className="fw-bold mb-1">Foto Profil</h5>
                <p className="text-muted small mb-0">Unggah foto, atur crop, zoom, posisi, dan rotasi sebelum disimpan.</p>
              </div>

              {photoNotice && <div className="alert alert-warning py-2 small">{photoNotice}</div>}

              <label className="btn btn-outline-dark w-100 mb-3">
                <FaCamera className="me-2" /> Pilih Foto
                <input type="file" accept="image/*" className="d-none" onChange={handlePhotoUpload} />
              </label>

              <div className="profile-editor-panel">
                <label className="form-label small fw-semibold mb-1">Zoom</label>
                <input type="range" className="form-range" min="1" max="2.8" step="0.05" value={editor.zoom} disabled={!hasPhoto} onChange={(event) => updateEditor("zoom", event.target.value)} />

                <label className="form-label small fw-semibold mb-1">Geser Horizontal</label>
                <input type="range" className="form-range" min="-100" max="100" step="1" value={editor.offsetX} disabled={!hasPhoto} onChange={(event) => updateEditor("offsetX", event.target.value)} />

                <label className="form-label small fw-semibold mb-1">Geser Vertikal</label>
                <input type="range" className="form-range" min="-100" max="100" step="1" value={editor.offsetY} disabled={!hasPhoto} onChange={(event) => updateEditor("offsetY", event.target.value)} />
              </div>

              <div className="d-flex gap-2 flex-wrap mt-3">
                <button type="button" className="btn btn-soft-warning flex-fill" disabled={!hasPhoto} onClick={() => rotatePhoto(-90)}>
                  <FaRotateLeft className="me-1" /> Kiri
                </button>
                <button type="button" className="btn btn-soft-warning flex-fill" disabled={!hasPhoto} onClick={() => rotatePhoto(90)}>
                  <FaRotateRight className="me-1" /> Kanan
                </button>
              </div>

              <div className="d-grid gap-2 mt-3">
                <button type="button" className="btn btn-warning" disabled={!hasPhoto} onClick={applyCrop}>Terapkan Crop</button>
                <button type="button" className="btn btn-outline-secondary" disabled={!hasPhoto} onClick={() => setEditor(initialEditor)}>Reset Posisi</button>
                <button type="button" className="btn btn-outline-danger" disabled={!hasPhoto} onClick={removePhoto}>
                  <FaTrashCan className="me-1" /> Hapus Foto
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="page-card p-4 p-md-5">
              {saved && <div className="alert alert-success">Profil berhasil diperbarui.</div>}
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6"><label className="form-label fw-semibold">Nama Lengkap</label><input name="nama" className="form-control" value={form.nama} onChange={handleChange} required /></div>
                <div className="col-md-6"><label className="form-label fw-semibold">Nomor HP</label><input name="phone" className="form-control" value={form.phone} onChange={handleChange} required /></div>
                <div className="col-12"><label className="form-label fw-semibold">Email</label><input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} /></div>
                <div className="col-md-6"><label className="form-label fw-semibold">Kendaraan</label><input name="kendaraan" className="form-control" value={form.kendaraan} onChange={handleChange} required /></div>
                <div className="col-md-6"><label className="form-label fw-semibold">Plat Nomor</label><input name="plat" className="form-control text-uppercase" value={form.plat} onChange={handleChange} required /></div>
                <div className="col-12"><label className="form-label fw-semibold">Alamat</label><textarea name="alamat" className="form-control" rows="3" value={form.alamat} onChange={handleChange} /></div>
                <div className="col-12 d-flex gap-2 flex-wrap mt-4">
                  <button className="btn btn-warning px-4">Simpan Profil</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Edit Foto Lagi</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}

export default ProfilPelanggan;
