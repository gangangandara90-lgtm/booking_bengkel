import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { getServis, servisStatus, updateServis } from "../../services/servisService.js";
import { formatRupiah } from "../../utils/format.js";

function DataServis() {
  const [rows, setRows] = useState([]);
  const load = () => setRows(getServis());
  useEffect(() => { load(); }, []);

  const changeStatus = (item, status) => {
    const progress = status === "Selesai" ? 100 : status === "Dikerjakan" && item.progress < 25 ? 25 : item.progress;
    updateServis(item.id, { ...item, status, progress });
    load();
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Data Servis</h2>
        <p className="text-muted mb-0">Pantau proses pengerjaan, mekanik, catatan, dan biaya servis.</p>
      </div>
      <div className="page-card p-4">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Kode</th><th>Pelanggan</th><th>Layanan</th><th>Mekanik</th><th>Progress</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong><br /><small className="text-muted">{item.bookingId}</small></td>
                  <td>{item.nama}<br /><small className="text-muted">{item.kendaraan} • {item.plat}</small></td>
                  <td>{item.layanan}<br /><small className="text-muted">{formatRupiah(item.biaya)}</small></td>
                  <td>{item.mekanik}</td>
                  <td style={{ minWidth: "160px" }}>
                    <div className="progress"><div className="progress-bar bg-warning" style={{ width: `${item.progress}%` }} /></div>
                    <small className="text-muted">{item.progress}%</small>
                  </td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <Link to={`/admin/servis/${item.id}`} className="btn btn-outline-primary btn-sm">Detail</Link>
                      <select className="form-select form-select-sm" value={item.status} onChange={(e) => changeStatus(item, e.target.value)} style={{ width: "170px" }}>
                        {servisStatus.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <div className="empty-state">Belum ada servis. Terima booking terlebih dahulu.</div>}
      </div>
    </AdminLayout>
  );
}

export default DataServis;
