import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";

import CustomersList from "../pages/Customers/CustomersList";
import AddCustomer from "../pages/Customers/AddCustomer";
import EditCustomer from "../pages/Customers/EditCustomer";

import StaffList from "../pages/Staff/StaffList";
import AddStaff from "../pages/Staff/AddStaff";
import EditStaff from "../pages/Staff/EditStaff";

import ServicesList from "../pages/Services/ServicesList";
import AddService from "../pages/Services/AddService";
import EditService from "../pages/Services/EditService";

import OrdersList from "../pages/Orders/OrdersList";
import AddOrder from "../pages/Orders/AddOrder";
import EditOrder from "../pages/Orders/EditOrder";

import PaymentsList from "../pages/Payments/PaymentsList";
import AddPayment from "../pages/Payments/AddPayment";
import EditPayment from "../pages/Payments/EditPayment";

import ExportReports from "../pages/Reports/ExportReport";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Login tidak diproteksi */}
            <Route path="/" element={<Login />} />

            {/* Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />

            {/* Customers */}
            <Route
                path="/customers"
                element={
                    <PrivateRoute>
                        <CustomersList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/customers/add"
                element={
                    <PrivateRoute>
                        <AddCustomer />
                    </PrivateRoute>
                }
            />
            <Route
                path="/customers/edit/:id"
                element={
                    <PrivateRoute>
                        <EditCustomer />
                    </PrivateRoute>
                }
            />

            {/* Staff */}
            <Route
                path="/staff"
                element={
                    <PrivateRoute>
                        <StaffList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/staff/add"
                element={
                    <PrivateRoute>
                        <AddStaff />
                    </PrivateRoute>
                }
            />
            <Route
                path="/staff/edit/:id"
                element={
                    <PrivateRoute>
                        <EditStaff />
                    </PrivateRoute>
                }
            />

            {/* Services */}
            <Route
                path="/services"
                element={
                    <PrivateRoute>
                        <ServicesList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/services/add"
                element={
                    <PrivateRoute>
                        <AddService />
                    </PrivateRoute>
                }
            />
            <Route
                path="/services/edit/:id"
                element={
                    <PrivateRoute>
                        <EditService />
                    </PrivateRoute>
                }
            />

            {/* Orders */}
            <Route
                path="/orders"
                element={
                    <PrivateRoute>
                        <OrdersList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/orders/add"
                element={
                    <PrivateRoute>
                        <AddOrder />
                    </PrivateRoute>
                }
            />
            <Route
                path="/orders/edit/:id"
                element={
                    <PrivateRoute>
                        <EditOrder />
                    </PrivateRoute>
                }
            />

            {/* Payments */}
            <Route
                path="/payments"
                element={
                    <PrivateRoute>
                        <PaymentsList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/payments/add"
                element={
                    <PrivateRoute>
                        <AddPayment />
                    </PrivateRoute>
                }
            />
            <Route
                path="/payments/edit/:id"
                element={
                    <PrivateRoute>
                        <EditPayment />
                    </PrivateRoute>
                }
            />

            {/* Reports */}
            <Route
                path="/reports"
                element={
                    <PrivateRoute>
                        <ExportReports />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}
