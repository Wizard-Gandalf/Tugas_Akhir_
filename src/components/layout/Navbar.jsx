import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-black dark:text-white">
                Dashboard
            </h1>
            <ThemeToggle />
        </nav>
    );
}

<nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
    <h1 className="text-xl font-semibold text-black dark:text-white">
        Dashboard
    </h1>
    <ThemeToggle />
</nav>

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <div className="w-full bg-white shadow p-4 flex justify-end">
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
            >
                Logout
            </button>
        </div>
    );
}
