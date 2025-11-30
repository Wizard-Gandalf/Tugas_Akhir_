import { Link } from "react-router-dom";

<div className="w-64 min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white border-r border-gray-300 dark:border-gray-700">
    ...
</div>

export default function Sidebar() {
    return (
        <div className="w-64 bg-white shadow h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Laundry App</h1>

            <nav className="flex flex-col gap-3">
                <Link to="/dashboard" className="text-blue-600 hover:underline">
                    Dashboard
                </Link>
                <Link to="/customers" className="hover:underline">Pelanggan</Link>
                <Link to="/staff" className="hover:underline">Petugas</Link>
                <Link to="/services" className="hover:underline">Layanan</Link>
                <Link to="/orders" className="hover:underline">Pesanan</Link>
                <Link to="/payments" className="hover:underline">Pembayaran</Link>
                <Link to="/reports" className="hover:underline">Laporan</Link>
            </nav>
        </div>
    );
}
