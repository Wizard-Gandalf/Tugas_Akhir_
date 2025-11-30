import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function EditService() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", price: "" });

    useEffect(() => {
        async function loadData() {
            const { data } = await supabase.from("services").select("*").eq("id", id).single();
            if (data) setForm(data);
        }
        loadData();
    }, [id]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { error } = await supabase.from("services").update(form).eq("id", id);
        if (error) alert(error.message);
        else navigate("/services");
    }

    return (
        <LayoutWrapper>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Edit Layanan
            </h1>

            <form
                className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full md:w-1/2 
                   text-black dark:text-white"
                onSubmit={handleSubmit}
            >
                <label className="block mb-2">Nama Layanan</label>
                <input
                    name="name"
                    value={form.name}
                    className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 
                     text-black dark:text-white 
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

                <label className="block mb-2">Harga</label>
                <input
                    name="price"
                    value={form.price}
                    className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 
                     text-black dark:text-white 
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Perbarui
                </button>
            </form>
        </LayoutWrapper>
    );
}
