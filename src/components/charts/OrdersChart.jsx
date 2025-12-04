// src/components/charts/OrdersChart.jsx
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OrdersChart({ labels, values }) {
    const data = {
        labels,
        datasets: [
            {
                label: "Jumlah Pesanan",
                data: values.map((v) => Number(v) || 0),
                backgroundColor: "rgba(59, 130, 246, 0.9)", // biru terang
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                ticks: {
                    color: "#e5e7eb", // text-slate-200
                    maxRotation: 45,
                    minRotation: 45,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#e5e7eb",
                    stepSize: 1,
                },
                grid: {
                    color: "rgba(148, 163, 184, 0.3)", // garis abu2
                },
            },
        },
    };

    return (
        <div className="w-full h-64">
            <Bar data={data} options={options} />
        </div>
    );
}
