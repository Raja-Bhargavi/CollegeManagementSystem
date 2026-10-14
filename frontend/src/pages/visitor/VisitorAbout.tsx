
import "../../styles/visitor-about.css";

export default function VisitorAbout() {
    return (
        <div className="visitor-about-page">
            {/* PAGE HERO */}
            <section className="visitor-about-hero">
                <div className="visitor-about-container">
                    <p className="visitor-about-eyebrow">
                        ABOUT US
                    </p>

                    <h1>About Our College</h1>

                    <p className="visitor-about-hero-description">
                        Learn more about the institution, its academic
                        environment and its commitment to education.
                    </p>
                </div>
            </section>

            {/* INSTITUTION INFORMATION */}
            <section className="visitor-about-section">
                <div className="visitor-about-container">
                    <div className="visitor-about-section-heading">
                        <span>OUR INSTITUTION</span>
                        <h2>College Management System</h2>
                    </div>

                    <div className="visitor-about-content">
                        <p>
                            The College Management System provides a
                            centralized digital platform for academic
                            and administrative activities.
                        </p>

                        <p>
                            The public portal provides visitors and
                            prospective students with access to general
                            institutional information, including
                            departments, courses, faculty, events,
                            notices and admission information.
                        </p>

                        <p>
                            Secure academic and administrative information
                            remains available only to authorized users
                            through their respective portals.
                        </p>
                    </div>

                    <div className="visitor-about-focus">
                        <h3>Our Focus</h3>

                        <ul>
                            <li>Academic excellence</li>
                            <li>Accessible educational information</li>
                            <li>Efficient academic administration</li>
                            <li>Student-focused services</li>
                            <li>Transparent institutional communication</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
