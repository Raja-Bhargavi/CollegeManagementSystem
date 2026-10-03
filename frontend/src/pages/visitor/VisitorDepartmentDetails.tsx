import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";

interface Department {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
    description: string | null;
}

interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number | null;
    description: string | null;
    programLevel?: string | null;
}

interface Faculty {
    facultyId: number;
    firstName: string;
    lastName: string | null;
    designation: string;
    departmentId: number | null;
    joiningDate?: string | null;
}

const VisitorDepartmentDetails = () => {

    const { departmentId } = useParams();

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

    useEffect(() => {

        const loadDepartment = async () => {

            if (!departmentId) {
                setError("Invalid department.");
                setLoading(false);
                return;
            }

            try {

                const [
                    departmentResponse,
                    coursesResponse,
                    facultyResponse
                ] = await Promise.all([
                    axios.get(
                        `http://localhost:8080/api/public/departments/${departmentId}`
                    ),
                    axios.get(
                        `http://localhost:8080/api/public/departments/${departmentId}/courses`
                    ),
                    axios.get(
                        `http://localhost:8080/api/public/departments/${departmentId}/faculty`
                    )
                ]);

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

                setError(
                    "Unable to load department information."
                );

            } finally {

                setLoading(false);

            }

        };

        loadDepartment();

    }, [departmentId]);

    if (loading) {

        return (
            <div className="visitor-page">

                <section className="visitor-section">

                    <div className="visitor-state">
                        Loading department...
                    </div>

                </section>

            </div>
        );
    }

    if (error || !department) {

        return (
            <div className="visitor-page">

                <section className="visitor-section">

                    <div className="visitor-error">
                        {error ||
                            "Department information could not be found."}
                    </div>

                </section>

            </div>
        );
    }

    const groupedFaculty = {
        professors: faculty.filter(
            member =>
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

        associateProfessors: faculty.filter(
            member =>
                member.designation
                    ?.toLowerCase()
                    .includes("associate professor")
        ),

        assistantProfessors: faculty.filter(
            member =>
                member.designation
                    ?.toLowerCase()
                    .includes("assistant professor")
        )
    };

    return (
        <div className="visitor-page">

            <section className="visitor-department-hero">

                <div>

                    <span>
                        {department.departmentCode}
                    </span>

                    <h1>
                        {department.departmentName}
                    </h1>

                    <p>
                        {department.description ||
                            "Explore the department's academic programs, courses and faculty."}
                    </p>

                </div>

            </section>


            {/* DEPARTMENT ABOUT */}

            <section className="visitor-section">

                <div className="visitor-department-about">

                    <div>

                        <span>
                            ABOUT THE DEPARTMENT
                        </span>

                        <h2>
                            Department Overview
                        </h2>

                    </div>

                    <p>
                        {department.description ||
                            "Department information will be displayed here."}
                    </p>

                </div>

            </section>


            {/* PROGRAMS */}

            <section className="visitor-department-program-section">

                <div className="visitor-section">

                    <div className="visitor-home-section-heading">

                        <span>
                            ACADEMIC PROGRAMS
                        </span>

                        <h2>
                            Programs Offered
                        </h2>

                    </div>

                    <div className="visitor-program-links">

                        <NavLink
                            to={`/departments/${departmentId}/courses?program=BTECH`}
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
                                View Courses →
                            </span>
                        </NavLink>

                        <NavLink
                            to={`/departments/${departmentId}/courses?program=MTECH`}
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
                                View Courses →
                            </span>
                        </NavLink>

                    </div>

                </div>

            </section>


            {/* COURSES */}

            <section className="visitor-section">

                <div className="visitor-home-section-heading">

                    <span>
                        COURSES
                    </span>

                    <h2>
                        Department Courses
                    </h2>

                    <p>
                        Select a course to view its academic
                        information and syllabus.
                    </p>

                </div>

                <div className="visitor-department-course-list">

                    {courses.length === 0 && (
                        <div className="visitor-state">
                            No courses have been associated with this
                            department yet.
                        </div>
                    )}

                    {courses.map((course) => (

                        <NavLink
                            key={course.courseId}
                            to={`/courses/${course.courseId}`}
                            className="visitor-course-line"
                        >

                            <div>

                                <strong>
                                    {course.courseName}
                                </strong>

                                <span>
                                    {course.programLevel ||
                                        "Academic Course"}
                                </span>

                            </div>

                            <span>
                                View →
                            </span>

                        </NavLink>

                    ))}

                </div>

            </section>


            {/* FACULTY */}

            <section className="visitor-department-faculty-section">

                <div className="visitor-section">

                    <div className="visitor-home-section-heading">

                        <span>
                            FACULTY
                        </span>

                        <h2>
                            Department Faculty
                        </h2>

                        <p>
                            Faculty members grouped according to
                            academic designation.
                        </p>

                    </div>


                    {[
                        {
                            title: "Professors",
                            members:
                                groupedFaculty.professors
                        },
                        {
                            title: "Associate Professors",
                            members:
                                groupedFaculty.associateProfessors
                        },
                        {
                            title: "Assistant Professors",
                            members:
                                groupedFaculty.assistantProfessors
                        }
                    ].map((group) => (

                        group.members.length > 0 && (

                            <div
                                key={group.title}
                                className="visitor-faculty-group"
                            >

                                <h3>
                                    {group.title}
                                </h3>

                                <div className="visitor-faculty-line-list">

                                    {group.members.map(
                                        member => (

                                            <NavLink
                                                key={
                                                    member.facultyId
                                                }
                                                to={`/faculty-info/${member.facultyId}`}
                                                className="visitor-faculty-line"
                                            >

                                                <div>

                                                    <strong>
                                                        {
                                                            member.firstName
                                                        }{" "}
                                                        {
                                                            member.lastName ||
                                                            ""
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            member.designation
                                                        }
                                                    </span>

                                                </div>

                                                <span>
                                                    View Profile →
                                                </span>

                                            </NavLink>

                                        )
                                    )}

                                </div>

                            </div>

                        )

                    ))}

                </div>

            </section>

        </div>
    );
};

export default VisitorDepartmentDetails;