import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/landing/LandingPage.jsx";
import Login from "../pages/auth/Login.jsx";
import CustomerLogin from "../pages/auth/CustomerLogin.jsx";
import RegisterPelanggan from "../pages/auth/RegisterPelanggan.jsx";
import CustomerDashboard from "../pages/customer/CustomerDashboard.jsx";
import DaftarLayanan from "../pages/customer/DaftarLayanan.jsx";
import BookingBaru from "../pages/customer/BookingBaru.jsx";
import CekStatus from "../pages/customer/CekStatus.jsx";
import PanggilMekanik from "../pages/customer/PanggilMekanik.jsx";
import RiwayatPelanggan from "../pages/customer/RiwayatPelanggan.jsx";
import PembayaranPelanggan from "../pages/customer/PembayaranPelanggan.jsx";
import ProfilPelanggan from "../pages/customer/ProfilPelanggan.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import DataPelanggan from "../pages/pelanggan/DataPelanggan.jsx";
import VerifikasiBooking from "../pages/booking/VerifikasiBooking.jsx";
import DataLayanan from "../pages/layanan/DataLayanan.jsx";
import TambahLayanan from "../pages/layanan/TambahLayanan.jsx";
import EditLayanan from "../pages/layanan/EditLayanan.jsx";
import DataServis from "../pages/servis/DataServis.jsx";
import DataMekanik from "../pages/mekanik/DataMekanik.jsx";
import DetailServis from "../pages/servis/DetailServis.jsx";
import DataMogok from "../pages/mogok/DataMogok.jsx";
import DataPembayaran from "../pages/pembayaran/DataPembayaran.jsx";
import Statistik from "../pages/statistik/Statistik.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const admin = (page) => <ProtectedRoute role="admin">{page}</ProtectedRoute>;
const pelanggan = (page) => <ProtectedRoute role="pelanggan">{page}</ProtectedRoute>;

function CustomerEntry() {
  const { user } = useAuth();

  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "pelanggan") return <Navigate to="/pelanggan/dashboard" replace />;

  return <LandingPage />;
}

function AdminEntry() {
  const { user } = useAuth();

  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "pelanggan") return <Navigate to="/pelanggan/dashboard" replace />;

  return <Login />;
}

function CustomerLoginEntry() {
  const { user } = useAuth();

  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "pelanggan") return <Navigate to="/pelanggan/dashboard" replace />;

  return <CustomerLogin />;
}

function CustomerRegisterEntry() {
  const { user } = useAuth();

  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "pelanggan") return <Navigate to="/pelanggan/dashboard" replace />;

  return <RegisterPelanggan />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pelanggan" replace />} />

      {/* Area pelanggan: hanya berisi tampilan dan fitur pelanggan. */}
      <Route path="/pelanggan" element={<CustomerEntry />} />
      <Route path="/pelanggan/login" element={<CustomerLoginEntry />} />
      <Route path="/pelanggan/register" element={<CustomerRegisterEntry />} />
      <Route path="/pelanggan/dashboard" element={pelanggan(<CustomerDashboard />)} />
      <Route path="/pelanggan/layanan" element={pelanggan(<DaftarLayanan />)} />
      <Route path="/pelanggan/booking" element={pelanggan(<BookingBaru />)} />
      <Route path="/pelanggan/mogok" element={pelanggan(<PanggilMekanik />)} />
      <Route path="/pelanggan/status" element={pelanggan(<CekStatus />)} />
      <Route path="/pelanggan/riwayat" element={pelanggan(<RiwayatPelanggan />)} />
      <Route path="/pelanggan/pembayaran" element={pelanggan(<PembayaranPelanggan />)} />
      <Route path="/pelanggan/profil" element={pelanggan(<ProfilPelanggan />)} />

      {/* Area admin: hanya berisi tampilan dan fitur admin. */}
      <Route path="/admin" element={<AdminEntry />} />
      <Route path="/admin/login" element={<AdminEntry />} />
      <Route path="/admin/dashboard" element={admin(<Dashboard />)} />
      <Route path="/admin/pelanggan" element={admin(<DataPelanggan />)} />
      <Route path="/admin/booking" element={admin(<VerifikasiBooking />)} />
      <Route path="/admin/layanan" element={admin(<DataLayanan />)} />
      <Route path="/admin/layanan/tambah" element={admin(<TambahLayanan />)} />
      <Route path="/admin/layanan/edit/:id" element={admin(<EditLayanan />)} />
      <Route path="/admin/servis" element={admin(<DataServis />)} />
      <Route path="/admin/mekanik" element={admin(<DataMekanik />)} />
      <Route path="/admin/servis/:id" element={admin(<DetailServis />)} />
      <Route path="/admin/mogok" element={admin(<DataMogok />)} />
      <Route path="/admin/pembayaran" element={admin(<DataPembayaran />)} />
      <Route path="/admin/statistik" element={admin(<Statistik />)} />

      {/* Redirect kompatibilitas link lama. Tidak ditampilkan di UI. */}
      <Route path="/register" element={<Navigate to="/pelanggan/register" replace />} />
      <Route path="/booking-baru" element={<Navigate to="/pelanggan/booking" replace />} />
      <Route path="/cek-status" element={<Navigate to="/pelanggan/status" replace />} />
      <Route path="/panggil-mekanik" element={<Navigate to="/pelanggan/mogok" replace />} />
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/booking" element={<Navigate to="/admin/booking" replace />} />
      <Route path="/layanan" element={<Navigate to="/admin/layanan" replace />} />
      <Route path="/servis" element={<Navigate to="/admin/servis" replace />} />
      <Route path="/mogok" element={<Navigate to="/admin/mogok" replace />} />
      <Route path="/statistik" element={<Navigate to="/admin/statistik" replace />} />

      <Route path="*" element={<Navigate to="/pelanggan" replace />} />
    </Routes>
  );
}

export default AppRoutes;
