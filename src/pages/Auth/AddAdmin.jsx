import { useState } from "react";
import { supabase } from "../../api/supabaseClient";

export default function AddAdmin() {
    const [data, setData] = useState({ username: "", password: "" });
    const [msg, setMsg] = useState("");

    function handleChange(e) {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const { error } = await supabase
            .from("admins")
            .insert([{ username: data.username, password: data.password }]);

        if (error) {
            setMsg("Gagal menambahkan admin: " + error.message);
        } else {
            setMsg("Admin berhasil ditambahkan");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow w-96">
                <h1 className="text-2xl font-semibold mb-4 text-center">
                    Tambah Admin
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="username"
                        placeholder="Username"
                        value={data.username}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded"
                    >
                        Simpan
                    </button>
                </form>

                {msg && <p className="mt-3 text-center text-sm">{msg}</p>}
            </div>
        </div>
    );
}
