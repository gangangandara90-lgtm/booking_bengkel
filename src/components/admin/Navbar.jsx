import { useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="admin-navbar d-flex justify-content-between align-items-center">
      <div>
        <div className="fw-bold">Panel Administrasi</div>
        <small className="text-muted">Manajemen operasional bengkel motor</small>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-md-block">
          <div className="fw-semibold">{user?.name || "Admin"}</div>
          <small className="text-muted">Administrator</small>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          <FaArrowRightFromBracket className="me-1" /> Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
