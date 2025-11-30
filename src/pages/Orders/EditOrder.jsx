import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function EditOrder() {
    const { id } = useParams();
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
        const [{ data: cust }, { data: staffData }, { data: serv }] = await Promise.all([
            supabase.from("customers").select("*"),
            supabase.from("staff").select("*"),
            supabase.from("services").select("*"),
        ]);
        setCustomers(cust || []);
        setStaff(staffData || []);
        setServices(serv || []);
    }

    async function loadOrder() {
        const { data } = await supabase.from("orders").select("*").eq("id", id).single();
        if (data) setForm(data);
    }

    useEffect(() => {
        loadData();
        loadOrder();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        const { error } = await supabase.from("orders").update(form).eq("id", id);
        if (error) alert(error.message);
        else navigate("/orders");
    }

    return (
        <LayoutWrapper>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Edit Pesanan
            </h1>

            <form
                className="bg-white dark:bg-gray-800 p-4 rounded shadow 
                   text-black dark:text-white w-full md:w-1/2"
                onSubmit={handleSubmit}
            >
                <label className="block mb-2">Pelanggan</label>
                <select
                    name="customer_id"
                    value={form.customer_id}
                    className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-black dark:text-white
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                >
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Layanan</label>
                <select
                    name="service_id"
                    value={form.service_id}
                    className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-black dark:text-white
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                >
                    {services.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Petugas</label>
                <select
                    name="staff_id"
                    value={form.staff_id}
                    className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-black dark:text-white
                     p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                >
                    {staff.map((st) => (
                        <option key={st.id} value={st.id}>
                            {st.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Berat (kg)</label>
                <input
                    name="weight"
                    value={form.weight}
                    className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-black dark:text-white 
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
