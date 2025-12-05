// src/pages/About.jsx
import LayoutWrapper from "../components/layout/LayoutWrapper";
import { Link } from "react-router-dom";

export default function About() {
    return (
        <LayoutWrapper>
            <h1 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Tentang Aplikasi
            </h1>

            <div
                className="
                    bg-white dark:bg-gray-800
                    text-black dark:text-white
                    border border-gray-200 dark:border-gray-700
                    p-6 rounded-lg shadow space-y-4
                "
            >
                <p>
                    Aplikasi <span className="font-semibold">Laundry Management</span> ini
                    dibuat untuk membantu pemilik usaha laundry mengelola data
                    layanan, pesanan, petugas, dan pembayaran dalam satu
                    dashboard yang sederhana.
                </p>

                <ul className="list-disc list-inside space-y-1">
                    <li>Kelola data layanan dan petugas</li>
                    <li>Mencatat pesanan beserta berat dan total biaya</li>
                    <li>Mencatat pembayaran dan statusnya</li>
                    <li>Dashboard ringkasan dan laporan pesanan/pembayaran</li>
                </ul>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Halaman ini hanya informasi singkat. Teks dapat disesuaikan
                    untuk keperluan laporan, dokumentasi, atau presentasi.
                </p>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 flex justify-end">
                    <Link
                        to="/add-admin"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                    >
                        Tambah Admin
                    </Link>
                </div>
            </div>
        </LayoutWrapper>
    );
}
