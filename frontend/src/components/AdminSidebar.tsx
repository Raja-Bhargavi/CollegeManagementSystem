
import { Link, useLocation } from "react-router-dom";

const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Students", path: "/admin/students" },
    { label: "Faculty", path: "/admin/faculty" },
    { label: "Staff", path: "/admin/staff" },
    { label: "Applications", path: "/admin/applications" },
    { label: "Courses", path: "/admin/courses" },
    { label: "Departments", path: "/admin/departments" },
    { label: "Events", path: "/admin/events" },
    { label: "Examinations", path: "/admin/examinations" },
    { label: "Notices", path: "/admin/notices" },
    { label: "Payments", path: "/admin/payments" },
    { label: "Results", path: "/admin/results" },
    { label: "Attendance", path: "/admin/attendance" },
];

export default function AdminSidebar() {
    const location = useLocation();

    return (
        <aside
            style={{
                width: "230px",
                minHeight: "100vh",
                borderRight: "1px solid #ddd",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            <h2>Admin Panel</h2>

            <nav>
                {menuItems.map((item) => {
                    const active = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: "block",
                                padding: "10px",
                                marginBottom: "5px",
                                textDecoration: "none",
                                fontWeight: active ? "bold" : "normal",
                                backgroundColor: active
                                    ? "#e8e8e8"
                                    : "transparent",
                                color: "#222",
                                borderRadius: "5px",
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

