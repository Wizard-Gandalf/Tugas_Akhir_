// src/pages/Reports/PaymentReport.jsx
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
                id,
                amount_paid,
                method,
                status,
                payment_date,
                orders (
                    id,
                    customer_name,
                    total_price,
                    services ( name )
                )
            `)

            .order("id", { ascending: true });

        if (filters.startDate) {
            query = query.gte("payment_date", `${filters.startDate} 00:00:00`);
        }

        if (filters.endDate) {
            query = query.lte("payment_date", `${filters.endDate} 23:59:59`);
        }

        if (filters.method) {
            query = query.eq("method", filters.method);
        }

        if (filters.status) {
            query = query.eq("status", filters.status);
        }

        const { data, error } = await query;
        if (error) {
            console.error(error);
            alert("Gagal memuat laporan pembayaran");
            return;
        }

        setResults(data || []);
    }

    function exportToExcel() {
        const exportData = results.map((r) => ({
            ID: r.id,
            Pelanggan: r.orders?.customer_name,
            Layanan: r.orders?.services?.name,
            Total_Tagihan: r.orders?.total_price,
            Dibayar: r.amount_paid,
            Metode: r.method,          // disimpan sebagai cash / transfer
            Status: r.status,          // pending / selesai
            Tanggal: r.payment_date,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payments Report");
        XLSX.writeFile(wb, "laporan_pembayaran.xlsx");
    }

    function renderMethodLabel(method) {
        if (method === "cash") return "Tunai";
        if (method === "transfer") return "QRIS";
        return method || "-";
    }

    function renderStatusLabel(status) {
        if (status === "selesai") return "Lunas";
        if (status === "pending") return "Pending";
        return status || "-";
    }

    return (
        <div className="text-black dark:text-white">
            <h2 className="text-lg font-semibold mb-4">Laporan Pembayaran</h2>

            {/* Filter */}
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
                        {/* value = enum di DB, label = yang tampil */}
                        <option value="cash">Tunai</option>
                        <option value="transfer">QRIS</option>
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

            {/* Tabel */}
            <table className="mt-6 w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow rounded">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="p-2 border">Pelanggan</th>
                        <th className="p-2 border">Layanan</th>
                        <th className="p-2 border">Total Tagihan</th>
                        <th className="p-2 border">Dibayar</th>
                        <th className="p-2 border">Metode</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Tanggal</th>
                    </tr>
                </thead>

                <tbody>
                    {results.map((r) => (
                        <tr key={r.id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                            <td className="p-2 border">
                                {r.orders?.customer_name}
                            </td>
                            <td className="p-2 border">
                                {r.orders?.services?.name}
                            </td>
                            <td className="p-2 border">
                                Rp{" "}
                                {r.orders?.total_price
                                    ? Number(r.orders.total_price).toLocaleString()
                                    : 0}
                            </td>
                            <td className="p-2 border">
                                Rp {Number(r.amount_paid || 0).toLocaleString()}
                            </td>
                            <td className="p-2 border">
                                {renderMethodLabel(r.method)}
                            </td>
                            <td className="p-2 border">
                                {renderStatusLabel(r.status)}
                            </td>
                            <td className="p-2 border">
                                {r.payment_date ? r.payment_date.slice(0, 10) : "-"}
                            </td>
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
