import {
    NavLink,
    useNavigate,
} from "react-router-dom";

const menuItems = [
    {
        label: "Dashboard",
        path: "/faculty",
    },
    {
        label: "My Profile",
        path: "/faculty/profile",
    },
    {
        label: "My Courses",
        path: "/faculty/courses",
    },
    {
        label: "Attendance",
        path: "/faculty/attendance",
    },
    {
        label: "Examinations",
        path: "/faculty/examinations",
    },
    {
        label: "Marks",
        path: "/faculty/marks",
    },
    {
        label: "Results",
        path: "/faculty/results",
    },
    {
        label: "Notices",
        path: "/faculty/notices",
    },
];

export default function FacultySidebar() {

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
                width: "240px",
                minHeight: "100vh",
                backgroundColor: "#1f2937",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >

            <h2
                style={{
                    color: "white",
                    marginBottom: "30px",
                }}
            >
                Faculty Portal
            </h2>

            <nav
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/faculty"}
                        style={({ isActive }) => ({
                            padding: "12px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            color: "white",
                            backgroundColor:
                                isActive
                                    ? "#374151"
                                    : "transparent",
                        })}
                    >
                        {item.label}
                    </NavLink>

                ))}

                <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                        marginTop: "25px",
                        width: "100%",
                        padding: "12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: "white",
                        color: "#1f2937",
                        fontSize: "15px",
                        fontWeight: "bold",
                    }}
                >
                    Logout
                </button>

            </nav>

        </aside>
    );
}