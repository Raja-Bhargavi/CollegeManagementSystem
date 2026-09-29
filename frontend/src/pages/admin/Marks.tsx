import { useEffect, useState } from "react";

import {
    createMark,
    deleteMark,
    getMarks,
    updateMark,
} from "../../api/markApi";

import type{
    Mark,
    MarkRequest,
} from "../../api/markApi";

import {
    getExaminations,
} from "../../api/examinationApi";

import type{
    Examination,
} from "../../api/examinationApi";

import {
    getStudents,
} from "../../api/studentApi";

import type{
    Student,
} from "../../api/studentApi";

const initialForm: MarkRequest = {
    examId: 0,
    studentId: 0,
    marksObtained: 0,
    remarks: "",
};

export default function MarksPage() {
    const [marks, setMarks] = useState<Mark[]>([]);
    const [examinations, setExaminations] =
        useState<Examination[]>([]);
    const [students, setStudents] =
        useState<Student[]>([]);

    const [form, setForm] =
        useState<MarkRequest>(initialForm);

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
                markData,
                examinationData,
                studentData,
            ] = await Promise.all([
                getMarks(),
                getExaminations(),
                getStudents(),
            ]);

            setMarks(markData);
            setExaminations(examinationData);
            setStudents(studentData);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to load marks data"
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
                name === "examId" ||
                name === "studentId"
                    ? Number(value)
                    : name === "marksObtained"
                    ? Number(value)
                    : value,
        }));
    };

    const selectedExam = examinations.find(
        (exam) => exam.examId === form.examId
    );

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

            if (!form.examId) {
                setError(
                    "Please select an examination"
                );
                return;
            }

            if (!form.studentId) {
                setError(
                    "Please select a student"
                );
                return;
            }

            if (
                form.marksObtained < 0
            ) {
                setError(
                    "Marks cannot be negative"
                );
                return;
            }

            if (
                selectedExam &&
                form.marksObtained >
                    selectedExam.maximumMarks
            ) {
                setError(
                    `Marks cannot exceed ${selectedExam.maximumMarks}`
                );
                return;
            }

            if (editingId !== null) {
                await updateMark(
                    editingId,
                    form
                );
            } else {
                await createMark(form);
            }

            resetForm();
            await loadData();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to save marks"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (mark: Mark) => {
        setEditingId(mark.markId);

        setForm({
            examId: mark.examId,
            studentId: mark.studentId,
            marksObtained: mark.marksObtained,
            remarks: mark.remarks || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (
        markId: number
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this mark?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteMark(markId);

            if (editingId === markId) {
                resetForm();
            }

            await loadData();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to delete mark"
            );
        }
    };

    const getStudentName = (
        studentId: number
    ) => {
        const student = students.find(
            (item) =>
                item.studentId === studentId
        );

        if (!student) {
            return `Student ${studentId}`;
        }

        return `${student.firstName} ${
            student.lastName || ""
        }`.trim();
    };

    const getExamLabel = (
        examId: number
    ) => {
        const exam = examinations.find(
            (item) => item.examId === examId
        );

        if (!exam) {
            return `Exam ${examId}`;
        }

        return `#${exam.examId} - ${
            exam.examType
        } - ${exam.examDate}`;
    };

    if (loading) {
        return <h1>Loading Marks...</h1>;
    }

    return (
        <div>
            <h1>Marks Management</h1>

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
                        ? "Edit Marks"
                        : "Enter Marks"}
                </h2>

                <div
                    style={{
                        marginBottom: "15px",
                    }}
                >
                    <label>
                        Examination
                    </label>

                    <select
                        name="examId"
                        value={form.examId}
                        onChange={handleChange}
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        <option value={0}>
                            Select examination
                        </option>

                        {examinations.map(
                            (exam) => (
                                <option
                                    key={exam.examId}
                                    value={exam.examId}
                                >
                                    {getExamLabel(
                                        exam.examId
                                    )}
                                    {" | Max: "}
                                    {
                                        exam.maximumMarks
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div
                    style={{
                        marginBottom: "15px",
                    }}
                >
                    <label>
                        Student
                    </label>

                    <select
                        name="studentId"
                        value={form.studentId}
                        onChange={handleChange}
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
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
                            .map(
                                (student) => (
                                    <option
                                        key={
                                            student.studentId
                                        }
                                        value={
                                            student.studentId
                                        }
                                    >
                                        {
                                            student.studentId
                                        }{" "}
                                        -{" "}
                                        {
                                            student.firstName
                                        }{" "}
                                        {
                                            student.lastName
                                        }
                                    </option>
                                )
                            )}
                    </select>
                </div>

                <div
                    style={{
                        marginBottom: "15px",
                    }}
                >
                    <label>
                        Marks Obtained
                    </label>

                    <input
                        type="number"
                        name="marksObtained"
                        value={
                            form.marksObtained
                        }
                        onChange={handleChange}
                        min="0"
                        max={
                            selectedExam?.maximumMarks
                        }
                        step="0.01"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            boxSizing:
                                "border-box",
                        }}
                    />

                    {selectedExam && (
                        <small>
                            Maximum marks:{" "}
                            {
                                selectedExam.maximumMarks
                            }
                        </small>
                    )}
                </div>

                <div
                    style={{
                        marginBottom: "15px",
                    }}
                >
                    <label>
                        Remarks
                    </label>

                    <input
                        type="text"
                        name="remarks"
                        value={
                            form.remarks || ""
                        }
                        onChange={handleChange}
                        maxLength={255}
                        placeholder="Optional remarks"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            boxSizing:
                                "border-box",
                        }}
                    />
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
                        ? "Update Marks"
                        : "Save Marks"}
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

            <h2>Mark Records</h2>

            {marks.length === 0 ? (
                <p>No marks found.</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse:
                            "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={cellStyle}>
                                ID
                            </th>

                            <th style={cellStyle}>
                                Examination
                            </th>

                            <th style={cellStyle}>
                                Student
                            </th>

                            <th style={cellStyle}>
                                Marks
                            </th>

                            <th style={cellStyle}>
                                Remarks
                            </th>

                            <th style={cellStyle}>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {marks.map((mark) => (
                            <tr
                                key={
                                    mark.markId
                                }
                            >
                                <td
                                    style={
                                        cellStyle
                                    }
                                >
                                    {
                                        mark.markId
                                    }
                                </td>

                                <td
                                    style={
                                        cellStyle
                                    }
                                >
                                    {getExamLabel(
                                        mark.examId
                                    )}
                                </td>

                                <td
                                    style={
                                        cellStyle
                                    }
                                >
                                    {getStudentName(
                                        mark.studentId
                                    )}
                                </td>

                                <td
                                    style={
                                        cellStyle
                                    }
                                >
                                    {
                                        mark.marksObtained
                                    }
                                </td>

                                <td
                                    style={
                                        cellStyle
                                    }
                                >
                                    {
                                        mark.remarks ||
                                        "-"
                                    }
                                </td>

                                <td
                                    style={
                                        cellStyle
                                    }
                                >
                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                mark
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
                                                mark.markId
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
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
