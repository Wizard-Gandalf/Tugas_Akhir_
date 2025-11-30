import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function ServicesList() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);

    useEffect(() => {
        loadServices();
    }, []);

    async function loadServices() {
        const { data } = await supabase.from("services").select("*");
        setServices(data || []);
    }

    async function deleteService(id) {
        if (!confirm("Hapus layanan ini?")) return;

        await supabase.from("services").delete().eq("id", id);
        loadServices();
    }

    return (
        <LayoutWrapper>
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold">Data Layanan</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/services/add")}
                >
                    + Tambah Layanan
                </button>
            </div>

            <table className="w-full bg-white shadow rounded overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">Nama Layanan</th>
                        <th className="p-2 border">Jenis Kain</th>
                        <th className="p-2 border">Harga</th>
                        <th className="p-2 border">Durasi</th>
                        <th className="p-2 border">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {services.map((s) => (
                        <tr key={s.id}>
                            <td className="border p-2">{s.name}</td>
                            <td className="border p-2">{s.cloth_type}</td>
                            <td className="border p-2">Rp {parseInt(s.price).toLocaleString()}</td>
                            <td className="border p-2">{s.duration_hours} Jam</td>

                            <td className="border p-2 flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/services/edit/${s.id}`)}
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
                            <td colSpan="5" className="p-3 text-center">
                                Tidak ada data layanan
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </LayoutWrapper>
    );
}
