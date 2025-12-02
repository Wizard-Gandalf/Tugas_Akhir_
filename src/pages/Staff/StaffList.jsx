import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function StaffList() {
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        loadStaff();
    }, []);

    async function loadStaff() {
        const { data, error } = await supabase.from("staff").select("*");
        if (error) {
            alert(error.message);
            return;
        }
        setStaff(data || []);
    }

    async function deleteStaff(id) {
        if (!confirm("Hapus petugas ini?")) return;

        const { error } = await supabase.from("staff").delete().eq("id", id);
        if (error) {
            alert(error.message);
        } else {
            loadStaff();
        }
    }

    return (
        <LayoutWrapper>
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold text-black dark:text-white">
                    Data Petugas
                </h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/app/staff/add")}
                >
                    + Tambah Petugas
                </button>

            </div>

            <table className="w-full bg-white dark:bg-gray-900 shadow rounded overflow-hidden text-black dark:text-white">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="p-2 border">Nama</th>
                        <th className="p-2 border">Telepon</th>
                        <th className="p-2 border">Posisi</th>
                        <th className="p-2 border">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {staff.map((s) => (
                        <tr
                            key={s.id}
                            className="odd:bg-gray-50 dark:odd:bg-gray-800"
                        >
                            <td className="p-2 border">{s.name}</td>
                            <td className="p-2 border">{s.phone}</td>
                            <td className="p-2 border">{s.position}</td>
                            <td className="p-2 border flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/app/staff/edit/${s.id}`)}
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
                            <td
                                colSpan="4"
                                className="p-3 text-center text-black dark:text-white"
                            >
                                Tidak ada data petugas
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </LayoutWrapper>
    );
}
