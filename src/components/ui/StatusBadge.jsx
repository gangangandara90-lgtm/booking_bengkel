const tone = {
  "Menunggu Verifikasi": "bg-warning-subtle text-warning-emphasis",
  Diverifikasi: "bg-primary-subtle text-primary-emphasis",
  Ditolak: "bg-danger-subtle text-danger-emphasis",
  Dikerjakan: "bg-info-subtle text-info-emphasis",
  "Menunggu Pengerjaan": "bg-secondary-subtle text-secondary-emphasis",
  Selesai: "bg-success-subtle text-success-emphasis",
  Menunggu: "bg-warning-subtle text-warning-emphasis",
  Diterima: "bg-primary-subtle text-primary-emphasis",
  "Dalam Perjalanan": "bg-info-subtle text-info-emphasis",
  Dibatalkan: "bg-danger-subtle text-danger-emphasis",
  Aktif: "bg-success-subtle text-success-emphasis",
  Nonaktif: "bg-secondary-subtle text-secondary-emphasis",
  "Belum Dibayar": "bg-secondary-subtle text-secondary-emphasis",
  Lunas: "bg-success-subtle text-success-emphasis"
};

function StatusBadge({ status }) {
  return <span className={`badge rounded-pill px-3 py-2 ${tone[status] || "bg-secondary-subtle text-secondary-emphasis"}`}>{status}</span>;
}

export default StatusBadge;
