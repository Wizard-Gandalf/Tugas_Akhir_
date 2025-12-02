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
            "inline-block px-3 py-1 rounded text-white text-sm";
        const colorByStatus = {
            pending: "bg-yellow-500",
            proses: "bg-blue-500",
            selesai: "bg-green-600",
            diambil: "bg-gray-500",
        };

        // kalau sudah status terakhir → hanya badge, tidak bisa diklik
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
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold text-black dark:text-white">
                    Data Pesanan
                </h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/app/orders/add")}
                >
                    + Tambah Pesanan
                </button>
            </div>

            <table className="w-full bg-white dark:bg-gray-800 shadow rounded overflow-hidden text-black dark:text-white">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="p-2 border">Pelanggan</th>
                        <th className="p-2 border">Layanan</th>
                        <th className="p-2 border">Petugas</th>
                        <th className="p-2 border">Berat</th>
                        <th className="p-2 border">Total</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((o) => (
                        <tr key={o.id} className="odd:bg-gray-50 dark:odd:bg-gray-900">
                            <td className="border p-2">{o.customer_name}</td>
                            <td className="border p-2">{o.services?.name}</td>
                            <td className="border p-2">{o.staff?.name}</td>

                            <td className="border p-2">{o.weight_kg} Kg</td>
                            <td className="border p-2">
                                Rp {parseInt(o.total_price).toLocaleString()}
                            </td>
                            <td className="border p-2 text-center">
                                {statusButton(o)}
                            </td>

                            <td className="border p-2 flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    onClick={() =>
                                        navigate(`/app/orders/edit/${o.id}`)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => deleteOrder(o.id)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}

                    {orders.length === 0 && (
                        <tr>
                            <td
                                colSpan="7"
                                className="text-center p-3 text-gray-600 dark:text-gray-300"
                            >
                                Tidak ada pesanan
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </LayoutWrapper>
    );
}
