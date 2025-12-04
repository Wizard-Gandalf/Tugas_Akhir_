import { useState } from "react";
import OrderReport from "./OrderReport";
import PaymentReport from "./PaymentReport";

export default function ExportReports() {
    const [tab, setTab] = useState("orders");

    return (
        <div className="text-white">
            <h1 className="text-xl sm:text-2xl font-semibold mb-2">
                Laporan & Export
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
                Lihat dan ekspor laporan pesanan serta pembayaran dalam bentuk Excel.
            </p>

            {/* Tab pilihan laporan */}
            <div className="inline-flex items-center rounded-xl bg-slate-800/60 p-1 gap-1 mb-6">
                <button
                    onClick={() => setTab("orders")}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${tab === "orders"
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-slate-700/70"
                        }`}
                >
                    Laporan Pesanan
                </button>

                <button
                    onClick={() => setTab("payments")}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${tab === "payments"
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-slate-700/70"
                        }`}
                >
                    Laporan Pembayaran
                </button>
            </div>

            {tab === "orders" && <OrderReport />}
            {tab === "payments" && <PaymentReport />}
        </div>
    );
}
