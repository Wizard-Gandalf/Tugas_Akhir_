import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../../api/supabaseClient";

export function OrderReport() {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "",
    });

    const [results, setResults] = useState([]);

    function handleChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    async function loadData() {
        let query = supabase
            .from("orders")
            .select(`
        id, status, order_date, finish_date, total_price,
        customers(name),
        services(name)
      `);

        if (filters.startDate)
            query = query.gte("order_date", `${filters.startDate} 00:00:00`);

        if (filters.endDate)
            query = query.lte("order_date", `${filters.endDate} 23:59:59`);

        if (filters.status)
            query = query.eq("status", filters.status);

        const { data } = await query;
        setResults(data || []);
    }

    function exportToExcel() {
        const exportData = results.map((r) => ({
            ID: r.id,
            Pelanggan: r.customers?.name,
            Layanan: r.services?.name,
            Total: r.total_price,
            Status: r.status,
            Tanggal_Pesanan: r.order_date,
            Tanggal_Selesai: r.finish_date,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders Report");
        XLSX.writeFile(wb, "laporan_pesanan.xlsx");
    }

    return (
        <div className="text-black dark:text-white">

            <h2 className="text-lg font-semibold mb-4">Laporan Pesanan</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label>Tanggal Mulai</label>
                    <input
                        type="date"
                        name="startDate"
                        className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 p-2 w-full rounded"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Tanggal Akhir</label>
                    <input
                        type="date"
                        name="endDate"
                        className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 p-2 w-full rounded"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Status</label>
                    <select
                        name="status"
                        className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 p-2 w-full rounded"
                        onChange={handleChange}
                    >
                        <option value="">Semua</option>
                        <option value="pending">Pending</option>
                        <option value="proses">Proses</option>
                        <option value="selesai">Selesai</option>
                        <option value="diambil">Diambil</option>
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

            <table className="mt-6 w-full 
                       bg-white dark:bg-gray-900 
                       text-black dark:text-white 
                       shadow rounded">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="p-2 border dark:border-gray-600">Pelanggan</th>
                        <th className="p-2 border dark:border-gray-600">Layanan</th>
                        <th className="p-2 border dark:border-gray-600">Total</th>
                        <th className="p-2 border dark:border-gray-600">Status</th>
                        <th className="p-2 border dark:border-gray-600">Tanggal</th>
                    </tr>
                </thead>

                <tbody>
                    {results.map((r) => (
                        <tr key={r.id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                            <td className="p-2 border dark:border-gray-700">{r.customers?.name}</td>
                            <td className="p-2 border dark:border-gray-700">{r.services?.name}</td>
                            <td className="p-2 border dark:border-gray-700">
                                Rp {r.total_price.toLocaleString()}
                            </td>
                            <td className="p-2 border dark:border-gray-700">{r.status}</td>
                            <td className="p-2 border dark:border-gray-700">
                                {r.order_date?.slice(0, 10)}
                            </td>
                        </tr>
                    ))}

                    {results.length === 0 && (
                        <tr>
                            <td
                                colSpan="5"
                                className="text-center p-3 text-gray-600 dark:text-gray-300"
                            >
                                Tidak ada data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
