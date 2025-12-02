import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function PaymentsList() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        loadPayments();
    }, []);

    async function loadPayments() {
        const { data, error } = await supabase
            .from("payments")
            .select(`
                id,
                amount_paid,
                remaining_amount,
                method,
                status,
                payment_date,
                orders (
                    id,
                    customer_name,
                    total_price,
                    services (name)
                )
            `)
            .order("id", { ascending: true });

        if (error) {
            console.error(error);
            alert("Gagal memuat data pembayaran");
            return;
        }

        setPayments(data || []);
    }

    async function deletePayment(id) {
        if (!confirm("Hapus data pembayaran ini?")) return;
        const { error } = await supabase.from("payments").delete().eq("id", id);
        if (error) {
            alert(error.message);
        } else {
            loadPayments();
        }
    }

    async function updateStatus(payment, newStatus) {
        const updateData = { status: newStatus };

        if (newStatus === "selesai") {
            const total = Number(payment.orders?.total_price || 0);
            updateData.amount_paid = total;    // dibayar penuh
            updateData.remaining_amount = 0;   // sisa 0
        }

        const { error } = await supabase
            .from("payments")
            .update(updateData)
            .eq("id", payment.id);

        if (error) {
            console.error(error);
            alert("Gagal mengubah status");
            return;
        }

        loadPayments();
    }
    function renderStatus(p) {
        if (p.status === "selesai") {
            return (
                <span className="inline-block px-3 py-1 rounded bg-green-600 text-white text-sm font-semibold">
                    Lunas
                </span>
            );
        }

        return (
            <button
                className="inline-block px-3 py-1 rounded bg-yellow-500 text-white text-sm font-semibold"
                onClick={() => updateStatus(p, "selesai")}
            >
                Pending
            </button>
        );
    }

    function renderMethodLabel(method) {
        if (method === "cash") return "Tunai";
        if (method === "transfer") return "QRIS";
        return method || "-";
    }

    return (
        <LayoutWrapper>
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold text-black dark:text-white">
                    Data Pembayaran
                </h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/app/payments/add")}
                >
                    + Tambah Pembayaran
                </button>
            </div>

            <table className="w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow rounded overflow-hidden">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="p-2 border">Pelanggan</th>
                        <th className="p-2 border">Layanan</th>
                        <th className="p-2 border">Total Tagihan</th>
                        <th className="p-2 border">Metode</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {payments.map((p) => (
                        <tr key={p.id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                            <td className="p-2 border">
                                {p.orders?.customer_name}
                            </td>

                            <td className="p-2 border">
                                {p.orders?.services?.name}
                            </td>

                            <td className="p-2 border">
                                Rp{" "}
                                {p.orders?.total_price
                                    ? Number(p.orders.total_price).toLocaleString()
                                    : 0}
                            </td>

                            <td className="p-2 border">
                                {renderMethodLabel(p.method)}
                            </td>

                            <td className="p-2 border text-center">
                                {renderStatus(p)}
                            </td>

                            <td className="p-2 border flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/app/payments/edit/${p.id}`)}
                                >
                                    Edit
                                </button>

                                {/* Cetak Nota: hanya aktif jika status = selesai */}
                                <button
                                    className={
                                        p.status === "selesai"
                                            ? "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                            : "bg-gray-500 text-gray-200 px-3 py-1 rounded cursor-not-allowed"
                                    }
                                    disabled={p.status !== "selesai"}
                                    onClick={() => {
                                        if (p.status !== "selesai") return;
                                        navigate(`/app/payments/receipt/${p.id}`);
                                    }}
                                >
                                    Cetak Nota
                                </button>

                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => deletePayment(p.id)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}

                    {payments.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center p-3">
                                Tidak ada data pembayaran
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </LayoutWrapper>
    );
}
