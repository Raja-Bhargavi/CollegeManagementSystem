import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// =========================
// ADMIN
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
// STUDENT
// =========================

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentCourses from "./pages/student/StudentCourses";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentMarks from "./pages/student/StudentMarks";
import StudentResults from "./pages/student/StudentResults";
import StudentFees from "./pages/student/StudentFees";
import StudentPayments from "./pages/student/StudentPayments";
import StudentApplications from "./pages/student/StudentApplications";
import StudentNotices from "./pages/student/StudentNotices";

// =========================
// FACULTY
// =========================

import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyProfile from "./pages/faculty/FacultyProfile";
import FacultyCourses from "./pages/faculty/FacultyCourses";
import FacultyAttendance from "./pages/faculty/FacultyAttendance";
import FacultyExaminations from "./pages/faculty/FacultyExaminations";
import FacultyMarks from "./pages/faculty/FacultyMarks";
import FacultyResults from "./pages/faculty/FacultyResults";
import FacultyNotices from "./pages/faculty/FacultyNotices";

// =========================
// STAFF
// =========================

import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffProfile from "./pages/staff/StaffProfile";

// =========================
// MANAGEMENT
// =========================

import ManagementDashboard from "./pages/management/ManagementDashboard";

// =========================
// COMPONENTS / LAYOUTS
// =========================

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import StaffLayout from "./layouts/StaffLayout";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                {/* =========================
                    ADMIN
                ========================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                            ]}
                        >
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={
                            <AdminDashboard />
                        }
                    />

                    <Route
                        path="students"
                        element={
                            <Students />
                        }
                    />

                    <Route
                        path="faculty"
                        element={
                            <FacultyPage />
                        }
                    />

                    <Route
                        path="staff"
                        element={
                            <StaffPage />
                        }
                    />

                    <Route
                        path="applications"
                        element={
                            <Applications />
                        }
                    />

                    <Route
                        path="courses"
                        element={
                            <CoursePage />
                        }
                    />

                    <Route
                        path="course-offerings"
                        element={
                            <CourseOfferingPage />
                        }
                    />

                    <Route
                        path="course-registrations"
                        element={
                            <CourseRegistrationPage />
                        }
                    />

                    <Route
                        path="departments"
                        element={
                            <DepartmentPage />
                        }
                    />

                    <Route
                        path="events"
                        element={
                            <EventsPage />
                        }
                    />

                    <Route
                        path="examinations"
                        element={
                            <ExaminationsPage />
                        }
                    />

                    <Route
                        path="marks"
                        element={
                            <MarksPage />
                        }
                    />

                    <Route
                        path="notices"
                        element={
                            <NoticesPage />
                        }
                    />

                    <Route
                        path="fees"
                        element={
                            <Fees />
                        }
                    />

                    <Route
                        path="payments"
                        element={
                            <Payments />
                        }
                    />

                    <Route
                        path="results"
                        element={
                            <ResultsPage />
                        }
                    />

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
                            allowedRoles={[
                                "STUDENT",
                            ]}
                        >
                            <StudentLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={
                            <StudentDashboard />
                        }
                    />

                    <Route
                        path="profile"
                        element={
                            <StudentProfile />
                        }
                    />

                    <Route
                        path="courses"
                        element={
                            <StudentCourses />
                        }
                    />

                    <Route
                        path="attendance"
                        element={
                            <StudentAttendance />
                        }
                    />

                    <Route
                        path="marks"
                        element={
                            <StudentMarks />
                        }
                    />

                    <Route
                        path="results"
                        element={
                            <StudentResults />
                        }
                    />

                    <Route
                        path="fees"
                        element={
                            <StudentFees />
                        }
                    />

                    <Route
                        path="payments"
                        element={
                            <StudentPayments />
                        }
                    />

                    <Route
                        path="applications"
                        element={
                            <StudentApplications />
                        }
                    />

                    <Route
                        path="notices"
                        element={
                            <StudentNotices />
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
                            allowedRoles={[
                                "FACULTY",
                            ]}
                        >
                            <FacultyLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={
                            <FacultyDashboard />
                        }
                    />

                    <Route
                        path="profile"
                        element={
                            <FacultyProfile />
                        }
                    />

                    <Route
                        path="courses"
                        element={
                            <FacultyCourses />
                        }
                    />

                    <Route
                        path="attendance"
                        element={
                            <FacultyAttendance />
                        }
                    />

                    <Route
                        path="examinations"
                        element={
                            <FacultyExaminations />
                        }
                    />

                    <Route
                        path="marks"
                        element={
                            <FacultyMarks />
                        }
                    />

                    <Route
                        path="results"
                        element={
                            <FacultyResults />
                        }
                    />

                    <Route
                        path="notices"
                        element={
                            <FacultyNotices />
                        }
                    />

                </Route>


                {/* =========================
                    STAFF
                ========================= */}

                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "STAFF",
                            ]}
                        >
                            <StaffLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={
                            <StaffDashboard />
                        }
                    />

                    <Route
                        path="profile"
                        element={
                            <StaffProfile />
                        }
                    />

                    <Route
                        path="students"
                        element={
                            <Students />
                        }
                    />

                    <Route
                        path="faculty"
                        element={
                            <FacultyPage />
                        }
                    />

                    <Route
                        path="applications"
                        element={
                            <Applications />
                        }
                    />

                    <Route
                        path="departments"
                        element={
                            <DepartmentPage />
                        }
                    />

                    <Route
                        path="courses"
                        element={
                            <CoursePage />
                        }
                    />

                    <Route
                        path="course-offerings"
                        element={
                            <CourseOfferingPage />
                        }
                    />

                    <Route
                        path="course-registrations"
                        element={
                            <CourseRegistrationPage />
                        }
                    />

                    <Route
                        path="attendance"
                        element={
                            <AttendancePage />
                        }
                    />

                    <Route
                        path="examinations"
                        element={
                            <ExaminationsPage />
                        }
                    />

                    <Route
                        path="marks"
                        element={
                            <MarksPage />
                        }
                    />

                    <Route
                        path="results"
                        element={
                            <ResultsPage />
                        }
                    />

                    <Route
                        path="fees"
                        element={
                            <Fees />
                        }
                    />

                    <Route
                        path="payments"
                        element={
                            <Payments />
                        }
                    />

                    <Route
                        path="events"
                        element={
                            <EventsPage />
                        }
                    />

                    <Route
                        path="notices"
                        element={
                            <NoticesPage />
                        }
                    />

                </Route>


                {/* =========================
                    MANAGEMENT
                ========================= */}

                <Route
                    path="/management"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "MANAGEMENT",
                            ]}
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
                    element={
                        <Unauthorized />
                    }
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