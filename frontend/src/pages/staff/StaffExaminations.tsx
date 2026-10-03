import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Examination {
    examId: number;
    offeringId: number;
    examType: string;
    examDate: string;
    maximumMarks: number;
    status: string;
}

interface CourseOffering {
    offeringId: number;
    courseCode: string;
    courseName: string;
    sectionName: string;
    facultyName: string;
    offeringStatus: string;
}

interface ExaminationForm {
    offeringId: number;
    examType: string;
    examDate: string;
    maximumMarks: number;
    status: string;
}

export default function StaffExaminations() {
    const [examinations, setExaminations] =
        useState<Examination[]>([]);

    const [offerings, setOfferings] =
        useState<CourseOffering[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [formData, setFormData] =
        useState<ExaminationForm>({
            offeringId: 0,
            examType: "",
            examDate: "",
            maximumMarks: 100,
            status: "SCHEDULED",
        });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                examinationsResponse,
                offeringsResponse,
            ] = await Promise.all([
                api.get<Examination[]>(
                    "/api/examinations"
                ),
                api.get<CourseOffering[]>(
                    "/api/course-offerings"
                ),
            ]);

            setExaminations(
                examinationsResponse.data
            );

            setOfferings(
                offeringsResponse.data
            );
        } catch (error: any) {
            console.error(
                "Failed to load examinations:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to load examinations."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);

        setFormData({
            offeringId: 0,
            examType: "",
            examDate: "",
            maximumMarks: 100,
            status: "SCHEDULED",
        });
    };

    const handleEdit = (
        examination: Examination
    ) => {
        setEditingId(
            examination.examId
        );

        setFormData({
            offeringId:
                examination.offeringId,
            examType:
                examination.examType,
            examDate:
                examination.examDate,
            maximumMarks:
                examination.maximumMarks,
            status:
                examination.status,
        });

        setMessage("");
        setError("");
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (
            formData.offeringId <= 0 ||
            !formData.examType.trim() ||
            !formData.examDate ||
            formData.maximumMarks <= 0 ||
            !formData.status.trim()
        ) {
            setError(
                "Please complete all examination fields."
            );

            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            if (editingId === null) {
                await api.post(
                    "/api/examinations",
                    formData
                );

                setMessage(
                    "Examination created successfully."
                );
            } else {
                await api.put(
                    `/api/examinations/${editingId}`,
                    formData
                );

                setMessage(
                    "Examination updated successfully."
                );
            }

            resetForm();

            await loadData();
        } catch (error: any) {
            console.error(
                "Failed to save examination:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to save examination."
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
                Examinations
            </h1>

            <p
                style={{
                    color: "#6b7280",
                    marginBottom: "25px",
                }}
            >
                Manage examination schedules and details
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
                        ? "Create Examination"
                        : "Edit Examination"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={gridStyle}>
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
                                            }
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Exam Type
                            </label>

                            <input
                                type="text"
                                value={
                                    formData.examType
                                }
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        examType:
                                            event.target.value,
                                    })
                                }
                                style={inputStyle}
                                placeholder="e.g. MIDTERM"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Exam Date
                            </label>

                            <input
                                type="date"
                                value={
                                    formData.examDate
                                }
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        examDate:
                                            event.target.value,
                                    })
                                }
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Maximum Marks
                            </label>

                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={
                                    formData.maximumMarks
                                }
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        maximumMarks:
                                            Number(
                                                event.target.value
                                            ),
                                    })
                                }
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Status
                            </label>

                            <select
                                value={
                                    formData.status
                                }
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        status:
                                            event.target.value,
                                    })
                                }
                                style={inputStyle}
                            >
                                <option value="SCHEDULED">
                                    SCHEDULED
                                </option>

                                <option value="COMPLETED">
                                    COMPLETED
                                </option>

                                <option value="CANCELLED">
                                    CANCELLED
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
                                ? "Create Examination"
                                : "Update Examination"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={
                                    secondaryButtonStyle
                                }
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div style={tableCardStyle}>
                <h2>Existing Examinations</h2>

                {loading ? (
                    <p>
                        Loading examinations...
                    </p>
                ) : examinations.length === 0 ? (
                    <p>
                        No examinations found.
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
                                        Offering ID
                                    </th>
                                    <th style={thStyle}>
                                        Exam Type
                                    </th>
                                    <th style={thStyle}>
                                        Exam Date
                                    </th>
                                    <th style={thStyle}>
                                        Maximum Marks
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
                                {examinations.map(
                                    (exam) => (
                                        <tr
                                            key={
                                                exam.examId
                                            }
                                        >
                                            <td style={tdStyle}>
                                                {
                                                    exam.examId
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    exam.offeringId
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    exam.examType
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    exam.examDate
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    exam.maximumMarks
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    exam.status
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            exam
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