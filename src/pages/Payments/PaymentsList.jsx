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
        const { data } = await supabase
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
          total_price,
          customers (name),
          services (name)
        )
      `);

        setPayments(data || []);
    }

    async function deletePayment(id) {
        if (!confirm("Hapus data pembayaran ini?")) return;
        await supabase.from("payments").delete().eq("id", id);
        loadPayments();
    }

    return (
        <LayoutWrapper>
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold">Data Pembayaran</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/payments/add")}
                >
                    + Tambah Pembayaran
                </button>
            </div>

            <table className="w-full bg-white shadow rounded overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">Pelanggan</th>
                        <th className="p-2 border">Layanan</th>
                        <th className="p-2 border">Total Tagihan</th>
                        <th className="p-2 border">Dibayar</th>
                        <th className="p-2 border">Sisa</th>
                        <th className="p-2 border">Metode</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {payments.map((p) => (
                        <tr key={p.id}>
                            <td className="border p-2">{p.orders?.customers?.name}</td>
                            <td className="border p-2">{p.orders?.services?.name}</td>
                            <td className="border p-2">Rp {parseInt(p.orders?.total_price).toLocaleString()}</td>
                            <td className="border p-2">Rp {parseInt(p.amount_paid).toLocaleString()}</td>
                            <td className="border p-2">
                                {p.remaining_amount === 0
                                    ? "Lunas"
                                    : "Rp " + parseInt(p.remaining_amount).toLocaleString()}
                            </td>
                            <td className="border p-2">{p.method}</td>
                            <td className="border p-2">
                                {p.status === "selesai" ? (
                                    <span className="text-green-600 font-semibold">Lunas</span>
                                ) : (
                                    <span className="text-red-600 font-semibold">Pending</span>
                                )}
                            </td>

                            <td className="border p-2 flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/payments/edit/${p.id}`)}
                                >
                                    Edit
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
                            <td colSpan="8" className="text-center p-3">
                                Tidak ada data pembayaran
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </LayoutWrapper>
    );
}
