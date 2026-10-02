import { useEffect, useState } from "react";

import type {
    FacultyMark,
} from "../../api/facultyPortalApi";

import {
    getMyFacultyMarks,
    updateFacultyMark,
} from "../../api/facultyPortalApi";

export default function FacultyMarks() {

    const [marks, setMarks] =
        useState<FacultyMark[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [editingMarkId, setEditingMarkId] =
        useState<number | null>(null);

    const [editingMarks, setEditingMarks] =
        useState("");

    const [editingRemarks, setEditingRemarks] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    useEffect(() => {
        loadMarks();
    }, []);

    // =========================================================
    // LOAD MARKS
    // =========================================================

    const loadMarks = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getMyFacultyMarks();

            setMarks(data);

        } catch (err: any) {

            console.error(
                "Failed to load faculty marks:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load marks."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // START EDIT
    // =========================================================

    const handleEdit = (
        mark: FacultyMark
    ) => {

        setEditingMarkId(
            mark.markId
        );

        setEditingMarks(
            String(mark.marksObtained)
        );

        setEditingRemarks(
            mark.remarks || ""
        );

        setError("");
        setSuccess("");
    };

    // =========================================================
    // CANCEL EDIT
    // =========================================================

    const handleCancel = () => {

        setEditingMarkId(null);

        setEditingMarks("");
        setEditingRemarks("");

        setError("");
    };

    // =========================================================
    // SAVE EDIT
    // =========================================================

    const handleSave = async () => {

        setError("");
        setSuccess("");

        if (editingMarkId === null) {
            return;
        }

        if (editingMarks.trim() === "") {

            setError(
                "Marks obtained are required."
            );

            return;
        }

        const marksValue =
            Number(editingMarks);

        if (
            Number.isNaN(marksValue) ||
            marksValue < 0
        ) {

            setError(
                "Marks must be a valid non-negative number."
            );

            return;
        }

        try {

            setSaving(true);

            await updateFacultyMark(
                editingMarkId,
                {
                    marksObtained:
                        marksValue,

                    remarks:
                        editingRemarks
                }
            );

            setSuccess(
                "Marks updated successfully."
            );

            setEditingMarkId(null);

            setEditingMarks("");
            setEditingRemarks("");

            await loadMarks();

        } catch (err: any) {

            console.error(
                "Failed to update faculty mark:",
                err
            );

            const responseData =
                err?.response?.data;

            if (responseData?.fields) {

                const fieldMessages =
                    Object.values(
                        responseData.fields
                    );

                setError(
                    fieldMessages.join(", ")
                );

            } else if (
                typeof responseData?.message ===
                "string"
            ) {

                setError(
                    responseData.message
                );

            } else if (
                typeof responseData?.error ===
                "string"
            ) {

                setError(
                    responseData.error
                );

            } else {

                setError(
                    "Failed to update marks."
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
            <h2>
                Loading marks...
            </h2>
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
                    My Marks
                </h1>

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

            {/* NO RECORDS */}

            {marks.length === 0 ? (

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.1)"
                    }}
                >

                    No marks found for your courses.

                </div>

            ) : (

                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        overflowX: "auto",
                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.1)"
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

                            <tr
                                style={{
                                    backgroundColor:
                                        "#f3f4f6"
                                }}
                            >

                                <th style={thStyle}>
                                    Mark ID
                                </th>

                                <th style={thStyle}>
                                    Exam
                                </th>

                                <th style={thStyle}>
                                    Student ID
                                </th>

                                <th style={thStyle}>
                                    Student Name
                                </th>

                                <th style={thStyle}>
                                    Marks Obtained
                                </th>

                                <th style={thStyle}>
                                    Remarks
                                </th>

                                <th style={thStyle}>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {marks.map(
                                (mark) => {

                                    const isEditing =
                                        editingMarkId ===
                                        mark.markId;

                                    return (

                                        <tr
                                            key={
                                                mark.markId
                                            }
                                        >

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    mark.markId
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    mark.examType
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    mark.studentId
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    mark.studentName
                                                }
                                            </td>

                                            {/* MARKS */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                {isEditing ? (

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            editingMarks
                                                        }
                                                        onChange={
                                                            (event) =>
                                                                setEditingMarks(
                                                                    event.target.value
                                                                )
                                                        }
                                                        style={
                                                            inputStyle
                                                        }
                                                    />

                                                ) : (

                                                    mark.marksObtained

                                                )}

                                            </td>

                                            {/* REMARKS */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                {isEditing ? (

                                                    <input
                                                        type="text"
                                                        value={
                                                            editingRemarks
                                                        }
                                                        onChange={
                                                            (event) =>
                                                                setEditingRemarks(
                                                                    event.target.value
                                                                )
                                                        }
                                                        maxLength={
                                                            255
                                                        }
                                                        style={
                                                            inputStyle
                                                        }
                                                    />

                                                ) : (

                                                    mark.remarks ||
                                                    "-"

                                                )}

                                            </td>

                                            {/* ACTION */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                {isEditing ? (

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "8px"
                                                        }}
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleSave
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            style={{
                                                                padding:
                                                                    "7px 12px",
                                                                border:
                                                                    "none",
                                                                borderRadius:
                                                                    "5px",
                                                                backgroundColor:
                                                                    "#1f2937",
                                                                color:
                                                                    "white",
                                                                cursor:
                                                                    saving
                                                                        ? "not-allowed"
                                                                        : "pointer",
                                                                fontWeight:
                                                                    "bold"
                                                            }}
                                                        >
                                                            {saving
                                                                ? "Saving..."
                                                                : "Save"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleCancel
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            style={{
                                                                padding:
                                                                    "7px 12px",
                                                                border:
                                                                    "1px solid #d1d5db",
                                                                borderRadius:
                                                                    "5px",
                                                                backgroundColor:
                                                                    "white",
                                                                color:
                                                                    "#374151",
                                                                cursor:
                                                                    saving
                                                                        ? "not-allowed"
                                                                        : "pointer"
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                mark
                                                            )
                                                        }
                                                        style={{
                                                            padding:
                                                                "7px 12px",
                                                            border:
                                                                "none",
                                                            borderRadius:
                                                                "5px",
                                                            backgroundColor:
                                                                "#1f2937",
                                                            color:
                                                                "white",
                                                            cursor:
                                                                "pointer",
                                                            fontWeight:
                                                                "bold"
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                )}

                                            </td>

                                        </tr>

                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}


// =========================================================
// TABLE STYLES
// =========================================================

const thStyle: React.CSSProperties = {

    padding: "12px",

    textAlign: "left",

    borderBottom:
        "1px solid #ddd",

    whiteSpace: "nowrap"
};


const tdStyle: React.CSSProperties = {

    padding: "12px",

    borderBottom:
        "1px solid #eee",

    verticalAlign: "middle"
};


// =========================================================
// INPUT STYLE
// =========================================================

const inputStyle: React.CSSProperties = {

    width: "100%",

    minWidth: "120px",

    boxSizing: "border-box",

    padding: "8px 10px",

    border:
        "1px solid #d1d5db",

    borderRadius: "5px",

    fontSize: "14px"
};