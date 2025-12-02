import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function ServicesList() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);

    useEffect(() => {
        loadServices();
    }, []);

    async function loadServices() {
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            alert(error.message);
            return;
        }
        setServices(data || []);
    }

    async function deleteService(id) {
        if (!confirm("Hapus layanan ini?")) return;

        const { error } = await supabase
            .from("services")
            .delete()
            .eq("id", id);

        if (error) {
            alert(error.message);
        } else {
            loadServices();
        }
    }

    return (
        <LayoutWrapper>
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold text-black dark:text-white">
                    Data Layanan
                </h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/app/services/add")}
                >
                    + Tambah Layanan
                </button>

            </div>

            <table className="w-full bg-white dark:bg-gray-900 shadow rounded overflow-hidden text-black dark:text-white">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="p-2 border">Nama Layanan</th>
                        <th className="p-2 border">Harga</th>
                        <th className="p-2 border">Durasi</th>
                        <th className="p-2 border">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {services.map((s) => (
                        <tr key={s.id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                            <td className="border p-2">{s.name}</td>
                            <td className="border p-2">
                                Rp {parseInt(s.price, 10).toLocaleString()}
                            </td>
                            <td className="border p-2">
                                {s.duration_hours ? `${s.duration_hours} Jam` : "-"}
                            </td>
                            <td className="border p-2 flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/app/services/edit/${s.id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => deleteService(s.id)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}

                    {services.length === 0 && (
                        <tr>
                            <td colSpan="4" className="p-3 text-center">
                                Tidak ada data layanan
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </LayoutWrapper>
    );
}
