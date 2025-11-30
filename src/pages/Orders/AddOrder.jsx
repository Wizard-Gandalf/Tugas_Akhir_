import { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function AddOrder() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [staff, setStaff] = useState([]);
    const [services, setServices] = useState([]);

    const [form, setForm] = useState({
        customer_id: "",
        service_id: "",
        staff_id: "",
        weight: "",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function loadData() {
        const { data: cust } = await supabase.from("customers").select("*");
        const { data: staffData } = await supabase.from("staff").select("*");
        const { data: serv } = await supabase.from("services").select("*");

        setCustomers(cust || []);
        setStaff(staffData || []);
        setServices(serv || []);
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const { error } = await supabase.from("orders").insert(form);
        if (error) alert(error.message);
        else navigate("/orders");
    }

    return (
        <LayoutWrapper>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Tambah Pesanan
            </h1>

            <form
                className="bg-white dark:bg-gray-800 text-black dark:text-white 
                   p-4 rounded shadow w-full md:w-1/2"
                onSubmit={handleSubmit}
            >
                <label className="block mb-2">Pelanggan</label>
                <select
                    name="customer_id"
                    className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-black dark:text-white
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                >
                    <option>Pilih pelanggan</option>
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Layanan</label>
                <select
                    name="service_id"
                    className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-black dark:text-white
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                >
                    <option>Pilih layanan</option>
                    {services.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Petugas</label>
                <select
                    name="staff_id"
                    className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-black dark:text-white
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                >
                    <option>Pilih petugas</option>
                    {staff.map((st) => (
                        <option key={st.id} value={st.id}>
                            {st.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Berat (kg)</label>
                <input
                    name="weight"
                    className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-black dark:text-white 
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Simpan
                </button>
            </form>
        </LayoutWrapper>
    );
}
