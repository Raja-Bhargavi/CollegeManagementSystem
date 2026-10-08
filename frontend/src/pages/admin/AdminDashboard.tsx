import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getStudents,
    getFaculty,
    getStaff,
    getApplications,
    getCourses,
    getDepartments,
    getEvents,
    getExaminations,
    getNotices,
    getPayments,
    getResults,
    getAttendance,
} from "../../api/adminApi";

import {
    getCourseOfferings,
} from "../../api/courseOfferingApi";

interface DashboardCounts {
    students: number;
    faculty: number;
    staff: number;
    applications: number;
    courses: number;
    courseOfferings: number;
    departments: number;
    events: number;
    examinations: number;
    notices: number;
    payments: number;
    results: number;
    attendance: number;
}

function AdminDashboard() {
    const navigate = useNavigate();

    const [counts, setCounts] = useState<DashboardCounts>({
        students: 0,
        faculty: 0,
        staff: 0,
        applications: 0,
        courses: 0,
        courseOfferings: 0,
        departments: 0,
        events: 0,
        examinations: 0,
        notices: 0,
        payments: 0,
        results: 0,
        attendance: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    students,
                    faculty,
                    staff,
                    applications,
                    courses,
                    courseOfferings,
                    departments,
                    events,
                    examinations,
                    notices,
                    payments,
                    results,
                    attendance,
                ] = await Promise.all([
                    getStudents(),
                    getFaculty(),
                    getStaff(),
                    getApplications(),
                    getCourses(),
                    getCourseOfferings(),
                    getDepartments(),
                    getEvents(),
                    getExaminations(),
                    getNotices(),
                    getPayments(),
                    getResults(),
                    getAttendance(),
                ]);

                setCounts({
                    students: students.length,
                    faculty: faculty.length,
                    staff: staff.length,
                    applications: applications.length,
                    courses: courses.length,
                    courseOfferings: courseOfferings.length,
                    departments: departments.length,
                    events: events.length,
                    examinations: examinations.length,
                    notices: notices.length,
                    payments: payments.length,
                    results: results.length,
                    attendance: attendance.length,
                });
            } catch (error) {
                console.error(
                    "Dashboard loading failed:",
                    error
                );

                setError(
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const dashboardCards = [
        {
            title: "Students",
            value: counts.students,
        },
        {
            title: "Faculty",
            value: counts.faculty,
        },
        {
            title: "Staff",
            value: counts.staff,
        },
        {
            title: "Applications",
            value: counts.applications,
        },
        {
            title: "Courses",
            value: counts.courses,
        },
        {
            title: "Course Offerings",
            value: counts.courseOfferings,
            clickable: true,
            onClick: () =>
                navigate("/admin/course-offerings"),
        },
        {
            title: "Departments",
            value: counts.departments,
        },
        {
            title: "Events",
            value: counts.events,
        },
        {
            title: "Examinations",
            value: counts.examinations,
        },
        {
            title: "Notices",
            value: counts.notices,
        },
        {
            title: "Payments",
            value: counts.payments,
        },
        {
            title: "Results",
            value: counts.results,
        },
        {
            title: "Attendance",
            value: counts.attendance,
        },
    ];

    return (
        <div
            style={{
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    marginBottom: "22px",
                }}
            >
                <h1
                    style={{
                        margin: "0",
                        fontSize: "30px",
                        fontWeight: "700",
                        color: "#111827",
                    }}
                >
                    Admin Dashboard
                </h1>

                <p
                    style={{
                        margin: "10px 0 0",
                        fontSize: "16px",
                        color: "#64748b",
                    }}
                >
                    College Management System
                </p>
            </div>

            {loading && (
                <div
                    style={{
                        padding: "20px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        color: "#334155",
                    }}
                >
                    Loading dashboard data...
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: "14px 18px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        color: "#b91c1c",
                    }}
                >
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(6, minmax(0, 1fr))",
                        gap: "16px",
                    }}
                >
                    {dashboardCards.map((card) => (
                        <div
                            key={card.title}
                            onClick={
                                card.clickable
                                    ? card.onClick
                                    : undefined
                            }
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "10px",
                                padding: "18px",
                                minHeight: "100px",
                                boxSizing: "border-box",
                                cursor: card.clickable
                                    ? "pointer"
                                    : "default",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "#111827",
                                    marginBottom: "10px",
                                }}
                            >
                                {card.title}
                            </div>

                            <div
                                style={{
                                    fontSize: "28px",
                                    fontWeight: "700",
                                    lineHeight: "1",
                                    color: "#111827",
                                }}
                            >
                                {card.value}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;