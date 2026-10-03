import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

import "../styles/Management.css";

function ManagementLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");

        navigate("/login");
    };

    const linkClass = ({
        isActive,
    }: {
        isActive: boolean;
    }) =>
        `management-nav-link ${
            isActive
                ? "management-nav-link-active"
                : ""
        }`;

    return (
        <div className="management-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="management-sidebar">

                <h2 className="management-sidebar-title">
                    Management Portal
                </h2>

                <nav className="management-navigation">

                    {/* =========================
                        DASHBOARD
                    ========================= */}

                    <NavLink
                        to="/management"
                        end
                        className={linkClass}
                    >
                        Dashboard
                    </NavLink>

                    {/* =========================
                        MY PROFILE
                    ========================= */}

                    <NavLink
                        to="/management/profile"
                        className={linkClass}
                    >
                        My Profile
                    </NavLink>

                    {/* =========================
                        ACADEMIC
                    ========================= */}

                    <div className="management-section-title">
                        Academic
                    </div>

                    <NavLink
                        to="/management/students"
                        className={linkClass}
                    >
                        Students
                    </NavLink>

                    <NavLink
                        to="/management/faculty"
                        className={linkClass}
                    >
                        Faculty
                    </NavLink>

                    <NavLink
                        to="/management/staff"
                        className={linkClass}
                    >
                        Staff
                    </NavLink>

                    <NavLink
                        to="/management/departments"
                        className={linkClass}
                    >
                        Departments
                    </NavLink>

                    <NavLink
                        to="/management/courses"
                        className={linkClass}
                    >
                        Courses
                    </NavLink>

                    <NavLink
                        to="/management/course-offerings"
                        className={linkClass}
                    >
                        Course Offerings
                    </NavLink>

                    <NavLink
                        to="/management/course-registrations"
                        className={linkClass}
                    >
                        Course Registrations
                    </NavLink>

                    {/* =========================
                        EXAMINATIONS
                    ========================= */}

                    <div className="management-section-title">
                        Examinations
                    </div>

                    <NavLink
                        to="/management/examinations"
                        className={linkClass}
                    >
                        Examinations
                    </NavLink>

                    <NavLink
                        to="/management/attendance"
                        className={linkClass}
                    >
                        Attendance
                    </NavLink>

                    <NavLink
                        to="/management/marks"
                        className={linkClass}
                    >
                        Marks
                    </NavLink>

                    <NavLink
                        to="/management/results"
                        className={linkClass}
                    >
                        Results
                    </NavLink>

                    {/* =========================
                        ADMINISTRATION
                    ========================= */}

                    <div className="management-section-title">
                        Administration
                    </div>

                    <NavLink
                        to="/management/applications"
                        className={linkClass}
                    >
                        Applications
                    </NavLink>

                    <NavLink
                        to="/management/fees"
                        className={linkClass}
                    >
                        Fees
                    </NavLink>

                    <NavLink
                        to="/management/payments"
                        className={linkClass}
                    >
                        Payments
                    </NavLink>

                    <NavLink
                        to="/management/events"
                        className={linkClass}
                    >
                        Events
                    </NavLink>

                    <NavLink
                        to="/management/notices"
                        className={linkClass}
                    >
                        Notices
                    </NavLink>

                </nav>

                {/* =========================
                    LOGOUT
                ========================= */}

                <button
                    type="button"
                    className="management-logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </aside>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="management-main">
                <Outlet />
            </main>

        </div>
    );
}

export default ManagementLayout;