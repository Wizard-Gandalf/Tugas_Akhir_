import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <nav className="flex justify-between items-center p-4 
                    bg-white dark:bg-gray-900 
                    border-b border-gray-300 dark:border-gray-700 
                    text-black dark:text-white">

            <h1 className="text-xl font-semibold">
                Dashboard
            </h1>

            <div className="flex items-center gap-4">

                {/* Tombol tema */}
                <ThemeToggle />

                {/* Tombol logout */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
