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
            Metode: r.method, // disimpan sebagai cash / transfer
            Status: r.status, // pending / selesai
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
        <div className="text-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Laporan Pembayaran
            </h2>

            {/* Filter */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs sm:text-sm text-gray-300">
                        Tanggal Mulai
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        className="border rounded-md px-3 py-2 text-sm w-full
                                   bg-slate-900 border-slate-700
                                   focus:outline-none focus:ring-2 focus:ring-blue-600"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs sm:text-sm text-gray-300">
                        Tanggal Akhir
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        className="border rounded-md px-3 py-2 text-sm w-full
                                   bg-slate-900 border-slate-700
                                   focus:outline-none focus:ring-2 focus:ring-blue-600"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs sm:text-sm text-gray-300">
                        Metode Pembayaran
                    </label>
                    <select
                        name="method"
                        className="border rounded-md px-3 py-2 text-sm w-full
                                   bg-slate-900 border-slate-700
                                   focus:outline-none focus:ring-2 focus:ring-blue-600"
                        onChange={handleChange}
                    >
                        <option value="">Semua</option>
                        <option value="cash">Tunai</option>
                        <option value="transfer">QRIS</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs sm:text-sm text-gray-300">
                        Status
                    </label>
                    <select
                        name="status"
                        className="border rounded-md px-3 py-2 text-sm w-full
                                   bg-slate-900 border-slate-700
                                   focus:outline-none focus:ring-2 focus:ring-blue-600"
                        onChange={handleChange}
                    >
                        <option value="">Semua</option>
                        <option value="pending">Pending</option>
                        <option value="selesai">Lunas</option>
                    </select>
                </div>
            </div>

            {/* Tombol aksi */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    onClick={loadData}
                >
                    Tampilkan Laporan
                </button>

                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    onClick={exportToExcel}
                    disabled={results.length === 0}
                >
                    Export Excel
                </button>
            </div>

            {/* Tabel */}
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
                <table className="min-w-full bg-slate-900 text-white text-xs sm:text-sm border-collapse">
                    <thead className="bg-slate-900/80">
                        <tr className="text-left text-gray-300">
                            <th className="p-2 sm:p-3 border-b border-slate-800">
                                Pelanggan
                            </th>
                            <th className="p-2 sm:p-3 border-b border-slate-800">
                                Layanan
                            </th>
                            <th className="p-2 sm:p-3 border-b border-slate-800 whitespace-nowrap">
                                Total Tagihan
                            </th>
                            <th className="p-2 sm:p-3 border-b border-slate-800 whitespace-nowrap">
                                Dibayar
                            </th>
                            <th className="p-2 sm:p-3 border-b border-slate-800">
                                Metode
                            </th>
                            <th className="p-2 sm:p-3 border-b border-slate-800">
                                Status
                            </th>
                            <th className="p-2 sm:p-3 border-b border-slate-800 whitespace-nowrap">
                                Tanggal
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.map((r) => (
                            <tr
                                key={r.id}
                                className="border-b border-slate-800 hover:bg-slate-900/60"
                            >
                                <td className="p-2 sm:p-3">
                                    {r.orders?.customer_name}
                                </td>
                                <td className="p-2 sm:p-3">
                                    {r.orders?.services?.name}
                                </td>
                                <td className="p-2 sm:p-3 whitespace-nowrap">
                                    Rp{" "}
                                    {r.orders?.total_price
                                        ? Number(
                                            r.orders.total_price
                                        ).toLocaleString()
                                        : 0}
                                </td>
                                <td className="p-2 sm:p-3 whitespace-nowrap">
                                    Rp {Number(r.amount_paid || 0).toLocaleString()}
                                </td>
                                <td className="p-2 sm:p-3">
                                    {renderMethodLabel(r.method)}
                                </td>
                                <td className="p-2 sm:p-3">
                                    {renderStatusLabel(r.status)}
                                </td>
                                <td className="p-2 sm:p-3 whitespace-nowrap">
                                    {r.payment_date
                                        ? r.payment_date.slice(0, 10)
                                        : "-"}
                                </td>
                            </tr>
                        ))}

                        {results.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="p-4 text-center text-sm text-gray-400"
                                >
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
