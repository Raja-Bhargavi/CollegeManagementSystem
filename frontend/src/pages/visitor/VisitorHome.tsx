import { Link } from "react-router-dom";

export default function VisitorHome() {
    return (
        <div className="visitor-home">

            {/* =========================
                HERO
            ========================= */}

            <section className="visitor-hero">

                <div className="visitor-container visitor-hero-inner">

                    <div className="visitor-hero-content">

                        <p className="visitor-eyebrow">
                            COLLEGE MANAGEMENT SYSTEM
                        </p>

                        <h1>
                            Welcome to Our Institution
                        </h1>

                        <p className="visitor-hero-description">
                            Explore the institution, academic departments,
                            programs, courses, faculty, admissions, events
                            and important notices through this institutional
                            information portal.
                        </p>

                        <div className="visitor-hero-actions">

                            <Link
                                to="/academics"
                                className="visitor-primary-button"
                            >
                                Explore Academics
                            </Link>

                            <Link
                                to="/admissions"
                                className="visitor-secondary-button"
                            >
                                Admissions
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            {/* =========================
                ABOUT
            ========================= */}

            <section className="visitor-section">

                <div className="visitor-container">

                    <div className="visitor-section-heading">

                        <span className="visitor-section-label">
                            ABOUT THE INSTITUTION
                        </span>

                        <h2>
                            College Management System
                        </h2>

                    </div>

                    <div className="visitor-section-content">

                        <p>
                            The College Management System provides
                            institutional information through a structured
                            public portal. Visitors can explore academic
                            departments, programs, courses, faculty,
                            admissions, events and important notices.
                        </p>

                        <p>
                            Use the navigation above to move through the
                            different sections of the institution.
                        </p>

                    </div>

                </div>

            </section>

            {/* =========================
                ACADEMICS
            ========================= */}

            <section className="visitor-section visitor-section-light">

                <div className="visitor-container">

                    <div className="visitor-section-heading">

                        <span className="visitor-section-label">
                            ACADEMICS
                        </span>

                        <h2>
                            Explore Our Academic Structure
                        </h2>

                        <p>
                            Explore departments, programs, courses and
                            faculty information through the Academics
                            section.
                        </p>

                    </div>

                    <div className="visitor-feature-row">

                        <div>
                            <h3>
                                Departments
                            </h3>

                            <p>
                                Explore the academic departments and their
                                programs, courses and faculty.
                            </p>
                        </div>

                        <div>
                            <h3>
                                Programs
                            </h3>

                            <p>
                                Explore the academic programs offered
                                through the institution.
                            </p>
                        </div>

                        <div>
                            <h3>
                                Faculty
                            </h3>

                            <p>
                                View publicly available academic faculty
                                information by department.
                            </p>
                        </div>

                    </div>

                    <div className="visitor-section-action">

                        <Link
                            to="/academics"
                            className="visitor-primary-button"
                        >
                            Explore Academics →
                        </Link>

                    </div>

                </div>

            </section>

            {/* =========================
                ADMISSIONS
            ========================= */}

            <section className="visitor-section">

                <div className="visitor-container">

                    <div className="visitor-section-heading">

                        <span className="visitor-section-label">
                            ADMISSIONS
                        </span>

                        <h2>
                            Admissions Information
                        </h2>

                        <p>
                            Find information about admissions and the
                            application process through the Admissions
                            section.
                        </p>

                    </div>

                    <div className="visitor-section-action">

                        <Link
                            to="/admissions"
                            className="visitor-secondary-button"
                        >
                            View Admissions →
                        </Link>

                    </div>

                </div>

            </section>

            {/* =========================
                EVENTS AND NOTICES
            ========================= */}

            <section className="visitor-section visitor-section-light">

                <div className="visitor-container">

                    <div className="visitor-section-heading">

                        <span className="visitor-section-label">
                            INSTITUTIONAL UPDATES
                        </span>

                        <h2>
                            Events and Notices
                        </h2>

                        <p>
                            Stay informed about upcoming institutional
                            events and publicly available notices.
                        </p>

                    </div>

                    <div className="visitor-feature-row">

                        <div className="visitor-feature-link">

                            <h3>
                                Events
                            </h3>

                            <p>
                                Explore upcoming institutional and
                                academic events.
                            </p>

                            <Link to="/events">
                                View Events →
                            </Link>

                        </div>

                        <div className="visitor-feature-link">

                            <h3>
                                Notices
                            </h3>

                            <p>
                                View important publicly available
                                institutional notices.
                            </p>

                            <Link to="/notices">
                                View Notices →
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            {/* =========================
                CONTACT
            ========================= */}

            <section className="visitor-section">

                <div className="visitor-container">

                    <div className="visitor-section-heading">

                        <span className="visitor-section-label">
                            CONTACT
                        </span>

                        <h2>
                            Get in Touch
                        </h2>

                        <p>
                            For institutional contact information,
                            visit the Contact section.
                        </p>

                    </div>

                    <div className="visitor-section-action">

                        <Link
                            to="/contact"
                            className="visitor-primary-button"
                        >
                            Contact Institution →
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}