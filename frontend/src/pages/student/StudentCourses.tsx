import { useEffect, useState } from "react";
import { getMyCourses } from "../../api/studentPortalApi";

interface StudentCourse {

    registrationId: number;

    studentId: number;

    offeringId: number;

    courseCode: string;

    courseName: string;

    sectionName: string;

    facultyName: string;

    registrationDate: string;

    status: string;
}

export default function StudentCourses() {

    const [courses, setCourses] =
        useState<StudentCourse[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadCourses = async () => {

            try {

                const data =
                    await getMyCourses();

                setCourses(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error: any) {

                console.error(
                    "Failed to load courses:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load courses."
                );

            } finally {

                setLoading(false);
            }
        };

        loadCourses();

    }, []);

    // -----------------------------------------
    // LOADING
    // -----------------------------------------

    if (loading) {

        return (
            <p>
                Loading courses...
            </p>
        );
    }

    // -----------------------------------------
    // PAGE
    // -----------------------------------------

    return (

        <div>

            <h1>
                My Courses
            </h1>

            {error && (

                <p
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </p>

            )}

            {!error &&
                courses.length === 0 && (

                    <p>
                        No courses registered.
                    </p>

                )}

            {!error &&
                courses.length > 0 && (

                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "20px",
                            marginTop: "20px",
                            boxShadow:
                                "0 2px 8px rgba(0,0,0,0.08)",
                            overflowX: "auto"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th
                                        style={thStyle}
                                    >
                                        Course Code
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Course Name
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Section
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Faculty
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Registration Date
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {courses.map(
                                    (course) => (

                                        <tr
                                            key={
                                                course.registrationId
                                            }
                                        >

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    course.courseCode
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    course.courseName
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    course.sectionName
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    course.facultyName
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {formatDate(
                                                    course.registrationDate
                                                )}
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                <span
                                                    style={{
                                                        padding:
                                                            "5px 10px",
                                                        borderRadius:
                                                            "12px",
                                                        backgroundColor:
                                                            course.status ===
                                                            "REGISTERED"
                                                                ? "#dcfce7"
                                                                : "#f3f4f6",
                                                        color:
                                                            course.status ===
                                                            "REGISTERED"
                                                                ? "#166534"
                                                                : "#374151",
                                                        fontSize:
                                                            "13px",
                                                        fontWeight:
                                                            "bold"
                                                    }}
                                                >
                                                    {
                                                        course.status
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

        </div>
    );
}

// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(
    dateString: string
): string {

    if (!dateString) {
        return "N/A";
    }

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

// =========================================================
// STYLES
// =========================================================

const thStyle: React.CSSProperties = {

    textAlign: "left",

    padding: "12px",

    borderBottom:
        "2px solid #e5e7eb",

    fontSize: "14px",

    fontWeight: "bold"
};

const tdStyle: React.CSSProperties = {

    padding: "12px",

    borderBottom:
        "1px solid #e5e7eb",

    fontSize: "14px"
};