// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
    const { admin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!admin) navigate("/");
    }, [admin, navigate]);

    const [stats, setStats] = useState({
        staff: 0,
        orders: 0,
        ordersToday: 0,
        monthlyIncome: 0,
    });

    const [weeklyOrders, setWeeklyOrders] = useState([]);
    const [weekRange, setWeekRange] = useState("");

    useEffect(() => {
        loadStats();
        loadWeeklyOrders();
    }, []);

    async function loadStats() {
        // total STAFF (ganti dari customers -> staff)
        const { count: staffCount } = await supabase
            .from("staff")
            .select("*", { count: "exact", head: true });

        // total pesanan
        const { count: ordersCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true });

        // pesanan hari ini
        const today = new Date().toISOString().slice(0, 10);
        const { count: ordersTodayCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .gte("order_date", `${today} 00:00:00`)
            .lte("order_date", `${today} 23:59:59`);

        // pendapatan bulan ini
        const firstDay = new Date();
        firstDay.setDate(1);
        const startMonth = firstDay.toISOString().slice(0, 10);

        const { data: paymentData } = await supabase
            .from("payments")
            .select("amount_paid")
            .gte("payment_date", `${startMonth} 00:00:00`);

        const totalIncome = (paymentData || []).reduce(
            (sum, p) => sum + parseFloat(p.amount_paid),
            0
        );

        setStats({
            staff: staffCount || 0,
            orders: ordersCount || 0,
            ordersToday: ordersTodayCount || 0,
            monthlyIncome: totalIncome || 0,
        });
    }

    async function loadWeeklyOrders() {
        const today = new Date();
        const start = new Date();
        start.setDate(today.getDate() - 6); // 7 hari terakhir

        const startStr = start.toISOString().slice(0, 10);
        const endStr = today.toISOString().slice(0, 10);

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
            "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
        ];
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

        let countPerDay = {};

        try {
            const { data, error } = await supabase
                .from("orders")
                .select("id, order_date")
                // gunakan rentang penuh per hari agar tidak terpotong jam
                .gte("order_date", `${startStr} 00:00:00`)
                .lte("order_date", `${endStr} 23:59:59`);

            if (error) {
                console.error("Gagal ambil data order mingguan:", error);
            }

            (data || []).forEach((row) => {
                const d = new Date(row.order_date);
                const key = d.toISOString().slice(0, 10);
                countPerDay[key] = (countPerDay[key] || 0) + 1;
            });
        } catch (err) {
            console.error("Error di loadWeeklyOrders:", err);
        }

        const weekly = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);

            const key = d.toISOString().slice(0, 10);
            const label = `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]
                }`;

            weekly.push({
                label,
                count: countPerDay[key] || 0,
            });
        }

        setWeeklyOrders(weekly);

        const startLabel = `${start.getDate()} ${monthNames[start.getMonth()]}`;
        const endLabel = `${today.getDate()} ${monthNames[today.getMonth()]}`;
        setWeekRange(`${startLabel} – ${endLabel}`);
    }

    const maxCount =
        weeklyOrders.length > 0
            ? Math.max(...weeklyOrders.map((d) => d.count), 1)
            : 1;

    return (
        <div className="px-8 py-8 mt-16 text-white min-h-screen bg-slate-950">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-sm text-gray-400 mb-8">
                Ringkasan aktivitas laundry hari ini dan performa 7 hari terakhir.
            </p>

            {/* Kartu statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Petugas" value={stats.staff} />
                <StatCard title="Total Pesanan" value={stats.orders} />
                <StatCard title="Pesanan Hari Ini" value={stats.ordersToday} />
                <StatCard
                    title="Pendapatan Bulan Ini"
                    value={`Rp ${stats.monthlyIncome.toLocaleString()}`}
                />
            </div>

            {/* Grafik mingguan */}
            <div className="bg-slate-900 rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Grafik Pesanan / Mingguan
                        </h2>
                        <p className="text-xs text-gray-400">
                            7 hari terakhir{weekRange ? ` (${weekRange})` : ""}
                        </p>
                    </div>
                </div>

                <div className="mt-6 h-64 flex items-end gap-4 border-t border-slate-800 pt-6 overflow-x-auto">
                    {weeklyOrders.map((item) => {
                        const height = (item.count / maxCount) * 100;
                        return (
                            <div
                                key={item.label}
                                className="flex flex-col items-center min-w-[48px]"
                            >
                                <div
                                    className="w-6 rounded-t-md bg-blue-500 transition-all"
                                    style={{ height: `${height || 4}%` }}
                                ></div>
                                <span className="mt-2 text-xs text-gray-300">
                                    {item.count}
                                </span>
                                <span className="mt-1 text-[10px] text-gray-400 text-center leading-tight">
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}

                    {weeklyOrders.length === 0 && (
                        <div className="text-sm text-gray-500">
                            Tidak ada data pesanan untuk 7 hari terakhir.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-slate-900 p-5 rounded-xl shadow border border-slate-800">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}
