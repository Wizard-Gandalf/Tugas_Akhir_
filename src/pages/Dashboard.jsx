import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/layout/LayoutWrapper";

export default function Dashboard() {
    const { admin } = useAuth();
    const navigate = useNavigate();

    // Redirect jika belum login
    useEffect(() => {
        if (!admin) navigate("/");
    }, [admin]);

    const [stats, setStats] = useState({
        customers: 0,
        orders: 0,
        ordersToday: 0,
        monthlyIncome: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        // Hitung jumlah pelanggan
        const { count: custCount } = await supabase
            .from("customers")
            .select("*", { count: "exact", head: true });

        // Hitung jumlah pesanan
        const { count: ordersCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true });

        // Pesanan hari ini
        const today = new Date().toISOString().slice(0, 10);
        const { count: ordersTodayCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .gte("order_date", `${today} 00:00:00`)
            .lte("order_date", `${today} 23:59:59`);

        // Pendapatan bulan ini
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
            customers: custCount || 0,
            orders: ordersCount || 0,
            ordersToday: ordersTodayCount || 0,
            monthlyIncome: totalIncome || 0,
        });
    }

    return (
        <LayoutWrapper>
            <div className="p-6 text-black dark:text-white">

                <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Total Pelanggan" value={stats.customers} />
                    <StatCard title="Total Pesanan" value={stats.orders} />
                    <StatCard title="Pesanan Hari Ini" value={stats.ordersToday} />
                    <StatCard
                        title="Pendapatan Bulan Ini"
                        value={`Rp ${stats.monthlyIncome.toLocaleString()}`}
                    />
                </div>

                {/* Grafik Placeholder */}
                <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded shadow">
                    <h2 className="text-lg font-medium mb-2">Grafik Pesanan / Bulan</h2>

                    <div className="h-40 flex items-center justify-center 
                          text-gray-500 dark:text-gray-300">
                        Grafik akan ditambahkan setelah UI selesai.
                    </div>
                </div>

                {/* Shortcut Menu */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Shortcut title="Kelola Pelanggan" onClick={() => navigate("/customers")} />
                    <Shortcut title="Kelola Layanan" onClick={() => navigate("/services")} />
                    <Shortcut title="Kelola Pesanan" onClick={() => navigate("/orders")} />
                </div>
            </div>
        </LayoutWrapper>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 
                    text-black dark:text-white rounded shadow">
            <p className="text-gray-600 dark:text-gray-300">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}

function Shortcut({ title, onClick }) {
    return (
        <button
            onClick={onClick}
            className="p-4 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
            {title}
        </button>
    );
}
