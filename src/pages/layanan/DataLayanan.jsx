import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { deleteLayanan, getLayanan, updateLayanan } from "../../services/layananService.js";
import { formatRupiah } from "../../utils/format.js";

function DataLayanan() {
  const [rows, setRows] = useState([]);
  const load = () => setRows(getLayanan());
  useEffect(() => { load(); }, []);

  const toggleAktif = (item) => {
    updateLayanan(item.id, { ...item, aktif: !item.aktif });
    load();
  };

  const remove = (id) => {
    if (window.confirm("Hapus layanan ini?")) {
      deleteLayanan(id);
      load();
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Data Layanan</h2>
          <p className="text-muted mb-0">Kelola jenis layanan, estimasi, dan harga servis.</p>
        </div>
        <Link to="/admin/layanan/tambah" className="btn btn-warning">Tambah Layanan</Link>
      </div>

      <div className="page-card p-4">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Layanan</th><th>Kategori</th><th>Estimasi</th><th>Harga</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.nama}</strong><br /><small className="text-muted">{item.deskripsi}</small></td>
                  <td>{item.kategori}</td>
                  <td>{item.estimasi}</td>
                  <td>{formatRupiah(item.harga)}</td>
                  <td><StatusBadge status={item.aktif ? "Aktif" : "Nonaktif"} /></td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <Link to={`/admin/layanan/edit/${item.id}`} className="btn btn-outline-primary btn-sm">Edit</Link>
                      <button className="btn btn-soft-warning btn-sm" onClick={() => toggleAktif(item)}>{item.aktif ? "Nonaktifkan" : "Aktifkan"}</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => remove(item.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DataLayanan;
