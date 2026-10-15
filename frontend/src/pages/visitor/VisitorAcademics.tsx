import { Link } from "react-router-dom";
import "../../styles/visitor-academics.css";

const academicSections = [
    {
        number: "01",
        title: "Departments",
        description:
            "Explore the academic departments of the institution, including their programs, courses, faculty members and department information.",
        path: "/academics/departments",
    },
    {
        number: "02",
        title: "Academic Notices",
        description:
            "View publicly available notices and important academic announcements published by the institution.",
        path: "/notices",
    },
    {
        number: "03",
        title: "Academic Events",
        description:
            "Explore upcoming institutional and academic events available to visitors.",
        path: "/events",
    },
];

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
                        Explore the academic structure of the institution
                        through its departments, academic notices and events.
                    </p>
                </div>
            </section>

            <section className="visitor-academics-main">
                <div className="visitor-academics-container">
                    <div className="visitor-academics-section-heading">
                        <span>OUR ACADEMIC COMMUNITY</span>

                        <h2>Explore Academics</h2>

                        <p>
                            Select a section below to explore the institution's
                            departments and publicly available academic
                            information.
                        </p>
                    </div>

                    <div className="visitor-academics-list">
                        {academicSections.map((section) => (
                            <Link
                                key={section.number}
                                to={section.path}
                                className="visitor-academics-row"
                            >
                                <span className="visitor-academics-number">
                                    {section.number}
                                </span>

                                <div className="visitor-academics-row-content">
                                    <h3>{section.title}</h3>
                                    <p>{section.description}</p>
                                </div>

                                <span
                                    className="visitor-academics-arrow"
                                    aria-hidden="true"
                                >
                                    →
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default VisitorAcademics;