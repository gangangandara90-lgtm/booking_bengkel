import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { bookingStatus, getBookings, updateBooking } from "../../services/bookingService.js";
import { createServisFromBooking, updateServis } from "../../services/servisService.js";
import { formatDateTime } from "../../utils/format.js";

function VerifikasiBooking() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("Semua");

  const load = () => setRows(getBookings());
  useEffect(() => { load(); }, []);

  const filteredRows = useMemo(() => {
    if (filter === "Semua") return rows;
    return rows.filter((item) => item.status === filter);
  }, [filter, rows]);

  const handleApprove = (id) => {
    createServisFromBooking(id);
    load();
  };

  const handleReject = (id) => {
    const reason = window.prompt("Catatan penolakan", "Jadwal tidak tersedia.");
    updateBooking(id, { status: "Ditolak", catatanAdmin: reason || "Ditolak oleh admin." });
    load();
  };

  const handleStatus = (id, status) => {
    if (status === "Diverifikasi") {
      createServisFromBooking(id);
    } else if (status === "Dikerjakan") {
      const servis = createServisFromBooking(id, { status: "Dikerjakan", progress: 25 });
      updateServis(servis.id, { status: "Dikerjakan", progress: 25 });
    } else if (status === "Selesai") {
      const servis = createServisFromBooking(id, { status: "Selesai", progress: 100 });
      updateServis(servis.id, { status: "Selesai", progress: 100 });
    } else {
      updateBooking(id, { status });
    }
    load();
  };

  const handleNote = (id, current) => {
    const note = window.prompt("Catatan admin", current || "");
    if (note !== null) {
      updateBooking(id, { catatanAdmin: note });
      load();
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Verifikasi Booking</h2>
          <p className="text-muted mb-0">Terima, tolak, dan pantau jadwal booking pelanggan.</p>
        </div>
        <select className="form-select" style={{ width: "240px" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>Semua</option>
          {bookingStatus.map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>

      <div className="page-card p-4">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr><th>Kode</th><th>Pelanggan</th><th>Layanan</th><th>Jadwal</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {filteredRows.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong><br /><small className="text-muted">{formatDateTime(item.createdAt)}</small></td>
                  <td>{item.nama}<br /><small className="text-muted">{item.phone} • {item.plat}</small></td>
                  <td>{item.layanan}<br /><small className="text-muted">{item.keluhan}</small></td>
                  <td>{item.tanggal}<br /><small className="text-muted">Pukul {item.jam}</small></td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      {item.status === "Menunggu Verifikasi" && <button className="btn btn-success btn-sm" onClick={() => handleApprove(item.id)}>Terima</button>}
                      {item.status === "Menunggu Verifikasi" && <button className="btn btn-outline-danger btn-sm" onClick={() => handleReject(item.id)}>Tolak</button>}
                      <button className="btn btn-soft-warning btn-sm" onClick={() => handleNote(item.id, item.catatanAdmin)}>Catatan</button>
                      <select className="form-select form-select-sm" value={item.status} onChange={(e) => handleStatus(item.id, e.target.value)} style={{ width: "170px" }}>
                        {bookingStatus.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRows.length === 0 && <div className="empty-state">Tidak ada data booking untuk filter ini.</div>}
      </div>
    </AdminLayout>
  );
}

export default VerifikasiBooking;
