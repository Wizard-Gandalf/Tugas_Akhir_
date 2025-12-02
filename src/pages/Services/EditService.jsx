import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function EditService() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        price: "",
        duration_hours: "",
    });

    useEffect(() => {
        async function loadData() {
            const { data, error } = await supabase
                .from("services")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                alert(error.message);
                return;
            }
            setForm({
                name: data.name || "",
                price: data.price?.toString() || "",
                duration_hours: data.duration_hours?.toString() || "",
            });
        }

        loadData();
    }, [id]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            name: form.name.trim(),
            price: parseInt(form.price, 10),
            duration_hours: form.duration_hours
                ? parseInt(form.duration_hours, 10)
                : null,
        };

        const { error } = await supabase
            .from("services")
            .update(payload)
            .eq("id", id);

        if (error) {
            alert(error.message);
        } else {
            navigate("/app/services");
        }
    }

    return (
        <LayoutWrapper>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Edit Layanan
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full md:w-1/2
                           text-black dark:text-white"
            >
                <label className="block mb-2">Nama Layanan</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700
                               text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                />

                <label className="block mb-2">Harga (Rp)</label>
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700
                               text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                />

                <label className="block mb-2">
                    Durasi (Jam) <span className="text-sm text-gray-400">(opsional)</span>
                </label>
                <input
                    name="duration_hours"
                    type="number"
                    value={form.duration_hours}
                    onChange={handleChange}
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700
                               text-black dark:text-white
                               p-2 w-full mb-4 rounded"
                />

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Perbarui
                </button>
            </form>
        </LayoutWrapper>
    );
}
