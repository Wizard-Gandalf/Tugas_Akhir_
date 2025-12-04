// src/components/layout/Navbar.jsx
import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    const { admin, logout } = useAuth();

    if (!admin) return null;

    return (
        <nav className="bg-slate-950 text-white border-b border-slate-800">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">

                {/* Brand */}
                <h1 className="font-bold text-base sm:text-lg">
                    MyLaundryManager
                </h1>

                {/* Menu + tombol logout */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm w-full sm:w-auto">
                    <NavLink
                        to="/app/dashboard"
                        className="whitespace-nowrap hover:text-blue-300"
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/app/services"
                        className="whitespace-nowrap hover:text-blue-300"
                    >
                        Layanan
                    </NavLink>

                    <NavLink
                        to="/app/staff"
                        className="whitespace-nowrap hover:text-blue-300"
                    >
                        Petugas
                    </NavLink>

                    <NavLink
                        to="/app/orders"
                        className="whitespace-nowrap hover:text-blue-300"
                    >
                        Pesanan
                    </NavLink>

                    <NavLink
                        to="/app/payments"
                        className="whitespace-nowrap hover:text-blue-300"
                    >
                        Pembayaran
                    </NavLink>

                    <NavLink
                        to="/app/reports"
                        className="whitespace-nowrap hover:text-blue-300"
                    >
                        Laporan
                    </NavLink>

                    <NavLink
                        to="/app/about"
                        className="whitespace-nowrap hover:text-blue-300"
                    >
                        Tentang
                    </NavLink>

                    <button
                        onClick={logout}
                        className="ml-auto sm:ml-0 bg-white text-black rounded px-3 py-1 hover:bg-gray-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
