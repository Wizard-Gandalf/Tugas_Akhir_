import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
    const { admin } = useAuth();

    if (!admin) {
        return <Navigate to="/" replace />;
    }

    return children;
}
