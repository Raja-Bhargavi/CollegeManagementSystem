import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Department {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
    description: string | null;
}

export default function StaffDepartments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await api.get<Department[]>(
                "/api/departments"
            );

            setDepartments(response.data);
        } catch (error: any) {
            console.error("Failed to load departments:", error);

            setMessage(
                error?.response?.data?.message ||
                    "Failed to load departments."
            );
        } finally {
            setLoading(false);
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
                Departments
            </h1>

            <p
                style={{
                    color: "#6b7280",
                    marginBottom: "25px",
                }}
            >
                View college departments
            </p>

            {message && (
                <div
                    style={{
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

            {loading ? (
                <p>Loading departments...</p>
            ) : departments.length === 0 ? (
                <div
                    style={{
                        padding: "20px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                    }}
                >
                    No departments found.
                </div>
            ) : (
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        overflow: "hidden",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    backgroundColor: "#f3f4f6",
                                }}
                            >
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Code</th>
                                <th style={thStyle}>Department Name</th>
                                <th style={thStyle}>Description</th>
                            </tr>
                        </thead>

                        <tbody>
                            {departments.map((department) => (
                                <tr key={department.departmentId}>
                                    <td style={tdStyle}>
                                        {department.departmentId}
                                    </td>

                                    <td style={tdStyle}>
                                        {department.departmentCode}
                                    </td>

                                    <td style={tdStyle}>
                                        {department.departmentName}
                                    </td>

                                    <td style={tdStyle}>
                                        {department.description || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const thStyle: React.CSSProperties = {
    padding: "14px",
    textAlign: "left",
    borderBottom: "1px solid #d1d5db",
    fontWeight: 600,
    color: "#111827",
};

const tdStyle: React.CSSProperties = {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
};