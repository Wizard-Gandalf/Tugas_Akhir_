import Navbar from "./Navbar";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
            <Navbar />
            <main className="p-4">
                {children}
            </main>
        </div>
    );
}
