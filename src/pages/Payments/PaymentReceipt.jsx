import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

// library PDF
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

export default function PaymentReceipt() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        setLoading(true);

        const { data, error } = await supabase
            .from("payments")
            .select(`
                id,
                amount_paid,
                remaining_amount,
                method,
                status,
                payment_date,
                orders (
                    id,
                    customer_name,
                    customer_phone,
                    total_price,
                    weight_kg,
                    status,
                    order_date,
                    services ( name, price ),
                    staff ( name, position )
                )
            `)
            .eq("id", id)
            .single();

        if (error) {
            console.error(error);
            alert("Gagal memuat nota pembayaran");
        } else {
            setPayment(data);
        }

        setLoading(false);
    }

    function renderMethodLabel(method) {
        if (method === "cash") return "Tunai";
        if (method === "transfer") return "QRIS";
        return method || "-";
    }

    function renderStatusLabel(status) {
        if (status === "selesai") return "Lunas";
        if (status === "pending") return "Pending";
        return status || "-";
    }

    function formatRupiah(value) {
        return `Rp ${Number(value || 0).toLocaleString()}`;
    }

    function handleDownloadPdf() {
        if (!payment) return;

        const order = payment.orders;
        const service = order?.services;
        const staff = order?.staff;

        const doc = new jsPDF(); // A4 portrait

        // Header
        doc.setFontSize(16);
        doc.text("Laundry Management", 14, 18);
        doc.setFontSize(11);
        doc.text("Nota Pembayaran", 14, 26);

        doc.setFontSize(10);
        doc.text(`No Nota : ${payment.id}`, 14, 34);
        doc.text(
            `Tanggal : ${payment.payment_date ? payment.payment_date.slice(0, 10) : "-"
            }`,
            14,
            40
        );

        // Info pelanggan di kanan
        const customerName = order?.customer_name || "-";
        const customerPhone = order?.customer_phone || "";

        doc.text(`Pelanggan : ${customerName}`, 120, 34);
        if (customerPhone) {
            doc.text(`Telepon  : ${customerPhone}`, 120, 40);
        }

        // Tabel rincian layanan
        const tableBody = [
            [
                service?.name || "-",
                order?.weight_kg ? `${order.weight_kg} Kg` : "-",
                service?.price ? formatRupiah(service.price) : "-",
                order?.total_price ? formatRupiah(order.total_price) : "-",
            ],
        ];

        autoTable(doc, {
            startY: 48,
            head: [["Layanan", "Berat", "Harga/kg", "Subtotal"]],
            body: tableBody,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [33, 150, 243] },
        });

        let finalY = doc.lastAutoTable?.finalY || 48;

        // Ringkasan pembayaran
        finalY += 6;
        doc.text("Ringkasan Pembayaran", 14, finalY);

        finalY += 5;
        doc.text("Total Tagihan :", 14, finalY);
        doc.text(
            order?.total_price ? formatRupiah(order.total_price) : "Rp 0",
            60,
            finalY
        );

        finalY += 5;
        doc.text("Dibayar       :", 14, finalY);
        doc.text(formatRupiah(payment.amount_paid), 60, finalY);

        finalY += 8;
        doc.text(
            `Status : ${renderStatusLabel(payment.status)} | Metode : ${renderMethodLabel(
                payment.method
            )}`,
            14,
            finalY
        );

        if (staff?.name) {
            finalY += 8;
            doc.text(
                `Dilayani oleh: ${staff.name}${staff.position ? " (" + staff.position + ")" : ""
                }`,
                14,
                finalY
            );
        }

        finalY += 12;
        doc.setFontSize(9);
        doc.text(
            "Terima kasih telah menggunakan layanan laundry kami.",
            14,
            finalY
        );

        doc.save(`Nota-${payment.id}.pdf`);
    }

    if (loading) {
        return (
            <LayoutWrapper>
                <p className="text-black dark:text-white">Memuat nota...</p>
            </LayoutWrapper>
        );
    }

    if (!payment) {
        return (
            <LayoutWrapper>
                <p className="text-red-500">Data nota tidak ditemukan.</p>
            </LayoutWrapper>
        );
    }

    const order = payment.orders;
    const service = order?.services;
    const staff = order?.staff;
    const customerName = order?.customer_name;
    const customerPhone = order?.customer_phone;

    return (
        <LayoutWrapper>
            <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold">Nota Pembayaran</h1>
                    <span className="text-sm text-gray-500">
                        #{payment.id}
                    </span>
                </div>

                <div className="border-b border-gray-300 dark:border-gray-700 pb-3 mb-3 text-sm">
                    <p className="font-semibold">Laundry Management</p>
                    <p>Keterangan transaksi pembayaran layanan laundry.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <h2 className="font-semibold mb-1">Pelanggan</h2>
                        <p>{customerName || "-"}</p>
                        <p className="text-gray-500 text-xs">
                            {customerPhone || ""}
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="font-semibold mb-1">Info Nota</h2>
                        <p>
                            Tanggal:{" "}
                            {payment.payment_date
                                ? payment.payment_date.slice(0, 10)
                                : "-"}
                        </p>
                        <p>Status: {renderStatusLabel(payment.status)}</p>
                        <p>Metode: {renderMethodLabel(payment.method)}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <h2 className="text-sm font-semibold mb-2">
                        Rincian Pesanan
                    </h2>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-700">
                                <th className="py-1 text-left">Layanan</th>
                                <th className="py-1 text-right">Berat</th>
                                <th className="py-1 text-right">Harga/kg</th>
                                <th className="py-1 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-1">
                                    {service?.name || "-"}
                                </td>
                                <td className="py-1 text-right">
                                    {order?.weight_kg
                                        ? `${order.weight_kg} Kg`
                                        : "-"}
                                </td>
                                <td className="py-1 text-right">
                                    {service?.price
                                        ? formatRupiah(service.price)
                                        : "-"}
                                </td>
                                <td className="py-1 text-right">
                                    {order?.total_price
                                        ? formatRupiah(order.total_price)
                                        : "-"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-700 pt-3 text-sm space-y-1 mb-4">
                    <div className="flex justify-between">
                        <span>Total Tagihan</span>
                        <span className="font-semibold">
                            {order?.total_price
                                ? formatRupiah(order.total_price)
                                : "Rp 0"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Dibayar</span>
                        <span className="font-semibold">
                            {formatRupiah(payment.amount_paid)}
                        </span>
                    </div>

                </div>

                {staff && (
                    <p className="text-xs text-gray-500 mb-4">
                        Dilayani oleh: {staff.name}{" "}
                        {staff.position ? `(${staff.position})` : ""}
                    </p>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={() => navigate("/app/payments")}
                        className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </LayoutWrapper>
    );
}
