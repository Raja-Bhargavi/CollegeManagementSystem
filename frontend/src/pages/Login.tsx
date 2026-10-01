import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        /*
         * IMPORTANT:
         * Remove any previous login session before
         * attempting a new login.
         *
         * This prevents an old Student JWT from being
         * reused when attempting to log in as Faculty,
         * Staff, etc.
         */
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        try {

            const response = await login({
                username,
                password,
            });

            console.log(
                "Login successful:",
                response.username
            );

            console.log(
                "User role:",
                response.role
            );

            /*
             * Make sure the backend actually returned
             * the required authentication information.
             */
            if (
                !response.token ||
                !response.username ||
                !response.role
            ) {
                throw new Error(
                    "Invalid login response from server."
                );
            }

            /*
             * Store the NEW JWT.
             */
            localStorage.setItem(
                "token",
                response.token
            );

            /*
             * Store the authenticated username.
             */
            localStorage.setItem(
                "username",
                response.username
            );

            /*
             * Store the authenticated role.
             */
            localStorage.setItem(
                "role",
                response.role
            );

            console.log(
                "JWT stored successfully"
            );

            console.log(
                "Logged in as:",
                response.username
            );

            console.log(
                "Role:",
                response.role
            );

            /*
             * Navigate according to the role returned
             * by the BACKEND.
             */
            switch (response.role) {

                case "ADMIN":
                    navigate("/admin", {
                        replace: true,
                    });
                    break;

                case "FACULTY":
                    navigate("/faculty", {
                        replace: true,
                    });
                    break;

                case "STAFF":
                    navigate("/staff", {
                        replace: true,
                    });
                    break;

                case "MANAGEMENT":
                    navigate("/management", {
                        replace: true,
                    });
                    break;

                case "STUDENT":
                    navigate("/student", {
                        replace: true,
                    });
                    break;

                default:

                    /*
                     * Unknown role should never be allowed
                     * into a protected portal.
                     */
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("role");

                    navigate("/unauthorized", {
                        replace: true,
                    });

                    break;
            }

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            /*
             * Very important:
             * If login fails, make sure an old session
             * cannot remain active.
             */
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("role");

            setError(
                "Invalid username or password."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>
                    College Management System
                </h1>

                <p className="login-subtitle">
                    Login to your account
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(
                                    event.target.value
                                )
                            }
                            placeholder="Enter username"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter password"
                            required
                        />

                    </div>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;