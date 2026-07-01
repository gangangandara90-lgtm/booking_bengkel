import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import { deletePelanggan, getPelanggan, updatePelanggan } from "../../services/pelangganService.js";
import { formatDateTime } from "../../utils/format.js";
import { FaUser } from "react-icons/fa6";

function DataPelanggan() {
  const [rows, setRows] = useState([]);
  const load = () => setRows(getPelanggan());
  useEffect(() => { load(); }, []);

  const editPelanggan = (item) => {
    const nama = window.prompt("Nama pelanggan", item.nama);
    if (nama === null) return;
    const phone = window.prompt("Nomor HP", item.phone);
    if (phone === null) return;
    const kendaraan = window.prompt("Kendaraan", item.kendaraan);
    if (kendaraan === null) return;
    const plat = window.prompt("Plat nomor", item.plat);
    if (plat === null) return;
    updatePelanggan(item.id, { nama, phone, kendaraan, plat: plat.toUpperCase() });
    load();
  };

  const remove = (id) => {
    if (window.confirm("Hapus data pelanggan ini?")) {
      deletePelanggan(id);
      load();
    }
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Data Pelanggan</h2>
        <p className="text-muted mb-0">Kelola akun pelanggan yang melakukan booking dan panggilan mekanik.</p>
      </div>
      <div className="page-card p-4">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Kode</th><th>Pelanggan</th><th>Akun</th><th>Kendaraan</th><th>Alamat</th><th>Aksi</th></tr></thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong><br /><small className="text-muted">{formatDateTime(item.createdAt)}</small></td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      {item.foto ? <img src={item.foto} alt={item.nama} className="admin-customer-avatar" /> : <div className="admin-customer-avatar admin-customer-avatar-empty"><FaUser /></div>}
                      <div>{item.nama}<br /><small className="text-muted">{item.phone}</small></div>
                    </div>
                  </td>
                  <td>{item.username || "-"}<br /><small className="text-muted">{item.email || "Email belum diisi"}</small></td>
                  <td>{item.kendaraan}<br /><small className="text-muted">{item.plat}</small></td>
                  <td><small className="text-muted">{item.alamat || "Belum diisi"}</small></td>
                  <td><div className="d-flex gap-2 flex-wrap"><button className="btn btn-soft-warning btn-sm" onClick={() => editPelanggan(item)}>Edit</button><button className="btn btn-outline-danger btn-sm" onClick={() => remove(item.id)}>Hapus</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <div className="empty-state">Belum ada data pelanggan.</div>}
      </div>
    </AdminLayout>
  );
}

export default DataPelanggan;
