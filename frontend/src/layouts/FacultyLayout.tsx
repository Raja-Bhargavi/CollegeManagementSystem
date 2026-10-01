import { Outlet } from "react-router-dom";
import FacultySidebar from "../components/FacultySidebar";

export default function FacultyLayout() {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
            }}
        >
            <FacultySidebar />

            <main
                style={{
                    flex: 1,
                    padding: "24px",
                    backgroundColor: "#f5f6fa",
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}