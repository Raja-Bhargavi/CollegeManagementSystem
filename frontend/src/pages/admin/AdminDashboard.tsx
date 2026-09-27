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

    const username =
        localStorage.getItem("username");

    const [counts, setCounts] =
        useState<DashboardCounts>({
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

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

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

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <div>

            <header>

                <h1>
                    College Management System
                </h1>

                <div>
                    <span>
                        Welcome, {username}
                    </span>

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

            </header>

            <main>

                <h2>
                    Admin Dashboard
                </h2>

                <p>
                    Role: ADMIN
                </p>

                {loading && (
                    <p>
                        Loading dashboard data...
                    </p>
                )}

                {error && (
                    <p>
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div>

                        <div>
                            <h3>Students</h3>
                            <p>{counts.students}</p>
                        </div>

                        <div>
                            <h3>Faculty</h3>
                            <p>{counts.faculty}</p>
                        </div>

                        <div>
                            <h3>Staff</h3>
                            <p>{counts.staff}</p>
                        </div>

                        <div>
                            <h3>Applications</h3>
                            <p>{counts.applications}</p>
                        </div>

                        <div>
                            <h3>Courses</h3>
                            <p>{counts.courses}</p>
                        </div>

                        <div
                            onClick={() => navigate("/admin/course-offerings")}
                            style={{ cursor: "pointer" }}
                        >
                            <h3>Course Offerings</h3>
                            <p>{counts.courseOfferings}</p>
                        </div>

                        <div>
                            <h3>Departments</h3>
                            <p>{counts.departments}</p>
                        </div>

                        <div>
                            <h3>Events</h3>
                            <p>{counts.events}</p>
                        </div>

                        <div>
                            <h3>Examinations</h3>
                            <p>{counts.examinations}</p>
                        </div>

                        <div>
                            <h3>Notices</h3>
                            <p>{counts.notices}</p>
                        </div>

                        <div>
                            <h3>Payments</h3>
                            <p>{counts.payments}</p>
                        </div>

                        <div>
                            <h3>Results</h3>
                            <p>{counts.results}</p>
                        </div>

                        <div>
                            <h3>Attendance Records</h3>
                            <p>{counts.attendance}</p>
                        </div>

                    </div>
                )}

            </main>

        </div>
    );
}

export default AdminDashboard;