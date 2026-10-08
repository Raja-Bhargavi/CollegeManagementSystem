import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
    {
        label: "Dashboard",
        path: "/management",
    },
    {
        label: "My Profile",
        path: "/management/profile",
    },
    {
        label: "Students",
        path: "/management/students",
    },
    {
        label: "Faculty",
        path: "/management/faculty",
    },
    {
        label: "Staff",
        path: "/management/staff",
    },
    {
        label: "Departments",
        path: "/management/departments",
    },
    {
        label: "Courses",
        path: "/management/courses",
    },
    {
        label: "Course Offerings",
        path: "/management/course-offerings",
    },
    {
        label: "Course Registrations",
        path: "/management/course-registrations",
    },
    {
        label: "Examinations",
        path: "/management/examinations",
    },
    {
        label: "Attendance",
        path: "/management/attendance",
    },
    {
        label: "Marks",
        path: "/management/marks",
    },
    {
        label: "Results",
        path: "/management/results",
    },
    {
        label: "Applications",
        path: "/management/applications",
    },
    {
        label: "Fees",
        path: "/management/fees",
    },
    {
        label: "Payments",
        path: "/management/payments",
    },
    {
        label: "Events",
        path: "/management/events",
    },
    {
        label: "Notices",
        path: "/management/notices",
    },
];

export default function ManagementSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        navigate("/login", {
            replace: true,
        });
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
                Management Portal
            </div>

            <nav>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/management"}
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
                type="button"
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