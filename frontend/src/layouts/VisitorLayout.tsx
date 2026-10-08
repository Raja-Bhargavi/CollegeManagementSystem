import { Link, NavLink, Outlet } from "react-router-dom";
import "../styles/Visitor.css";

const navigationItems = [
    {
        label: "Home",
        path: "/",
    },
    {
        label: "About",
        path: "/about",
    },
    {
        label: "Academics",
        path: "/academics",
    },
    {
        label: "Admissions",
        path: "/admissions",
    },
    {
        label: "Events",
        path: "/events",
    },
    {
        label: "Notices",
        path: "/notices",
    },
    {
        label: "Contact",
        path: "/contact",
    },
];

export default function VisitorLayout() {
    return (
        <div className="visitor-site">

            {/* =========================
                HEADER
            ========================= */}

            <header className="visitor-header">

                <div className="visitor-header-inner">

                    {/* INSTITUTION NAME */}

                    <Link
                        to="/"
                        className="visitor-brand"
                    >
                        <span className="visitor-brand-title">
                            College Management System
                        </span>

                        <span className="visitor-brand-subtitle">
                            Institutional Information Portal
                        </span>
                    </Link>

                    {/* MAIN NAVIGATION */}

                    <nav className="visitor-navigation">

                        {navigationItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    `visitor-nav-link ${
                                        isActive
                                            ? "visitor-nav-link-active"
                                            : ""
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <Link
                            to="/login"
                            className="visitor-login-button"
                        >
                            Login
                        </Link>

                    </nav>

                </div>

            </header>

            {/* =========================
                PAGE CONTENT
            ========================= */}

            <main className="visitor-main">
                <Outlet />
            </main>

            {/* =========================
                FOOTER
            ========================= */}

            <footer className="visitor-footer">

                <div className="visitor-container visitor-footer-inner">

                    <div>
                        <h3>
                            College Management System
                        </h3>

                        <p>
                            Institutional Information Portal
                        </p>
                    </div>

                    <div className="visitor-footer-links">

                        <Link to="/about">
                            About
                        </Link>

                        <Link to="/academics">
                            Academics
                        </Link>

                        <Link to="/admissions">
                            Admissions
                        </Link>

                        <Link to="/events">
                            Events
                        </Link>

                        <Link to="/notices">
                            Notices
                        </Link>

                        <Link to="/contact">
                            Contact
                        </Link>

                    </div>

                </div>

                <div className="visitor-footer-bottom">
                    © {new Date().getFullYear()} College Management System
                </div>

            </footer>

        </div>
    );
}