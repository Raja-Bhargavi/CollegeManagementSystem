import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";

export default function StudentLayout() {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f9fafb",
            }}
        >
            <StudentSidebar />

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