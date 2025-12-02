import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

const STATUS_OPTIONS = ["pending", "proses", "selesai", "diambil"];

export default function EditOrder() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [staff, setStaff] = useState([]);
    const [services, setServices] = useState([]);

    const [form, setForm] = useState({
        customer_name: "",
        customer_phone: "",
        service_id: "",
        staff_id: "",
        weight_kg: "",
        status: "pending",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function loadData() {
        const [{ data: staffData }, { data: serv }] = await Promise.all([
            supabase.from("staff").select("*"),
            supabase.from("services").select("*"),
        ]);
        setStaff(staffData || []);
        setServices(serv || []);
    }

    async function loadOrder() {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            alert(error.message);
        } else if (data) {
            setForm({
                customer_name: data.customer_name || "",
                customer_phone: data.customer_phone || "",
                service_id: data.service_id,
                staff_id: data.staff_id,
                weight_kg: String(data.weight_kg),
                status: data.status,
            });
        }
    }

    useEffect(() => {
        loadData();
        loadOrder();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        const weightNumber = parseFloat(
            String(form.weight_kg).replace(",", ".")
        );
        if (Number.isNaN(weightNumber) || weightNumber <= 0) {
            alert("Berat tidak valid");
            return;
        }

        const service = services.find(
            (s) => s.id === Number(form.service_id)
        );
        if (!service) {
            alert("Layanan tidak ditemukan");
            return;
        }

        const totalPrice = Math.round(service.price * weightNumber);

        const payload = {
            customer_name: form.customer_name.trim(),
            customer_phone: form.customer_phone.trim() || null,
            service_id: Number(form.service_id),
            staff_id: Number(form.staff_id),
            weight_kg: weightNumber,
            total_price: totalPrice,
            status: form.status,
        };

        const { error } = await supabase
            .from("orders")
            .update(payload)
            .eq("id", id);

        if (error) {
            alert(error.message);
        } else {
            navigate("/app/orders");
        }
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
                <label className="block mb-2">Nama Pelanggan</label>
                <input
                    name="customer_name"
                    value={form.customer_name}
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

                <label className="block mb-2">
                    No. Telepon <span className="text-sm text-gray-400">(opsional)</span>
                </label>
                <input
                    name="customer_phone"
                    value={form.customer_phone}
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

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
                            {s.name} (Rp {s.price.toLocaleString()} /kg)
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
                    name="weight_kg"
                    value={form.weight_kg}
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-black dark:text-white 
                               p-2 w-full mb-3 rounded"
                    onChange={handleChange}
                />

                <label className="block mb-2">Status Pesanan</label>
                <select
                    name="status"
                    value={form.status}
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-black dark:text-white
                               p-2 w-full mb-4 rounded"
                    onChange={handleChange}
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Perbarui
                </button>
            </form>
        </LayoutWrapper>
    );
}
