import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/visitor-department-details.css";

interface Department {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
}

interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number | null;
    description: string | null;
    departmentId: number | null;
    programLevel: string | null;
}

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

const API_BASE_URL = "http://localhost:8080/api/public";

const VisitorDepartmentDetails = () => {
    const { departmentId: departmentIdParam } = useParams<{
        departmentId: string;
    }>();

    const departmentId = Number(departmentIdParam);

    const [department, setDepartment] = useState<Department | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadDepartment = async () => {
            if (
                !departmentIdParam ||
                !Number.isInteger(departmentId) ||
                departmentId <= 0
            ) {
                setError("Invalid department ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const options = { signal: controller.signal };

                const [
                    departmentResponse,
                    coursesResponse,
                    facultyResponse,
                ] = await Promise.all([
                    axios.get<Department>(
                        `${API_BASE_URL}/departments/${departmentId}`,
                        options
                    ),
                    axios.get<Course[]>(
                        `${API_BASE_URL}/departments/${departmentId}/courses`,
                        options
                    ),
                    axios.get<Faculty[]>(
                        `${API_BASE_URL}/departments/${departmentId}/faculty`,
                        options
                    ),
                ]);

                setDepartment(departmentResponse.data);
                setCourses(coursesResponse.data);
                setFaculty(facultyResponse.data);
            } catch (err) {
                if (
                    axios.isCancel(err) ||
                    (axios.isAxiosError(err) &&
                        err.code === "ERR_CANCELED")
                ) {
                    return;
                }

                console.error(
                    "Failed to load department information:",
                    err
                );

                setDepartment(null);
                setCourses([]);
                setFaculty([]);
                setError(
                    "Unable to load department information. Please try again later."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadDepartment();

        return () => controller.abort();
    }, [departmentId, departmentIdParam]);

    const hasRecognizedPrograms = useMemo(
        () =>
            courses.some((course) => {
                const level = course.programLevel?.trim().toUpperCase();
                return level === "BTECH" || level === "MTECH";
            }),
        [courses]
    );

    if (loading) {
        return (
            <main className="visitor-department-page">
                <div className="visitor-department-container">
                    <p className="visitor-department-state" role="status">
                        Loading department information...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !department) {
        return (
            <main className="visitor-department-page">
                <div className="visitor-department-container">
                    <div
                        className="visitor-department-state visitor-department-error"
                        role="alert"
                    >
                        {error || "Department information could not be found."}
                    </div>

                    <Link
                        to="/academics/departments"
                        className="visitor-department-back-link"
                    >
                        ← Back to Departments
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="visitor-department-page">
            <div className="visitor-department-container">
                <header className="visitor-department-header">
                    <span className="visitor-department-eyebrow">
                        {department.departmentCode}
                    </span>

                    <h1>{department.departmentName}</h1>

                    <p>Department of {department.departmentName}</p>
                </header>

                <section className="visitor-department-section">
                    <div className="visitor-department-section-heading">
                        <span>ABOUT THE DEPARTMENT</span>
                        <h2>Department Overview</h2>
                    </div>

                    <div className="visitor-department-overview">
                        <p>
                            The Department of{" "}
                            <strong>{department.departmentName}</strong> is
                            one of the academic departments of the institution.
                        </p>

                        <p>
                            Explore the academic programs and faculty
                            associated with this department.
                        </p>
                    </div>
                </section>

                {/* Programs remain unchanged */}
                <section className="visitor-department-section">
                    <div className="visitor-department-section-heading">
                        <span>ACADEMIC PROGRAMS</span>
                        <h2>Programs Offered</h2>
                        <p>Select a program to view its courses.</p>
                    </div>

                    <div className="visitor-program-list">
                        <Link
                            to={`/academics/departments/${department.departmentId}/btech-courses`}
                            className="visitor-program-row"
                        >
                            <div>
                                <strong>B.Tech</strong>
                                <span>Undergraduate Programme</span>
                            </div>
                            <span aria-hidden="true">→</span>
                        </Link>

                        <Link
                            to={`/academics/departments/${department.departmentId}/mtech-courses`}
                            className="visitor-program-row"
                        >
                            <div>
                                <strong>M.Tech</strong>
                                <span>Postgraduate Programme</span>
                            </div>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {courses.length > 0 && !hasRecognizedPrograms && (
                        <p className="visitor-department-note">
                            No courses have a recognized B.Tech or M.Tech
                            program assignment. Please check the course
                            assignments in the database.
                        </p>
                    )}
                </section>

                {/* Faculty now has one row, matching the program rows */}
                <section
                    id="faculty"
                    className="visitor-department-section"
                >
                    <div className="visitor-department-section-heading">
                        <span>FACULTY</span>
                        <h2>Faculty</h2>
                        <p>
                            View the faculty members belonging to this
                            department and explore their individual profiles.
                        </p>
                    </div>

                    <div className="visitor-program-list">
                        <Link
                            to={`/academics/departments/${department.departmentId}/faculty`}
                            className="visitor-program-row"
                        >
                            <div>
                                <strong>View Faculty</strong>
                                <span>
                                    Professors, Associate Professors and
                                    Assistant Professors
                                </span>
                            </div>

                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {faculty.length === 0 && (
                        <p className="visitor-department-note">
                            There are currently no active faculty members
                            listed for this department.
                        </p>
                    )}
                </section>

                <div className="visitor-department-footer-link">
                    <Link
                        to="/academics/departments"
                        className="visitor-department-back-link"
                    >
                        ← Back to Departments
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default VisitorDepartmentDetails;
