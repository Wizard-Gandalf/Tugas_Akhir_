import { useState } from "react";
import OrderReport from "./OrderReport";
import PaymentReport from "./PaymentReport";

export default function ExportReports() {
    const [tab, setTab] = useState("orders");

    return (
        <div>
            <h1 className="text-xl font-semibold mb-6 text-black dark:text-white">
                Laporan & Export
            </h1>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setTab("orders")}
                    className={`px-4 py-2 rounded ${tab === "orders"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 dark:bg-gray-700 dark:text-white"
                        }`}
                >
                    Laporan Pesanan
                </button>

                <button
                    onClick={() => setTab("payments")}
                    className={`px-4 py-2 rounded ${tab === "payments"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 dark:bg-gray-700 dark:text-white"
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
