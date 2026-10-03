import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// =========================
// VISITOR / PUBLIC
// =========================

import VisitorLayout from "./layouts/VisitorLayout";
import VisitorHome from "./pages/visitor/VisitorHome";
import VisitorAbout from "./pages/visitor/VisitorAbout";
import VisitorAcademics from "./pages/visitor/VisitorAcademics";
import VisitorDepartments from "./pages/visitor/VisitorDepartments";
import VisitorDepartmentDetails from "./pages/visitor/VisitorDepartmentDetails";
import VisitorCourses from "./pages/visitor/VisitorCourses";
import VisitorCourseDetails from "./pages/visitor/VisitorCourseDetails";
import VisitorFaculty from "./pages/visitor/VisitorFaculty";
import VisitorEvents from "./pages/visitor/VisitorEvents";
import VisitorNotices from "./pages/visitor/VisitorNotices";
import VisitorAdmissions from "./pages/visitor/VisitorAdmissions";
import VisitorContact from "./pages/visitor/VisitorContact";

// If this file already exists in your project,
// keep this import.
// If it does not exist yet, we will create it next.



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
import StaffStudents from "./pages/staff/StaffStudents";
import StaffFaculty from "./pages/staff/StaffFaculty";
import StaffApplications from "./pages/staff/StaffApplications";
import StaffDepartments from "./pages/staff/StaffDepartments";
import StaffCourses from "./pages/staff/StaffCourses";
import StaffCourseOfferings from "./pages/staff/StaffCourseOfferings";
import StaffCourseRegistrations from "./pages/staff/StaffCourseRegistrations";
import StaffExaminations from "./pages/staff/StaffExaminations";
import StaffAttendance from "./pages/staff/StaffAttendance";
import StaffMarks from "./pages/staff/StaffMarks";
import StaffResults from "./pages/staff/StaffResults";
import StaffFees from "./pages/staff/StaffFees";
import StaffPayments from "./pages/staff/StaffPayments";
import StaffEvents from "./pages/staff/StaffEvents";
import StaffNotices from "./pages/staff/StaffNotices";


// =========================
// MANAGEMENT
// =========================

import ManagementDashboard from "./pages/management/ManagementDashboard";
import ManagementProfile from "./pages/management/ManagementProfile";
import ManagementStudents from "./pages/management/ManagementStudents";
import ManagementFaculty from "./pages/management/ManagementFaculty";
import ManagementStaff from "./pages/management/ManagementStaff";
import ManagementDepartments from "./pages/management/ManagementDepartments";
import ManagementCourses from "./pages/management/ManagementCourses";
import ManagementCourseOfferings from "./pages/management/ManagementCourseOfferings";
import ManagementCourseRegistrations from "./pages/management/ManagementCourseRegistrations";
import ManagementExaminations from "./pages/management/ManagementExaminations";
import ManagementAttendance from "./pages/management/ManagementAttendance";
import ManagementMarks from "./pages/management/ManagementMarks";
import ManagementResults from "./pages/management/ManagementResults";
import ManagementFees from "./pages/management/ManagementFees";
import ManagementPayments from "./pages/management/ManagementPayments";
import ManagementEvents from "./pages/management/ManagementEvents";
import ManagementNotices from "./pages/management/ManagementNotices";
import ManagementApplications from "./pages/management/ManagementApplications";


// =========================
// COMPONENTS / LAYOUTS
// =========================

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import StaffLayout from "./layouts/StaffLayout";
import ManagementLayout from "./layouts/ManagementLayout";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =====================================================
                    PUBLIC / VISITOR PORTAL
                    ===================================================== */}

                <Route
                    element={<VisitorLayout />}
                >

                    {/* =========================
                        HOME
                    ========================= */}

                    <Route
                        path="/"
                        element={<VisitorHome />}
                    />


                    {/* =========================
                        ABOUT
                    ========================= */}

                    <Route
                        path="/about"
                        element={<VisitorAbout />}
                    />


                    {/* =================================================
                        ACADEMICS

                        Academics is the main public academic entry point.

                        Home
                          ↓
                        Academics
                          ↓
                        Departments / Programs / Courses / Faculty /
                        Academic Notices / Academic Events
                        ================================================= */}

                    <Route
                        path="/academics"
                        element={<VisitorAcademics />}
                    />


                    {/* =========================
                        DEPARTMENTS
                    ========================= */}

                    <Route
                        path="/departments"
                        element={<VisitorDepartments />}
                    />

                    <Route
                        path="/departments/:departmentId"
                        element={<VisitorDepartmentDetails />}
                    />


                    {/* =========================
                        COURSES

                        Course listing can be reached
                        from department/academic pages.

                        Course detail remains:
                        /courses/:courseId
                    ========================= */}

                    <Route
                        path="/courses"
                        element={<VisitorCourses />}
                    />

                    <Route
                        path="/courses/:courseId"
                        element={<VisitorCourseDetails />}
                    />


                    {/* =========================
                        PUBLIC FACULTY

                        IMPORTANT:
                        /faculty is reserved for the
                        authenticated Faculty portal.

                        Therefore public faculty uses:
                        /faculty-info
                    ========================= */}

                    <Route
                        path="/faculty-info"
                        element={<VisitorFaculty />}
                    />


                    {/* =========================
                        EVENTS
                    ========================= */}

                    <Route
                        path="/events"
                        element={<VisitorEvents />}
                    />


                    {/* =========================
                        NOTICES
                    ========================= */}

                    <Route
                        path="/notices"
                        element={<VisitorNotices />}
                    />


                    {/* =========================
                        ADMISSIONS
                    ========================= */}

                    <Route
                        path="/admissions"
                        element={<VisitorAdmissions />}
                    />


                    {/* =========================
                        CONTACT
                    ========================= */}

                    <Route
                        path="/contact"
                        element={<VisitorContact />}
                    />

                </Route>


                {/* =====================================================
                    LOGIN
                    ===================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =====================================================
                    ADMIN PORTAL
                    ===================================================== */}

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
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="students"
                        element={<Students />}
                    />

                    <Route
                        path="faculty"
                        element={<FacultyPage />}
                    />

                    <Route
                        path="staff"
                        element={<StaffPage />}
                    />

                    <Route
                        path="applications"
                        element={<Applications />}
                    />

                    <Route
                        path="courses"
                        element={<CoursePage />}
                    />

                    <Route
                        path="course-offerings"
                        element={<CourseOfferingPage />}
                    />

                    <Route
                        path="course-registrations"
                        element={<CourseRegistrationPage />}
                    />

                    <Route
                        path="departments"
                        element={<DepartmentPage />}
                    />

                    <Route
                        path="events"
                        element={<EventsPage />}
                    />

                    <Route
                        path="examinations"
                        element={<ExaminationsPage />}
                    />

                    <Route
                        path="marks"
                        element={<MarksPage />}
                    />

                    <Route
                        path="notices"
                        element={<NoticesPage />}
                    />

                    <Route
                        path="fees"
                        element={<Fees />}
                    />

                    <Route
                        path="payments"
                        element={<Payments />}
                    />

                    <Route
                        path="results"
                        element={<ResultsPage />}
                    />

                    <Route
                        path="attendance"
                        element={<AttendancePage />}
                    />

                </Route>


                {/* =====================================================
                    STUDENT PORTAL
                    ===================================================== */}

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
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="profile"
                        element={<StudentProfile />}
                    />

                    <Route
                        path="courses"
                        element={<StudentCourses />}
                    />

                    <Route
                        path="attendance"
                        element={<StudentAttendance />}
                    />

                    <Route
                        path="marks"
                        element={<StudentMarks />}
                    />

                    <Route
                        path="results"
                        element={<StudentResults />}
                    />

                    <Route
                        path="fees"
                        element={<StudentFees />}
                    />

                    <Route
                        path="payments"
                        element={<StudentPayments />}
                    />

                    <Route
                        path="applications"
                        element={<StudentApplications />}
                    />

                    <Route
                        path="notices"
                        element={<StudentNotices />}
                    />

                </Route>


                {/* =====================================================
                    FACULTY PORTAL

                    /faculty is PROTECTED.
                    Do not use /faculty for public faculty information.
                    ===================================================== */}

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
                        element={<FacultyDashboard />}
                    />

                    <Route
                        path="profile"
                        element={<FacultyProfile />}
                    />

                    <Route
                        path="courses"
                        element={<FacultyCourses />}
                    />

                    <Route
                        path="attendance"
                        element={<FacultyAttendance />}
                    />

                    <Route
                        path="examinations"
                        element={<FacultyExaminations />}
                    />

                    <Route
                        path="marks"
                        element={<FacultyMarks />}
                    />

                    <Route
                        path="results"
                        element={<FacultyResults />}
                    />

                    <Route
                        path="notices"
                        element={<FacultyNotices />}
                    />

                </Route>


                {/* =====================================================
                    STAFF PORTAL
                    ===================================================== */}

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
                        element={<StaffDashboard />}
                    />

                    <Route
                        path="profile"
                        element={<StaffProfile />}
                    />

                    <Route
                        path="students"
                        element={<StaffStudents />}
                    />

                    <Route
                        path="faculty"
                        element={<StaffFaculty />}
                    />

                    <Route
                        path="applications"
                        element={<StaffApplications />}
                    />

                    <Route
                        path="departments"
                        element={<StaffDepartments />}
                    />

                    <Route
                        path="courses"
                        element={<StaffCourses />}
                    />

                    <Route
                        path="course-offerings"
                        element={<StaffCourseOfferings />}
                    />

                    <Route
                        path="course-registrations"
                        element={<StaffCourseRegistrations />}
                    />

                    <Route
                        path="examinations"
                        element={<StaffExaminations />}
                    />

                    <Route
                        path="attendance"
                        element={<StaffAttendance />}
                    />

                    <Route
                        path="marks"
                        element={<StaffMarks />}
                    />

                    <Route
                        path="results"
                        element={<StaffResults />}
                    />

                    <Route
                        path="fees"
                        element={<StaffFees />}
                    />

                    <Route
                        path="payments"
                        element={<StaffPayments />}
                    />

                    <Route
                        path="events"
                        element={<StaffEvents />}
                    />

                    <Route
                        path="notices"
                        element={<StaffNotices />}
                    />

                </Route>


                {/* =====================================================
                    MANAGEMENT PORTAL
                    ===================================================== */}

                <Route
                    path="/management"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "MANAGEMENT",
                            ]}
                        >
                            <ManagementLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={<ManagementDashboard />}
                    />

                    <Route
                        path="profile"
                        element={<ManagementProfile />}
                    />

                    <Route
                        path="students"
                        element={<ManagementStudents />}
                    />

                    <Route
                        path="faculty"
                        element={<ManagementFaculty />}
                    />

                    <Route
                        path="staff"
                        element={<ManagementStaff />}
                    />

                    <Route
                        path="departments"
                        element={<ManagementDepartments />}
                    />

                    <Route
                        path="courses"
                        element={<ManagementCourses />}
                    />

                    <Route
                        path="course-offerings"
                        element={<ManagementCourseOfferings />}
                    />

                    <Route
                        path="course-registrations"
                        element={<ManagementCourseRegistrations />}
                    />

                    <Route
                        path="examinations"
                        element={<ManagementExaminations />}
                    />

                    <Route
                        path="attendance"
                        element={<ManagementAttendance />}
                    />

                    <Route
                        path="marks"
                        element={<ManagementMarks />}
                    />

                    <Route
                        path="results"
                        element={<ManagementResults />}
                    />

                    <Route
                        path="fees"
                        element={<ManagementFees />}
                    />

                    <Route
                        path="payments"
                        element={<ManagementPayments />}
                    />

                    <Route
                        path="events"
                        element={<ManagementEvents />}
                    />

                    <Route
                        path="notices"
                        element={<ManagementNotices />}
                    />

                    <Route
                        path="applications"
                        element={<ManagementApplications />}
                    />

                </Route>


                {/* =====================================================
                    UNAUTHORIZED
                    ===================================================== */}

                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />


                {/* =====================================================
                    FALLBACK

                    Unknown public URLs return to the visitor home.
                    ===================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;