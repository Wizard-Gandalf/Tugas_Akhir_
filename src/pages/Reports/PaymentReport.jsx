import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../../api/supabaseClient";

export default function PaymentReport() {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        method: "",
        status: "",
    });

    const [results, setResults] = useState([]);

    function handleChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    async function loadData() {
        let query = supabase
            .from("payments")
            .select(`
                id, amount_paid, remaining_amount, method, status, payment_date,
                orders (
                    id,
                    total_price,
                    customers (name)
                )
            `);

        if (filters.startDate)
            query = query.gte("payment_date", `${filters.startDate} 00:00:00`);

        if (filters.endDate)
            query = query.lte("payment_date", `${filters.endDate} 23:59:59`);

        if (filters.method) query = query.eq("method", filters.method);
        if (filters.status) query = query.eq("status", filters.status);

        const { data } = await query;
        setResults(data || []);
    }

    function exportToExcel() {
        const exportData = results.map((r) => ({
            ID: r.id,
            Pelanggan: r.orders?.customers?.name,
            Total_Tagihan: r.orders?.total_price,
            Dibayar: r.amount_paid,
            Sisa: r.remaining_amount,
            Metode: r.method,
            Status: r.status,
            Tanggal: r.payment_date,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payments Report");
        XLSX.writeFile(wb, "laporan_pembayaran.xlsx");
    }

    return (
        <div className="text-black dark:text-white">

            <h2 className="text-lg font-semibold mb-4">Laporan Pembayaran</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                    <label>Tanggal Mulai</label>
                    <input
                        type="date"
                        name="startDate"
                        className="border p-2 w-full rounded 
                               dark:border-gray-600 bg-white dark:bg-gray-800"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Tanggal Akhir</label>
                    <input
                        type="date"
                        name="endDate"
                        className="border p-2 w-full rounded 
                               dark:border-gray-600 bg-white dark:bg-gray-800"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Metode Pembayaran</label>
                    <select
                        name="method"
                        className="border p-2 w-full rounded 
                               dark:border-gray-600 bg-white dark:bg-gray-800"
                        onChange={handleChange}
                    >
                        <option value="">Semua</option>
                        <option value="cash">Cash</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>

                <div>
                    <label>Status</label>
                    <select
                        name="status"
                        className="border p-2 w-full rounded 
                               dark:border-gray-600 bg-white dark:bg-gray-800"
                        onChange={handleChange}
                    >
                        <option value="">Semua</option>
                        <option value="pending">Pending</option>
                        <option value="selesai">Lunas</option>
                    </select>
                </div>
            </div>

            <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                onClick={loadData}
            >
                Tampilkan Laporan
            </button>

            <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={exportToExcel}
            >
                Export Excel
            </button>

            <table className="mt-6 w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow rounded">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="p-2 border">Pelanggan</th>
                        <th className="p-2 border">Total</th>
                        <th className="p-2 border">Dibayar</th>
                        <th className="p-2 border">Sisa</th>
                        <th className="p-2 border">Metode</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Tanggal</th>
                    </tr>
                </thead>

                <tbody>
                    {results.map((r) => (
                        <tr key={r.id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                            <td className="p-2 border">{r.orders?.customers?.name}</td>
                            <td className="p-2 border">Rp {r.orders?.total_price?.toLocaleString()}</td>
                            <td className="p-2 border">Rp {r.amount_paid.toLocaleString()}</td>
                            <td className="p-2 border">
                                {r.remaining_amount === 0
                                    ? "Lunas"
                                    : "Rp " + r.remaining_amount.toLocaleString()}
                            </td>
                            <td className="p-2 border">{r.method}</td>
                            <td className="p-2 border">{r.status}</td>
                            <td className="p-2 border">{r.payment_date?.slice(0, 10)}</td>
                        </tr>
                    ))}

                    {results.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center p-3">
                                Tidak ada data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
