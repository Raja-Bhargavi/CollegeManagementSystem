import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

interface Faculty {
    facultyId: number;
    firstName: string;
    lastName: string | null;
    designation: string;
    departmentId: number | null;
    joiningDate: string | null;
    profile: string | null;
    researchAreas: string | null;
    projects: string | null;
    facultyStatus: string | null;
}

interface Department {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
}

const VisitorFacultyDetails = () => {

    const { facultyId } = useParams<{
        facultyId: string;
    }>();

    const [faculty, setFaculty] =
        useState<Faculty | null>(null);

    const [department, setDepartment] =
        useState<Department | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadFaculty = async () => {

            if (!facultyId) {
                setError("Invalid faculty.");
                setLoading(false);
                return;
            }

            try {

                setLoading(true);
                setError("");

                /*
                 * The public faculty endpoint currently returns
                 * the list of active faculty members.
                 *
                 * We find the requested faculty member from
                 * that public list.
                 */
                const facultyResponse =
                    await axios.get<Faculty[]>(
                        "http://localhost:8080/api/public/faculty"
                    );

                const selectedFaculty =
                    facultyResponse.data.find(
                        (member) =>
                            member.facultyId ===
                            Number(facultyId)
                    );

                if (!selectedFaculty) {

                    throw new Error(
                        "Faculty member not found."
                    );
                }

                setFaculty(selectedFaculty);

                /*
                 * Load department information separately
                 * so the public profile can display the
                 * department name rather than only its ID.
                 */
                if (selectedFaculty.departmentId) {

                    const departmentResponse =
                        await axios.get<Department>(
                            `http://localhost:8080/api/public/departments/${selectedFaculty.departmentId}`
                        );

                    setDepartment(
                        departmentResponse.data
                    );
                }

            } catch (err) {

                console.error(
                    "Failed to load faculty profile:",
                    err
                );

                setFaculty(null);
                setDepartment(null);

                setError(
                    "Unable to load faculty information."
                );

            } finally {

                setLoading(false);
            }
        };

        loadFaculty();

    }, [facultyId]);

    // =========================================================
    // YEARS OF EXPERIENCE
    // =========================================================

    const calculateExperience = (
        joiningDate: string | null
    ): string => {

        if (!joiningDate) {
            return "Not available";
        }

        const joining =
            new Date(joiningDate);

        if (Number.isNaN(joining.getTime())) {
            return "Not available";
        }

        const today = new Date();

        let years =
            today.getFullYear() -
            joining.getFullYear();

        const monthDifference =
            today.getMonth() -
            joining.getMonth();

        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() <
                joining.getDate()
            )
        ) {
            years--;
        }

        if (years < 0) {
            years = 0;
        }

        return `${years} ${
            years === 1
                ? "year"
                : "years"
        }`;
    };

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatJoiningDate = (
        joiningDate: string | null
    ): string => {

        if (!joiningDate) {
            return "Not available";
        }

        const date =
            new Date(joiningDate);

        if (Number.isNaN(date.getTime())) {
            return joiningDate;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <main className="visitor-page">

                <section className="visitor-section">

                    <div className="visitor-container">

                        <div className="visitor-state">
                            Loading faculty profile...
                        </div>

                    </div>

                </section>

            </main>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error || !faculty) {

        return (

            <main className="visitor-page">

                <section className="visitor-section">

                    <div className="visitor-container">

                        <div className="visitor-error">

                            {error ||
                                "Faculty information could not be found."}

                        </div>

                        <Link
                            to="/faculty-info"
                            className="visitor-button"
                        >
                            Back to Faculty
                        </Link>

                    </div>

                </section>

            </main>
        );
    }

    // =========================================================
    // FACULTY NAME
    // =========================================================

    const fullName =
        `${faculty.firstName} ${
            faculty.lastName || ""
        }`.trim();

    // =========================================================
    // PAGE
    // =========================================================

    return (

        <main className="visitor-page">

            {/* =================================================
                FACULTY HEADER
            ================================================= */}

            <section className="visitor-department-hero">

                <div>

                    <span>
                        FACULTY PROFILE
                    </span>

                    <h1>
                        {fullName}
                    </h1>

                    <p>
                        {faculty.designation}
                    </p>

                </div>

            </section>

            {/* =================================================
                PROFILE INFORMATION
            ================================================= */}

            <section className="visitor-section">

                <div className="visitor-container">

                    <div className="visitor-home-section-heading">

                        <span>
                            ACADEMIC PROFILE
                        </span>

                        <h2>
                            Faculty Information
                        </h2>

                    </div>

                    <div className="visitor-profile-information">

                        {/* DESIGNATION */}

                        <div className="visitor-profile-row">

                            <span>
                                Designation
                            </span>

                            <strong>
                                {faculty.designation ||
                                    "Not available"}
                            </strong>

                        </div>

                        {/* DEPARTMENT */}

                        <div className="visitor-profile-row">

                            <span>
                                Department
                            </span>

                            <strong>
                                {department
                                    ? department.departmentName
                                    : "Not available"}
                            </strong>

                        </div>

                        {/* JOINING DATE */}

                        <div className="visitor-profile-row">

                            <span>
                                Joining Date
                            </span>

                            <strong>
                                {formatJoiningDate(
                                    faculty.joiningDate
                                )}
                            </strong>

                        </div>

                        {/* EXPERIENCE */}

                        <div className="visitor-profile-row">

                            <span>
                                Years of Experience
                            </span>

                            <strong>
                                {calculateExperience(
                                    faculty.joiningDate
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>

            {/* =================================================
                PROFILE
            ================================================= */}

            {faculty.profile && (

                <section className="visitor-section">

                    <div className="visitor-container">

                        <div className="visitor-home-section-heading">

                            <span>
                                PROFILE
                            </span>

                            <h2>
                                About the Faculty
                            </h2>

                        </div>

                        <div className="visitor-detail-content">

                            <p>
                                {faculty.profile}
                            </p>

                        </div>

                    </div>

                </section>
            )}

            {/* =================================================
                RESEARCH AREAS
            ================================================= */}

            {faculty.researchAreas && (

                <section className="visitor-section">

                    <div className="visitor-container">

                        <div className="visitor-home-section-heading">

                            <span>
                                RESEARCH
                            </span>

                            <h2>
                                Research Areas
                            </h2>

                        </div>

                        <div className="visitor-detail-content">

                            <p>
                                {faculty.researchAreas}
                            </p>

                        </div>

                    </div>

                </section>
            )}

            {/* =================================================
                PROJECTS
            ================================================= */}

            {faculty.projects && (

                <section className="visitor-section">

                    <div className="visitor-container">

                        <div className="visitor-home-section-heading">

                            <span>
                                ACADEMIC WORK
                            </span>

                            <h2>
                                Projects
                            </h2>

                        </div>

                        <div className="visitor-detail-content">

                            <p>
                                {faculty.projects}
                            </p>

                        </div>

                    </div>

                </section>
            )}

            {/* =================================================
                BACK TO DEPARTMENT
            ================================================= */}

            <section className="visitor-section">

                <div className="visitor-container">

                    {department && (

                        <Link
                            to={`/departments/${department.departmentId}`}
                            className="visitor-button"
                        >
                            ← Back to Department
                        </Link>

                    )}

                    <Link
                        to="/faculty-info"
                        className="visitor-button visitor-button-secondary"
                    >
                        View All Faculty
                    </Link>

                </div>

            </section>

        </main>
    );
};

export default VisitorFacultyDetails;