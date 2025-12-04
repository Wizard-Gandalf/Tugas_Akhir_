// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import OrdersChart from "../components/charts/OrdersChart";

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
        // total STAFF
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
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Agu",
            "Sep",
            "Okt",
            "Nov",
            "Des",
        ];
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

        let countPerDay = {};

        try {
            const { data, error } = await supabase
                .from("orders")
                .select("id, order_date")
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

    const totalWeeklyOrders = weeklyOrders.reduce(
        (sum, d) => sum + d.count,
        0
    );

    return (
        <div className="text-white">
            {/* Batasi lebar konten agar rapi di desktop */}
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="pt-2 sm:pt-4">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                        Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400">
                        Ringkasan aktivitas laundry hari ini dan performa 7 hari terakhir.
                    </p>
                </header>

                {/* Kartu statistik */}
                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard
                        title="Total Petugas"
                        value={stats.staff}
                        subtitle="Petugas aktif terdaftar"
                    />
                    <StatCard
                        title="Total Pesanan"
                        value={stats.orders}
                        subtitle="Semua pesanan tersimpan"
                    />
                    <StatCard
                        title="Pesanan Hari Ini"
                        value={stats.ordersToday}
                        subtitle="Masuk sejak 00.00"
                    />
                    <StatCard
                        title="Pendapatan Bulan Ini"
                        value={`Rp ${stats.monthlyIncome.toLocaleString()}`}
                        subtitle="Akumulasi semua pembayaran"
                    />
                </section>

                {/* Grafik mingguan */}
                <section className="bg-slate-900 rounded-2xl shadow border border-slate-800 px-4 py-4 sm:px-6 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold">
                                Grafik Pesanan / Mingguan
                            </h2>
                            <p className="text-[11px] sm:text-xs text-gray-400">
                                7 hari terakhir{weekRange ? ` (${weekRange})` : ""}
                            </p>
                        </div>

                        {weeklyOrders.length > 0 && (
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-3 py-1">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-[11px] sm:text-xs text-gray-200">
                                    Total 7 hari:{" "}
                                    <span className="font-semibold">
                                        {totalWeeklyOrders} pesanan
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>

                    {weeklyOrders.length > 0 ? (
                        <div className="h-64 sm:h-72">
                            <OrdersChart
                                labels={weeklyOrders.map((d) => d.label)}
                                values={weeklyOrders.map((d) => d.count)}
                            />
                        </div>
                    ) : (
                        <div className="mt-4 text-sm text-gray-400">
                            Tidak ada data pesanan untuk 7 hari terakhir.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle }) {
    return (
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl shadow border border-slate-800 flex flex-col justify-between">
            <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-wide text-gray-400 mb-1">
                    {title}
                </p>
                <p className="text-xl sm:text-2xl font-bold mb-1">{value}</p>
            </div>
            {subtitle && (
                <p className="text-[10px] sm:text-xs text-gray-500">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
