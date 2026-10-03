import { useEffect, useState } from "react";

interface DashboardStats {
    students: number;
    faculty: number;
    staff: number;
    departments: number;
    courses: number;
    examinations: number;
    attendance: number;
    marks: number;
    results: number;
    fees: number;
    payments: number;
    events: number;
    notices: number;
    applications: number;
}

interface StatCardProps {
    title: string;
    value: number;
}

function StatCard({
    title,
    value,
}: StatCardProps) {
    return (
        <div className="management-stat-card">

            <div className="management-stat-card-header">

                <span className="management-stat-card-title">
                    {title}
                </span>

            </div>

            <div className="management-stat-card-value">
                {value}
            </div>

        </div>
    );
}

function ManagementDashboard() {
    const [stats, setStats] =
        useState<DashboardStats>({
            students: 0,
            faculty: 0,
            staff: 0,
            departments: 0,
            courses: 0,
            examinations: 0,
            attendance: 0,
            marks: 0,
            results: 0,
            fees: 0,
            payments: 0,
            events: 0,
            notices: 0,
            applications: 0,
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadDashboardStats =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const headers = {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    };

                    const endpoints = [
                        {
                            key: "students",
                            endpoint:
                                "/students",
                        },
                        {
                            key: "faculty",
                            endpoint:
                                "/faculty",
                        },
                        {
                            key: "staff",
                            endpoint:
                                "/staff",
                        },
                        {
                            key: "departments",
                            endpoint:
                                "/departments",
                        },
                        {
                            key: "courses",
                            endpoint:
                                "/courses",
                        },
                        {
                            key: "examinations",
                            endpoint:
                                "/examinations",
                        },
                        {
                            key: "attendance",
                            endpoint:
                                "/attendance",
                        },
                        {
                            key: "marks",
                            endpoint:
                                "/marks",
                        },
                        {
                            key: "results",
                            endpoint:
                                "/results",
                        },
                        {
                            key: "fees",
                            endpoint:
                                "/fees",
                        },
                        {
                            key: "payments",
                            endpoint:
                                "/payments",
                        },
                        {
                            key: "events",
                            endpoint:
                                "/events",
                        },
                        {
                            key: "notices",
                            endpoint:
                                "/notices",
                        },
                        {
                            key: "applications",
                            endpoint:
                                "/applications",
                        },
                    ];

                    const responses =
                        await Promise.all(
                            endpoints.map(
                                async ({
                                    endpoint,
                                }) => {
                                    const response =
                                        await fetch(
                                            `http://localhost:8080/api${endpoint}`,
                                            {
                                                method:
                                                    "GET",
                                                headers,
                                            }
                                        );

                                    if (
                                        !response.ok
                                    ) {
                                        throw new Error(
                                            `Failed to load ${endpoint}`
                                        );
                                    }

                                    return response.json();
                                }
                            )
                        );

                    const newStats =
                        {} as DashboardStats;

                    endpoints.forEach(
                        (
                            item,
                            index
                        ) => {
                            const result =
                                responses[index];

                            if (
                                Array.isArray(
                                    result
                                )
                            ) {
                                (
                                    newStats as any
                                )[item.key] =
                                    result.length;
                            } else if (
                                result &&
                                Array.isArray(
                                    result.content
                                )
                            ) {
                                (
                                    newStats as any
                                )[item.key] =
                                    result.content.length;
                            } else {
                                (
                                    newStats as any
                                )[item.key] = 0;
                            }
                        }
                    );

                    setStats(newStats);

                } catch (err: any) {
                    console.error(
                        "Management dashboard error:",
                        err
                    );

                    setError(
                        "Unable to load management dashboard information."
                    );

                } finally {
                    setLoading(false);
                }
            };

        loadDashboardStats();
    }, []);

    return (
        <div className="management-dashboard">

            {/* =========================
                DASHBOARD INTRO
            ========================= */}

            <div className="management-dashboard-intro">

                <h2>
                    Management Dashboard
                </h2>

                <p>
                    Institutional overview and
                    management information
                </p>

            </div>

            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="management-error">
                    {error}
                </div>
            )}

            {/* =========================
                STATISTICS
            ========================= */}

            {loading ? (
                <div className="management-loading">
                    Loading management
                    information...
                </div>
            ) : (
                <div className="management-stats-grid">

                    <StatCard
                        title="Students"
                        value={
                            stats.students
                        }
                    />

                    <StatCard
                        title="Faculty"
                        value={
                            stats.faculty
                        }
                    />

                    <StatCard
                        title="Staff"
                        value={
                            stats.staff
                        }
                    />

                    <StatCard
                        title="Departments"
                        value={
                            stats.departments
                        }
                    />

                    <StatCard
                        title="Courses"
                        value={
                            stats.courses
                        }
                    />

                    <StatCard
                        title="Examinations"
                        value={
                            stats.examinations
                        }
                    />

                    <StatCard
                        title="Attendance"
                        value={
                            stats.attendance
                        }
                    />

                    <StatCard
                        title="Marks"
                        value={
                            stats.marks
                        }
                    />

                    <StatCard
                        title="Results"
                        value={
                            stats.results
                        }
                    />

                    <StatCard
                        title="Fees"
                        value={
                            stats.fees
                        }
                    />

                    <StatCard
                        title="Payments"
                        value={
                            stats.payments
                        }
                    />

                    <StatCard
                        title="Events"
                        value={
                            stats.events
                        }
                    />

                    <StatCard
                        title="Notices"
                        value={
                            stats.notices
                        }
                    />

                    <StatCard
                        title="Applications"
                        value={
                            stats.applications
                        }
                    />

                </div>
            )}

            {/* =========================
                ACCESS INFORMATION
            ========================= */}

            <div className="management-access-card">

                <h3>
                    Management Access
                </h3>

                <p>
                    Management users have read
                    access to institutional
                    academic and administrative
                    information. Application
                    processing is available from
                    the Applications section.
                    Creation and deletion of
                    institutional records remain
                    restricted to the appropriate
                    administrative roles.
                </p>

            </div>

        </div>
    );
}

export default ManagementDashboard;