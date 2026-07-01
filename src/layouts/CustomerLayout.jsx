import CustomerNavbar from "../components/customer/CustomerNavbar.jsx";

function CustomerLayout({ children }) {
  return (
    <div className="customer-shell">
      <CustomerNavbar />
      <main>{children}</main>
      <footer className="customer-footer text-center text-white py-4">
        <h5 className="mb-1">Bengkel Cihuyyy</h5>
        <p className="mb-0 text-white-50">Portal pelanggan untuk booking, darurat, status, riwayat, dan pembayaran.</p>
      </footer>
    </div>
  );
}

export default CustomerLayout;
