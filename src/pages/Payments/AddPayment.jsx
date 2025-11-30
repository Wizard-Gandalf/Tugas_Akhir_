import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function AddPayment() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const [form, setForm] = useState({
        order_id: "",
        amount_paid: "",
        method: "Tunai",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function loadOrders() {
        const { data } = await supabase.from("orders").select("*");
        setOrders(data || []);
    }

    useEffect(() => {
        loadOrders();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const { error } = await supabase.from("payments").insert(form);
        if (error) alert(error.message);
        else navigate("/payments");
    }

    return (
        <LayoutWrapper>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">Tambah Pembayaran</h1>

            <form
                className="bg-white dark:bg-gray-800 text-black dark:text-white
                   p-4 rounded shadow w-full md:w-1/2"
                onSubmit={handleSubmit}
            >
                <label className="block mb-2">ID Pesanan</label>
                <select
                    name="order_id"
                    className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-black dark:text-white 
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                >
                    <option>Pilih Pesanan</option>
                    {orders.map((o) => (
                        <option key={o.id} value={o.id}>
                            #{o.id}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Jumlah Bayar (Rp)</label>
                <input
                    name="amount_paid"
                    className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-black dark:text-white
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

                <label className="block mb-2">Metode Pembayaran</label>
                <select
                    name="method"
                    className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-black dark:text-white 
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                >
                    <option value="Tunai">Tunai</option>
                    <option value="QRIS">QRIS</option>
                </select>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Simpan
                </button>
            </form>
        </LayoutWrapper>
    );
}
