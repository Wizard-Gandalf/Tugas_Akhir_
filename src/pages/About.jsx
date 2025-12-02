// src/pages/About.jsx
import LayoutWrapper from "../components/layout/LayoutWrapper";

export default function About() {
    return (
        <LayoutWrapper>
            <h1 className="text-2xl font-semibold mb-4 text-white">
                Tentang Aplikasi
            </h1>

            <div className="bg-slate-800/80 text-gray-100 p-6 rounded-lg shadow-lg space-y-4">
                <p>
                    Aplikasi <span className="font-semibold">Laundry Management</span> ini
                    dibuat untuk membantu pemilik usaha laundry mengelola data
                    pelanggan, layanan, pesanan, dan pembayaran dalam satu
                    dashboard yang sederhana.
                </p>

                <ul className="list-disc list-inside space-y-1">
                    <li>Kelola data pelanggan, layanan, dan petugas</li>
                    <li>Mencatat pesanan beserta berat dan total biaya</li>
                    <li>Mencatat pembayaran dan statusnya</li>
                    <li>Dashboard ringkasan dan laporan pesanan/pembayaran</li>
                </ul>

                <p className="text-sm text-gray-400">
                    Halaman ini hanya informasi singkat. Kamu bisa menyesuaikan isi
                    teksnya untuk keperluan laporan atau presentasi.
                </p>
            </div>
        </LayoutWrapper>
    );
}
