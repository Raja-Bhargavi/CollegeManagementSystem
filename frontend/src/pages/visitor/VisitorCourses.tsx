import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../styles/visitor-courses.css";

interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number | null;
    description: string | null;
    departmentId: number | null;
    programLevel: string | null;
}

const VisitorCourses = () => {
    const { departmentId: departmentIdParam, program: programParam } =
        useParams<{
            departmentId?: string;
            program?: string;
        }>();

    const location = useLocation();

    const departmentId = departmentIdParam
        ? Number(departmentIdParam)
        : null;

    // Support both explicit program routes and the existing URL suffixes.
    const pathname = location.pathname.toLowerCase();

    const programFromPath = pathname.endsWith("/btech-courses")
        ? "BTECH"
        : pathname.endsWith("/mtech-courses")
            ? "MTECH"
            : null;

    const program = (
        programParam || programFromPath || ""
    ).trim().toUpperCase() || null;

    const isDepartmentProgramPage =
        departmentIdParam !== undefined;

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadCourses = async () => {
            try {
                setLoading(true);
                setError("");
                setCourses([]);

                let url = "http://localhost:8080/api/public/courses";

                if (isDepartmentProgramPage) {
                    if (
                        departmentId === null ||
                        !Number.isInteger(departmentId) ||
                        departmentId <= 0 ||
                        !program ||
                        !["BTECH", "MTECH"].includes(program)
                    ) {
                        setError(
                            "Invalid department or academic program. Please return to the department page and select B.Tech or M.Tech again."
                        );
                        return;
                    }

                    url =
                        `http://localhost:8080/api/public/departments/` +
                        `${departmentId}/courses?program=${program}`;
                } else if (program) {
                    setError("Please select a department first.");
                    return;
                }

                const response = await axios.get<Course[]>(url, {
                    signal: controller.signal,
                });

                setCourses(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
            } catch (err) {
                if (
                    axios.isCancel(err) ||
                    (axios.isAxiosError(err) &&
                        err.code === "ERR_CANCELED")
                ) {
                    return;
                }

                console.error("Failed to load courses:", err);

                setError(
                    "Unable to load course information. Please check that the backend is running and try again."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadCourses();

        return () => controller.abort();
    }, [departmentId, isDepartmentProgramPage, program]);

    const pageTitle =
        program === "BTECH"
            ? "B.Tech Courses"
            : program === "MTECH"
                ? "M.Tech Courses"
                : "All Courses";

    const pageDescription =
        program && departmentId !== null
            ? `Explore the ${program === "BTECH" ? "B.Tech" : "M.Tech"} courses offered by Department ${departmentId}.`
            : "Explore the courses and academic programs offered by the institution.";

    const backUrl =
        departmentId !== null
            ? `/academics/departments/${departmentId}`
            : "/academics";

    return (
        <main className="visitor-courses-page">
            <div className="visitor-courses-container">
                <header className="visitor-courses-header">
                    <p className="visitor-courses-eyebrow">
                        ACADEMICS
                    </p>

                    <h1>{pageTitle}</h1>

                    <p className="visitor-courses-description">
                        {pageDescription}
                    </p>

                    <Link
                        to={backUrl}
                        className="visitor-course-back-link"
                    >
                        ← Back to {departmentId !== null
                            ? "Department"
                            : "Academics"}
                    </Link>
                </header>

                <section className="visitor-courses-content">
                    {loading && (
                        <p className="visitor-courses-message">
                            Loading courses...
                        </p>
                    )}

                    {!loading && error && (
                        <p
                            className="visitor-courses-message visitor-courses-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    {!loading && !error && courses.length === 0 && (
                        <p className="visitor-courses-message">
                            No courses are currently assigned to this
                            department and program. Check the course
                            records in the database to confirm that
                            the department and program assignments
                            are correct.
                        </p>
                    )}

                    {!loading && !error && courses.length > 0 && (
                        <div className="visitor-courses-list">
                            {courses.map((course) => (
                                <Link
                                    key={course.courseId}
                                    to={`/academics/courses/${course.courseId}`}
                                    className="visitor-course-row"
                                >
                                    <span className="visitor-course-name">
                                        {course.courseName}
                                    </span>

                                    <span
                                        className="visitor-course-arrow"
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default VisitorCourses;