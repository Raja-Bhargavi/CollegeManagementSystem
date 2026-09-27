import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {

    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");

    // User is not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Role restriction
    if (
        allowedRoles &&
        !allowedRoles.includes(role || "")
    ) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;