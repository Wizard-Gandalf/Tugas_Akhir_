import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function EditPayment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        amount_paid: "",
        method: "cash",
    });

    useEffect(() => {
        async function loadData() {
            const { data, error } = await supabase
                .from("payments")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error(error);
                alert("Gagal memuat data pembayaran");
                return;
            }

            setForm({
                amount_paid: data.amount_paid,
                method: data.method, // 'cash' / 'transfer'
            });
        }
        loadData();
    }, [id]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { error } = await supabase
            .from("payments")
            .update({
                amount_paid: Number(form.amount_paid) || 0,
                method: form.method,
            })
            .eq("id", id);

        if (error) {
            alert(error.message);
        } else {
            navigate("/app/payments");
        }
    }

    return (
        <LayoutWrapper>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Edit Pembayaran
            </h1>

            <form
                className="bg-white dark:bg-gray-800 text-black dark:text-white
                           p-4 rounded shadow w-full md:w-1/2"
                onSubmit={handleSubmit}
            >
                <label className="block mb-2">Jumlah Bayar (Rp)</label>
                <input
                    name="amount_paid"
                    type="number"
                    value={form.amount_paid}
                    onChange={handleChange}
                    className="border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                />

                <label className="block mb-2">Metode Pembayaran</label>
                <select
                    name="method"
                    value={form.method}
                    onChange={handleChange}
                    className="border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                >
                    <option value="cash">Tunai</option>
                    <option value="transfer">QRIS</option>
                </select>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Perbarui
                </button>
            </form>
        </LayoutWrapper>
    );
}
