import { NavLink } from "react-router-dom";

const VisitorHome = () => {
    return (
        <div className="visitor-page">

            {/* HERO */}

            <section className="visitor-home-hero">

                <div className="visitor-home-hero-overlay">

                    <div className="visitor-home-hero-content">

                        <span>
                            WELCOME TO
                        </span>

                        <h1>
                            College Management System
                        </h1>

                        <p>
                            Explore academic programs, departments,
                            faculty, admissions, events and institutional
                            information through our public portal.
                        </p>

                        <div className="visitor-home-actions">

                            <NavLink
                                to="/departments"
                                className="visitor-primary-button"
                            >
                                Explore Academics
                            </NavLink>

                            <NavLink
                                to="/admissions"
                                className="visitor-outline-button"
                            >
                                Admissions
                            </NavLink>

                        </div>

                    </div>

                </div>

            </section>


            {/* INTRODUCTION */}

            <section className="visitor-home-intro">

                <div className="visitor-home-container">

                    <div className="visitor-home-intro-text">

                        <span>
                            ABOUT THE INSTITUTION
                        </span>

                        <h2>
                            Education, Academics and Institutional
                            Excellence
                        </h2>

                        <p>
                            The College Management System provides a
                            centralized platform for academic and
                            administrative information.
                        </p>

                        <p>
                            Visitors can explore academic departments,
                            programs, courses, faculty information,
                            admission information, notices and college
                            events.
                        </p>

                        <NavLink
                            to="/about"
                            className="visitor-text-link"
                        >
                            Learn more about the college →
                        </NavLink>

                    </div>

                    <div className="visitor-home-intro-panel">

                        <div>
                            <strong>
                                Academics
                            </strong>

                            <span>
                                Departments and Programs
                            </span>
                        </div>

                        <div>
                            <strong>
                                Admissions
                            </strong>

                            <span>
                                Admission information and schedules
                            </span>
                        </div>

                        <div>
                            <strong>
                                Campus
                            </strong>

                            <span>
                                Events and institutional activities
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            {/* ACADEMICS */}

            <section className="visitor-home-academics">

                <div className="visitor-home-container">

                    <div className="visitor-home-section-heading">

                        <span>
                            ACADEMICS
                        </span>

                        <h2>
                            Explore Our Departments
                        </h2>

                        <p>
                            Select a department to explore its programs,
                            courses, faculty and academic information.
                        </p>

                    </div>

                    <div className="visitor-home-academic-links">

                        <NavLink
                            to="/departments"
                            className="visitor-academic-link-card"
                        >
                            <span>
                                Academic Departments
                            </span>

                            <strong>
                                Explore Departments →
                            </strong>
                        </NavLink>

                    </div>

                </div>

            </section>


            {/* ADMISSIONS */}

            <section className="visitor-home-admissions">

                <div className="visitor-home-container">

                    <div>

                        <span>
                            ADMISSIONS
                        </span>

                        <h2>
                            Plan Your Academic Journey
                        </h2>

                        <p>
                            Find general admission information,
                            admission schedules, required documents
                            and fee information.
                        </p>

                    </div>

                    <NavLink
                        to="/admissions"
                        className="visitor-primary-button"
                    >
                        Admission Information
                    </NavLink>

                </div>

            </section>


            {/* EVENTS / NOTICES */}

            <section className="visitor-home-updates">

                <div className="visitor-home-container">

                    <div className="visitor-home-update-card">

                        <span>
                            ANNOUNCEMENTS
                        </span>

                        <h2>
                            Latest Notices
                        </h2>

                        <p>
                            Stay informed about important institutional
                            announcements.
                        </p>

                        <NavLink
                            to="/notices"
                            className="visitor-text-link"
                        >
                            View Notices →
                        </NavLink>

                    </div>


                    <div className="visitor-home-update-card">

                        <span>
                            CAMPUS LIFE
                        </span>

                        <h2>
                            Upcoming Events
                        </h2>

                        <p>
                            Explore upcoming academic and institutional
                            events.
                        </p>

                        <NavLink
                            to="/events"
                            className="visitor-text-link"
                        >
                            View Events →
                        </NavLink>

                    </div>

                </div>

            </section>


            {/* CONTACT */}

            <section className="visitor-home-contact">

                <div className="visitor-home-container">

                    <div>

                        <span>
                            CONNECT WITH US
                        </span>

                        <h2>
                            Need More Information?
                        </h2>

                        <p>
                            Contact the college for admission, academic
                            or general institutional information.
                        </p>

                    </div>

                    <NavLink
                        to="/contact"
                        className="visitor-primary-button"
                    >
                        Contact Us
                    </NavLink>

                </div>

            </section>

        </div>
    );
};

export default VisitorHome;