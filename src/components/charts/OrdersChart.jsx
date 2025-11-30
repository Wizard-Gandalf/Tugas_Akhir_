import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function OrdersChart({ labels, values }) {
    const data = {
        labels,
        datasets: [
            {
                label: "Jumlah Pesanan",
                data: values,
            },
        ],
    };

    return <Bar data={data} />;
}
