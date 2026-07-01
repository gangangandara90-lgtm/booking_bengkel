CREATE DATABASE IF NOT EXISTS booking_bengkel;
USE booking_bengkel;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pelanggan (
  id VARCHAR(30) PRIMARY KEY,
  nama VARCHAR(120) NOT NULL,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(120),
  kendaraan VARCHAR(120),
  plat VARCHAR(30),
  alamat TEXT,
  foto LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mekanik (
  id VARCHAR(30) PRIMARY KEY,
  nama VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  spesialis VARCHAR(160),
  pengalaman VARCHAR(80),
  rating DECIMAL(2,1) DEFAULT 4.7,
  status VARCHAR(30) DEFAULT 'Aktif',
  foto LONGTEXT,
  profil TEXT,
  jumlah_tugas INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE layanan (
  id VARCHAR(30) PRIMARY KEY,
  nama VARCHAR(120) NOT NULL,
  kategori VARCHAR(80),
  estimasi VARCHAR(50),
  harga INT DEFAULT 0,
  deskripsi TEXT,
  aktif BOOLEAN DEFAULT TRUE
);

CREATE TABLE booking (
  id VARCHAR(30) PRIMARY KEY,
  pelanggan_id VARCHAR(30),
  nama VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  kendaraan VARCHAR(120),
  plat VARCHAR(30),
  layanan_id VARCHAR(30),
  layanan VARCHAR(120),
  tanggal DATE,
  jam TIME,
  keluhan TEXT,
  status VARCHAR(50) DEFAULT 'Menunggu Verifikasi',
  catatan_admin TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE SET NULL,
  FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE SET NULL
);

CREATE TABLE servis (
  id VARCHAR(30) PRIMARY KEY,
  booking_id VARCHAR(30),
  pelanggan_id VARCHAR(30),
  nama VARCHAR(120),
  phone VARCHAR(30),
  kendaraan VARCHAR(120),
  plat VARCHAR(30),
  layanan VARCHAR(120),
  mekanik VARCHAR(120),
  status VARCHAR(50) DEFAULT 'Menunggu Pengerjaan',
  progress INT DEFAULT 0,
  biaya INT DEFAULT 0,
  catatan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE SET NULL,
  FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE SET NULL
);

CREATE TABLE mogok (
  id VARCHAR(30) PRIMARY KEY,
  pelanggan_id VARCHAR(30),
  nama VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  kendaraan VARCHAR(120),
  plat VARCHAR(30),
  lokasi TEXT,
  latitude VARCHAR(30),
  longitude VARCHAR(30),
  maps_url TEXT,
  keluhan TEXT,
  mekanik_id VARCHAR(30),
  mekanik_nama VARCHAR(120),
  mekanik_phone VARCHAR(30),
  mekanik_spesialis VARCHAR(160),
  mekanik_foto LONGTEXT,
  status VARCHAR(50) DEFAULT 'Menunggu',
  petugas VARCHAR(120),
  catatan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE SET NULL,
  FOREIGN KEY (mekanik_id) REFERENCES mekanik(id) ON DELETE SET NULL
);

CREATE TABLE pembayaran (
  id VARCHAR(30) PRIMARY KEY,
  servis_id VARCHAR(30),
  booking_id VARCHAR(30),
  pelanggan_id VARCHAR(30),
  nama VARCHAR(120),
  jumlah INT DEFAULT 0,
  metode VARCHAR(80),
  rekening_tujuan VARCHAR(120) DEFAULT 'MANDIRI 1770024320449',
  status VARCHAR(50) DEFAULT 'Belum Dibayar',
  bukti VARCHAR(255),
  bukti_file_name VARCHAR(255),
  bukti_foto LONGTEXT,
  catatan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (servis_id) REFERENCES servis(id) ON DELETE SET NULL,
  FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE SET NULL,
  FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE SET NULL
);

INSERT INTO admins (username, password, nama) VALUES ('admin', 'admin123', 'Admin Bengkel');
