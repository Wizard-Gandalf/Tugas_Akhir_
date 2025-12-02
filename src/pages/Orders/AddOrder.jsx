import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function AddOrder() {
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);
    const [services, setServices] = useState([]);

    const [form, setForm] = useState({
        customer_name: "",
        customer_phone: "",
        service_id: "",
        staff_id: "",
        weight_kg: "",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function loadData() {
        const { data: staffData } = await supabase.from("staff").select("*");
        const { data: serv } = await supabase.from("services").select("*");

        setStaff(staffData || []);
        setServices(serv || []);
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.customer_name.trim()) {
            alert("Nama pelanggan wajib diisi");
            return;
        }
        if (!form.service_id || !form.staff_id) {
            alert("Layanan dan petugas wajib dipilih");
            return;
        }

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
            status: "pending",
        };

        const { error } = await supabase.from("orders").insert(payload);
        if (error) {
            alert(error.message);
        } else {
            navigate("/app/orders");
        }
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
                {/* Nama Pelanggan bebas */}
                <label className="block mb-2">Nama Pelanggan</label>
                <input
                    name="customer_name"
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                    value={form.customer_name}
                    onChange={handleChange}
                    placeholder="contoh: Budi"
                />

                <label className="block mb-2">
                    No. Telepon <span className="text-sm text-gray-400">(opsional)</span>
                </label>
                <input
                    name="customer_phone"
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                    value={form.customer_phone}
                    onChange={handleChange}
                    placeholder="contoh: 08xxxx"
                />

                <label className="block mb-2">Layanan</label>
                <select
                    name="service_id"
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                    value={form.service_id}
                    onChange={handleChange}
                >
                    <option value="">Pilih layanan</option>
                    {services.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name} (Rp {s.price.toLocaleString()} /kg)
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Petugas</label>
                <select
                    name="staff_id"
                    className="border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-black dark:text-white
                               p-2 w-full mb-3 rounded"
                    value={form.staff_id}
                    onChange={handleChange}
                >
                    <option value="">Pilih petugas</option>
                    {staff.map((st) => (
                        <option key={st.id} value={st.id}>
                            {st.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Berat (kg)</label>
                <input
                    name="weight_kg"
                    className="border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-black dark:text-white 
                               p-2 w-full mb-3 rounded"
                    value={form.weight_kg}
                    onChange={handleChange}
                    placeholder="contoh: 0.5 atau 2"
                />

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Simpan
                </button>
            </form>
        </LayoutWrapper>
    );
}
