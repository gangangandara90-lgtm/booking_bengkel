import { useEffect, useMemo, useRef, useState } from "react";
import { FaScrewdriverWrench, FaUsers } from "react-icons/fa6";
import { FaPen, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import {
  createMekanik,
  createMekanikBulk,
  deleteMekanik,
  getMekanik,
  makeMechanicAvatar,
  mekanikStatus,
  updateMekanik
} from "../../services/mekanikService.js";

const emptyForm = {
  id: "",
  nama: "",
  phone: "",
  spesialis: "",
  pengalaman: "",
  rating: 4.7,
  status: "Aktif",
  foto: "",
  profil: "",
  jumlahTugas: 0
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function DataMekanik() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [bulkText, setBulkText] = useState("");
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);

  const load = () => setRows(getMekanik());
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const active = rows.filter((item) => item.status !== "Tidak Aktif").length;
    const inactive = rows.length - active;
    const taskTotal = rows.reduce((sum, item) => sum + Number(item.jumlahTugas || 0), 0);
    return { active, inactive, taskTotal };
  }, [rows]);

  const resetForm = () => {
    setForm(emptyForm);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const photo = await readFileAsDataUrl(file);
    setForm((prev) => ({ ...prev, foto: photo }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.nama.trim()) return;

    if (form.id) {
      updateMekanik(form.id, form);
      setMessage("Data mekanik berhasil diperbarui.");
    } else {
      createMekanik(form);
      setMessage("Mekanik baru berhasil ditambahkan.");
    }

    resetForm();
    load();
  };

  const handleEdit = (item) => {
    setForm(item);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (item) => {
    if (!window.confirm(`Hapus mekanik ${item.nama}?`)) return;
    deleteMekanik(item.id);
    load();
  };

  const handleBulkAdd = () => {
    try {
      const created = createMekanikBulk(bulkText);
      setBulkText("");
      setMessage(`${created.length} mekanik berhasil ditambahkan sekaligus.`);
      load();
    } catch (error) {
      setMessage(error.message || "Gagal menambahkan data mekanik.");
    }
  };

  const photo = form.foto || makeMechanicAvatar(form.nama || "Mekanik");

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
        <div>
          <h2 className="fw-bold mb-1">Data Mekanik / Montir</h2>
          <p className="text-muted mb-0">Tambahkan beberapa mekanik, foto, profil, dan status ketersediaan untuk pilihan pelanggan.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={resetForm}>Form Baru</button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard title="Total Mekanik" value={rows.length} subtitle="Seluruh data montir" icon={FaUsers} /></div>
        <div className="col-md-4"><StatCard title="Mekanik Aktif" value={stats.active} subtitle="Tampil untuk pelanggan" icon={FaScrewdriverWrench} /></div>
        <div className="col-md-4"><StatCard title="Total Tugas" value={stats.taskTotal} subtitle="Akumulasi penanganan" icon={FaPlus} /></div>
      </div>

      {message && <div className="alert alert-success rounded-4">{message}</div>}

      <div className="row g-4 mb-4">
        <div className="col-xl-5">
          <div className="page-card p-4 h-100">
            <h5 className="fw-bold mb-3">{form.id ? "Edit Mekanik" : "Tambah Mekanik"}</h5>
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-12">
                <div className="mechanic-admin-photo-wrap">
                  <img src={photo} alt="Preview mekanik" className="mechanic-admin-photo" />
                  <div>
                    <label className="btn btn-soft-warning btn-sm mb-2">
                      <FaUpload className="me-2" /> Upload Foto
                      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
                    </label>
                    <p className="small text-muted mb-0">Foto akan tampil di pilihan mekanik pelanggan.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6"><label className="form-label fw-semibold">Nama Mekanik</label><input name="nama" className="form-control" value={form.nama} onChange={handleChange} required /></div>
              <div className="col-md-6"><label className="form-label fw-semibold">Nomor HP</label><input name="phone" className="form-control" value={form.phone} onChange={handleChange} /></div>
              <div className="col-12"><label className="form-label fw-semibold">Spesialis</label><input name="spesialis" className="form-control" value={form.spesialis} onChange={handleChange} placeholder="Contoh: Kelistrikan, ban, injeksi" required /></div>
              <div className="col-md-4"><label className="form-label fw-semibold">Pengalaman</label><input name="pengalaman" className="form-control" value={form.pengalaman} onChange={handleChange} placeholder="5 tahun" /></div>
              <div className="col-md-4"><label className="form-label fw-semibold">Rating</label><input type="number" step="0.1" min="1" max="5" name="rating" className="form-control" value={form.rating} onChange={handleChange} /></div>
              <div className="col-md-4"><label className="form-label fw-semibold">Status</label><select name="status" className="form-select" value={form.status} onChange={handleChange}>{mekanikStatus.map((status) => <option key={status}>{status}</option>)}</select></div>
              <div className="col-12"><label className="form-label fw-semibold">Profil Singkat</label><textarea name="profil" className="form-control" rows="4" value={form.profil} onChange={handleChange} placeholder="Tuliskan keahlian dan pengalaman mekanik" /></div>
              <div className="col-12 d-flex gap-2 flex-wrap"><button className="btn btn-warning px-4">Simpan Mekanik</button>{form.id && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Batal Edit</button>}</div>
            </form>
          </div>
        </div>

        <div className="col-xl-7">
          <div className="page-card p-4 h-100">
            <h5 className="fw-bold mb-2">Tambah Beberapa Mekanik Sekaligus</h5>
            <p className="text-muted small">Tulis satu mekanik per baris dengan format: Nama | Spesialis | Nomor HP | Pengalaman | Profil singkat</p>
            <textarea className="form-control" rows="8" value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder={"Contoh:\nRian Saputra | Kelistrikan & aki | 081200001111 | 3 tahun | Cepat menangani starter dan aki lemah\nYusuf Maulana | Ban & rem | 081200002222 | 6 tahun | Fokus penanganan darurat di jalan"} />
            <button className="btn btn-outline-warning mt-3" onClick={handleBulkAdd} disabled={!bulkText.trim()}>Tambah Sekaligus</button>
          </div>
        </div>
      </div>

      <div className="page-card p-4">
        <div className="row g-3">
          {rows.map((item) => (
            <div className="col-md-6 col-xl-4" key={item.id}>
              <div className="mechanic-admin-card h-100">
                <div className="d-flex gap-3 align-items-start">
                  <img src={item.foto || makeMechanicAvatar(item.nama)} alt={item.nama} className="mechanic-admin-list-photo" />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <h6 className="fw-bold mb-1">{item.nama}</h6>
                        <p className="small text-muted mb-1">{item.spesialis}</p>
                      </div>
                      <span className={`badge rounded-pill ${item.status === "Aktif" ? "bg-success" : "bg-secondary"}`}>{item.status}</span>
                    </div>
                    <p className="small text-muted mb-2">{item.pengalaman || "Pengalaman belum diisi"} • ⭐ {item.rating}</p>
                    <p className="small mb-3">{item.profil}</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(item)}><FaPen className="me-1" /> Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(item)}><FaTrash className="me-1" /> Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {rows.length === 0 && <div className="col-12"><div className="empty-state">Belum ada mekanik. Tambahkan mekanik terlebih dahulu.</div></div>}
        </div>
      </div>
    </AdminLayout>
  );
}

export default DataMekanik;
