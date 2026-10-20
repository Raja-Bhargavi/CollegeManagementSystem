import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
    const navigate = useNavigate();

    const menuItems = [
        {
            label: "Dashboard",
            path: "/admin",
        },
        {
            label: "Students",
            path: "/admin/students",
        },
        {
            label: "Faculty",
            path: "/admin/faculty",
        },
        {
            label: "Staff",
            path: "/admin/staff",
        },
        {
            label: "Applications",
            path: "/admin/applications",
        },
        {
            label: "Admission Reviews",
            path: "/admin/admission-reviews",
        },
        {
            label: "Courses",
            path: "/admin/courses",
        },
        {
            label: "Course Offerings",
            path: "/admin/course-offerings",
        },
        {
            label: "Course Registrations",
            path: "/admin/course-registrations",
        },
        {
            label: "Departments",
            path: "/admin/departments",
        },
        {
            label: "Events",
            path: "/admin/events",
        },
        {
            label: "Examinations",
            path: "/admin/examinations",
        },
        {
            label: "Marks",
            path: "/admin/marks",
        },
        {
            label: "Notices",
            path: "/admin/notices",
        },
        {
            label: "Payments",
            path: "/admin/payments",
        },
        {
            label: "Fees",
            path: "/admin/fees",
        },
        {
            label: "Results",
            path: "/admin/results",
        },
        {
            label: "Attendance",
            path: "/admin/attendance",
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
                Admin Portal
            </div>

            <nav>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"}
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