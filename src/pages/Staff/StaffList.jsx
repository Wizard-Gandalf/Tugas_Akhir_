import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function StaffList() {
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        loadStaff();
    }, []);

    async function loadStaff() {
        const { data } = await supabase.from("staff").select("*");
        setStaff(data || []);
    }

    async function deleteStaff(id) {
        if (!confirm("Hapus petugas ini?")) return;

        await supabase.from("staff").delete().eq("id", id);
        loadStaff();
    }

    return (
        <LayoutWrapper>
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold">Data Petugas</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/staff/add")}
                >
                    + Tambah Petugas
                </button>
            </div>

            <table className="w-full bg-white shadow rounded overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">Nama</th>
                        <th className="p-2 border">Telepon</th>
                        <th className="p-2 border">Posisi</th>
                        <th className="p-2 border">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {staff.map((s) => (
                        <tr key={s.id}>
                            <td className="p-2 border">{s.name}</td>
                            <td className="p-2 border">{s.phone}</td>
                            <td className="p-2 border">{s.position}</td>
                            <td className="p-2 border flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/staff/edit/${s.id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => deleteStaff(s.id)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}

                    {staff.length === 0 && (
                        <tr>
                            <td colSpan="4" className="p-3 text-center">
                                Tidak ada data petugas
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </LayoutWrapper>
    );
}
