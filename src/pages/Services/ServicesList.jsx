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
            {/* Header judul + tombol */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-white">
                        Data Layanan
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400">
                        Daftar jenis layanan laundry beserta harga dan durasinya.
                    </p>
                </div>

                <button
                    className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    onClick={() => navigate("/app/services/add")}
                >
                    + Tambah Layanan
                </button>
            </div>

            {/* Tabel responsif */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="min-w-full text-xs sm:text-sm border-collapse bg-slate-900 text-white">
                    <thead className="bg-slate-900/80">
                        <tr className="text-left text-gray-300">
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800">
                                Nama Layanan
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800 whitespace-nowrap">
                                Harga
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800">
                                Durasi
                            </th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-800 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {services.map((s) => (
                            <tr
                                key={s.id}
                                className="border-b border-slate-800 hover:bg-slate-900/60"
                            >
                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    {s.name}
                                </td>

                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle whitespace-nowrap">
                                    Rp {parseInt(s.price, 10).toLocaleString()}
                                </td>

                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    {s.duration_hours
                                        ? `${s.duration_hours} Jam`
                                        : "-"}
                                </td>

                                <td className="px-3 py-2 sm:px-4 sm:py-3 align-middle">
                                    <div className="flex gap-2 justify-center flex-wrap">
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm px-3 py-1.5 rounded-md font-medium"
                                            onClick={() =>
                                                navigate(`/app/services/edit/${s.id}`)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md font-medium"
                                            onClick={() => deleteService(s.id)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {services.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-6 text-center text-sm text-gray-400"
                                >
                                    Tidak ada data layanan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </LayoutWrapper>
    );
}
