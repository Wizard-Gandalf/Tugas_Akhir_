import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function AddPayment() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const [form, setForm] = useState({
        order_id: "",
        method: "cash",
    });

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        // ambil semua orders
        const [{ data: ordersData, error: ordersError }, { data: paymentData, error: paymentError }] =
            await Promise.all([
                supabase
                    .from("orders")
                    .select("id, total_price, customer_name")
                    .order("id", { ascending: true }),
                // semua pembayaran (apa pun statusnya), supaya 1 order = 1 payment
                supabase
                    .from("payments")
                    .select("order_id"),
            ]);

        if (ordersError || paymentError) {
            console.error(ordersError || paymentError);
            alert("Gagal memuat data pesanan");
            return;
        }

        const alreadyPaidIds = new Set((paymentData || []).map((p) => p.order_id));

        // hanya tampilkan order yang belum punya pembayaran sama sekali
        const availableOrders = (ordersData || []).filter(
            (o) => !alreadyPaidIds.has(o.id)
        );

        setOrders(availableOrders);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const selectedOrder = orders.find(
            (o) => String(o.id) === String(form.order_id)
        );

        if (!selectedOrder) {
            alert("Silakan pilih pesanan yang valid");
            return;
        }

        const total = Number(selectedOrder.total_price) || 0;

        // saat dibuat: status PENDING, dianggap belum dibayar
        const payload = {
            order_id: selectedOrder.id,
            amount_paid: 0,          // belum dibayar
            remaining_amount: total, // masih utuh
            method: form.method,     // cash / transfer
            status: "pending",
        };

        const { error } = await supabase
            .from("payments")
            .insert(payload);

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        // selesai simpan → balik ke daftar pembayaran
        navigate("/app/payments");
    }

    return (
        <LayoutWrapper>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Tambah Pembayaran
            </h1>

            <form
                className="bg-white dark:bg-gray-800 text-black dark:text-white
                           p-4 rounded shadow w-full md:w-1/2"
                onSubmit={handleSubmit}
            >
                <label className="block mb-2">ID Pesanan</label>
                <select
                    name="order_id"
                    value={form.order_id}
                    onChange={handleChange}
                    className="border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-black dark:text-white 
                               p-2 w-full mb-3 rounded"
                >
                    <option value="">Pilih Pesanan</option>
                    {orders.map((o) => (
                        <option key={o.id} value={o.id}>
                            #{o.id} - {o.customer_name} - Rp{" "}
                            {Number(o.total_price).toLocaleString()}
                        </option>
                    ))}
                </select>

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

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    type="submit"
                >
                    Simpan
                </button>
            </form>
        </LayoutWrapper>
    );
}
