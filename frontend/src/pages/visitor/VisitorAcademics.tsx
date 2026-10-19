
import { Link } from "react-router-dom";
import "../../styles/visitor-academics.css";

const VisitorAcademics = () => {
    return (
        <main className="visitor-academics-page">
            <section className="visitor-academics-hero">
                <div className="visitor-academics-container">
                    <p className="visitor-academics-eyebrow">
                        ACADEMIC INFORMATION
                    </p>

                    <h1>Academics</h1>

                    <p className="visitor-academics-intro">
                        Explore our academic departments, faculty members,
                        department notices and upcoming events.
                    </p>
                </div>
            </section>

            <section className="visitor-academics-main">
                <div className="visitor-academics-container">
                    <div className="visitor-academics-section-heading">
                        <span>OUR ACADEMIC COMMUNITY</span>

                        <h2>Explore Departments</h2>

                        <p>
                            Select a department to explore its programs,
                            faculty, notices and events.
                        </p>
                    </div>

                    <div className="visitor-academics-list">
                        <Link
                            to="/academics/departments"
                            className="visitor-academics-row"
                        >
                            <span className="visitor-academics-number">
                                01
                            </span>

                            <div className="visitor-academics-row-content">
                                <h3>Departments</h3>
                                <p>
                                    Explore department information, courses,
                                    faculty members, department notices and
                                    department events.
                                </p>
                            </div>

                            <span
                                className="visitor-academics-arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default VisitorAcademics;
