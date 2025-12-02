import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
    const { admin, loading } = useAuth();

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
                Loading...
            </div>
        );
    }

    if (!admin) {
        return <Navigate to="/" replace />;   // tadinya "/login"
    }

    return children;
}
