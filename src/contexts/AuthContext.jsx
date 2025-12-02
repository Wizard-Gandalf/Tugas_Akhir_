import { createContext, useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Saat pertama kali load, ambil admin dari localStorage
    useEffect(() => {
        const saved = localStorage.getItem("admin");
        if (saved) {
            try {
                setAdmin(JSON.parse(saved));
            } catch {
                setAdmin(null);
            }
        }
        setLoading(false);
    }, []);

    // LOGIN ke tabel admins (username + password)
    async function login(username, password) {
        const { data, error } = await supabase
            .from("admins")
            .select("*")
            .eq("username", username)
            .eq("password", password)
            .maybeSingle();

        if (error) {
            console.error(error);
            // tampilkan pesan asli Supabase di layar
            return { error: error.message };
        }

        if (!data) {
            return { error: "Username atau password salah" };
        }

        setAdmin(data);
        localStorage.setItem("admin", JSON.stringify(data));
        return { user: data };
    }

    // LOGOUT
    function logout() {
        setAdmin(null);
        localStorage.removeItem("admin");
    }

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
