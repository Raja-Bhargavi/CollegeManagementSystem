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
import CoursePage from "./pages/admin/Course";
import CourseOfferingPage from "./pages/admin/CourseOffering";
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
                        element={
                            <div>
                                <h1>Applications Management</h1>
                            </div>
                        }
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

                    {/* Departments */} 
                    <Route 
                        path="departments" 
                        element={<DepartmentPage />}
                    />

                    {/* Events */}
                    <Route
                        path="events"
                        element={
                            <div>
                                <h1>Events Management</h1>
                            </div>
                        }
                    />

                    {/* Examinations */}
                    <Route
                        path="examinations"
                        element={
                            <div>
                                <h1>Examinations Management</h1>
                            </div>
                        }
                    />

                    {/* Notices */}
                    <Route
                        path="notices"
                        element={
                            <div>
                                <h1>Notices Management</h1>
                            </div>
                        }
                    />

                    {/* Payments */}
                    <Route
                        path="payments"
                        element={
                            <div>
                                <h1>Payments Management</h1>
                            </div>
                        }
                    />

                    {/* Results */}
                    <Route
                        path="results"
                        element={
                            <div>
                                <h1>Results Management</h1>
                            </div>
                        }
                    />

                    {/* Attendance */}
                    <Route
                        path="attendance"
                        element={
                            <div>
                                <h1>Attendance Management</h1>
                            </div>
                        }
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
