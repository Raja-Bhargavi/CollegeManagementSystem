
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
            }}
        >
            <AdminSidebar />

            <main
                style={{
                    flex: 1,
                    padding: "30px",
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}

