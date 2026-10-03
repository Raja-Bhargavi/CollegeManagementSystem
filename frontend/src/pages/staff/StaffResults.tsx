import { useEffect, useState, type CSSProperties } from "react";
import {
    getResults,
    type Result,
} from "../../api/resultApi";

export default function StaffResults() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            setLoading(true);
            setMessage("");

            const data = await getResults();
            setResults(data);
        } catch (error: any) {
            console.error("Failed to load staff results:", error);

            setMessage(
                error?.response?.data?.message ||
                    "Failed to load results."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        const normalizedStatus = status.toUpperCase();

        if (
            normalizedStatus === "PASS" ||
            normalizedStatus === "PASSED"
        ) {
            return {
                backgroundColor: "#dcfce7",
                color: "#166534",
            };
        }

        if (
            normalizedStatus === "FAIL" ||
            normalizedStatus === "FAILED"
        ) {
            return {
                backgroundColor: "#fee2e2",
                color: "#991b1b",
            };
        }

        if (
            normalizedStatus === "PUBLISHED"
        ) {
            return {
                backgroundColor: "#dbeafe",
                color: "#1e40af",
            };
        }

        return {
            backgroundColor: "#e5e7eb",
            color: "#374151",
        };
    };

    if (loading) {
        return (
            <div>
                <h1 style={{ color: "#111827" }}>
                    Results
                </h1>

                <p style={{ color: "#6b7280" }}>
                    Loading results...
                </p>
            </div>
        );
    }

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            color: "#111827",
                        }}
                    >
                        Results
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#6b7280",
                        }}
                    >
                        View student academic results
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadResults}
                    style={buttonStyle}
                >
                    Refresh
                </button>
            </div>

            {message && (
                <div style={errorStyle}>
                    {message}
                </div>
            )}

            <div style={tableContainerStyle}>
                {results.length === 0 ? (
                    <div style={emptyStyle}>
                        No results found.
                    </div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={{ backgroundColor: "#f9fafb" }}>
                                <th style={headerStyle}>
                                    Result ID
                                </th>

                                <th style={headerStyle}>
                                    Student ID
                                </th>

                                <th style={headerStyle}>
                                    Semester ID
                                </th>

                                <th style={headerStyle}>
                                    SGPA
                                </th>

                                <th style={headerStyle}>
                                    CGPA
                                </th>

                                <th style={headerStyle}>
                                    Status
                                </th>

                                <th style={headerStyle}>
                                    Published At
                                </th>

                                <th style={headerStyle}>
                                    Remarks
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {results.map((result) => (
                                <tr key={result.resultId}>
                                    <td style={cellStyle}>
                                        {result.resultId}
                                    </td>

                                    <td style={cellStyle}>
                                        {result.studentId}
                                    </td>

                                    <td style={cellStyle}>
                                        {result.semesterId}
                                    </td>

                                    <td style={cellStyle}>
                                        {result.sgpa}
                                    </td>

                                    <td style={cellStyle}>
                                        {result.cgpa}
                                    </td>

                                    <td style={cellStyle}>
                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    result.resultStatus
                                                ),
                                                display: "inline-block",
                                                padding: "5px 10px",
                                                borderRadius: "999px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {result.resultStatus}
                                        </span>
                                    </td>

                                    <td style={cellStyle}>
                                        {result.publishedAt
                                            ? new Date(
                                                  result.publishedAt
                                              ).toLocaleString()
                                            : "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {result.remarks || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const buttonStyle: CSSProperties = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
};

const errorStyle: CSSProperties = {
    marginTop: "20px",
    marginBottom: "20px",
    padding: "12px",
    border: "1px solid #fca5a5",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    borderRadius: "6px",
};

const tableContainerStyle: CSSProperties = {
    marginTop: "25px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflowX: "auto",
};

const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
};

const headerStyle: CSSProperties = {
    textAlign: "left",
    padding: "14px 16px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
};

const cellStyle: CSSProperties = {
    padding: "14px 16px",
    borderBottom: "1px solid #f3f4f6",
    color: "#374151",
    fontSize: "14px",
};

const emptyStyle: CSSProperties = {
    padding: "30px",
    textAlign: "center",
    color: "#6b7280",
};