export default function LoadingScreen() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <img
                    src="/icons/icon-192.png"
                    alt="logo"
                    className="w-20 h-20 mx-auto mb-4 animate-pulse"
                />
                <p className="text-gray-600 text-lg font-medium">Memuat aplikasi...</p>
            </div>
        </div>
    );
}
