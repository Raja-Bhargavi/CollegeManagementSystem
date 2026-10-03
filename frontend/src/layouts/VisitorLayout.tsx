import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const VisitorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname === path;
  };

  return (
    <div className="visitor-layout">

      {/* HEADER */}
      <header className="visitor-header">

        <div className="visitor-header-inner">

          <button
            type="button"
            className="visitor-brand"
            onClick={() => navigate("/")}
          >
            <span className="visitor-brand-title">
              College Management System
            </span>

            <span className="visitor-brand-subtitle">
              Institutional Information Portal
            </span>
          </button>

          <nav className="visitor-navigation">

            <button
              type="button"
              className={`visitor-nav-button ${
                isActive("/") ? "active" : ""
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <button
              type="button"
              className={`visitor-nav-button ${
                isActive("/about") ? "active" : ""
              }`}
              onClick={() => navigate("/about")}
            >
              About
            </button>

            <button
              type="button"
              className={`visitor-nav-button ${
                location.pathname.startsWith("/academics") ||
                location.pathname.startsWith("/departments") ||
                location.pathname.startsWith("/courses") ||
                location.pathname.startsWith("/faculty-info")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/academics")}
            >
              Academics
            </button>

            <button
              type="button"
              className={`visitor-nav-button ${
                isActive("/admissions") ? "active" : ""
              }`}
              onClick={() => navigate("/admissions")}
            >
              Admissions
            </button>

            <button
              type="button"
              className={`visitor-nav-button ${
                isActive("/events") ? "active" : ""
              }`}
              onClick={() => navigate("/events")}
            >
              Events
            </button>

            <button
              type="button"
              className={`visitor-nav-button ${
                isActive("/notices") ? "active" : ""
              }`}
              onClick={() => navigate("/notices")}
            >
              Notices
            </button>

            <button
              type="button"
              className={`visitor-nav-button ${
                isActive("/contact") ? "active" : ""
              }`}
              onClick={() => navigate("/contact")}
            >
              Contact
            </button>

            <button
              type="button"
              className="visitor-nav-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

          </nav>

        </div>

      </header>

      {/* PAGE CONTENT */}
      <main className="visitor-main">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="visitor-footer">

        <div className="visitor-footer-inner">

          <div>
            <strong>College Management System</strong>
            <p>
              Institutional Information Portal
            </p>
          </div>

          <div className="visitor-footer-actions">

            <button
              type="button"
              onClick={() => navigate("/academics")}
            >
              Academics
            </button>

            <button
              type="button"
              onClick={() => navigate("/events")}
            >
              Events
            </button>

            <button
              type="button"
              onClick={() => navigate("/notices")}
            >
              Notices
            </button>

            <button
              type="button"
              onClick={() => navigate("/contact")}
            >
              Contact
            </button>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default VisitorLayout;