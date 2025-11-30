import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function CustomersList() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        const { data, error } = await supabase.from("customers").select("*");
        if (!error) setCustomers(data);
    }

    async function deleteCustomer(id) {
        if (!confirm("Hapus pelanggan ini?")) return;

        await supabase.from("customers").delete().eq("id", id);
        loadCustomers();
    }

    return (
        <LayoutWrapper>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Data Pelanggan</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/customers/add")}
                >
                    + Tambah Pelanggan
                </button>
            </div>

            <table className="w-full bg-white shadow rounded overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">Nama</th>
                        <th className="p-2 border">Telepon</th>
                        <th className="p-2 border">Alamat</th>
                        <th className="p-2 border">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((c) => (
                        <tr key={c.id}>
                            <td className="border p-2">{c.name}</td>
                            <td className="border p-2">{c.phone}</td>
                            <td className="border p-2">{c.address}</td>
                            <td className="border p-2 flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/customers/edit/${c.id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => deleteCustomer(c.id)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}

                    {customers.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center p-3">
                                Tidak ada data pelanggan
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </LayoutWrapper>
    );
}
