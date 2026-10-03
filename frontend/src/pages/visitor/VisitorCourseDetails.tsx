import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number | null;
    description: string | null;
}

const VisitorCourseDetails = () => {

    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadCourse = async () => {

            if (!courseId) {
                setError("Invalid course.");
                setLoading(false);
                return;
            }

            try {

                const response = await axios.get(
                    `http://localhost:8080/api/public/courses/${courseId}`
                );

                setCourse(response.data);

            } catch (err) {

                console.error(
                    "Failed to load course:",
                    err
                );

                setError(
                    "Unable to load course information."
                );

            } finally {

                setLoading(false);

            }

        };

        loadCourse();

    }, [courseId]);

    if (loading) {
        return (
            <div className="visitor-page">

                <section className="visitor-section">

                    <div className="visitor-state">
                        Loading course information...
                    </div>

                </section>

            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="visitor-page">

                <section className="visitor-section">

                    <div className="visitor-error">
                        {error ||
                            "Course information could not be found."}
                    </div>

                    <button
                        type="button"
                        className="visitor-course-back-button"
                        onClick={() => navigate("/courses")}
                    >
                        ← Back to Courses
                    </button>

                </section>

            </div>
        );
    }

    return (
        <div className="visitor-page">

            <section className="visitor-page-banner">

                <span>
                    COURSE INFORMATION
                </span>

                <h1>
                    {course.courseName}
                </h1>

                <p>
                    {course.courseCode}
                </p>

            </section>

            <section className="visitor-section">

                <button
                    type="button"
                    className="visitor-course-back-button"
                    onClick={() => navigate("/courses")}
                >
                    ← Back to Courses
                </button>

                <div className="visitor-course-details-card">

                    <div className="visitor-course-details-header">

                        <div>
                            <span className="visitor-course-code">
                                {course.courseCode}
                            </span>

                            <h2>
                                {course.courseName}
                            </h2>
                        </div>

                        <div className="visitor-course-credit-box">
                            <span>
                                Credits
                            </span>

                            <strong>
                                {course.credits !== null
                                    ? course.credits
                                    : "N/A"}
                            </strong>
                        </div>

                    </div>

                    <div className="visitor-course-description">

                        <h3>
                            Course Description
                        </h3>

                        <p>
                            {course.description ||
                                "Course description is currently unavailable."}
                        </p>

                    </div>

                    <div className="visitor-syllabus-section">

                        <span>
                            SYLLABUS
                        </span>

                        <h2>
                            Course Syllabus
                        </h2>

                        <p>
                            The syllabus for this course will be
                            displayed here once the official syllabus
                            information is added to the college
                            management system.
                        </p>

                        <div className="visitor-syllabus-placeholder">

                            <h3>
                                Official Syllabus
                            </h3>

                            <p>
                                This section is reserved for the
                                semester-wise syllabus, subjects,
                                units, credits and other academic
                                curriculum information.
                            </p>

                            <div className="visitor-syllabus-semesters">

                                <div>
                                    Semester 1
                                </div>

                                <div>
                                    Semester 2
                                </div>

                                <div>
                                    Semester 3
                                </div>

                                <div>
                                    Semester 4
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default VisitorCourseDetails;