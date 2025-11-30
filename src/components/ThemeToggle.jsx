import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
        >
            {theme === "light" ? "🌞" : "🌙"}
        </button>
    );
}
