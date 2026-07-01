# Setup Firebase Backend

Project ini sudah siap memakai Firebase Firestore sebagai backend data. Jika `VITE_USE_FIREBASE=true` dan konfigurasi Firebase valid, semua perubahan data akan disinkronkan ke Firestore.

## Collection Database

Saat pertama kali dijalankan, aplikasi menyiapkan collection berikut di Firestore:

- `admins` untuk akun login admin.
- `pelanggan` untuk register dan login pelanggan.
- `layanan` untuk layanan bengkel.
- `booking` untuk booking servis.
- `servis` untuk progress pengerjaan servis.
- `mogok` untuk panggilan mekanik beserta titik lokasi maps.
- `pembayaran` untuk tagihan, status pembayaran, metode, rekening dan upload foto bukti.

Akun admin awal:

```text
username: admin
password: admin123
```

## 1. Buat project Firebase

1. Buka Firebase Console.
2. Klik **Add project**.
3. Buat project baru.
4. Masuk ke **Project settings**.
5. Tambahkan aplikasi **Web**.
6. Salin nilai konfigurasi Firebase.

## 2. Buat database Firestore

1. Masuk ke **Build > Firestore Database**.
2. Klik **Create database**.
3. Pilih mode test untuk demo/presentasi.
4. Pilih lokasi database.
5. Buat database.

Rules untuk demo lokal:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Rules di atas hanya untuk demo/tugas. Untuk production, rules wajib diamankan.

## 3. Isi file `.env.local`

Copy `.env.example` menjadi `.env.local`, lalu isi konfigurasi sesuai Firebase project.

```env
VITE_USE_FIREBASE=true
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 4. Install dan jalankan

```bash
npm install
npm run dev
```

## 5. Alur register dan login

1. Pelanggan melakukan registrasi dari `/pelanggan/register`.
2. Data pelanggan masuk ke collection `pelanggan`.
3. Pelanggan login dari `/pelanggan/login` memakai username atau nomor HP.
4. Admin login dari `/admin/login` memakai data collection `admins`.

## 6. Alur pembayaran terbaru

1. Pelanggan melakukan booking.
2. Admin menerima booking.
3. Servis masuk ke data servis.
4. Admin/mekanik mengubah status servis menjadi **Selesai**.
5. Sistem membuat tagihan otomatis dengan status **Belum Dibayar**.
6. Pelanggan membuka halaman pembayaran.
7. Pelanggan membayar ke:

```text
Bank    : MANDIRI
No. Rek : 1770024320449
a.n.    : Bengkel Chuyyy
```

8. Pelanggan membayar melalui **Transfer Bank Mandiri** dan mengunggah foto bukti transfer.
9. Pelanggan wajib upload foto bukti pembayaran.
10. Setelah bukti dikirim, status pembayaran berubah menjadi **Lunas**.
11. Admin melihat bukti foto di halaman `/admin/pembayaran`.

## Catatan

- Foto bukti pembayaran disimpan sebagai data gambar agar mudah demo. Untuk production besar, sebaiknya upload file ke Firebase Storage lalu simpan URL-nya di Firestore.
