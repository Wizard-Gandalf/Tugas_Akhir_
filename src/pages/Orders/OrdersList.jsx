// src/pages/Orders/OrdersList.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function OrdersList() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        const { data, error } = await supabase
            .from("orders")
            .select(`
                id,
                customer_name,
                weight_kg,
                total_price,
                status,
                order_date,
                services (name),
                staff (name)
            `)
            .order("id", { ascending: true });

        if (error) {
            console.error(error);
            alert("Gagal memuat data pesanan");
            return;
        }

        setOrders(data || []);
    }

    async function deleteOrder(id) {
        if (!confirm("Hapus pesanan ini?")) return;

        const { error } = await supabase
            .from("orders")
            .delete()
            .eq("id", id);

        if (error) {
            alert(error.message);
        } else {
            loadOrders();
        }
    }

    async function updateStatus(id, newStatus) {
        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            alert(error.message);
        } else {
            loadOrders();
        }
    }

    function statusButton(order) {
        const sequence = ["pending", "proses", "selesai", "diambil"];
        const currentIdx = sequence.indexOf(order.status);
        const next = sequence[currentIdx + 1];

        const baseClass =
            "inline-flex items-center justify-center px-3 py-1 rounded-md text-[11px] font-medium text-white";
        const colorByStatus = {
            pending: "bg-yellow-500",
            proses: "bg-blue-500",
            selesai: "bg-green-600",
            diambil: "bg-gray-500",
        };

        // kalau sudah status terakhir → hanya badge
        if (!next) {
            return (
                <span
                    className={`${baseClass} ${colorByStatus[order.status] || "bg-gray-500"
                        }`}
                >
                    {order.status}
                </span>
            );
        }

        // status masih bisa naik → tombol
        return (
            <button
                className={`${baseClass} ${colorByStatus[order.status] || "bg-green-600"
                    }`}
                onClick={() => updateStatus(order.id, next)}
            >
                {order.status} → {next}
            </button>
        );
    }

    return (
        <LayoutWrapper>
            {/* Header judul + tombol */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-white">
                        Data Pesanan
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400">
                        Daftar pesanan laundry beserta status dan total pembayaran.
                    </p>
                </div>

                <button
                    className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    onClick={() => navigate("/app/orders/add")}
                >
                    + Tambah Pesanan
                </button>
            </div>

            {/* Tabel responsif */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="min-w-full text-xs sm:text-sm border-collapse bg-slate-900 text-white">
                    <thead className="bg-slate-900/80">
                        <tr className="text-left text-gray-300">
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800">
                                Pelanggan
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800">
                                Layanan
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800">
                                Petugas
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800 whitespace-nowrap">
                                Berat
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800 whitespace-nowrap">
                                Total
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800">
                                Status
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((o) => (
                            <tr
                                key={o.id}
                                className="border-b border-slate-800 hover:bg-slate-900/60"
                            >
                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    {o.customer_name}
                                </td>
                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    {o.services?.name}
                                </td>
                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    {o.staff?.name}
                                </td>
                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle whitespace-nowrap">
                                    {o.weight_kg} Kg
                                </td>
                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle whitespace-nowrap">
                                    Rp {parseInt(o.total_price).toLocaleString()}
                                </td>
                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle text-center">
                                    {statusButton(o)}
                                </td>
                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm px-3 py-1.5 rounded-md font-medium"
                                            onClick={() =>
                                                navigate(`/app/orders/edit/${o.id}`)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md font-medium"
                                            onClick={() => deleteOrder(o.id)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {orders.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-6 text-center text-sm text-gray-400"
                                >
                                    Tidak ada pesanan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </LayoutWrapper>
    );
}
