import { useEffect, useState, type CSSProperties } from "react";
import {
    getMarks,
    type Mark,
} from "../../api/markApi";

export default function StaffMarks() {
    const [marks, setMarks] = useState<Mark[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadMarks();
    }, []);

    const loadMarks = async () => {
        try {
            setLoading(true);
            setMessage("");

            const data = await getMarks();
            setMarks(data);
        } catch (error: any) {
            console.error("Failed to load staff marks:", error);

            setMessage(
                error?.response?.data?.message ||
                    "Failed to load marks."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h1 style={{ color: "#111827" }}>Marks</h1>
                <p style={{ color: "#6b7280" }}>
                    Loading marks...
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
                    marginBottom: "8px",
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            color: "#111827",
                        }}
                    >
                        Marks
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#6b7280",
                        }}
                    >
                        View student examination marks
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadMarks}
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
                {marks.length === 0 ? (
                    <div style={emptyStyle}>
                        No marks records found.
                    </div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={{ backgroundColor: "#f9fafb" }}>
                                <th style={headerStyle}>
                                    Mark ID
                                </th>
                                <th style={headerStyle}>
                                    Exam ID
                                </th>
                                <th style={headerStyle}>
                                    Exam Type
                                </th>
                                <th style={headerStyle}>
                                    Student ID
                                </th>
                                <th style={headerStyle}>
                                    Student Name
                                </th>
                                <th style={headerStyle}>
                                    Marks Obtained
                                </th>
                                <th style={headerStyle}>
                                    Remarks
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {marks.map((mark) => (
                                <tr key={mark.markId}>
                                    <td style={cellStyle}>
                                        {mark.markId}
                                    </td>

                                    <td style={cellStyle}>
                                        {mark.examId}
                                    </td>

                                    <td style={cellStyle}>
                                        {mark.examType || "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {mark.studentId}
                                    </td>

                                    <td style={cellStyle}>
                                        {mark.studentName || "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {mark.marksObtained}
                                    </td>

                                    <td style={cellStyle}>
                                        {mark.remarks || "-"}
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
    minWidth: "900px",
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