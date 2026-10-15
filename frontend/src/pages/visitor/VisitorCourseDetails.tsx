
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "../../styles/visitor-course-details.css";

interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number | null;
    description: string | null;
    departmentId: number | null;
    programLevel: string | null;
    syllabusUrl?: string | null;
}

const API_BASE_URL = "http://localhost:8080";

export default function VisitorCourseDetails() {
    const { courseId } = useParams();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadCourse() {
            if (!courseId || !/^\d+$/.test(courseId)) {
                setError("The requested course ID is invalid.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get<Course>(
                    `${API_BASE_URL}/api/public/courses/${courseId}`,
                    { signal: controller.signal }
                );

                setCourse(response.data);
            } catch (err) {
                if (axios.isCancel(err)) return;

                console.error("Failed to load course:", err);
                setError(
                    "Unable to load course information. Please try again later."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadCourse();

        return () => controller.abort();
    }, [courseId]);

    if (loading) {
        return (
            <main className="course-details-page">
                <div className="course-details-container">
                    <p className="course-details-state">
                        Loading course information...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !course) {
        return (
            <main className="course-details-page">
                <div className="course-details-container">
                    <p className="course-details-breadcrumb">
                        <Link to="/academics">Academics</Link>
                        {" / "}
                        <Link to="/academics/courses">Courses</Link>
                    </p>

                    <section className="course-details-message">
                        <h1>Course Information</h1>
                        <p role="alert">
                            {error || "Course information was not found."}
                        </p>
                        <Link
                            className="course-details-button"
                            to="/academics/courses"
                        >
                            Back to Courses
                        </Link>
                    </section>
                </div>
            </main>
        );
    }

    const programName =
        course.programLevel?.toUpperCase() === "BTECH"
            ? "B.Tech"
            : course.programLevel?.toUpperCase() === "MTECH"
                ? "M.Tech"
                : "Not specified";

    const syllabusUrl = course.syllabusUrl
        ? course.syllabusUrl.startsWith("http")
            ? course.syllabusUrl
            : `${API_BASE_URL}${course.syllabusUrl.startsWith("/") ? "" : "/"}${course.syllabusUrl}`
        : null;

    return (
        <main className="course-details-page">
            <div className="course-details-container">
                <nav className="course-details-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/academics">Academics</Link>
                    <span>/</span>
                    <Link to="/academics/courses">Courses</Link>
                    <span>/</span>
                    <span>{course.courseCode}</span>
                </nav>

                <header className="course-details-hero">
                    <p className="course-details-eyebrow">
                        COURSE INFORMATION
                    </p>

                    <h1>{course.courseName}</h1>

                    <p className="course-details-subtitle">
                        Course code: {course.courseCode}
                    </p>
                </header>

                <section className="course-details-section">
                    <div className="course-details-heading">
                        <p className="course-details-eyebrow">
                            COURSE OVERVIEW
                        </p>
                        <h2>Course Details</h2>
                    </div>

                    <div className="course-details-card">
                        <dl className="course-details-grid">
                            <div>
                                <dt>Course Name</dt>
                                <dd>{course.courseName}</dd>
                            </div>

                            <div>
                                <dt>Course Code</dt>
                                <dd>{course.courseCode}</dd>
                            </div>

                            <div>
                                <dt>Program</dt>
                                <dd>{programName}</dd>
                            </div>

                            <div>
                                <dt>Credits</dt>
                                <dd>
                                    {course.credits ?? "Not specified"}
                                </dd>
                            </div>

                            <div>
                                <dt>Department ID</dt>
                                <dd>
                                    {course.departmentId ?? "Not assigned"}
                                </dd>
                            </div>
                        </dl>

                        <div className="course-details-description">
                            <h3>Course Description</h3>
                            <p>
                                {course.description?.trim() ||
                                    "The course description has not yet been provided."}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="course-details-section">
                    <div className="course-details-heading">
                        <p className="course-details-eyebrow">
                            ACADEMIC DOCUMENTS
                        </p>
                        <h2>Course Syllabus</h2>
                        <p>
                            Access the official syllabus for this course
                            in PDF format.
                        </p>
                    </div>

                    <div className="course-syllabus-card">
                        <div className="course-syllabus-information">
                            <h3>{course.courseName} — Syllabus</h3>
                            <p>
                                Program: {programName}
                            </p>
                            <p>
                                Course code: {course.courseCode}
                            </p>
                        </div>

                        {syllabusUrl ? (
                            <a
                                className="course-details-button"
                                href={syllabusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View / Download Syllabus PDF
                            </a>
                        ) : (
                            <p className="course-syllabus-unavailable">
                                The official syllabus PDF is not available
                                for this course yet.
                            </p>
                        )}
                    </div>
                </section>

                <div className="course-details-footer-action">
                    <Link
                        to="/academics/courses"
                        className="course-details-button course-details-button-secondary"
                    >
                        ← Back to Courses
                    </Link>
                </div>
            </div>
        </main>
    );
}
