import { useNavigate } from "react-router-dom";

const VisitorHome = () => {
  const navigate = useNavigate();

  return (
    <div className="visitor-home">

      {/* HEADER / INTRODUCTION */}
      <section className="visitor-home-intro">
        <div className="visitor-container visitor-home-intro-content">
          <p className="visitor-home-kicker">
            COLLEGE MANAGEMENT SYSTEM
          </p>

          <h1>
            Welcome to Our Institution
          </h1>

          <p className="visitor-home-description">
            Explore the institution, academic departments, programs,
            courses, faculty, admissions, events and important notices
            through the sections below.
          </p>
        </div>
      </section>

      {/* MAIN NAVIGATION */}
      <section className="visitor-home-navigation">
        <div className="visitor-container">

          <div className="visitor-home-section-heading">
            <p>EXPLORE</p>
            <h2>Institution Information</h2>
          </div>

          <div className="visitor-home-button-list">

            <button
              type="button"
              className="visitor-home-button"
              onClick={() => navigate("/about")}
            >
              <span>About</span>
              <span>→</span>
            </button>

            <button
              type="button"
              className="visitor-home-button"
              onClick={() => navigate("/academics")}
            >
              <span>Academics</span>
              <span>→</span>
            </button>

            <button
              type="button"
              className="visitor-home-button"
              onClick={() => navigate("/admissions")}
            >
              <span>Admissions</span>
              <span>→</span>
            </button>

            <button
              type="button"
              className="visitor-home-button"
              onClick={() => navigate("/events")}
            >
              <span>Events</span>
              <span>→</span>
            </button>

            <button
              type="button"
              className="visitor-home-button"
              onClick={() => navigate("/notices")}
            >
              <span>Notices</span>
              <span>→</span>
            </button>

            <button
              type="button"
              className="visitor-home-button"
              onClick={() => navigate("/contact")}
            >
              <span>Contact</span>
              <span>→</span>
            </button>

          </div>

        </div>
      </section>

      {/* ACADEMICS */}
      <section className="visitor-home-academics">
        <div className="visitor-container visitor-home-academics-content">

          <div>
            <p className="visitor-home-kicker">
              ACADEMICS
            </p>

            <h2>
              Explore Our Academic Structure
            </h2>

            <p>
              Explore departments, programs, courses and faculty
              information through the Academics section.
            </p>
          </div>

          <button
            type="button"
            className="visitor-home-primary-button"
            onClick={() => navigate("/academics")}
          >
            Explore Academics
            <span>→</span>
          </button>

        </div>
      </section>

      {/* LOGIN */}
      <section className="visitor-home-login">
        <div className="visitor-container visitor-home-login-content">

          <div>
            <p className="visitor-home-kicker">
              PORTAL ACCESS
            </p>

            <h2>
              Student, Faculty, Staff & Management
            </h2>

            <p>
              Use the institutional login to access your respective
              portal.
            </p>
          </div>

          <button
            type="button"
            className="visitor-home-login-button"
            onClick={() => navigate("/login")}
          >
            Login
            <span>→</span>
          </button>

        </div>
      </section>

    </div>
  );
};

export default VisitorHome;