import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/visitor.css";

const VisitorLayout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname === path;
  };

  return (
    <div className="visitor-site">

      {/* HEADER */}
      <header className="visitor-header">

        <div className="visitor-header-inner">

          <Link to="/" className="visitor-brand">
            <div className="visitor-brand-mark">
              CMS
            </div>

            <div className="visitor-brand-text">
              <h1>College Management System</h1>
              <p>Academic & Institutional Portal</p>
            </div>
          </Link>

          {/* MAIN NAVIGATION */}
          <nav className="visitor-nav">

            <Link
              to="/"
              className={isActive("/") ? "visitor-nav-link active" : "visitor-nav-link"}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={
                isActive("/about")
                  ? "visitor-nav-link active"
                  : "visitor-nav-link"
              }
            >
              About
            </Link>

            {/* ACADEMICS IS ONE MAIN BUTTON */}
            <Link
              to="/academics"
              className={
                location.pathname.startsWith("/academics") ||
                location.pathname.startsWith("/departments") ||
                location.pathname.startsWith("/courses") ||
                location.pathname.startsWith("/faculty-info")
                  ? "visitor-nav-link active"
                  : "visitor-nav-link"
              }
            >
              Academics
            </Link>

            <Link
              to="/admissions"
              className={
                isActive("/admissions")
                  ? "visitor-nav-link active"
                  : "visitor-nav-link"
              }
            >
              Admissions
            </Link>

            <Link
              to="/events"
              className={
                isActive("/events")
                  ? "visitor-nav-link active"
                  : "visitor-nav-link"
              }
            >
              Events
            </Link>

            <Link
              to="/notices"
              className={
                isActive("/notices")
                  ? "visitor-nav-link active"
                  : "visitor-nav-link"
              }
            >
              Notices
            </Link>

            <Link
              to="/contact"
              className={
                isActive("/contact")
                  ? "visitor-nav-link active"
                  : "visitor-nav-link"
              }
            >
              Contact
            </Link>

            <Link to="/login" className="visitor-login-button">
              Login
            </Link>

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

          <div className="visitor-footer-column">
            <h3>College Management System</h3>
            <p>
              Academic and institutional information portal for students,
              faculty, staff, management and visitors.
            </p>
          </div>

          <div className="visitor-footer-column">
            <h3>Explore</h3>

            <Link to="/about">About</Link>
            <Link to="/academics">Academics</Link>
            <Link to="/admissions">Admissions</Link>
            <Link to="/events">Events</Link>
            <Link to="/notices">Notices</Link>
          </div>

          <div className="visitor-footer-column">
            <h3>Academic Sections</h3>

            <Link to="/departments">Departments</Link>
            <Link to="/faculty-info">Faculty</Link>
          </div>

          <div className="visitor-footer-column">
            <h3>Portal</h3>

            <Link to="/login">Login</Link>
            <Link to="/contact">Contact</Link>
          </div>

        </div>

        <div className="visitor-footer-bottom">
          © {new Date().getFullYear()} College Management System
        </div>

      </footer>

    </div>
  );
};

export default VisitorLayout;