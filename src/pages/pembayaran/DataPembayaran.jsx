import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import {
  getPembayaran,
  pembayaranStatus,
  rekeningPembayaran,
  syncPembayaranDariServis,
  tandaiBelumDibayar,
  tandaiLunas,
  updatePembayaran
} from "../../services/pembayaranService.js";
import { formatDateTime, formatRupiah } from "../../utils/format.js";
import { FaClock, FaMoneyBillWave, FaReceipt, FaCheckCircle } from "react-icons/fa";

function DataPembayaran() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [preview, setPreview] = useState(null);

  const load = () => setRows(syncPembayaranDariServis());

  useEffect(() => {
    load();
    const handleStorageUpdate = () => setRows(getPembayaran());
    window.addEventListener("booking-bengkel-updated", handleStorageUpdate);
    return () => window.removeEventListener("booking-bengkel-updated", handleStorageUpdate);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "Semua") return rows;
    return rows.filter((item) => item.status === filter);
  }, [rows, filter]);

  const totalBelumDibayar = rows.filter((item) => item.status === "Belum Dibayar").length;
  const totalLunas = rows.filter((item) => item.status === "Lunas").length;
  const totalTagihan = rows.reduce((total, item) => total + Number(item.jumlah || 0), 0);
  const totalTerbayar = rows
    .filter((item) => item.status === "Lunas")
    .reduce((total, item) => total + Number(item.jumlah || 0), 0);

  const changeStatus = (item, status) => {
    if (status === "Lunas") {
      const catatan = window.prompt("Catatan pembayaran", item.catatan || "Pembayaran sudah lunas.");
      tandaiLunas(item.id, catatan || "Pembayaran sudah lunas.");
    } else {
      const catatan = window.prompt("Catatan pembayaran", item.catatan || "Pembayaran belum diterima.");
      tandaiBelumDibayar(item.id, catatan || "Pembayaran belum diterima.");
    }
    load();
  };

  const editNote = (item) => {
    const catatan = window.prompt("Catatan admin", item.catatan || "");
    if (catatan !== null) {
      updatePembayaran(item.id, { status: item.status, catatan });
      load();
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Data Pembayaran</h2>
          <p className="text-muted mb-0">Tagihan muncul setelah servis selesai. Status pembayaran mengikuti konfirmasi pelanggan.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-primary" onClick={load}>Sinkronkan Tagihan</button>
          <select className="form-select" style={{ width: "220px" }} value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>Semua</option>
            {pembayaranStatus.map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3"><StatCard title="Total Tagihan" value={rows.length} subtitle="Dari servis selesai" icon={FaReceipt} /></div>
        <div className="col-md-6 col-xl-3"><StatCard title="Belum Dibayar" value={totalBelumDibayar} subtitle="Menunggu transfer pelanggan" icon={FaClock} /></div>
        <div className="col-md-6 col-xl-3"><StatCard title="Lunas" value={totalLunas} subtitle={formatRupiah(totalTerbayar)} icon={FaCheckCircle} /></div>
        <div className="col-md-6 col-xl-3"><StatCard title="Total Nilai Tagihan" value={formatRupiah(totalTagihan)} subtitle="Akumulasi invoice" icon={FaMoneyBillWave} /></div>
      </div>

      <div className="page-card p-4">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Kode Tagihan</th>
                <th>Pelanggan</th>
                <th>Nominal</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.id}</strong><br />
                    <small className="text-muted">Dibuat: {formatDateTime(item.createdAt)}</small><br />
                    <small className="text-muted">Update: {formatDateTime(item.updatedAt || item.createdAt)}</small>
                  </td>
                  <td>
                    {item.nama}<br />
                    <small className="text-muted">Servis: {item.servisId || "-"}</small><br />
                    <small className="text-muted">Booking: {item.bookingId || "-"}</small>
                  </td>
                  <td><strong>{formatRupiah(item.jumlah)}</strong></td>
                  <td>
                    <div className="admin-payment-method mb-2">
                      <img src={rekeningPembayaran.logoImage} alt="Logo Mandiri" />
                      <div>
                        <strong>{item.metode || "Transfer Bank Mandiri"}</strong><br />
                        <small className="text-muted">Tujuan: {item.rekeningTujuan || "MANDIRI 1770024320449"}</small>
                      </div>
                    </div>
                    <small className="text-muted d-block">{item.buktiFileName || item.bukti || "Belum ada bukti pembayaran"}</small>
                    {item.buktiFoto ? (
                      <button type="button" className="payment-proof-thumb-link d-inline-block mt-2" onClick={() => setPreview(item)}>
                        <img src={item.buktiFoto} alt={`Bukti pembayaran ${item.id}`} className="payment-proof-thumb" />
                        <span className="proof-view-label">Lihat bukti</span>
                      </button>
                    ) : (
                      <small className="text-muted d-block mt-2">Foto bukti belum diunggah.</small>
                    )}
                    {item.paidAt && <small className="text-muted d-block mt-2">Dibayar: {formatDateTime(item.paidAt)}</small>}
                  </td>
                  <td><StatusBadge status={item.status} /></td>
                  <td style={{ minWidth: "180px" }}><small>{item.catatan || "-"}</small></td>
                  <td style={{ minWidth: "240px" }}>
                    <div className="d-flex gap-2 flex-wrap">
                      {item.status === "Belum Dibayar" ? (
                        <button className="btn btn-success btn-sm" onClick={() => changeStatus(item, "Lunas")}>Tandai Lunas</button>
                      ) : (
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => changeStatus(item, "Belum Dibayar")}>Tandai Belum Dibayar</button>
                      )}
                      <button className="btn btn-soft-warning btn-sm" onClick={() => editNote(item)}>Catatan</button>
                      <select className="form-select form-select-sm" value={item.status} onChange={(event) => changeStatus(item, event.target.value)} style={{ width: "160px" }}>
                        {pembayaranStatus.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            Belum ada data pembayaran untuk filter ini. Tagihan otomatis muncul setelah status servis diubah menjadi <strong>Selesai</strong>.
          </div>
        )}
      </div>

      {preview && (
        <div className="proof-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setPreview(null)}>
          <div className="proof-modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
              <div>
                <h5 className="fw-bold mb-1">Bukti Pembayaran</h5>
                <p className="text-muted mb-0">{preview.id} • {preview.nama}</p>
              </div>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setPreview(null)}>Tutup</button>
            </div>
            <img src={preview.buktiFoto} alt={`Bukti pembayaran ${preview.id}`} className="proof-modal-image" />
            <div className="mt-3 small text-muted">
              <div>File: {preview.buktiFileName || preview.bukti || "Bukti pembayaran"}</div>
              {preview.paidAt && <div>Dibayar: {formatDateTime(preview.paidAt)}</div>}
              <div>Total: {formatRupiah(preview.jumlah)}</div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default DataPembayaran;
