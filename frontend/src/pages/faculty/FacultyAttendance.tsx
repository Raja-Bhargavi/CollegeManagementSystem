import { useEffect, useState } from "react";

import {
    getMyFacultyAttendance,
    getMyFacultyRegistrations,
    markFacultyAttendance,
    updateFacultyAttendance
} from "../../api/facultyPortalApi";

import type {
    FacultyAttendance,
    FacultyCourseRegistration
} from "../../api/facultyPortalApi";

export default function FacultyAttendance() {

    const [attendance, setAttendance] =
        useState<FacultyAttendance[]>([]);

    const [registrations, setRegistrations] =
        useState<FacultyCourseRegistration[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingAttendanceId, setEditingAttendanceId] =
        useState<number | null>(null);

    const [registrationId, setRegistrationId] =
        useState("");

    const [attendanceDate, setAttendanceDate] =
        useState("");

    const [status, setStatus] =
        useState("PRESENT");

    const [saving, setSaving] =
        useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                attendanceData,
                registrationData
            ] = await Promise.all([
                getMyFacultyAttendance(),
                getMyFacultyRegistrations()
            ]);

            setAttendance(attendanceData);
            setRegistrations(registrationData);

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
    // OPEN MARK FORM
    // =========================================================

    const handleMarkAttendance = () => {

        setEditingAttendanceId(null);
        setRegistrationId("");
        setAttendanceDate(
            new Date().toISOString().split("T")[0]
        );
        setStatus("PRESENT");

        setError("");
        setSuccess("");

        setShowForm(true);
    };

    // =========================================================
    // OPEN EDIT FORM
    // =========================================================

    const handleEdit = (
        record: FacultyAttendance
    ) => {

        setEditingAttendanceId(
            record.attendanceId
        );

        setRegistrationId(
            String(record.registrationId)
        );

        setAttendanceDate(
            record.attendanceDate
        );

        setStatus(
            record.status
        );

        setError("");
        setSuccess("");

        setShowForm(true);
    };

    // =========================================================
    // CANCEL
    // =========================================================

    const handleCancel = () => {

        setShowForm(false);
        setEditingAttendanceId(null);

        setRegistrationId("");
        setAttendanceDate("");
        setStatus("PRESENT");

        setError("");
    };

    // =========================================================
    // SAVE
    // =========================================================

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!registrationId) {

            setError(
                "Please select a student."
            );

            return;
        }

        if (!attendanceDate) {

            setError(
                "Please select an attendance date."
            );

            return;
        }

        try {

            setSaving(true);

            const request = {
                registrationId:
                    Number(registrationId),

                attendanceDate,

                status
            };

            if (editingAttendanceId !== null) {

                await updateFacultyAttendance(
                    editingAttendanceId,
                    request
                );

                setSuccess(
                    "Attendance updated successfully."
                );

            } else {

                await markFacultyAttendance(
                    request
                );

                setSuccess(
                    "Attendance marked successfully."
                );
            }

            await loadData();

            setShowForm(false);
            setEditingAttendanceId(null);

            setRegistrationId("");
            setAttendanceDate("");
            setStatus("PRESENT");

        } catch (error: any) {

            console.error(
                "Failed to save attendance:",
                error
            );

            const responseData =
                error?.response?.data;

            if (responseData?.fields) {

                const fieldMessages =
                    Object.values(responseData.fields);

                setError(
                    fieldMessages.join(", ")
                );

            } else if (
                typeof responseData?.message === "string"
            ) {

                setError(
                    responseData.message
                );

            } else if (
                typeof responseData?.error === "string"
            ) {

                setError(
                    responseData.error
                );

            } else {

                setError(
                    "Failed to save attendance."
                );
            }

        } finally {

            setSaving(false);
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

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >

                <h1>
                    My Attendance
                </h1>

                <button
                    type="button"
                    onClick={handleMarkAttendance}
                    style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#1f2937",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    + Mark Attendance
                </button>

            </div>

            {/* SUCCESS */}

            {success && (

                <div
                    style={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        padding: "12px 15px",
                        borderRadius: "6px",
                        marginBottom: "15px"
                    }}
                >
                    {success}
                </div>

            )}

            {/* ERROR */}

            {error && (

                <div
                    style={{
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        padding: "12px 15px",
                        borderRadius: "6px",
                        marginBottom: "15px"
                    }}
                >
                    {error}
                </div>

            )}

            {/* =================================================
                FORM
            ================================================= */}

            {showForm && (

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "24px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.08)"
                    }}
                >

                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: "20px"
                        }}
                    >
                        {editingAttendanceId !== null
                            ? "Edit Attendance"
                            : "Mark Attendance"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        {/* STUDENT */}

                        <div
                            style={{
                                marginBottom: "16px"
                            }}
                        >

                            <label
                                style={labelStyle}
                            >
                                Student
                            </label>

                            <select
                                value={registrationId}
                                onChange={(event) =>
                                    setRegistrationId(
                                        event.target.value
                                    )
                                }
                                style={inputStyle}
                            >

                                <option value="">
                                    Select student
                                </option>

                                {registrations.map(
                                    (registration) => (

                                        <option
                                            key={
                                                registration.registrationId
                                            }
                                            value={
                                                registration.registrationId
                                            }
                                        >
                                            {
                                                registration.studentId
                                            }
                                            {" - "}
                                            {
                                                registration.courseCode
                                            }
                                            {" - "}
                                            {
                                                registration.courseName
                                            }
                                            {" - "}
                                            {
                                                registration.sectionName
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        {/* DATE */}

                        <div
                            style={{
                                marginBottom: "16px"
                            }}
                        >

                            <label
                                style={labelStyle}
                            >
                                Attendance Date
                            </label>

                            <input
                                type="date"
                                value={attendanceDate}
                                onChange={(event) =>
                                    setAttendanceDate(
                                        event.target.value
                                    )
                                }
                                style={inputStyle}
                            />

                        </div>

                        {/* STATUS */}

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >

                            <label
                                style={labelStyle}
                            >
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value
                                    )
                                }
                                style={inputStyle}
                            >

                                <option value="PRESENT">
                                    Present
                                </option>

                                <option value="ABSENT">
                                    Absent
                                </option>

                            </select>

                        </div>

                        {/* BUTTONS */}

                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: "10px 18px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor: "#1f2937",
                                    color: "white",
                                    cursor: saving
                                        ? "not-allowed"
                                        : "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingAttendanceId !== null
                                        ? "Update Attendance"
                                        : "Save Attendance"}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    padding: "10px 18px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* =================================================
                NO RECORDS
            ================================================= */}

            {attendance.length === 0 && !showForm && (

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

            {/* =================================================
                ATTENDANCE TABLE
            ================================================= */}

            {attendance.length > 0 && (

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
                            borderCollapse: "collapse"
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
                                    Student
                                </th>

                                <th style={thStyle}>
                                    Roll Number
                                </th>

                                <th style={thStyle}>
                                    Date
                                </th>

                                <th style={thStyle}>
                                    Attendance
                                </th>

                                <th style={thStyle}>
                                    Marked At
                                </th>

                                <th style={thStyle}>
                                    Action
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

                                        <td style={tdStyle}>
                                            {
                                                record.courseCode
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                record.courseName
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                record.sectionName
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                record.studentName
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                record.rollNumber
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {formatDate(
                                                record.attendanceDate
                                            )}
                                        </td>

                                        <td style={tdStyle}>

                                            <span
                                                style={
                                                    getStatusStyle(
                                                        record.status
                                                    )
                                                }
                                            >
                                                {
                                                    record.status
                                                }
                                            </span>

                                        </td>

                                        <td style={tdStyle}>
                                            {formatDateTime(
                                                record.markedAt
                                            )}
                                        </td>

                                        <td style={tdStyle}>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        record
                                                    )
                                                }
                                                style={{
                                                    padding:
                                                        "7px 12px",
                                                    border: "none",
                                                    borderRadius:
                                                        "5px",
                                                    backgroundColor:
                                                        "#1f2937",
                                                    color: "white",
                                                    cursor:
                                                        "pointer",
                                                    fontSize:
                                                        "13px",
                                                    fontWeight:
                                                        "bold"
                                                }}
                                            >
                                                Edit
                                            </button>

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
// FORM STYLES
// =========================================================

const labelStyle: React.CSSProperties = {

    display: "block",

    marginBottom: "7px",

    fontSize: "14px",

    fontWeight: "bold",

    color: "#374151"
};


const inputStyle: React.CSSProperties = {

    width: "100%",

    boxSizing: "border-box",

    padding: "10px 12px",

    border: "1px solid #d1d5db",

    borderRadius: "6px",

    fontSize: "14px",

    backgroundColor: "white"
};


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