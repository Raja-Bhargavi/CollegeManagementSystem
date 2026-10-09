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

const VisitorDepartmentDetails = () => {

    const { departmentId } = useParams<{
        departmentId: string;
    }>();

    const [department, setDepartment] =
        useState<Department | null>(null);

    const [courses, setCourses] =
        useState<Course[]>([]);

    const [faculty, setFaculty] =
        useState<Faculty[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =========================================================
    // LOAD DEPARTMENT DATA
    // =========================================================

    useEffect(() => {

        const loadDepartment = async () => {

            if (!departmentId) {
                setError("Invalid department.");
                setLoading(false);
                return;
            }

            try {

                setLoading(true);
                setError("");

                const id =
                    Number(departmentId);

                /*
                 * Load department.
                 */
                const departmentResponse =
                    await axios.get<Department>(
                        `http://localhost:8080/api/public/departments/${id}`
                    );

                /*
                 * Load department courses.
                 *
                 * Backend already filters these to BTECH
                 * and MTECH courses.
                 */
                const coursesResponse =
                    await axios.get<Course[]>(
                        `http://localhost:8080/api/public/departments/${id}/courses`
                    );

                /*
                 * Load department faculty.
                 */
                const facultyResponse =
                    await axios.get<Faculty[]>(
                        `http://localhost:8080/api/public/departments/${id}/faculty`
                    );

                setDepartment(
                    departmentResponse.data
                );

                setCourses(
                    coursesResponse.data
                );

                setFaculty(
                    facultyResponse.data
                );

            } catch (err) {

                console.error(
                    "Failed to load department:",
                    err
                );

                setDepartment(null);
                setCourses([]);
                setFaculty([]);

                setError(
                    "Unable to load department information."
                );

            } finally {

                setLoading(false);
            }
        };

        loadDepartment();

    }, [departmentId]);

    // =========================================================
    // GROUP COURSES
    // =========================================================

    const btechCourses = useMemo(
        () =>
            courses.filter(
                (course) =>
                    course.programLevel
                        ?.toUpperCase() === "BTECH"
            ),
        [courses]
    );

    const mtechCourses = useMemo(
        () =>
            courses.filter(
                (course) =>
                    course.programLevel
                        ?.toUpperCase() === "MTECH"
            ),
        [courses]
    );

    /*
     * Show the Courses section ONLY when there is at least
     * one BTECH or MTECH course.
     */
    const hasCourses =
        btechCourses.length > 0 ||
        mtechCourses.length > 0;

    // =========================================================
    // GROUP FACULTY
    // =========================================================

    const professors = useMemo(
        () =>
            faculty.filter((member) =>
                member.designation
                    ?.toLowerCase()
                    .includes("professor")
                &&
                !member.designation
                    ?.toLowerCase()
                    .includes("associate")
                &&
                !member.designation
                    ?.toLowerCase()
                    .includes("assistant")
            ),
        [faculty]
    );

    const associateProfessors = useMemo(
        () =>
            faculty.filter((member) =>
                member.designation
                    ?.toLowerCase()
                    .includes("associate professor")
            ),
        [faculty]
    );

    const assistantProfessors = useMemo(
        () =>
            faculty.filter((member) =>
                member.designation
                    ?.toLowerCase()
                    .includes("assistant professor")
            ),
        [faculty]
    );

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <main className="visitor-department-page">

                <div className="visitor-department-container">

                    <div className="visitor-department-state">
                        Loading department information...
                    </div>

                </div>

            </main>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error || !department) {

        return (

            <main className="visitor-department-page">

                <div className="visitor-department-container">

                    <div className="visitor-department-state visitor-department-error">

                        {error ||
                            "Department information could not be found."}

                    </div>

                    <Link
                        to="/departments"
                        className="visitor-department-back-link"
                    >
                        ← Back to Departments
                    </Link>

                </div>

            </main>
        );
    }

    // =========================================================
    // FACULTY ROW
    // =========================================================

    const renderFacultyRows = (
        members: Faculty[]
    ) => {

        return (

            <div className="visitor-department-list">

                {members.map((member) => {

                    const name =
                        `${member.firstName} ${
                            member.lastName || ""
                        }`.trim();

                    return (

                        <Link
                            key={member.facultyId}
                            to={`/faculty-info/${member.facultyId}`}
                            className="visitor-department-row"
                        >

                            <span>
                                {name}
                            </span>

                            <span
                                aria-hidden="true"
                                className="visitor-department-arrow"
                            >
                                →
                            </span>

                        </Link>
                    );
                })}

            </div>
        );
    };

    // =========================================================
    // COURSE ROW
    // =========================================================

    const renderCourseRows = (
        courseList: Course[]
    ) => {

        return (

            <div className="visitor-department-list">

                {courseList.map((course) => (

                    <Link
                        key={course.courseId}
                        to={`/courses/${course.courseId}`}
                        className="visitor-department-row"
                    >

                        <span>
                            {course.courseName}
                        </span>

                        <span
                            aria-hidden="true"
                            className="visitor-department-arrow"
                        >
                            →
                        </span>

                    </Link>

                ))}

            </div>
        );
    };

    // =========================================================
    // PAGE
    // =========================================================

    return (

        <main className="visitor-department-page">

            <div className="visitor-department-container">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <header className="visitor-department-header">

                    <span className="visitor-department-eyebrow">
                        {department.departmentCode}
                    </span>

                    <h1>
                        {department.departmentName}
                    </h1>

                    <p>
                        Department of{" "}
                        {department.departmentName}
                    </p>

                </header>

                {/* =================================================
                    DEPARTMENT OVERVIEW
                ================================================= */}

                <section className="visitor-department-section">

                    <div className="visitor-department-section-heading">

                        <span>
                            ABOUT THE DEPARTMENT
                        </span>

                        <h2>
                            Department Overview
                        </h2>

                    </div>

                    <div className="visitor-department-overview">

                        <p>
                            The Department of{" "}
                            <strong>
                                {department.departmentName}
                            </strong>{" "}
                            is one of the academic departments
                            of the institution.
                        </p>

                        <p>
                            Explore the academic programs,
                            courses and faculty associated
                            with this department below.
                        </p>

                    </div>

                </section>

                {/* =================================================
                    PROGRAMS
                ================================================= */}

                <section className="visitor-department-section">

                    <div className="visitor-department-section-heading">

                        <span>
                            ACADEMIC PROGRAMS
                        </span>

                        <h2>
                            Programs Offered
                        </h2>

                    </div>

                    <div className="visitor-program-list">

                        <Link
                            to={`/courses?departmentId=${department.departmentId}&program=BTECH`}
                            className="visitor-program-row"
                        >

                            <div>

                                <strong>
                                    B.Tech
                                </strong>

                                <span>
                                    Undergraduate Programme
                                </span>

                            </div>

                            <span>
                                →
                            </span>

                        </Link>

                        <Link
                            to={`/courses?departmentId=${department.departmentId}&program=MTECH`}
                            className="visitor-program-row"
                        >

                            <div>

                                <strong>
                                    M.Tech
                                </strong>

                                <span>
                                    Postgraduate Programme
                                </span>

                            </div>

                            <span>
                                →
                            </span>

                        </Link>

                    </div>

                </section>

                {/* =================================================
                    COURSES
                ================================================= */}

                {hasCourses && (

                    <section className="visitor-department-section">

                        <div className="visitor-department-section-heading">

                            <span>
                                COURSES
                            </span>

                            <h2>
                                Department Courses
                            </h2>

                            <p>
                                Select a course to view its
                                academic information and syllabus.
                            </p>

                        </div>

                        {/* BTECH */}

                        {btechCourses.length > 0 && (

                            <div className="visitor-program-group">

                                <h3>
                                    B.Tech
                                </h3>

                                {renderCourseRows(
                                    btechCourses
                                )}

                            </div>
                        )}

                        {/* MTECH */}

                        {mtechCourses.length > 0 && (

                            <div className="visitor-program-group">

                                <h3>
                                    M.Tech
                                </h3>

                                {renderCourseRows(
                                    mtechCourses
                                )}

                            </div>
                        )}

                    </section>
                )}

                {/* =================================================
                    FACULTY
                ================================================= */}

                {faculty.length > 0 && (

                    <section className="visitor-department-section">

                        <div className="visitor-department-section-heading">

                            <span>
                                FACULTY
                            </span>

                            <h2>
                                Department Faculty
                            </h2>

                            <p>
                                Faculty members grouped
                                according to academic designation.
                            </p>

                        </div>

                        {/* PROFESSORS */}

                        {professors.length > 0 && (

                            <div className="visitor-faculty-group">

                                <h3>
                                    Professors
                                </h3>

                                {renderFacultyRows(
                                    professors
                                )}

                            </div>
                        )}

                        {/* ASSOCIATE PROFESSORS */}

                        {associateProfessors.length > 0 && (

                            <div className="visitor-faculty-group">

                                <h3>
                                    Associate Professors
                                </h3>

                                {renderFacultyRows(
                                    associateProfessors
                                )}

                            </div>
                        )}

                        {/* ASSISTANT PROFESSORS */}

                        {assistantProfessors.length > 0 && (

                            <div className="visitor-faculty-group">

                                <h3>
                                    Assistant Professors
                                </h3>

                                {renderFacultyRows(
                                    assistantProfessors
                                )}

                            </div>
                        )}

                    </section>
                )}

                {/* =================================================
                    BACK
                ================================================= */}

                <div className="visitor-department-footer-link">

                    <Link
                        to="/departments"
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