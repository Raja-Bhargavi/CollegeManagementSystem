import { useEffect, useState } from "react";
import api from "../../api/axios";

interface CourseOffering {
    offeringId: number;
    courseId: number;
    courseCode: string;
    courseName: string;
    sectionId: number;
    sectionName: string;
    facultyId: number;
    facultyName: string;
    offeringStatus: string;
}

interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
}

interface Faculty {
    facultyId: number;
    firstName: string;
    lastName: string | null;
}

interface CourseOfferingForm {
    courseId: number;
    sectionId: number;
    facultyId: number;
    offeringStatus: string;
}

export default function StaffCourseOfferings() {
    const [offerings, setOfferings] = useState<CourseOffering[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] =
        useState<CourseOfferingForm>({
            courseId: 0,
            sectionId: 0,
            facultyId: 0,
            offeringStatus: "ACTIVE",
        });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                offeringsResponse,
                coursesResponse,
                facultyResponse,
            ] = await Promise.all([
                api.get<CourseOffering[]>(
                    "/api/course-offerings"
                ),
                api.get<Course[]>(
                    "/api/courses"
                ),
                api.get<Faculty[]>(
                    "/api/faculty"
                ),
            ]);

            setOfferings(offeringsResponse.data);
            setCourses(coursesResponse.data);
            setFaculty(facultyResponse.data);
        } catch (error: any) {
            console.error(
                "Failed to load course offerings:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to load course offerings."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);

        setFormData({
            courseId: 0,
            sectionId: 0,
            facultyId: 0,
            offeringStatus: "ACTIVE",
        });
    };

    const handleEdit = (
        offering: CourseOffering
    ) => {
        setEditingId(offering.offeringId);

        setFormData({
            courseId: offering.courseId,
            sectionId: offering.sectionId,
            facultyId: offering.facultyId,
            offeringStatus: offering.offeringStatus,
        });

        setMessage("");
        setError("");
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (
            formData.courseId <= 0 ||
            formData.sectionId <= 0 ||
            formData.facultyId <= 0
        ) {
            setError(
                "Course, section and faculty are required."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            if (editingId === null) {
                await api.post(
                    "/api/course-offerings",
                    formData
                );

                setMessage(
                    "Course offering created successfully."
                );
            } else {
                await api.put(
                    `/api/course-offerings/${editingId}`,
                    formData
                );

                setMessage(
                    "Course offering updated successfully."
                );
            }

            resetForm();
            await loadData();
        } catch (error: any) {
            console.error(
                "Failed to save course offering:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to save course offering."
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
                Course Offerings
            </h1>

            <p
                style={{
                    color: "#6b7280",
                    marginBottom: "25px",
                }}
            >
                Manage course offerings, sections and faculty assignments
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
                        ? "Create Course Offering"
                        : "Edit Course Offering"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={gridStyle}>
                        <div>
                            <label style={labelStyle}>
                                Course
                            </label>

                            <select
                                value={formData.courseId}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        courseId: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                                style={inputStyle}
                            >
                                <option value={0}>
                                    Select course
                                </option>

                                {courses.map((course) => (
                                    <option
                                        key={course.courseId}
                                        value={course.courseId}
                                    >
                                        {course.courseCode} -{" "}
                                        {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Section ID
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={
                                    formData.sectionId || ""
                                }
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        sectionId: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                                style={inputStyle}
                                placeholder="Enter section ID"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Faculty
                            </label>

                            <select
                                value={formData.facultyId}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        facultyId: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                                style={inputStyle}
                            >
                                <option value={0}>
                                    Select faculty
                                </option>

                                {faculty.map((member) => (
                                    <option
                                        key={member.facultyId}
                                        value={member.facultyId}
                                    >
                                        {member.firstName}{" "}
                                        {member.lastName || ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Offering Status
                            </label>

                            <select
                                value={
                                    formData.offeringStatus
                                }
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        offeringStatus:
                                            event.target.value,
                                    })
                                }
                                style={inputStyle}
                            >
                                <option value="ACTIVE">
                                    ACTIVE
                                </option>

                                <option value="INACTIVE">
                                    INACTIVE
                                </option>
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
                                ? "Create Offering"
                                : "Update Offering"}
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
                <h2>Existing Course Offerings</h2>

                {loading ? (
                    <p>Loading course offerings...</p>
                ) : offerings.length === 0 ? (
                    <p>No course offerings found.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Course</th>
                                    <th style={thStyle}>Section</th>
                                    <th style={thStyle}>Faculty</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {offerings.map((offering) => (
                                    <tr
                                        key={
                                            offering.offeringId
                                        }
                                    >
                                        <td style={tdStyle}>
                                            {
                                                offering.offeringId
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {offering.courseCode}
                                            {" - "}
                                            {offering.courseName}
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                offering.sectionName
                                            }
                                            {" "}
                                            (
                                            {
                                                offering.sectionId
                                            }
                                            )
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                offering.facultyName
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                offering.offeringStatus
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        offering
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
                                ))}
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
        "repeat(auto-fit, minmax(220px, 1fr))",
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