import Navbar from "../components/admin/Navbar.jsx";
import Sidebar from "../components/admin/Sidebar.jsx";

function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-main">
        <Navbar />
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
