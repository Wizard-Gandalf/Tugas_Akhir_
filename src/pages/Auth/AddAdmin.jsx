// src/pages/Auth/AddAdmin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";

export default function AddAdmin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.username.trim() || !form.password.trim()) {
            setError("Username dan password wajib diisi");
            return;
        }

        const { error } = await supabase.from("admins").insert({
            username: form.username.trim(),
            password: form.password.trim(),
        });

        if (error) {
            setError(error.message);
        } else {
            navigate("/"); // kembali ke halaman login
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6">
                <h1 className="text-xl font-semibold mb-4 text-center">
                    Tambah Admin
                </h1>

                {error && (
                    <p className="text-red-500 text-sm mb-3 text-center">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600
                                   bg-white dark:bg-gray-700 text-black dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600
                                   bg-white dark:bg-gray-700 text-black dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
                    >
                        Simpan
                    </button>
                </form>
            </div>
        </div>
    );
}
