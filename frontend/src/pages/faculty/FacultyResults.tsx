import { useEffect, useState } from "react";

import type {
    FacultyResult,
    FacultyResultUpdateRequest,
} from "../../api/facultyPortalApi";

import {
    getMyFacultyResults,
    updateFacultyResult,
} from "../../api/facultyPortalApi";

export default function FacultyResults() {

    const [results, setResults] =
        useState<FacultyResult[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [editSgpa, setEditSgpa] =
        useState("");

    const [editRemarks, setEditRemarks] =
        useState("");

    const [editStatus, setEditStatus] =
        useState("PUBLISHED");

    const [saving, setSaving] =
        useState(false);

    // =========================================================
    // LOAD RESULTS
    // =========================================================

    useEffect(() => {

        loadResults();

    }, []);

    const loadResults = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getMyFacultyResults();

            setResults(data);

        } catch (err: any) {

            console.error(
                "Failed to load faculty results:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to load results."
                )
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // START EDITING
    // =========================================================

    const startEditing = (
        result: FacultyResult
    ) => {

        setEditingId(
            result.resultId
        );

        setEditSgpa(
            result.sgpa?.toString() ?? ""
        );

        setEditRemarks(
            result.remarks ?? ""
        );

        setEditStatus(
            result.resultStatus || "PUBLISHED"
        );

        setError("");
    };


    // =========================================================
    // CANCEL EDITING
    // =========================================================

    const cancelEditing = () => {

        setEditingId(null);

        setEditSgpa("");

        setEditRemarks("");

        setEditStatus("PUBLISHED");

        setError("");
    };


    // =========================================================
    // SAVE RESULT
    // =========================================================

    const saveResult = async (
        resultId: number
    ) => {

        try {

            setSaving(true);
            setError("");

            const sgpa =
                Number(editSgpa);

            if (
                editSgpa.trim() === ""
                ||
                Number.isNaN(sgpa)
            ) {

                setError(
                    "Please enter a valid SGPA."
                );

                return;
            }

            if (
                sgpa < 0
                ||
                sgpa > 10
            ) {

                setError(
                    "SGPA must be between 0 and 10."
                );

                return;
            }

            const request:
                FacultyResultUpdateRequest = {

                sgpa: sgpa,

                remarks:
                    editRemarks.trim(),

                resultStatus:
                    editStatus,
            };

            const updatedResult =
                await updateFacultyResult(
                    resultId,
                    request
                );

            setResults(
                (currentResults) =>
                    currentResults.map(
                        (result) =>
                            result.resultId === resultId
                                ? {
                                    ...result,
                                    ...updatedResult,
                                }
                                : result
                    )
            );

            setEditingId(null);

            setEditSgpa("");

            setEditRemarks("");

            setEditStatus("PUBLISHED");

        } catch (err: any) {

            console.error(
                "Failed to update result:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to update result."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div
                style={{
                    padding: "20px",
                }}
            >
                <h2>
                    Loading results...
                </h2>
            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div>

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >

                <h1
                    style={{
                        margin: 0,
                    }}
                >
                    My Results
                </h1>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    style={{
                        backgroundColor:
                            "#fee2e2",

                        color:
                            "#991b1b",

                        padding:
                            "12px 15px",

                        borderRadius:
                            "6px",

                        marginBottom:
                            "20px",
                    }}
                >
                    {error}
                </div>

            )}


            {/* =================================================
                NO RESULTS
            ================================================= */}

            {results.length === 0 ? (

                <div
                    style={{
                        backgroundColor:
                            "white",

                        padding:
                            "20px",

                        borderRadius:
                            "8px",

                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                >

                    <p
                        style={{
                            margin: 0,
                            color: "#374151",
                        }}
                    >
                        No results found for
                        your students.
                    </p>

                </div>

            ) : (

                /* =================================================
                   RESULTS TABLE
                ================================================= */

                <div
                    style={{
                        backgroundColor:
                            "white",

                        borderRadius:
                            "8px",

                        padding:
                            "20px",

                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.1)",

                        overflowX:
                            "auto",
                    }}
                >

                    <table
                        style={{
                            width:
                                "100%",

                            borderCollapse:
                                "collapse",
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    backgroundColor:
                                        "#f3f4f6",
                                }}
                            >

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Result ID
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Student ID
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Student Name
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Semester
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    SGPA
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    CGPA
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Remarks
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Status
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Published At
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {results.map(
                                (result) => {

                                    const isEditing =
                                        editingId ===
                                        result.resultId;

                                    return (

                                        <tr
                                            key={
                                                result.resultId
                                            }
                                        >

                                            {/* RESULT ID */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    result.resultId
                                                }
                                            </td>


                                            {/* STUDENT ID */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    result.studentId
                                                }
                                            </td>


                                            {/* STUDENT NAME */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    result.studentName
                                                }
                                            </td>


                                            {/* SEMESTER */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                Semester{" "}
                                                {
                                                    result.semesterId
                                                }
                                            </td>


                                            {/* SGPA */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                {isEditing ? (

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="10"
                                                        step="0.01"
                                                        value={
                                                            editSgpa
                                                        }
                                                        onChange={
                                                            (e) =>
                                                                setEditSgpa(
                                                                    e.target.value
                                                                )
                                                        }
                                                        style={
                                                            inputStyle
                                                        }
                                                    />

                                                ) : (

                                                    <span
                                                        style={
                                                            scoreStyle
                                                        }
                                                    >
                                                        {
                                                            result.sgpa
                                                        }
                                                    </span>

                                                )}

                                            </td>


                                            {/* CGPA */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                <span
                                                    style={
                                                        scoreStyle
                                                    }
                                                >
                                                    {
                                                        result.cgpa
                                                    }
                                                </span>

                                            </td>


                                            {/* REMARKS */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                {isEditing ? (

                                                    <textarea
                                                        value={
                                                            editRemarks
                                                        }
                                                        onChange={
                                                            (e) =>
                                                                setEditRemarks(
                                                                    e.target.value
                                                                )
                                                        }
                                                        maxLength={
                                                            255
                                                        }
                                                        rows={
                                                            3
                                                        }
                                                        style={
                                                            textareaStyle
                                                        }
                                                    />

                                                ) : (

                                                    <span>
                                                        {
                                                            result.remarks
                                                                || "-"
                                                        }
                                                    </span>

                                                )}

                                            </td>


                                            {/* STATUS */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                {isEditing ? (

                                                    <select
                                                        value={
                                                            editStatus
                                                        }
                                                        onChange={
                                                            (e) =>
                                                                setEditStatus(
                                                                    e.target.value
                                                                )
                                                        }
                                                        style={
                                                            inputStyle
                                                        }
                                                    >

                                                        <option value="PENDING">
                                                            PENDING
                                                        </option>

                                                        <option value="PUBLISHED">
                                                            PUBLISHED
                                                        </option>

                                                    </select>

                                                ) : (

                                                    <span
                                                        style={
                                                            getStatusStyle(
                                                                result.resultStatus
                                                            )
                                                        }
                                                    >
                                                        {
                                                            result.resultStatus
                                                        }
                                                    </span>

                                                )}

                                            </td>


                                            {/* PUBLISHED AT */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                {
                                                    result.publishedAt
                                                        ? formatDateTime(
                                                            result.publishedAt
                                                        )
                                                        : "-"
                                                }

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
                                                                "8px",
                                                        }}
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                saveResult(
                                                                    result.resultId
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            style={
                                                                saveButtonStyle
                                                            }
                                                        >
                                                            {
                                                                saving
                                                                    ? "Saving..."
                                                                    : "Save"
                                                            }
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                cancelEditing
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            style={
                                                                cancelButtonStyle
                                                            }
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            startEditing(
                                                                result
                                                            )
                                                        }
                                                        style={
                                                            editButtonStyle
                                                        }
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
// ERROR HANDLING
// =========================================================

function getErrorMessage(
    err: any,
    fallback: string
): string {

    const responseData =
        err?.response?.data;

    if (responseData?.fields) {

        const fieldMessages =
            Object.values(
                responseData.fields
            ) as string[];

        return fieldMessages.join(", ");
    }

    if (
        typeof responseData?.message ===
        "string"
    ) {

        return responseData.message;
    }

    if (
        typeof responseData?.error ===
        "string"
    ) {

        return responseData.error;
    }

    if (
        typeof responseData ===
        "string"
    ) {

        return responseData;
    }

    return fallback;
}


// =========================================================
// FORMAT DATE + TIME
// =========================================================

function formatDateTime(
    date: string
): string {

    if (!date) {

        return "-";
    }

    return new Date(
        date
    ).toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}


// =========================================================
// RESULT STATUS STYLE
// =========================================================

function getStatusStyle(
    status: string
): React.CSSProperties {

    const normalized =
        status?.toUpperCase();

    if (
        normalized ===
        "PUBLISHED"
    ) {

        return {
            display:
                "inline-block",

            padding:
                "5px 10px",

            borderRadius:
                "12px",

            backgroundColor:
                "#dcfce7",

            color:
                "#166534",

            fontSize:
                "13px",

            fontWeight:
                "bold",
        };
    }

    if (
        normalized ===
        "PENDING"
    ) {

        return {
            display:
                "inline-block",

            padding:
                "5px 10px",

            borderRadius:
                "12px",

            backgroundColor:
                "#fef3c7",

            color:
                "#92400e",

            fontSize:
                "13px",

            fontWeight:
                "bold",
        };
    }

    return {
        display:
            "inline-block",

        padding:
            "5px 10px",

        borderRadius:
            "12px",

        backgroundColor:
            "#f3f4f6",

        color:
            "#374151",

        fontSize:
            "13px",

        fontWeight:
            "bold",
    };
}


// =========================================================
// TABLE STYLES
// =========================================================

const thStyle:
    React.CSSProperties = {

    padding:
        "12px",

    textAlign:
        "left",

    borderBottom:
        "2px solid #e5e7eb",

    fontSize:
        "14px",

    fontWeight:
        "bold",

    whiteSpace:
        "nowrap",
};


const tdStyle:
    React.CSSProperties = {

    padding:
        "12px",

    borderBottom:
        "1px solid #e5e7eb",

    fontSize:
        "14px",

    color:
        "#374151",

    whiteSpace:
        "nowrap",
};


// =========================================================
// SCORE STYLE
// =========================================================

const scoreStyle:
    React.CSSProperties = {

    fontWeight:
        "bold",

    fontSize:
        "15px",

    color:
        "#1f2937",
};


// =========================================================
// INPUT STYLE
// =========================================================

const inputStyle:
    React.CSSProperties = {

    padding:
        "8px 10px",

    border:
        "1px solid #d1d5db",

    borderRadius:
        "5px",

    fontSize:
        "14px",

    minWidth:
        "100px",

    boxSizing:
        "border-box",
};


// =========================================================
// TEXTAREA STYLE
// =========================================================

const textareaStyle:
    React.CSSProperties = {

    padding:
        "8px 10px",

    border:
        "1px solid #d1d5db",

    borderRadius:
        "5px",

    fontSize:
        "14px",

    minWidth:
        "180px",

    resize:
        "vertical",

    boxSizing:
        "border-box",
};


// =========================================================
// EDIT BUTTON
// =========================================================

const editButtonStyle:
    React.CSSProperties = {

    backgroundColor:
        "#1f2937",

    color:
        "white",

    border:
        "none",

    borderRadius:
        "5px",

    padding:
        "8px 14px",

    cursor:
        "pointer",

    fontWeight:
        "bold",
};


// =========================================================
// SAVE BUTTON
// =========================================================

const saveButtonStyle:
    React.CSSProperties = {

    backgroundColor:
        "#166534",

    color:
        "white",

    border:
        "none",

    borderRadius:
        "5px",

    padding:
        "8px 14px",

    cursor:
        "pointer",

    fontWeight:
        "bold",
};


// =========================================================
// CANCEL BUTTON
// =========================================================

const cancelButtonStyle:
    React.CSSProperties = {

    backgroundColor:
        "#6b7280",

    color:
        "white",

    border:
        "none",

    borderRadius:
        "5px",

    padding:
        "8px 14px",

    cursor:
        "pointer",

    fontWeight:
        "bold",
};