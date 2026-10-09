import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const departmentIdParam = queryParams.get("departmentId");
    const programParam = queryParams.get("program");

    const departmentId = departmentIdParam
        ? Number(departmentIdParam)
        : null;

    const program = programParam?.toUpperCase() || null;

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadCourses = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get<Course[]>(
                    "http://localhost:8080/api/public/courses",
                    { signal: controller.signal }
                );

                setCourses(response.data);
            } catch (err) {
                if (
                    axios.isCancel(err) ||
                    (axios.isAxiosError(err) &&
                        err.code === "ERR_CANCELED")
                ) {
                    return;
                }

                console.error("Failed to load courses:", err);
                setError("Unable to load course information.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadCourses();

        return () => controller.abort();
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesDepartment =
                departmentId === null ||
                course.departmentId === departmentId;

            const matchesProgram =
                program === null ||
                course.programLevel?.toUpperCase() === program;

            return matchesDepartment && matchesProgram;
        });
    }, [courses, departmentId, program]);

    const pageTitle = program
        ? program === "BTECH"
            ? "B.Tech Courses"
            : program === "MTECH"
                ? "M.Tech Courses"
                : `${program} Courses`
        : "Courses";

    const openCourse = (courseId: number) => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <main className="visitor-courses-page">
            <div className="visitor-courses-container">
                <header className="visitor-courses-header">
                    <p className="visitor-courses-eyebrow">
                        ACADEMICS
                    </p>

                    <h1>{pageTitle}</h1>

                    <p className="visitor-courses-description">
                        Explore the courses and academic programs
                        offered by the institution.
                    </p>
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

                    {!loading &&
                        !error &&
                        filteredCourses.length === 0 && (
                            <p className="visitor-courses-message">
                                {courses.length === 0
                                    ? "No courses were returned by the public API. Please check the backend database connection and course records."
                                    : "No courses are currently associated with this department and program."}
                            </p>
                        )}

                    {!loading &&
                        !error &&
                        filteredCourses.length > 0 && (
                            <div className="visitor-courses-list">
                                {filteredCourses.map((course) => (
                                    <button
                                        key={course.courseId}
                                        type="button"
                                        className="visitor-course-row"
                                        onClick={() =>
                                            openCourse(course.courseId)
                                        }
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
                                    </button>
                                ))}
                            </div>
                        )}
                </section>
            </div>
        </main>
    );
};

export default VisitorCourses;