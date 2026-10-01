import {
    Navigate,
    Outlet,
} from "react-router-dom";

interface ProtectedRouteProps {
    allowedRoles?: string[];
    children?: React.ReactNode;
}

export default function ProtectedRoute({
    allowedRoles,
    children,
}: ProtectedRouteProps) {

    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");

    /*
     * No JWT means the user is not logged in.
     */
    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    /*
     * If this route has role restrictions,
     * verify the stored role.
     */
    if (
        allowedRoles &&
        (
            !role ||
            !allowedRoles.includes(role)
        )
    ) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    /*
     * Support both:
     *
     * <ProtectedRoute>
     *     <Component />
     * </ProtectedRoute>
     *
     * and nested routes using <Outlet />.
     */
    if (children) {

        return (
            <>
                {children}
            </>
        );
    }

    return <Outlet />;
}