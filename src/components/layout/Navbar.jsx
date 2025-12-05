// src/components/layout/Navbar.jsx
import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Sparkles,
    Users,
    ShoppingBag,
    CreditCard,
    FileText,
    Info,
    LogOut,
} from "lucide-react";

const navLinks = [
    { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/services", label: "Layanan", icon: Sparkles },
    { to: "/app/staff", label: "Petugas", icon: Users },
    { to: "/app/orders", label: "Pesanan", icon: ShoppingBag },
    { to: "/app/payments", label: "Pembayaran", icon: CreditCard },
    { to: "/app/reports", label: "Laporan", icon: FileText },
    { to: "/app/about", label: "Tentang", icon: Info },
];

export default function Navbar() {
    const { admin, logout } = useAuth();

    if (!admin) return null;

    return (
        <>
            {/* NAVBAR ATAS - DESKTOP / TABLET */}
            <nav className="hidden md:block bg-gray-900 text-white shadow fixed top-0 left-0 right-0 z-20">
                <div className="flex justify-between items-center px-6 py-3">
                    <h1 className="font-bold text-lg">Laundry Management</h1>

                    <div className="flex items-center gap-6 text-sm">
                        {navLinks.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    "hover:text-blue-300 flex items-center gap-1" +
                                    (isActive ? " text-blue-400 font-semibold" : "")
                                }
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}

                        <button
                            onClick={logout}
                            className="flex items-center gap-1 bg-white text-black rounded px-3 py-1 hover:bg-gray-200"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* NAVBAR BAWAH - MOBILE */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 text-white shadow-inner z-20">
                <div className="flex items-center justify-around px-2 py-2 text-[11px]">
                    {navLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    "flex-1 text-center px-1 leading-tight flex flex-col items-center" +
                                    (isActive ? " text-blue-400 font-semibold" : " text-gray-200")
                                }
                            >
                                <Icon className="w-5 h-5 mb-0.5" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}

                    <button
                        onClick={logout}
                        className="flex-1 text-center px-1 leading-tight flex flex-col items-center text-red-400 font-semibold"
                    >
                        <LogOut className="w-5 h-5 mb-0.5" />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
