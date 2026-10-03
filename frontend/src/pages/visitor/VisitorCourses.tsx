import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number | null;
    description: string | null;
}

const VisitorCourses = () => {

    const navigate = useNavigate();

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadCourses = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:8080/api/public/courses"
                );

                setCourses(response.data);

            } catch (err) {

                console.error(
                    "Failed to load courses:",
                    err
                );

                setError(
                    "Unable to load course information."
                );

            } finally {

                setLoading(false);

            }

        };

        loadCourses();

    }, []);

    const openCourse = (courseId: number) => {

        navigate(`/courses/${courseId}`);

    };

    return (
        <div className="visitor-page">

            <section className="visitor-page-banner">

                <span>
                    ACADEMICS
                </span>

                <h1>
                    Courses
                </h1>

                <p>
                    Explore the courses and academic programs offered
                    by the institution.
                </p>

            </section>

            <section className="visitor-section">

                {loading && (
                    <div className="visitor-state">
                        Loading courses...
                    </div>
                )}

                {error && (
                    <div className="visitor-error">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    courses.length === 0 && (
                        <div className="visitor-state">
                            No course information is currently
                            available.
                        </div>
                    )}

                {!loading &&
                    !error &&
                    courses.length > 0 && (

                        <div className="visitor-course-grid">

                            {courses.map((course) => (

                                <button
                                    key={course.courseId}
                                    type="button"
                                    className="visitor-course-card"
                                    onClick={() =>
                                        openCourse(
                                            course.courseId
                                        )
                                    }
                                >

                                    <div className="visitor-course-code">
                                        {course.courseCode}
                                    </div>

                                    <h2>
                                        {course.courseName}
                                    </h2>

                                    <div className="visitor-course-credits">
                                        Credits:{" "}
                                        <strong>
                                            {course.credits !== null
                                                ? course.credits
                                                : "N/A"}
                                        </strong>
                                    </div>

                                    <p>
                                        {course.description ||
                                            "Course information is available here."}
                                    </p>

                                    <span className="visitor-course-link">
                                        View Course & Syllabus →
                                    </span>

                                </button>

                            ))}

                        </div>

                    )}

            </section>

        </div>
    );
};

export default VisitorCourses;