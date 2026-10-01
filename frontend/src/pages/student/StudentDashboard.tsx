import { Link } from "react-router-dom";

export default function StudentDashboard() {
    const username =
        localStorage.getItem("username");

    return (
        <div>
            <h1>Student Dashboard</h1>

            <h3>
                Welcome, {username || "Student"}
            </h3>

            <p>
                Use the menu to access your academic
                information.
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(3, 1fr)",
                    gap: "20px",
                    marginTop: "30px",
                }}
            >
                <Link
                    to="/student/profile"
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "#222",
                    }}
                >
                    <h3>My Profile</h3>
                    <p>View your student information.</p>
                </Link>

                <Link
                    to="/student/courses"
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "#222",
                    }}
                >
                    <h3>My Courses</h3>
                    <p>View your registered courses.</p>
                </Link>

                <Link
                    to="/student/attendance"
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "#222",
                    }}
                >
                    <h3>Attendance</h3>
                    <p>View your attendance records.</p>
                </Link>

                <Link
                    to="/student/marks"
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "#222",
                    }}
                >
                    <h3>Marks</h3>
                    <p>View your examination marks.</p>
                </Link>

                <Link
                    to="/student/results"
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "#222",
                    }}
                >
                    <h3>Results</h3>
                    <p>View your semester results.</p>
                </Link>

                <Link
                    to="/student/fees"
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "#222",
                    }}
                >
                    <h3>Fees</h3>
                    <p>View your fee information.</p>
                </Link>
            </div>
        </div>
    );
}