import { Outlet } from "react-router-dom";
import FacultySidebar from "../components/FacultySidebar";

export default function FacultyLayout() {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f9fafb",
            }}
        >
            <FacultySidebar />

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