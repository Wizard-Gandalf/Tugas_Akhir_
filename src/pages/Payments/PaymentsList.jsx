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
            updateData.amount_paid = total; // dibayar penuh
            updateData.remaining_amount = 0; // sisa 0
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
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-green-600 text-white text-[11px] font-medium">
                    Lunas
                </span>
            );
        }

        return (
            <button
                className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-yellow-500 text-white text-[11px] font-medium"
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
            {/* Header judul + tombol */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-white">
                        Data Pembayaran
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400">
                        Riwayat pembayaran pesanan laundry dan status pelunasannya.
                    </p>
                </div>

                <button
                    className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    onClick={() => navigate("/app/payments/add")}
                >
                    + Tambah Pembayaran
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
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800 whitespace-nowrap">
                                Total Tagihan
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800">
                                Metode
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800 text-center">
                                Status
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {payments.map((p) => (
                            <tr
                                key={p.id}
                                className="border-b border-slate-800 hover:bg-slate-900/60"
                            >
                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    {p.orders?.customer_name}
                                </td>

                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    {p.orders?.services?.name}
                                </td>

                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle whitespace-nowrap">
                                    Rp{" "}
                                    {p.orders?.total_price
                                        ? Number(p.orders.total_price).toLocaleString()
                                        : 0}
                                </td>

                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    {renderMethodLabel(p.method)}
                                </td>

                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle text-center">
                                    {renderStatus(p)}
                                </td>

                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm px-3 py-1.5 rounded-md font-medium"
                                            onClick={() =>
                                                navigate(`/app/payments/edit/${p.id}`)
                                            }
                                        >
                                            Edit
                                        </button>

                                        {/* Cetak Nota: hanya aktif jika status = selesai */}
                                        <button
                                            className={
                                                p.status === "selesai"
                                                    ? "bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md font-medium"
                                                    : "bg-gray-500 text-gray-200 text-xs sm:text-sm px-3 py-1.5 rounded-md cursor-not-allowed"
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
                                            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md font-medium"
                                            onClick={() => deletePayment(p.id)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {payments.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-sm text-gray-400"
                                >
                                    Tidak ada data pembayaran
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </LayoutWrapper>
    );
}
