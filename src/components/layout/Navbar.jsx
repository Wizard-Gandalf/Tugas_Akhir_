// src/components/layout/Navbar.jsx
import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    const { admin, logout } = useAuth();

    if (!admin) return null;

    return (
        <nav className="bg-gray-900 text-white shadow">
            <div className="flex justify-between items-center px-6 py-3">
                <h1 className="font-bold text-lg">
                    MyLaundryManager
                </h1>

                <div className="flex items-center gap-6 text-sm">
                    <NavLink to="/app/dashboard" className="hover:text-blue-300">
                        Dashboard
                    </NavLink>

                    {/* Pelanggan dihapus */}

                    <NavLink to="/app/services" className="hover:text-blue-300">
                        Layanan
                    </NavLink>

                    <NavLink to="/app/staff" className="hover:text-blue-300">
                        Petugas
                    </NavLink>

                    <NavLink to="/app/orders" className="hover:text-blue-300">
                        Pesanan
                    </NavLink>

                    <NavLink to="/app/payments" className="hover:text-blue-300">
                        Pembayaran
                    </NavLink>

                    <NavLink to="/app/reports" className="hover:text-blue-300">
                        Laporan
                    </NavLink>

                    <NavLink to="/app/about" className="hover:text-blue-300">
                        Tentang
                    </NavLink>

                    <button
                        onClick={logout}
                        className="bg-white text-black rounded px-3 py-1 hover:bg-gray-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
