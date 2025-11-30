import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function EditCustomer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", phone: "", address: "" });

    useEffect(() => {
        async function loadData() {
            const { data } = await supabase.from("customers").select("*").eq("id", id).single();
            if (data) setForm(data);
        }
        loadData();
    }, [id]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { error } = await supabase.from("customers").update(form).eq("id", id);
        if (error) alert(error.message);
        else navigate("/customers");
    }

    return (
        <LayoutWrapper>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">Edit Pelanggan</h1>

            <form
                className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full md:w-1/2 text-black dark:text-white"
                onSubmit={handleSubmit}
            >
                <label className="block mb-2">Nama</label>
                <input
                    name="name"
                    value={form.name}
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-black dark:text-white p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

                <label className="block mb-2">Telepon</label>
                <input
                    name="phone"
                    value={form.phone}
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-black dark:text-white p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

                <label className="block mb-2">Alamat</label>
                <textarea
                    name="address"
                    value={form.address}
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-black dark:text-white p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                ></textarea>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Perbarui
                </button>
            </form>
        </LayoutWrapper>
    );
}
