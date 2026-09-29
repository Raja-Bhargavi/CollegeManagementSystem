import { useEffect, useState } from "react";

import {
    createExamination,
    deleteExamination,
    getExaminations,
    updateExamination,
} from "../../api/examinationApi";

import type{
    Examination,
    ExaminationRequest,
} from "../../api/examinationApi";

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

const initialForm: ExaminationRequest = {
    offeringId: 0,
    examType: "",
    examDate: "",
    maximumMarks: 100,
    status: "SCHEDULED",
};

export default function ExaminationsPage() {
    const [examinations, setExaminations] = useState<Examination[]>([]);
    const [offerings, setOfferings] = useState<CourseOffering[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    const [form, setForm] =
        useState<ExaminationRequest>(initialForm);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                examinationData,
                offeringData,
                courseData,
            ] = await Promise.all([
                getExaminations(),
                getCourseOfferings(),
                getCourses(),
            ]);

            setExaminations(examinationData);
            setOfferings(offeringData);
            setCourses(courseData);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to load examination data"
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
                name === "offeringId"
                    ? Number(value)
                    : name === "maximumMarks"
                    ? Number(value)
                    : value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            if (!form.offeringId) {
                setError("Please select a course offering");
                return;
            }

            if (!form.examType.trim()) {
                setError("Please enter the examination type");
                return;
            }

            if (!form.examDate) {
                setError("Please select the examination date");
                return;
            }

            if (form.maximumMarks <= 0) {
                setError(
                    "Maximum marks must be greater than 0"
                );
                return;
            }

            if (editingId !== null) {
                await updateExamination(
                    editingId,
                    form
                );
            } else {
                await createExamination(form);
            }

            resetForm();
            await loadData();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to save examination"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (
        examination: Examination
    ) => {
        setEditingId(examination.examId);

        setForm({
            offeringId: examination.offeringId,
            examType: examination.examType,
            examDate: examination.examDate,
            maximumMarks: examination.maximumMarks,
            status: examination.status,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (
        examId: number
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this examination?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteExamination(examId);

            if (editingId === examId) {
                resetForm();
            }

            await loadData();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to delete examination"
            );
        }
    };

    const getOfferingLabel = (
        offering: CourseOffering
    ) => {
        const course = courses.find(
            (item) =>
                item.courseId === offering.courseId
        );

        return `#${offering.offeringId} - ${
            course?.courseName ||
            `Course ${offering.courseId}`
        }`;
    };

    if (loading) {
        return <h1>Loading Examinations...</h1>;
    }

    return (
        <div>
            <h1>Examinations Management</h1>

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
                        ? "Edit Examination"
                        : "Create Examination"}
                </h2>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        Course Offering
                    </label>

                    <select
                        name="offeringId"
                        value={form.offeringId}
                        onChange={handleChange}
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
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
                                    key={offering.offeringId}
                                    value={offering.offeringId}
                                >
                                    {getOfferingLabel(
                                        offering
                                    )}
                                </option>
                            ))}
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        Examination Type
                    </label>

                    <input
                        type="text"
                        name="examType"
                        value={form.examType}
                        onChange={handleChange}
                        placeholder="e.g. MIDTERM"
                        maxLength={30}
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
                        Examination Date
                    </label>

                    <input
                        type="date"
                        name="examDate"
                        value={form.examDate}
                        onChange={handleChange}
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        Maximum Marks
                    </label>

                    <input
                        type="number"
                        name="maximumMarks"
                        value={form.maximumMarks}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
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
                        Status
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

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: "8px 15px",
                        marginRight: "10px",
                    }}
                >
                    {saving
                        ? "Saving..."
                        : editingId !== null
                        ? "Update Examination"
                        : "Create Examination"}
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

            <h2>Examination Records</h2>

            {examinations.length === 0 ? (
                <p>No examinations found.</p>
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
                                Course Offering
                            </th>

                            <th style={cellStyle}>
                                Exam Type
                            </th>

                            <th style={cellStyle}>
                                Exam Date
                            </th>

                            <th style={cellStyle}>
                                Maximum Marks
                            </th>

                            <th style={cellStyle}>
                                Status
                            </th>

                            <th style={cellStyle}>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {examinations.map(
                            (examination) => (
                                <tr
                                    key={
                                        examination.examId
                                    }
                                >
                                    <td style={cellStyle}>
                                        {
                                            examination.examId
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {
                                            getOfferingLabel(
                                                offerings.find(
                                                    (
                                                        offering
                                                    ) =>
                                                        offering.offeringId ===
                                                        examination.offeringId
                                                ) || {
                                                    offeringId:
                                                        examination.offeringId,
                                                    courseId: 0,
                                                } as CourseOffering
                                            )
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {
                                            examination.examType
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {
                                            examination.examDate
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {
                                            examination.maximumMarks
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {
                                            examination.status
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    examination
                                                )
                                            }
                                            style={{
                                                marginRight:
                                                    "5px",
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    examination.examId
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
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
