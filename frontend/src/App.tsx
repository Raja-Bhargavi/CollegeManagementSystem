import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Admin */}
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

                    {/* Course Registration */} 
                    <Route 
                        path="course-registrations" 
                        element={<CourseRegistrationPage />} 
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
                        element={<ExaminationsPage />}
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
                        path="/admin/fees"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <Fees />
                            </ProtectedRoute>
                        }
                        />

                    {/* Payments */}
                    <Route
                        path="/admin/payments"
                        element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <Payments />
                        </ProtectedRoute>
                    }
                    />

                    {/* Results */}
                    <Route
                        path="results"
                        element={<ResultsPage />}
                    />

                    {/* Attendance */}
                    <Route
                        path="attendance"
                        element={<AttendancePage />}
                    />

                </Route>

                {/* Unauthorized */}
                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />

                {/* Default */}
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
