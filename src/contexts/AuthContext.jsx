import { createContext, useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);

    async function login(username, password) {
        const { data, error } = await supabase
            .from("admins")
            .select("*")
            .eq("username", username)
            .single();

        if (error || !data) return { error: "Username tidak ditemukan" };

        // BCrypt recommended, tapi untuk praktikum kita pakai simple compare
        if (password !== data.password_hash)
            return { error: "Password salah" };

        setAdmin(data);
        return { success: true };
    }

    function logout() {
        setAdmin(null);
    }

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
