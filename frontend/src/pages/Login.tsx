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

        try {
            const response = await login({
                username,
                password,
            });

            console.log("Login successful:", response);
            console.log("User role:", response.role);

            // Store JWT
            localStorage.setItem(
                "token",
                response.token
            );

            // Store username
            localStorage.setItem(
                "username",
                response.username
            );

            // Store role
            localStorage.setItem(
                "role",
                response.role
            );

            console.log("JWT stored successfully");
            console.log(
                "Logged in as:",
                response.username
            );
            console.log(
                "Role:",
                response.role
            );

            // Role-based navigation
            switch (response.role) {
                case "ADMIN":
                    navigate("/admin");
                    break;

                case "FACULTY":
                    navigate("/faculty");
                    break;

                case "STAFF":
                    navigate("/staff");
                    break;

                case "MANAGEMENT":
                    navigate("/management");
                    break;

                case "STUDENT":
                    navigate("/student");
                    break;

                default:
                    navigate("/unauthorized");
                    break;
            }
        } catch (error) {
            console.error(
                "Login failed:",
                error
            );

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