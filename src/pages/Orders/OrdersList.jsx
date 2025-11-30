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
        const { data } = await supabase
            .from("orders")
            .select(`
        id,
        weight_kg,
        total_price,
        status,
        order_date,
        customers(name),
        services(name),
        staff(name)
      `);

        setOrders(data || []);
    }

    async function deleteOrder(id) {
        if (!confirm("Hapus pesanan ini?")) return;

        await supabase.from("orders").delete().eq("id", id);
        loadOrders();
    }

    async function updateStatus(id, newStatus) {
        await supabase.from("orders").update({ status: newStatus }).eq("id", id);
        loadOrders();
    }

    function statusButton(order) {
        const sequence = ["pending", "proses", "selesai", "diambil"];
        const currentIdx = sequence.indexOf(order.status);
        const next = sequence[currentIdx + 1];

        if (!next) return null;

        return (
            <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(order.id, next)}
            >
                {order.status} → {next}
            </button>
        );
    }

    return (
        <LayoutWrapper>
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold">Data Pesanan</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/orders/add")}
                >
                    + Tambah Pesanan
                </button>
            </div>

            <table className="w-full bg-white shadow rounded overflow-hidden">
                <thead className="bg-gray-200">
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
                        <tr key={o.id}>
                            <td className="border p-2">{o.customers?.name}</td>
                            <td className="border p-2">{o.services?.name}</td>
                            <td className="border p-2">{o.staff?.name}</td>
                            <td className="border p-2">{o.weight_kg} Kg</td>
                            <td className="border p-2">Rp {parseInt(o.total_price).toLocaleString()}</td>
                            <td className="border p-2 text-center">
                                {o.status}
                                <div className="mt-2">{statusButton(o)}</div>
                            </td>

                            <td className="border p-2 flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/orders/edit/${o.id}`)}
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
                            <td colSpan="7" className="text-center p-3">
                                Tidak ada pesanan
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </LayoutWrapper>
    );
}
