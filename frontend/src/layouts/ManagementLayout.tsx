import { Outlet } from "react-router-dom";
import ManagementSidebar from "../components/ManagementSidebar";

import "../styles/Management.css";

function ManagementLayout() {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f9fafb",
            }}
        >
            <ManagementSidebar />

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

export default ManagementLayout;