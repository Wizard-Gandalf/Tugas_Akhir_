import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
    const { admin, login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Jika sudah login, arahkan ke dashboard
    useEffect(() => {
        if (admin) {
            navigate("/dashboard");
        }
    }, [admin, navigate]);

    const handleLogin = async () => {
        const res = await login(username, password);
        if (res?.error) setError(res.error);
        else navigate("/dashboard");
    };

    return (
        <div className="h-screen flex items-center justify-center 
                        bg-gray-100 dark:bg-gray-900 
                        text-black dark:text-white">

            <div className="p-6 bg-white dark:bg-gray-800 
                            rounded shadow w-80">

                <h2 className="text-xl font-semibold mb-4 text-center">
                    Admin Login
                </h2>

                {error && (
                    <p className="text-red-500 text-sm mb-3">{error}</p>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    className="border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 
                               text-black dark:text-white 
                               p-2 w-full mb-3 rounded"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 
                               text-black dark:text-white 
                               p-2 w-full mb-3 rounded"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="bg-blue-600 hover:bg-blue-700 
                               text-white px-4 py-2 rounded w-full"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
}
