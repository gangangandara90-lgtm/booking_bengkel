import { NavLink } from "react-router-dom";
import { FaCalendarCheck, FaChartPie, FaHouse, FaMotorcycle, FaScrewdriverWrench, FaTruckMedical, FaUsers, FaWrench } from "react-icons/fa6";
import { FaMoneyBillWave } from "react-icons/fa";

const menus = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaHouse },
  { to: "/admin/pelanggan", label: "Data Pelanggan", icon: FaUsers },
  { to: "/admin/booking", label: "Verifikasi Booking", icon: FaCalendarCheck },
  { to: "/admin/layanan", label: "Data Layanan", icon: FaWrench },
  { to: "/admin/servis", label: "Data Servis", icon: FaScrewdriverWrench },
  { to: "/admin/mekanik", label: "Data Mekanik", icon: FaScrewdriverWrench },
  { to: "/admin/mogok", label: "Kendaraan Mogok", icon: FaTruckMedical },
  { to: "/admin/pembayaran", label: "Pembayaran", icon: FaMoneyBillWave },
  { to: "/admin/statistik", label: "Statistik", icon: FaChartPie }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink className="sidebar-brand" to="/admin/dashboard">Bengkel Cihuyyy</NavLink>
      <div className="small text-white-50 mb-3 px-2">Menu Admin</div>
      <nav>
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <NavLink key={menu.to} to={menu.to} className="nav-link">
              <Icon />
              <span>{menu.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-4 p-3 rounded-4" style={{ background: "rgba(255,255,255,.08)" }}>
        <FaMotorcycle className="text-warning mb-2" />
        <p className="small mb-0 text-white-50">Panel ini khusus admin.Hahayyyy</p>
      </div>
    </aside>
  );
}

export default Sidebar;
