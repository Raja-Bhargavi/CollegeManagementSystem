import { useEffect, useState } from "react";
import api from "../../api/axios";

interface CourseRegistration {
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

interface Student {
    studentId: number;
    rollNumber: string;
    firstName: string;
    lastName: string;
    studentStatus: string;
}

interface CourseOffering {
    offeringId: number;
    courseCode: string;
    courseName: string;
    sectionName: string;
    facultyName: string;
    offeringStatus: string;
}

interface RegistrationForm {
    studentId: number;
    offeringId: number;
}

export default function StaffCourseRegistrations() {
    const [
        registrations,
        setRegistrations,
    ] = useState<CourseRegistration[]>([]);

    const [students, setStudents] = useState<Student[]>([]);
    const [offerings, setOfferings] =
        useState<CourseOffering[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] =
        useState<RegistrationForm>({
            studentId: 0,
            offeringId: 0,
        });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                registrationsResponse,
                studentsResponse,
                offeringsResponse,
            ] = await Promise.all([
                api.get<CourseRegistration[]>(
                    "/api/course-registrations"
                ),
                api.get<Student[]>(
                    "/api/students"
                ),
                api.get<CourseOffering[]>(
                    "/api/course-offerings"
                ),
            ]);

            setRegistrations(
                registrationsResponse.data
            );

            setStudents(
                studentsResponse.data
            );

            setOfferings(
                offeringsResponse.data
            );
        } catch (error: any) {
            console.error(
                "Failed to load registrations:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to load course registrations."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);

        setFormData({
            studentId: 0,
            offeringId: 0,
        });
    };

    const handleEdit = (
        registration: CourseRegistration
    ) => {
        setEditingId(
            registration.registrationId
        );

        setFormData({
            studentId: registration.studentId,
            offeringId: registration.offeringId,
        });

        setMessage("");
        setError("");
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (
            formData.studentId <= 0 ||
            formData.offeringId <= 0
        ) {
            setError(
                "Student and course offering are required."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            if (editingId === null) {
                await api.post(
                    "/api/course-registrations",
                    formData
                );

                setMessage(
                    "Student registered successfully."
                );
            } else {
                await api.put(
                    `/api/course-registrations/${editingId}`,
                    formData
                );

                setMessage(
                    "Course registration updated successfully."
                );
            }

            resetForm();

            await loadData();
        } catch (error: any) {
            console.error(
                "Failed to save registration:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to save registration."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h1
                style={{
                    marginBottom: "8px",
                    color: "#111827",
                }}
            >
                Course Registrations
            </h1>

            <p
                style={{
                    color: "#6b7280",
                    marginBottom: "25px",
                }}
            >
                Register students for course offerings
            </p>

            {message && (
                <div style={successStyle}>
                    {message}
                </div>
            )}

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}

            <div style={formCardStyle}>
                <h2>
                    {editingId === null
                        ? "Register Student"
                        : "Edit Registration"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={gridStyle}>
                        <div>
                            <label style={labelStyle}>
                                Student
                            </label>

                            <select
                                value={
                                    formData.studentId
                                }
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        studentId:
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            ),
                                    })
                                }
                                style={inputStyle}
                            >
                                <option value={0}>
                                    Select student
                                </option>

                                {students
                                    .filter(
                                        (student) =>
                                            student.studentStatus ===
                                            "ACTIVE"
                                    )
                                    .map((student) => (
                                        <option
                                            key={
                                                student.studentId
                                            }
                                            value={
                                                student.studentId
                                            }
                                        >
                                            {
                                                student.rollNumber
                                            }{" "}
                                            -{" "}
                                            {
                                                student.firstName
                                            }{" "}
                                            {
                                                student.lastName
                                            }
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Course Offering
                            </label>

                            <select
                                value={
                                    formData.offeringId
                                }
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        offeringId:
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            ),
                                    })
                                }
                                style={inputStyle}
                            >
                                <option value={0}>
                                    Select course offering
                                </option>

                                {offerings
                                    .filter(
                                        (offering) =>
                                            offering.offeringStatus ===
                                            "ACTIVE"
                                    )
                                    .map((offering) => (
                                        <option
                                            key={
                                                offering.offeringId
                                            }
                                            value={
                                                offering.offeringId
                                            }
                                        >
                                            {
                                                offering.courseCode
                                            }{" "}
                                            -{" "}
                                            {
                                                offering.courseName
                                            }{" "}
                                            /{" "}
                                            {
                                                offering.sectionName
                                            }{" "}
                                            /{" "}
                                            {
                                                offering.facultyName
                                            }
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        <button
                            type="submit"
                            disabled={saving}
                            style={primaryButtonStyle}
                        >
                            {saving
                                ? "Saving..."
                                : editingId === null
                                ? "Register Student"
                                : "Update Registration"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={secondaryButtonStyle}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div style={tableCardStyle}>
                <h2>Existing Registrations</h2>

                {loading ? (
                    <p>
                        Loading registrations...
                    </p>
                ) : registrations.length === 0 ? (
                    <p>
                        No course registrations found.
                    </p>
                ) : (
                    <div
                        style={{
                            overflowX: "auto",
                        }}
                    >
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>
                                        ID
                                    </th>
                                    <th style={thStyle}>
                                        Student ID
                                    </th>
                                    <th style={thStyle}>
                                        Course
                                    </th>
                                    <th style={thStyle}>
                                        Section
                                    </th>
                                    <th style={thStyle}>
                                        Faculty
                                    </th>
                                    <th style={thStyle}>
                                        Date
                                    </th>
                                    <th style={thStyle}>
                                        Status
                                    </th>
                                    <th style={thStyle}>
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {registrations.map(
                                    (registration) => (
                                        <tr
                                            key={
                                                registration.registrationId
                                            }
                                        >
                                            <td style={tdStyle}>
                                                {
                                                    registration.registrationId
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    registration.studentId
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    registration.courseCode
                                                }{" "}
                                                -{" "}
                                                {
                                                    registration.courseName
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    registration.sectionName
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    registration.facultyName
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {new Date(
                                                    registration.registrationDate
                                                ).toLocaleString()}
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    registration.status
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            registration
                                                        )
                                                    }
                                                    style={
                                                        secondaryButtonStyle
                                                    }
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
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 600,
    color: "#374151",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
};

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
};

const formCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "25px",
};

const tableCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
};

const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
    padding: "14px",
    textAlign: "left",
    backgroundColor: "#f3f4f6",
    borderBottom: "1px solid #d1d5db",
};

const tdStyle: React.CSSProperties = {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
};

const primaryButtonStyle: React.CSSProperties = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#111827",
    color: "#ffffff",
    cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
    padding: "10px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    color: "#111827",
    cursor: "pointer",
};

const successStyle: React.CSSProperties = {
    marginBottom: "20px",
    padding: "12px",
    border: "1px solid #86efac",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    borderRadius: "6px",
};

const errorStyle: React.CSSProperties = {
    marginBottom: "20px",
    padding: "12px",
    border: "1px solid #fca5a5",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    borderRadius: "6px",
};