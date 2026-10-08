import { NavLink, useNavigate } from "react-router-dom";

export default function StaffSidebar() {
    const navigate = useNavigate();

    const menuItems = [
        {
            label: "Dashboard",
            path: "/staff",
        },
        {
            label: "My Profile",
            path: "/staff/profile",
        },
        {
            label: "Students",
            path: "/staff/students",
        },
        {
            label: "Faculty",
            path: "/staff/faculty",
        },
        {
            label: "Applications",
            path: "/staff/applications",
        },
        {
            label: "Departments",
            path: "/staff/departments",
        },
        {
            label: "Courses",
            path: "/staff/courses",
        },
        {
            label: "Course Offerings",
            path: "/staff/course-offerings",
        },
        {
            label: "Course Registrations",
            path: "/staff/course-registrations",
        },
        {
            label: "Examinations",
            path: "/staff/examinations",
        },
        {
            label: "Attendance",
            path: "/staff/attendance",
        },
        {
            label: "Marks",
            path: "/staff/marks",
        },
        {
            label: "Results",
            path: "/staff/results",
        },
        {
            label: "Fees",
            path: "/staff/fees",
        },
        {
            label: "Payments",
            path: "/staff/payments",
        },
        {
            label: "Events",
            path: "/staff/events",
        },
        {
            label: "Notices",
            path: "/staff/notices",
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <aside
            style={{
                width: "250px",
                minHeight: "100vh",
                backgroundColor: "#111827",
                color: "white",
                padding: "20px 12px",
                boxSizing: "border-box",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                overflowY: "auto",
            }}
        >
            <div
                style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    marginBottom: "6px",
                    padding: "0 10px",
                }}
            >
                College Management
            </div>

            <div
                style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                    marginBottom: "25px",
                    padding: "0 10px",
                }}
            >
                Staff Portal
            </div>

            <nav>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/staff"}
                        style={({ isActive }) => ({
                            display: "block",
                            padding: "11px 12px",
                            marginBottom: "4px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            color: isActive
                                ? "#ffffff"
                                : "#d1d5db",
                            backgroundColor: isActive
                                ? "#374151"
                                : "transparent",
                            fontWeight: isActive
                                ? "600"
                                : "400",
                        })}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                style={{
                    width: "100%",
                    marginTop: "25px",
                    padding: "11px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#f3f4f6",
                    color: "#111827",
                    cursor: "pointer",
                    fontWeight: "600",
                }}
            >
                Logout
            </button>
        </aside>
    );
}