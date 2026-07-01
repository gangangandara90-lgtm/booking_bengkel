# Flow Fitur Booking Bengkel

## Admin

1. Admin login melalui `/admin/login`.
2. Admin masuk ke `/admin/dashboard`.
3. Admin dapat melihat data pelanggan di `/admin/pelanggan`.
4. Admin memverifikasi booking di `/admin/booking`.
5. Booking yang diterima otomatis dibuat menjadi data servis.
6. Admin/mekanik memperbarui progress servis di `/admin/servis`.
7. Saat servis selesai, tagihan pembayaran dibuat untuk pelanggan.
8. Admin memeriksa pembayaran di `/admin/pembayaran`.
9. Admin melihat statistik operasional di `/admin/statistik`.

## Pelanggan

1. Pelanggan daftar melalui `/pelanggan/register` atau login melalui `/pelanggan/login`.
2. Pelanggan masuk ke dashboard `/pelanggan`.
3. Pelanggan melihat layanan di `/pelanggan/layanan`.
4. Pelanggan membuat booking servis di `/pelanggan/booking`.
5. Pelanggan dapat membuat panggilan mekanik di `/pelanggan/mogok`.
6. Pelanggan mengecek status di `/pelanggan/status`.
7. Pelanggan melihat riwayat di `/pelanggan/riwayat`.
8. Pelanggan melakukan konfirmasi pembayaran di `/pelanggan/pembayaran`.
9. Pelanggan mengelola profil di `/pelanggan/profil`.

## Panggil Mekanik + Maps

1. Pelanggan membuka menu Panggil Mekanik.
2. Pelanggan menekan tombol Gunakan Lokasi Saya dan memberi izin lokasi browser.
3. Sistem menyimpan patokan lokasi, latitude, longitude, dan link Google Maps.
4. Admin membuka menu Kendaraan Mogok, lalu menekan Buka Maps untuk melihat titik pelanggan.
5. Admin menentukan petugas dan mengubah status penanganan.
