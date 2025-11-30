import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function EditPayment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        amount_paid: "",
        method: "",
    });

    useEffect(() => {
        async function loadData() {
            const { data } = await supabase.from("payments").select("*").eq("id", id).single();
            if (data) setForm(data);
        }
        loadData();
    }, [id]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { error } = await supabase.from("payments").update(form).eq("id", id);
        if (error) alert(error.message);
        else navigate("/payments");
    }

    return (
        <LayoutWrapper>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">Edit Pembayaran</h1>

            <form
                className="bg-white dark:bg-gray-800 text-black dark:text-white
                   p-4 rounded shadow w-full md:w-1/2"
                onSubmit={handleSubmit}
            >
                <label className="block mb-2">Jumlah Bayar (Rp)</label>
                <input
                    name="amount_paid"
                    value={form.amount_paid}
                    className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-black dark:text-white
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

                <label className="block mb-2">Metode Pembayaran</label>
                <select
                    name="method"
                    value={form.method}
                    className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-black dark:text-white
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                >
                    <option value="Tunai">Tunai</option>
                    <option value="QRIS">QRIS</option>
                </select>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Perbarui
                </button>
            </form>
        </LayoutWrapper>
    );
}
