import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // simulasi loading awal 400–700 ms
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <LoadingScreen />;

    return <AppRoutes />;
}
