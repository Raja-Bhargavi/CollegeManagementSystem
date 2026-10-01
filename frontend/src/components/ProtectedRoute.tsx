import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    allowedRoles?: string[];
    children?: React.ReactNode;
}

export default function ProtectedRoute({
    allowedRoles,
    children,
}: ProtectedRouteProps) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles &&
        (!role || !allowedRoles.includes(role))
    ) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (children) {
        return <>{children}</>;
    }

    return <Outlet />;
}