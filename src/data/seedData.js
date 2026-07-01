const mechanicAvatar = (name, color = "#f59e0b") => {
  const initials = String(name || "M").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs><rect width="320" height="320" rx="64" fill="url(#g)"/><circle cx="160" cy="128" r="58" fill="rgba(255,255,255,.88)"/><path d="M70 278c10-57 50-90 90-90s80 33 90 90" fill="rgba(255,255,255,.88)"/><text x="160" y="288" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="42" fill="#fff">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const seedData = {
  admins: [
    {
      id: "ADM-260701-001",
      nama: "Admin Bengkel",
      username: "admin",
      password: "admin123",
      role: "admin",
      createdAt: "2026-07-01T08:00:00+07:00"
    }
  ],
  pelanggan: [
    {
      id: "CUS-260701-001",
      nama: "Rizky Maulana",
      username: "rizky",
      password: "rizky123",
      phone: "081234567890",
      email: "rizky@email.com",
      kendaraan: "Honda Beat",
      plat: "D 1234 ABC",
      alamat: "Jl. Cibadak No. 10",
      foto: "",
      createdAt: "2026-07-01T08:20:00+07:00"
    },
    {
      id: "CUS-260701-002",
      nama: "Dewi Kartika",
      username: "dewi",
      password: "dewi123",
      phone: "082112223333",
      email: "dewi@email.com",
      kendaraan: "Yamaha NMAX",
      plat: "D 4411 ZK",
      alamat: "Jl. Otista No. 21",
      foto: "",
      createdAt: "2026-07-01T09:05:00+07:00"
    }
  ],
  mekanik: [
    {
      id: "MEK-260701-001",
      nama: "Asep Gunawan",
      phone: "081298760001",
      spesialis: "Servis ringan & kelistrikan",
      pengalaman: "5 tahun",
      rating: 4.8,
      status: "Aktif",
      foto: mechanicAvatar("Asep Gunawan", "#f59e0b"),
      profil: "Terbiasa menangani motor matic, starter mati, aki lemah, dan pengecekan darurat di lokasi pelanggan.",
      jumlahTugas: 18,
      createdAt: "2026-07-01T08:10:00+07:00"
    },
    {
      id: "MEK-260701-002",
      nama: "Budi Santoso",
      phone: "081298760002",
      spesialis: "Tune up & injeksi",
      pengalaman: "7 tahun",
      rating: 4.9,
      status: "Aktif",
      foto: mechanicAvatar("Budi Santoso", "#fb923c"),
      profil: "Fokus pada masalah mesin brebet, injeksi, langsam tidak stabil, dan pengecekan performa motor harian.",
      jumlahTugas: 24,
      createdAt: "2026-07-01T08:12:00+07:00"
    },
    {
      id: "MEK-260701-003",
      nama: "Dadan Pratama",
      phone: "081298760003",
      spesialis: "Ban, rem & emergency road service",
      pengalaman: "4 tahun",
      rating: 4.7,
      status: "Aktif",
      foto: mechanicAvatar("Dadan Pratama", "#334155"),
      profil: "Siap membantu panggilan darurat untuk ban bocor, rem bermasalah, rantai lepas, dan motor mogok di jalan.",
      jumlahTugas: 16,
      createdAt: "2026-07-01T08:14:00+07:00"
    }
  ],
  layanan: [
    {
      id: "LAY-001",
      nama: "Servis Ringan",
      kategori: "Perawatan Berkala",
      estimasi: "45 menit",
      harga: 75000,
      deskripsi: "Pengecekan oli, rem, rantai, tekanan ban, dan kelistrikan dasar.",
      aktif: true
    },
    {
      id: "LAY-002",
      nama: "Ganti Oli",
      kategori: "Perawatan Mesin",
      estimasi: "25 menit",
      harga: 55000,
      deskripsi: "Penggantian oli mesin dan pengecekan kondisi filter.",
      aktif: true
    },
    {
      id: "LAY-003",
      nama: "Tune Up",
      kategori: "Performa Mesin",
      estimasi: "90 menit",
      harga: 150000,
      deskripsi: "Pembersihan sistem pembakaran, pengecekan busi, injeksi/karburator, dan setting idle.",
      aktif: true
    },
    {
      id: "LAY-004",
      nama: "Panggilan Mekanik",
      kategori: "Darurat",
      estimasi: "30-60 menit",
      harga: 100000,
      deskripsi: "Bantuan mekanik ke lokasi pelanggan untuk kendaraan mogok.",
      aktif: true
    }
  ],
  booking: [
    {
      id: "BK-260701-001",
      pelangganId: "CUS-260701-001",
      nama: "Rizky Maulana",
      phone: "081234567890",
      kendaraan: "Honda Beat",
      plat: "D 1234 ABC",
      layananId: "LAY-001",
      layanan: "Servis Ringan",
      tanggal: "2026-07-03",
      jam: "09:00",
      keluhan: "Tarikan terasa berat dan rem belakang kurang pakem.",
      status: "Menunggu Verifikasi",
      catatanAdmin: "",
      createdAt: "2026-07-01T08:30:00+07:00"
    },
    {
      id: "BK-260701-002",
      pelangganId: "CUS-260701-002",
      nama: "Dewi Kartika",
      phone: "082112223333",
      kendaraan: "Yamaha NMAX",
      plat: "D 4411 ZK",
      layananId: "LAY-003",
      layanan: "Tune Up",
      tanggal: "2026-07-03",
      jam: "13:30",
      keluhan: "Mesin sulit langsam saat pagi.",
      status: "Diverifikasi",
      catatanAdmin: "Datang 10 menit lebih awal.",
      createdAt: "2026-07-01T09:10:00+07:00"
    }
  ],
  servis: [
    {
      id: "SRV-260701-001",
      bookingId: "BK-260701-002",
      pelangganId: "CUS-260701-002",
      nama: "Dewi Kartika",
      phone: "082112223333",
      kendaraan: "Yamaha NMAX",
      plat: "D 4411 ZK",
      layanan: "Tune Up",
      mekanik: "Asep",
      status: "Dikerjakan",
      progress: 55,
      biaya: 150000,
      catatan: "Pengecekan busi dan throttle body sedang dilakukan.",
      createdAt: "2026-07-01T09:40:00+07:00"
    }
  ],
  mogok: [
    {
      id: "MGK-260701-001",
      pelangganId: "",
      nama: "Agus Permana",
      phone: "085700001234",
      kendaraan: "Honda Vario",
      plat: "D 8976 KL",
      lokasi: "Jl. Cimanuk dekat SPBU",
      latitude: "-7.223402",
      longitude: "107.904802",
      mapsUrl: "https://www.google.com/maps?q=-7.223402,107.904802",
      keluhan: "Motor mati mendadak dan tidak bisa starter.",
      mekanikId: "MEK-260701-003",
      mekanikNama: "Dadan Pratama",
      mekanikPhone: "081298760003",
      mekanikSpesialis: "Ban, rem & emergency road service",
      mekanikFoto: mechanicAvatar("Dadan Pratama", "#334155"),
      status: "Menunggu",
      petugas: "Dadan Pratama",
      catatan: "",
      createdAt: "2026-07-01T10:05:00+07:00"
    }
  ],
  pembayaran: [
    {
      id: "PAY-260701-001",
      servisId: "SRV-260701-001",
      bookingId: "BK-260701-002",
      pelangganId: "CUS-260701-002",
      nama: "Dewi Kartika",
      jumlah: 150000,
      metode: "",
      rekeningTujuan: "MANDIRI 1770024320449",
      status: "Belum Dibayar",
      bukti: "",
      buktiFileName: "",
      buktiFoto: "",
      catatan: "",
      createdAt: "2026-07-01T10:15:00+07:00"
    }
  ]
};
