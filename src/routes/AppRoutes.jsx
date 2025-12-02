// src/routes/AppRoutes.jsx
import { Routes, Route, Outlet } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import AddAdmin from "../pages/Auth/AddAdmin";

import Navbar from "../components/layout/Navbar.jsx";

import StaffList from "../pages/Staff/StaffList.jsx";
import AddStaff from "../pages/Staff/AddStaff.jsx";
import EditStaff from "../pages/Staff/EditStaff.jsx";

import ServicesList from "../pages/Services/ServicesList.jsx";
import AddService from "../pages/Services/AddService.jsx";
import EditService from "../pages/Services/EditService.jsx";

import OrdersList from "../pages/Orders/OrdersList.jsx";
import AddOrder from "../pages/Orders/AddOrder.jsx";
import EditOrder from "../pages/Orders/EditOrder.jsx";

import PaymentsList from "../pages/Payments/PaymentsList.jsx";
import AddPayment from "../pages/Payments/AddPayment.jsx";
import EditPayment from "../pages/Payments/EditPayment.jsx";
import PaymentReceipt from "../pages/Payments/PaymentReceipt.jsx";

import ExportReports from "../pages/Reports/ExportReport.jsx";
import About from "../pages/About.jsx";

// Layout admin: Navbar di atas + konten halaman
function AppLayout() {
    return (
        <>
            <Navbar />
            <div className="pt-20 px-4 pb-6">
                <Outlet />
            </div>
        </>
    );
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/add-admin" element={<AddAdmin />} />

            {/* Protected admin routes */}
            <Route
                path="/app"
                element={
                    <PrivateRoute>
                        <AppLayout />
                    </PrivateRoute>
                }
            >
                {/* Dashboard */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* Petugas */}
                <Route path="staff" element={<StaffList />} />
                <Route path="staff/add" element={<AddStaff />} />
                <Route path="staff/edit/:id" element={<EditStaff />} />

                {/* Layanan */}
                <Route path="services" element={<ServicesList />} />
                <Route path="services/add" element={<AddService />} />
                <Route path="services/edit/:id" element={<EditService />} />

                {/* Pesanan */}
                <Route path="orders" element={<OrdersList />} />
                <Route path="orders/add" element={<AddOrder />} />
                <Route path="orders/edit/:id" element={<EditOrder />} />

                {/* Pembayaran */}
                <Route path="payments" element={<PaymentsList />} />
                <Route path="payments/add" element={<AddPayment />} />
                <Route path="payments/edit/:id" element={<EditPayment />} />
                <Route
                    path="payments/receipt/:id"
                    element={<PaymentReceipt />}
                />

                {/* Laporan */}
                <Route path="reports" element={<ExportReports />} />

                {/* About this web */}
                <Route path="about" element={<About />} />
            </Route>
        </Routes>
    );
}
