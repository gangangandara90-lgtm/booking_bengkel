import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { getMogok, mogokStatus, updateMogok } from "../../services/mogokService.js";
import { getMekanikAktif, getMekanikById, makeMechanicAvatar } from "../../services/mekanikService.js";
import { formatDateTime } from "../../utils/format.js";
import { formatCoordinate, getGoogleMapsUrl, getOsmEmbedUrl, hasCoordinates } from "../../utils/maps.js";

function DataMogok() {
  const [rows, setRows] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const load = () => {
    setRows(getMogok());
    setMechanics(getMekanikAktif());
  };
  useEffect(() => { load(); }, []);

  const mechanicOptions = useMemo(() => mechanics, [mechanics]);

  const updateField = (item, patch) => {
    updateMogok(item.id, { ...item, ...patch });
    load();
  };

  const changeMechanic = (item, mekanikId) => {
    const mekanik = getMekanikById(mekanikId);
    updateField(item, {
      mekanikId: mekanik?.id || "",
      mekanikNama: mekanik?.nama || "",
      mekanikPhone: mekanik?.phone || "",
      mekanikSpesialis: mekanik?.spesialis || "",
      mekanikFoto: mekanik?.foto || "",
      petugas: mekanik?.nama || ""
    });
  };

  const editResponse = (item) => {
    const catatan = window.prompt("Catatan penanganan", item.catatan || "");
    if (catatan === null) return;
    updateField(item, { catatan: catatan || "" });
  };

  const copyMapsLink = async (item) => {
    const url = getGoogleMapsUrl(item);
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      window.alert("Link Maps berhasil disalin.");
    } catch {
      window.prompt("Salin link Maps ini", url);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
        <div>
          <h2 className="fw-bold mb-1">Kendaraan Mogok</h2>
          <p className="text-muted mb-0">Kelola permintaan bantuan mekanik darurat dari pelanggan, termasuk titik lokasi Maps dan mekanik pilihan.</p>
        </div>
        <a href="/admin/mekanik" className="btn btn-outline-warning">Kelola Mekanik</a>
      </div>
      <div className="page-card p-4">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Kode</th><th>Pelanggan</th><th>Lokasi & Maps</th><th>Mekanik</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {rows.map((item) => {
                const mapsUrl = getGoogleMapsUrl(item);
                const mechanic = getMekanikById(item.mekanikId) || null;
                const mechanicName = mechanic?.nama || item.mekanikNama || item.petugas || "Belum dipilih";
                const mechanicPhoto = mechanic?.foto || item.mekanikFoto || makeMechanicAvatar(mechanicName);
                return (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong><br /><small className="text-muted">{formatDateTime(item.createdAt)}</small></td>
                    <td>{item.nama}<br /><small className="text-muted">{item.phone} • {item.kendaraan} • {item.plat}</small></td>
                    <td style={{ minWidth: "280px" }}>
                      <strong>{item.lokasi}</strong><br />
                      <small className="text-muted d-block mb-2">{item.keluhan}</small>
                      {hasCoordinates(item) ? (
                        <div className="admin-map-card">
                          <iframe title={`Titik lokasi ${item.id}`} src={getOsmEmbedUrl(item)} className="admin-map-frame" loading="lazy" />
                          <small className="text-muted d-block mt-2">Koordinat: {formatCoordinate(item.latitude)}, {formatCoordinate(item.longitude)}</small>
                          <div className="d-flex gap-2 flex-wrap mt-2">
                            <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-warning btn-sm">Buka Maps</a>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => copyMapsLink(item)}>Salin Link</button>
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-light border rounded-4 py-2 px-3 mb-0">
                          <small className="text-muted">Pelanggan belum mengirim titik koordinat. Gunakan patokan manual di atas.</small>
                        </div>
                      )}
                    </td>
                    <td style={{ minWidth: "260px" }}>
                      <div className="admin-mekanik-cell mb-2">
                        <img src={mechanicPhoto} alt={mechanicName} />
                        <div>
                          <strong>{mechanicName}</strong>
                          <small>{mechanic?.spesialis || item.mekanikSpesialis || "Spesialis belum diisi"}</small>
                          <small>{mechanic?.phone || item.mekanikPhone || "Nomor HP belum diisi"}</small>
                        </div>
                      </div>
                      <select className="form-select form-select-sm" value={item.mekanikId || ""} onChange={(e) => changeMechanic(item, e.target.value)}>
                        <option value="">Pilih mekanik</option>
                        {mechanicOptions.map((mekanik) => <option key={mekanik.id} value={mekanik.id}>{mekanik.nama} - {mekanik.spesialis}</option>)}
                      </select>
                      <small className="text-muted d-block mt-2">{item.catatan || "Belum ada catatan admin"}</small>
                    </td>
                    <td><StatusBadge status={item.status} /></td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <select className="form-select form-select-sm" value={item.status} onChange={(e) => updateField(item, { status: e.target.value })} style={{ width: "165px" }}>
                          {mogokStatus.map((status) => <option key={status}>{status}</option>)}
                        </select>
                        <button className="btn btn-soft-warning btn-sm" onClick={() => editResponse(item)}>Catatan</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan="6"><div className="empty-state">Belum ada permintaan panggilan mekanik.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DataMogok;
