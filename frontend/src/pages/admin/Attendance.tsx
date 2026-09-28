import { useEffect, useState } from "react";

import {
    createAttendance,
    deleteAttendance,
    getAttendance,
    updateAttendance,
} from "../../api/attendanceApi";


import type{
    Attendance,
    AttendanceRequest,
} from "../../api/attendanceApi";


import {
    getStudents,
} from "../../api/studentApi";

import type{
    Student,
} from "../../api/studentApi";

import {
    getCourseRegistrations,

} from "../../api/courseRegistrationApi";

import type{
    CourseRegistration,
} from "../../api/courseRegistrationApi";

import {
    getCourseOfferings,
} from "../../api/courseOfferingApi";

import type{
    CourseOffering,
} from "../../api/courseOfferingApi";

import {
    getCourses,
} from "../../api/courseApi";

import type{
    Course,
} from "../../api/courseApi";

interface RegistrationDisplay {
    registration: CourseRegistration;
    student?: Student;
    offering?: CourseOffering;
    course?: Course;
}

const initialForm: AttendanceRequest = {
    registrationId: 0,
    attendanceDate: "",
    status: "PRESENT",
    markedBy: 0,
};

export default function AttendancePage() {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [registrations, setRegistrations] = useState<RegistrationDisplay[]>([]);
    const [form, setForm] = useState<AttendanceRequest>(initialForm);

    const [editingId, setEditingId] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                attendanceData,
                registrationData,
                studentData,
                offeringData,
                courseData,
            ] = await Promise.all([
                getAttendance(),
                getCourseRegistrations(),
                getStudents(),
                getCourseOfferings(),
                getCourses(),
            ]);

            setAttendance(attendanceData);

            const displayData: RegistrationDisplay[] =
                registrationData.map((registration) => {
                    const student = studentData.find(
                        (item) =>
                            item.studentId === registration.studentId
                    );

                    const offering = offeringData.find(
                        (item) =>
                            item.offeringId === registration.offeringId
                    );

                    const course = offering
                        ? courseData.find(
                              (item) =>
                                  item.courseId === offering.courseId
                          )
                        : undefined;

                    return {
                        registration,
                        student,
                        offering,
                        course,
                    };
                });

            setRegistrations(displayData);

            const firstActiveRegistration =
                displayData.find(
                    (item) =>
                        item.student?.studentStatus === "ACTIVE" &&
                        item.offering?.offeringStatus === "ACTIVE"
                );

            if (form.registrationId === 0 && firstActiveRegistration) {
                setForm((previous) => ({
                    ...previous,
                    registrationId:
                        firstActiveRegistration.registration.registrationId,
                }));
            }
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to load attendance data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                name === "registrationId" || name === "markedBy"
                    ? Number(value)
                    : value,
        }));
    };

    const resetForm = () => {
        const firstActiveRegistration =
            registrations.find(
                (item) =>
                    item.student?.studentStatus === "ACTIVE" &&
                    item.offering?.offeringStatus === "ACTIVE"
            );

        setForm({
            registrationId:
                firstActiveRegistration?.registration.registrationId ?? 0,
            attendanceDate: "",
            status: "PRESENT",
            markedBy: 0,
        });

        setEditingId(null);
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            if (!form.registrationId) {
                setError("Please select a course registration");
                return;
            }

            if (!form.attendanceDate) {
                setError("Please select an attendance date");
                return;
            }

            if (!form.markedBy) {
                setError("Please enter the marked by user ID");
                return;
            }

            if (editingId !== null) {
                await updateAttendance(
                    editingId,
                    form
                );
            } else {
                await createAttendance(form);
            }

            resetForm();
            await loadData();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to save attendance"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item: Attendance) => {
        setEditingId(item.attendanceId);

        setForm({
            registrationId: item.registrationId,
            attendanceDate: item.attendanceDate,
            status: item.status,
            markedBy: item.markedBy,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (
        attendanceId: number
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this attendance record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteAttendance(attendanceId);

            if (editingId === attendanceId) {
                resetForm();
            }

            await loadData();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to delete attendance"
            );
        }
    };

    const getRegistrationLabel = (
        registrationId: number
    ) => {
        const item = registrations.find(
            (registration) =>
                registration.registration.registrationId ===
                registrationId
        );

        if (!item) {
            return `Registration #${registrationId}`;
        }

        const studentName = [
            item.student?.firstName,
            item.student?.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        const courseName =
            item.course?.courseName ||
            `Course #${item.offering?.courseId ?? "-"}`;

        return `#${registrationId} - ${studentName || "Student"} - ${courseName}`;
    };

    if (loading) {
        return <h1>Loading Attendance...</h1>;
    }

    return (
        <div>
            <h1>Attendance Management</h1>

            {error && (
                <div
                    style={{
                        backgroundColor: "#ffe5e5",
                        color: "#b00020",
                        padding: "10px",
                        marginBottom: "20px",
                        borderRadius: "5px",
                    }}
                >
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    marginBottom: "30px",
                    borderRadius: "8px",
                }}
            >
                <h2>
                    {editingId !== null
                        ? "Edit Attendance"
                        : "Mark Attendance"}
                </h2>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        Course Registration
                    </label>

                    <select
                        name="registrationId"
                        value={form.registrationId}
                        onChange={handleChange}
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        <option value={0}>
                            Select registration
                        </option>

                        {registrations
                            .filter(
                                (item) =>
                                    item.student?.studentStatus ===
                                        "ACTIVE" &&
                                    item.offering?.offeringStatus ===
                                        "ACTIVE"
                            )
                            .map((item) => (
                                <option
                                    key={
                                        item.registration.registrationId
                                    }
                                    value={
                                        item.registration.registrationId
                                    }
                                >
                                    {getRegistrationLabel(
                                        item.registration.registrationId
                                    )}
                                </option>
                            ))}
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        Attendance Date
                    </label>

                    <input
                        type="date"
                        name="attendanceDate"
                        value={form.attendanceDate}
                        onChange={handleChange}
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        Attendance Status
                    </label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        <option value="PRESENT">
                            PRESENT
                        </option>
                        <option value="ABSENT">
                            ABSENT
                        </option>
                        <option value="LATE">
                            LATE
                        </option>
                        <option value="EXCUSED">
                            EXCUSED
                        </option>
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        Marked By User ID
                    </label>

                    <input
                        type="number"
                        name="markedBy"
                        value={
                            form.markedBy === 0
                                ? ""
                                : form.markedBy
                        }
                        onChange={handleChange}
                        min="1"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        marginRight: "10px",
                        padding: "8px 15px",
                    }}
                >
                    {saving
                        ? "Saving..."
                        : editingId !== null
                        ? "Update Attendance"
                        : "Mark Attendance"}
                </button>

                {editingId !== null && (
                    <button
                        type="button"
                        onClick={resetForm}
                        style={{
                            padding: "8px 15px",
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <h2>Attendance Records</h2>

            {attendance.length === 0 ? (
                <p>No attendance records found.</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={cellStyle}>
                                ID
                            </th>
                            <th style={cellStyle}>
                                Registration
                            </th>
                            <th style={cellStyle}>
                                Student
                            </th>
                            <th style={cellStyle}>
                                Course
                            </th>
                            <th style={cellStyle}>
                                Date
                            </th>
                            <th style={cellStyle}>
                                Status
                            </th>
                            <th style={cellStyle}>
                                Marked By
                            </th>
                            <th style={cellStyle}>
                                Marked At
                            </th>
                            <th style={cellStyle}>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {attendance.map((item) => {
                            const registration =
                                registrations.find(
                                    (registrationItem) =>
                                        registrationItem.registration
                                            .registrationId ===
                                        item.registrationId
                                );

                            const studentName = [
                                registration?.student?.firstName,
                                registration?.student?.lastName,
                            ]
                                .filter(Boolean)
                                .join(" ");

                            return (
                                <tr key={item.attendanceId}>
                                    <td style={cellStyle}>
                                        {item.attendanceId}
                                    </td>

                                    <td style={cellStyle}>
                                        {item.registrationId}
                                    </td>

                                    <td style={cellStyle}>
                                        {studentName || "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {registration?.course
                                            ?.courseName || "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {item.attendanceDate}
                                    </td>

                                    <td style={cellStyle}>
                                        {item.status}
                                    </td>

                                    <td style={cellStyle}>
                                        {item.markedBy}
                                    </td>

                                    <td style={cellStyle}>
                                        {new Date(
                                            item.markedAt
                                        ).toLocaleString()}
                                    </td>

                                    <td style={cellStyle}>
                                        <button
                                            onClick={() =>
                                                handleEdit(item)
                                            }
                                            style={{
                                                marginRight: "5px",
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    item.attendanceId
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const cellStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
};
