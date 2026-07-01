import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaRightFromBracket, FaUser } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext.jsx";

const menus = [
  { to: "/pelanggan/dashboard", label: "Dashboard" },
  { to: "/pelanggan/layanan", label: "Layanan" },
  { to: "/pelanggan/booking", label: "Booking" },
  { to: "/pelanggan/mogok", label: "Panggil Mekanik" },
  { to: "/pelanggan/status", label: "Cek Status" },
  { to: "/pelanggan/riwayat", label: "Riwayat" },
  { to: "/pelanggan/pembayaran", label: "Pembayaran" }
];

function CustomerNavbar() {
  const { user, isPelanggan, logout } = useAuth();
  const navigate = useNavigate();
  const avatar = user?.foto || "";

  const handleLogout = () => {
    logout();
    navigate("/pelanggan");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark customer-navbar sticky-top">
      <div className="container-fluid px-4 px-lg-5">
        <Link to="/pelanggan" className="navbar-brand fw-bold text-warning">Bengkel Cihuyyy</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#customerMenu" aria-controls="customerMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="customerMenu">
          <div className="navbar-nav mx-auto gap-lg-1">
            {menus.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/pelanggan/dashboard"} className="nav-link customer-nav-link">
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="d-flex gap-2 align-items-center mt-3 mt-lg-0">
            {isPelanggan ? (
              <>
                <Link to="/pelanggan/profil" className="btn btn-sm btn-outline-light customer-profile-button">
                  {avatar ? <img src={avatar} alt="Foto profil" className="customer-nav-avatar" /> : <FaUser className="me-1" />}
                  <span>{user?.name || "Pelanggan"}</span>
                </Link>
                <button className="btn btn-sm btn-warning" onClick={handleLogout}>
                  <FaRightFromBracket className="me-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/pelanggan/login" className="btn btn-sm btn-outline-light">Login</Link>
                <Link to="/pelanggan/register" className="btn btn-sm btn-warning">Daftar</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default CustomerNavbar;
