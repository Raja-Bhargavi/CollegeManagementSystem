import { Outlet } from "react-router-dom";
import StaffSidebar from "../components/StaffSidebar";

export default function StaffLayout() {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f9fafb",
            }}
        >
            <StaffSidebar />

            <main
                style={{
                    marginLeft: "250px",
                    minHeight: "100vh",
                    padding: "30px",
                    boxSizing: "border-box",
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}