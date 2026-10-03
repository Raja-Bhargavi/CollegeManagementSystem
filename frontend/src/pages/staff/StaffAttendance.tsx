import { useEffect, useState, type CSSProperties } from "react";
import {
    getAttendance,
    type Attendance,
} from "../../api/attendanceApi";

export default function StaffAttendance() {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        try {
            setLoading(true);
            setMessage("");

            const data = await getAttendance();
            setAttendance(data);
        } catch (error: any) {
            console.error("Failed to load staff attendance:", error);

            setMessage(
                error?.response?.data?.message ||
                    "Failed to load attendance records."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        const normalizedStatus = status.toUpperCase();

        if (
            normalizedStatus === "PRESENT" ||
            normalizedStatus === "P"
        ) {
            return {
                backgroundColor: "#dcfce7",
                color: "#166534",
            };
        }

        if (
            normalizedStatus === "ABSENT" ||
            normalizedStatus === "A"
        ) {
            return {
                backgroundColor: "#fee2e2",
                color: "#991b1b",
            };
        }

        if (
            normalizedStatus === "LATE" ||
            normalizedStatus === "L"
        ) {
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
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
                <h1
                    style={{
                        marginBottom: "8px",
                        color: "#111827",
                    }}
                >
                    Attendance
                </h1>

                <p style={{ color: "#6b7280" }}>
                    Loading attendance records...
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
                        Attendance
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#6b7280",
                        }}
                    >
                        View student attendance records
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadAttendance}
                    style={{
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#111827",
                        color: "#ffffff",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    Refresh
                </button>
            </div>

            {message && (
                <div
                    style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        padding: "12px",
                        border: "1px solid #fca5a5",
                        backgroundColor: "#fef2f2",
                        color: "#991b1b",
                        borderRadius: "6px",
                    }}
                >
                    {message}
                </div>
            )}

            <div
                style={{
                    marginTop: "25px",
                    marginBottom: "20px",
                    padding: "15px 18px",
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#374151",
                }}
            >
                Attendance records are view-only for Staff.
            </div>

            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    overflowX: "auto",
                }}
            >
                {attendance.length === 0 ? (
                    <div
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "#6b7280",
                        }}
                    >
                        No attendance records found.
                    </div>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "800px",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    backgroundColor: "#f9fafb",
                                }}
                            >
                                <th style={headerStyle}>
                                    Attendance ID
                                </th>

                                <th style={headerStyle}>
                                    Registration ID
                                </th>

                                <th style={headerStyle}>
                                    Attendance Date
                                </th>

                                <th style={headerStyle}>
                                    Status
                                </th>

                                <th style={headerStyle}>
                                    Marked By
                                </th>

                                <th style={headerStyle}>
                                    Marked At
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {attendance.map((record) => (
                                <tr key={record.attendanceId}>
                                    <td style={cellStyle}>
                                        {record.attendanceId}
                                    </td>

                                    <td style={cellStyle}>
                                        {record.registrationId}
                                    </td>

                                    <td style={cellStyle}>
                                        {record.attendanceDate}
                                    </td>

                                    <td style={cellStyle}>
                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    record.status
                                                ),
                                                display: "inline-block",
                                                padding: "5px 10px",
                                                borderRadius: "999px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {record.status}
                                        </span>
                                    </td>

                                    <td style={cellStyle}>
                                        {record.markedBy}
                                    </td>

                                    <td style={cellStyle}>
                                        {record.markedAt
                                            ? new Date(
                                                  record.markedAt
                                              ).toLocaleString()
                                            : "-"}
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
