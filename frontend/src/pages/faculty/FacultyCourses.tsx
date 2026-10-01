import { useEffect, useState } from "react";
import { getMyFacultyCourses } from "../../api/facultyPortalApi";
import type {
    FacultyCourse
} from "../../api/facultyPortalApi";

export default function FacultyCourses() {

    const [courses, setCourses] =
        useState<FacultyCourse[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadCourses();

    }, []);

    const loadCourses = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getMyFacultyCourses();

            setCourses(data);

        } catch (error) {

            console.error(
                "Failed to load faculty courses:",
                error
            );

            setError(
                "Failed to load courses."
            );

        } finally {

            setLoading(false);
        }
    };

    if (loading) {

        return (
            <p>
                Loading courses...
            </p>
        );
    }

    if (error) {

        return (
            <div>

                <h2>
                    My Courses
                </h2>

                <p
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </p>

            </div>
        );
    }

    return (

        <div>

            <h1>
                My Courses
            </h1>

            {courses.length === 0 ? (

                <p>
                    No courses have been assigned
                    to you.
                </p>

            ) : (

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

                                <th style={thStyle}>
                                    Course Code
                                </th>

                                <th style={thStyle}>
                                    Course Name
                                </th>

                                <th style={thStyle}>
                                    Section
                                </th>

                                <th style={thStyle}>
                                    Faculty
                                </th>

                                <th style={thStyle}>
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {courses.map(
                                (course) => (

                                    <tr
                                        key={
                                            course.offeringId
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

                                            <span
                                                style={{
                                                    padding:
                                                        "5px 10px",
                                                    borderRadius:
                                                        "12px",
                                                    backgroundColor:
                                                        course.offeringStatus ===
                                                        "ACTIVE"
                                                            ? "#dcfce7"
                                                            : "#f3f4f6",
                                                    color:
                                                        course.offeringStatus ===
                                                        "ACTIVE"
                                                            ? "#166534"
                                                            : "#374151",
                                                    fontSize:
                                                        "13px",
                                                    fontWeight:
                                                        "bold"
                                                }}
                                            >
                                                {
                                                    course.offeringStatus
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