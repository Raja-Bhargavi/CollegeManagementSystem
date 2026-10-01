import { useEffect, useState } from "react";

import {
    getMyFacultyAttendance
} from "../../api/facultyPortalApi";

import type {
    FacultyAttendance
} from "../../api/facultyPortalApi";

export default function FacultyAttendance() {

    const [attendance, setAttendance] =
        useState<FacultyAttendance[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadAttendance();

    }, []);

    const loadAttendance = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getMyFacultyAttendance();

            setAttendance(data);

        } catch (error: any) {

            console.error(
                "Failed to load faculty attendance:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to load attendance."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <p>
                Loading attendance...
            </p>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div>

            <h1>
                My Attendance
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
                attendance.length === 0 && (

                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            marginTop: "20px"
                        }}
                    >

                        <p>
                            No attendance records
                            found for your courses.
                        </p>

                    </div>

                )}

            {!error &&
                attendance.length > 0 && (

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
                                        Student
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Roll Number
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Date
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Attendance
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Marked At
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {attendance.map(
                                    (record) => (

                                        <tr
                                            key={
                                                record.attendanceId
                                            }
                                        >

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    record.courseCode
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    record.courseName
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    record.sectionName
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    record.studentName
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    record.rollNumber
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {formatDate(
                                                    record.attendanceDate
                                                )}
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                <span
                                                    style={getStatusStyle(
                                                        record.status
                                                    )}
                                                >
                                                    {
                                                        record.status
                                                    }
                                                </span>

                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {formatDateTime(
                                                    record.markedAt
                                                )}
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
// DATE
// =========================================================

function formatDate(
    date: string
): string {

    if (!date) {
        return "N/A";
    }

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

// =========================================================
// DATE + TIME
// =========================================================

function formatDateTime(
    date: string
): string {

    if (!date) {
        return "N/A";
    }

    return new Date(date).toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

// =========================================================
// STATUS STYLE
// =========================================================

function getStatusStyle(
    status: string
): React.CSSProperties {

    const normalized =
        status.toUpperCase();

    if (normalized === "PRESENT") {

        return {
            padding: "5px 10px",
            borderRadius: "12px",
            backgroundColor: "#dcfce7",
            color: "#166534",
            fontSize: "13px",
            fontWeight: "bold"
        };
    }

    if (normalized === "ABSENT") {

        return {
            padding: "5px 10px",
            borderRadius: "12px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            fontSize: "13px",
            fontWeight: "bold"
        };
    }

    return {
        padding: "5px 10px",
        borderRadius: "12px",
        backgroundColor: "#f3f4f6",
        color: "#374151",
        fontSize: "13px",
        fontWeight: "bold"
    };
}

// =========================================================
// TABLE STYLES
// =========================================================

const thStyle: React.CSSProperties = {

    textAlign: "left",

    padding: "12px",

    borderBottom:
        "2px solid #e5e7eb",

    fontSize: "14px",

    fontWeight: "bold",

    whiteSpace: "nowrap"
};

const tdStyle: React.CSSProperties = {

    padding: "12px",

    borderBottom:
        "1px solid #e5e7eb",

    fontSize: "14px"
};