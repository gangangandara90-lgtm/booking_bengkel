# Booking Bengkel Cihuyyy

Aplikasi web booking bengkel motor berbasis React + Vite. Project ini sudah dipisahkan menjadi dua portal:

- `/` dan `/pelanggan` untuk portal pelanggan.
- `/admin` dan `/admin/login` untuk panel admin.

Tampilan admin dan pelanggan tidak dicampur. Pelanggan tidak melihat menu admin, dan admin tidak melihat menu pelanggan.

## Backend Firebase

Project ini sudah siap memakai Firebase Firestore sebagai backend data.

- Jika `VITE_USE_FIREBASE=true` dan config Firebase diisi, data akan disinkronkan ke Firestore.
- Jika config Firebase belum diisi, aplikasi tetap berjalan memakai localStorage demo agar mudah dites.
- Database Firestore menyiapkan collection `admins`, `pelanggan`, `mekanik`, `layanan`, `booking`, `servis`, `mogok`, dan `pembayaran`.
- Register pelanggan, login pelanggan, dan login admin sudah memakai data yang sama dengan database aplikasi.
- Panduan detail ada di `docs/firebase-setup.md`.

## Akun Demo

### Admin

```text
URL      : /admin atau /admin/login
Username : admin
Password : admin123
```

### Pelanggan

```text
URL      : /pelanggan atau /pelanggan/login
Username : rizky
Password : rizky123
```

```text
Username : dewi
Password : dewi123
```

## Fitur Admin

- Login admin.
- Dashboard operasional.
- Kelola data pelanggan.
- Verifikasi booking.
- Terima booking dan otomatis membuat data servis.
- Kelola data layanan: tambah, edit, aktif/nonaktif, hapus.
- Kelola data servis: mekanik, progress, status, biaya, catatan.
- Kelola data mekanik/montir: tambah satuan, tambah beberapa sekaligus, edit profil, upload foto, aktif/nonaktif, dan hapus.
- Saat status servis menjadi **Selesai**, tagihan pembayaran otomatis dibuat.
- Kelola kendaraan mogok / panggilan mekanik dengan titik Google Maps.
- Kelola pembayaran dengan status **Belum Dibayar** dan **Lunas**.
- Statistik booking, servis, panggilan darurat, dan omzet.
- Logout admin.

## Fitur Pelanggan

- Registrasi pelanggan.
- Login pelanggan.
- Dashboard pelanggan.
- Melihat daftar layanan.
- Membuat booking servis.
- Panggil mekanik darurat dengan titik maps dan memilih mekanik/montir berdasarkan foto serta profil.
- Cek status booking dan panggilan mekanik.
- Melihat riwayat.
- Membayar tagihan setelah servis selesai melalui transfer Bank Mandiri.
- Upload foto bukti pembayaran dengan preview sebelum dikirim.
- Mengelola profil pelanggan dan foto profil dengan preview/crop.
- Logout pelanggan.

## Alur Pembayaran Terbaru

1. Pelanggan membuat booking servis.
2. Admin menerima booking.
3. Data servis otomatis dibuat.
4. Admin/mekanik mengubah status servis menjadi **Selesai**.
5. Sistem membuat tagihan otomatis dengan status **Belum Dibayar**.
6. Pelanggan membuka halaman pembayaran.
7. Pelanggan membayar melalui **MANDIRI 1770024320449**.
8. Pelanggan wajib upload foto bukti pembayaran.
9. Setelah bukti dikirim, status pembayaran berubah menjadi **Lunas**.
10. Admin melihat status dan bukti foto:
   - **Belum Dibayar** = pelanggan belum membayar.
   - **Lunas** = pelanggan sudah membayar.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:5173
```

## Setup Firebase

1. Buat project di Firebase Console.
2. Tambahkan aplikasi Web.
3. Aktifkan Firestore Database.
4. Copy `.env.example` menjadi `.env.local`.
5. Isi konfigurasi Firebase di `.env.local`.
6. Jalankan ulang aplikasi.

Contoh `.env.local`:

```env
VITE_USE_FIREBASE=true
VITE_FIREBASE_API_KEY=isi_api_key
VITE_FIREBASE_AUTH_DOMAIN=isi_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=isi_project_id
VITE_FIREBASE_STORAGE_BUCKET=isi_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=isi_sender_id
VITE_FIREBASE_APP_ID=isi_app_id
```

## Cara Build

```bash
npm run build
```

## Cara Upload ke GitHub

Di folder project:

```bash
git init
git add .
git commit -m "tambah fitur pilih mekanik"
git branch -M main
git remote add origin https://github.com/gangangandara90-lgtm/booking_bengkel.git
git push -u origin main --force
```

Kalau `origin already exists`:

```bash
git remote set-url origin https://github.com/gangangandara90-lgtm/booking_bengkel.git
git push -u origin main --force
```

## Catatan Teknis

- Data akan tetap tersimpan lokal agar aplikasi tidak blank ketika Firebase belum dikonfigurasi.
- Setelah Firebase aktif, perubahan data otomatis dikirim ke Firestore.
- Jika browser masih menyimpan data lama, buka DevTools, hapus `localStorage` untuk `localhost:5173`, lalu refresh.
- Foto profil dan bukti pembayaran disimpan sebagai data gambar untuk kebutuhan demo. Untuk produksi besar, sebaiknya pindahkan file gambar ke Firebase Storage.
