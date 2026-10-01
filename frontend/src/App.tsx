import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// =========================
// ADMIN PAGES
// =========================
import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import DepartmentPage from "./pages/admin/Department";
import FacultyPage from "./pages/admin/Faculty";
import StaffPage from "./pages/admin/Staff";
import Applications from "./pages/admin/Applications";
import CoursePage from "./pages/admin/Course";
import CourseOfferingPage from "./pages/admin/CourseOffering";
import AttendancePage from "./pages/admin/Attendance";
import ExaminationsPage from "./pages/admin/Examinations";
import MarksPage from "./pages/admin/Marks";
import ResultsPage from "./pages/admin/Results";
import EventsPage from "./pages/admin/Events";
import NoticesPage from "./pages/admin/Notices";
import Fees from "./pages/admin/Fees";
import Payments from "./pages/admin/Payments";
import CourseRegistrationPage from "./pages/admin/CourseRegistration";

// =========================
// STUDENT PAGES
// =========================
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";

// =========================
// OTHER ROLE DASHBOARDS
// =========================
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import ManagementDashboard from "./pages/management/ManagementDashboard";

// =========================
// COMPONENTS / LAYOUTS
// =========================
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";


function StudentComingSoon({
    title,
}: {
    title: string;
}) {
    return (
        <div>
            <h1>{title}</h1>

            <p>
                This Student Portal module will be
                connected to the backend next.
            </p>
        </div>
    );
}


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =========================
                    ADMIN
                ========================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Dashboard */}
                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    {/* Students */}
                    <Route
                        path="students"
                        element={<Students />}
                    />

                    {/* Faculty */}
                    <Route
                        path="faculty"
                        element={<FacultyPage />}
                    />

                    {/* Staff */}
                    <Route
                        path="staff"
                        element={<StaffPage />}
                    />

                    {/* Applications */}
                    <Route
                        path="applications"
                        element={<Applications />}
                    />

                    {/* Courses */}
                    <Route
                        path="courses"
                        element={<CoursePage />}
                    />

                    {/* Course Offerings */}
                    <Route
                        path="course-offerings"
                        element={<CourseOfferingPage />}
                    />

                    {/* Course Registrations */}
                    <Route
                        path="course-registrations"
                        element={
                            <CourseRegistrationPage />
                        }
                    />

                    {/* Departments */}
                    <Route
                        path="departments"
                        element={<DepartmentPage />}
                    />

                    {/* Events */}
                    <Route
                        path="events"
                        element={<EventsPage />}
                    />

                    {/* Examinations */}
                    <Route
                        path="examinations"
                        element={
                            <ExaminationsPage />
                        }
                    />

                    {/* Marks */}
                    <Route
                        path="marks"
                        element={<MarksPage />}
                    />

                    {/* Notices */}
                    <Route
                        path="notices"
                        element={<NoticesPage />}
                    />

                    {/* Fees */}
                    <Route
                        path="fees"
                        element={<Fees />}
                    />

                    {/* Payments */}
                    <Route
                        path="payments"
                        element={<Payments />}
                    />

                    {/* Results */}
                    <Route
                        path="results"
                        element={<ResultsPage />}
                    />

                    {/* Attendance */}
                    <Route
                        path="attendance"
                        element={
                            <AttendancePage />
                        }
                    />
                </Route>


                {/* =========================
                    STUDENT
                ========================= */}

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute
                            allowedRoles={["STUDENT"]}
                        >
                            <StudentLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* Student Dashboard */}
                    <Route
                        index
                        element={<StudentDashboard />}
                    />

                    {/* My Profile */}
                    <Route
                        path="profile"
                        element={<StudentProfile />}
                    />

                    {/* My Courses */}
                    <Route
                        path="courses"
                        element={
                            <StudentComingSoon
                                title="My Courses"
                            />
                        }
                    />

                    {/* My Attendance */}
                    <Route
                        path="attendance"
                        element={
                            <StudentComingSoon
                                title="My Attendance"
                            />
                        }
                    />

                    {/* My Marks */}
                    <Route
                        path="marks"
                        element={
                            <StudentComingSoon
                                title="My Marks"
                            />
                        }
                    />

                    {/* My Results */}
                    <Route
                        path="results"
                        element={
                            <StudentComingSoon
                                title="My Results"
                            />
                        }
                    />

                    {/* My Fees */}
                    <Route
                        path="fees"
                        element={
                            <StudentComingSoon
                                title="My Fees"
                            />
                        }
                    />

                    {/* My Payments */}
                    <Route
                        path="payments"
                        element={
                            <StudentComingSoon
                                title="My Payments"
                            />
                        }
                    />

                    {/* My Applications */}
                    <Route
                        path="applications"
                        element={
                            <StudentComingSoon
                                title="My Applications"
                            />
                        }
                    />

                    {/* Notices */}
                    <Route
                        path="notices"
                        element={
                            <StudentComingSoon
                                title="Notices"
                            />
                        }
                    />
                </Route>


                {/* =========================
                    FACULTY
                ========================= */}

                <Route
                    path="/faculty"
                    element={
                        <ProtectedRoute
                            allowedRoles={["FACULTY"]}
                        >
                            <FacultyDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    STAFF
                ========================= */}

                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute
                            allowedRoles={["STAFF"]}
                        >
                            <StaffDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    MANAGEMENT
                ========================= */}

                <Route
                    path="/management"
                    element={
                        <ProtectedRoute
                            allowedRoles={["MANAGEMENT"]}
                        >
                            <ManagementDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    UNAUTHORIZED
                ========================= */}

                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />


                {/* =========================
                    DEFAULT
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;