import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
    {
        label: "Dashboard",
        path: "/student",
    },
    {
        label: "My Profile",
        path: "/student/profile",
    },
    {
        label: "My Courses",
        path: "/student/courses",
    },
    {
        label: "My Attendance",
        path: "/student/attendance",
    },
    {
        label: "My Marks",
        path: "/student/marks",
    },
    {
        label: "My Results",
        path: "/student/results",
    },
    {
        label: "My Fees",
        path: "/student/fees",
    },
    {
        label: "My Payments",
        path: "/student/payments",
    },
    {
        label: "My Applications",
        path: "/student/applications",
    },
    {
        label: "Notices",
        path: "/student/notices",
    },
];

export default function StudentSidebar() {
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
                Student Portal
            </div>

            <nav>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/student"}
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