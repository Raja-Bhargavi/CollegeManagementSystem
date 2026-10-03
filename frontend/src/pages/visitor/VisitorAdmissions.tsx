import { Link } from "react-router-dom";

function VisitorAdmissions() {
    return (
        <div className="visitor-page">

            <div className="visitor-page-header">

                <h2>
                    Admissions
                </h2>

                <p>
                    Public admission information for
                    prospective students and applicants.
                </p>

            </div>

            <div className="visitor-admission-card">

                <h3>
                    Admission Information
                </h3>

                <p>
                    Admission information, eligibility
                    requirements, important dates,
                    available programs, and application
                    instructions can be published here
                    during the relevant admission period.
                </p>

            </div>

            <div className="visitor-card-grid">

                <div className="visitor-card">

                    <h3>
                        Programs
                    </h3>

                    <p>
                        Review the courses and academic
                        programs available for admission.
                    </p>

                    <Link
                        to="/courses"
                        className="visitor-card-link"
                    >
                        View Courses
                    </Link>

                </div>

                <div className="visitor-card">

                    <h3>
                        Eligibility
                    </h3>

                    <p>
                        Eligibility requirements for
                        different programs can be
                        published here.
                    </p>

                </div>

                <div className="visitor-card">

                    <h3>
                        Important Dates
                    </h3>

                    <p>
                        Admission opening dates,
                        application deadlines, and
                        other public dates can be
                        displayed here.
                    </p>

                </div>

                <div className="visitor-card">

                    <h3>
                        Fee Information
                    </h3>

                    <p>
                        General admission and program
                        fee information can be displayed
                        publicly during the admission
                        period.
                    </p>

                </div>

                <div className="visitor-card">

                    <h3>
                        Application Process
                    </h3>

                    <p>
                        Prospective students can review
                        the publicly available steps for
                        submitting an admission
                        application.
                    </p>

                </div>

                <div className="visitor-card">

                    <h3>
                        Admission Notices
                    </h3>

                    <p>
                        Check the public notices section
                        for official admission
                        announcements.
                    </p>

                    <Link
                        to="/notices"
                        className="visitor-card-link"
                    >
                        View Notices
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default VisitorAdmissions;