import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number;
    description: string | null;
}

export default function StaffCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await api.get<Course[]>(
                "/api/courses"
            );

            setCourses(response.data);
        } catch (error: any) {
            console.error("Failed to load courses:", error);

            setMessage(
                error?.response?.data?.message ||
                    "Failed to load courses."
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
                Courses
            </h1>

            <p
                style={{
                    color: "#6b7280",
                    marginBottom: "25px",
                }}
            >
                View available college courses
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
                <p>Loading courses...</p>
            ) : courses.length === 0 ? (
                <div
                    style={{
                        padding: "20px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                    }}
                >
                    No courses found.
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
                                <th style={thStyle}>Course Code</th>
                                <th style={thStyle}>Course Name</th>
                                <th style={thStyle}>Credits</th>
                                <th style={thStyle}>Description</th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.courseId}>
                                    <td style={tdStyle}>
                                        {course.courseId}
                                    </td>

                                    <td style={tdStyle}>
                                        {course.courseCode}
                                    </td>

                                    <td style={tdStyle}>
                                        {course.courseName}
                                    </td>

                                    <td style={tdStyle}>
                                        {course.credits}
                                    </td>

                                    <td style={tdStyle}>
                                        {course.description || "-"}
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