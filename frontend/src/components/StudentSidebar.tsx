import { Link, useLocation } from "react-router-dom";

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
    const location = useLocation();

    const username =
        localStorage.getItem("username");

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
            <h2>Student Portal</h2>

            <p>
                Welcome, {username || "Student"}
            </p>

            <nav>
                {menuItems.map((item) => {
                    const active =
                        location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: "block",
                                padding: "10px",
                                marginBottom: "5px",
                                textDecoration: "none",
                                fontWeight: active
                                    ? "bold"
                                    : "normal",
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