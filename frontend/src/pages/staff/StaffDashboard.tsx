import { useEffect, useState } from "react";
import api from "../../api/axios";

interface DashboardCounts {
    students: number;
    faculty: number;
    staff: number;
    applications: number;
    courses: number;
    notices: number;
}

export default function StaffDashboard() {
    const [counts, setCounts] = useState<DashboardCounts>({
        students: 0,
        faculty: 0,
        staff: 0,
        applications: 0,
        courses: 0,
        notices: 0,
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setMessage("");

                const [
                    studentsResponse,
                    facultyResponse,
                    staffResponse,
                    applicationsResponse,
                    coursesResponse,
                    noticesResponse,
                ] = await Promise.all([
                    api.get("/api/students"),
                    api.get("/api/faculty"),
                    api.get("/api/staff"),
                    api.get("/api/applications"),
                    api.get("/api/courses"),
                    api.get("/api/notices"),
                ]);

                setCounts({
                    students: Array.isArray(studentsResponse.data)
                        ? studentsResponse.data.length
                        : 0,

                    faculty: Array.isArray(facultyResponse.data)
                        ? facultyResponse.data.length
                        : 0,

                    staff: Array.isArray(staffResponse.data)
                        ? staffResponse.data.length
                        : 0,

                    applications: Array.isArray(applicationsResponse.data)
                        ? applicationsResponse.data.length
                        : 0,

                    courses: Array.isArray(coursesResponse.data)
                        ? coursesResponse.data.length
                        : 0,

                    notices: Array.isArray(noticesResponse.data)
                        ? noticesResponse.data.length
                        : 0,
                });
            } catch (error: any) {
                console.error(
                    "Failed to load Staff dashboard:",
                    error
                );

                setMessage(
                    error?.response?.data?.message ||
                        "Failed to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const cardStyle = {
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "20px",
        minHeight: "120px",
        boxSizing: "border-box" as const,
    };

    const numberStyle = {
        fontSize: "32px",
        fontWeight: "700",
        marginTop: "10px",
        color: "#111827",
    };

    if (loading) {
        return (
            <div>
                <h1>Staff Dashboard</h1>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div>
            <h1
                style={{
                    marginBottom: "8px",
                    color: "#111827",
                }}
            >
                Staff Dashboard
            </h1>

            <p
                style={{
                    color: "#6b7280",
                    marginBottom: "30px",
                }}
            >
                College Management System
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

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                }}
            >
                <div style={cardStyle}>
                    <div>Students</div>
                    <div style={numberStyle}>
                        {counts.students}
                    </div>
                </div>

                <div style={cardStyle}>
                    <div>Faculty</div>
                    <div style={numberStyle}>
                        {counts.faculty}
                    </div>
                </div>

                <div style={cardStyle}>
                    <div>Staff</div>
                    <div style={numberStyle}>
                        {counts.staff}
                    </div>
                </div>

                <div style={cardStyle}>
                    <div>Applications</div>
                    <div style={numberStyle}>
                        {counts.applications}
                    </div>
                </div>

                <div style={cardStyle}>
                    <div>Courses</div>
                    <div style={numberStyle}>
                        {counts.courses}
                    </div>
                </div>

                <div style={cardStyle}>
                    <div>Notices</div>
                    <div style={numberStyle}>
                        {counts.notices}
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: "35px",
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                }}
            >
                <h2>Staff Operations</h2>

                <p>
                    Use the sidebar to manage students, faculty,
                    applications, academic records, fees,
                    payments, events and notices.
                </p>
            </div>
        </div>
    );
}