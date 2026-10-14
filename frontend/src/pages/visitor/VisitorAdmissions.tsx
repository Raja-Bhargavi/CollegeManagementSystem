
import { Link } from "react-router-dom";
import "../../styles/visitor-admissions.css";

export default function VisitorAdmissions() {
    return (
        <div className="visitor-admissions-page">
            {/* PAGE HEADER */}
            <section className="visitor-admissions-hero">
                <div className="visitor-admissions-container">
                    <p className="visitor-admissions-eyebrow">
                        JOIN OUR INSTITUTION
                    </p>

                    <h1>Admissions</h1>

                    <p className="visitor-admissions-intro">
                        Public admission information for prospective
                        students and applicants.
                    </p>
                </div>
            </section>

            {/* ADMISSION CONTENT */}
            <section className="visitor-admissions-section">
                <div className="visitor-admissions-container">
                    <div className="visitor-admissions-heading">
                        <span>ADMISSION INFORMATION</span>
                        <h2>Begin Your Academic Journey</h2>
                        <p>
                            Find information about academic programs,
                            eligibility, important dates, fees and the
                            admission application process.
                        </p>
                    </div>

                    <div className="visitor-admissions-grid">
                        <article className="visitor-admissions-card">
                            <div className="visitor-admissions-card-number">
                                01
                            </div>
                            <h3>Programs</h3>
                            <p>
                                Explore the courses and academic programs
                                available at the institution.
                            </p>
                            <Link
                                to="/academics/courses"
                                className="visitor-admissions-link"
                            >
                                View Courses <span aria-hidden="true">→</span>
                            </Link>
                        </article>

                        <article className="visitor-admissions-card">
                            <div className="visitor-admissions-card-number">
                                02
                            </div>
                            <h3>Eligibility</h3>
                            <p>
                                Review the eligibility requirements
                                applicable to different academic programs.
                            </p>
                            <span className="visitor-admissions-note">
                                Refer to the official admission notification.
                            </span>
                        </article>

                        <article className="visitor-admissions-card">
                            <div className="visitor-admissions-card-number">
                                03
                            </div>
                            <h3>Important Dates</h3>
                            <p>
                                Check admission opening dates, application
                                deadlines and other important dates.
                            </p>
                            <span className="visitor-admissions-note">
                                Dates will be announced officially.
                            </span>
                        </article>

                        <article className="visitor-admissions-card">
                            <div className="visitor-admissions-card-number">
                                04
                            </div>
                            <h3>Fee Information</h3>
                            <p>
                                Review the applicable admission and program
                                fee information when it is published.
                            </p>
                            <span className="visitor-admissions-note">
                                Confirm fees with the institution.
                            </span>
                        </article>

                        <article className="visitor-admissions-card">
                            <div className="visitor-admissions-card-number">
                                05
                            </div>
                            <h3>Application Process</h3>
                            <p>
                                Learn about the steps required to submit an
                                admission application.
                            </p>
                            <Link
                                to="/login"
                                className="visitor-admissions-link"
                            >
                                Applicant Login <span aria-hidden="true">→</span>
                            </Link>
                        </article>

                        <article className="visitor-admissions-card">
                            <div className="visitor-admissions-card-number">
                                06
                            </div>
                            <h3>Admission Notices</h3>
                            <p>
                                Read official announcements about admission
                                schedules, eligibility and application updates.
                            </p>
                            <Link
                                to="/notices"
                                className="visitor-admissions-link"
                            >
                                View Notices <span aria-hidden="true">→</span>
                            </Link>
                        </article>
                    </div>

                    {/* CONTACT INFORMATION */}
                    <div className="visitor-admissions-contact">
                        <div>
                            <span>NEED MORE INFORMATION?</span>
                            <h2>Have Questions About Admissions?</h2>
                            <p>
                                Contact the institution for verified
                                information about admission requirements
                                and application procedures.
                            </p>
                        </div>

                        <Link
                            to="/contact"
                            className="visitor-admissions-button"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
