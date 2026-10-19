import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

type RecoveryMode = "username" | "password" | "reset";

export default function AccountRecovery() {
    const location = useLocation();
    const navigate = useNavigate();

    const mode: RecoveryMode =
        location.pathname === "/reset-password"
            ? "reset"
            : location.pathname === "/forgot-username"
              ? "username"
              : "password";

    const queryToken = new URLSearchParams(location.search).get("token") ?? "";

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            if (mode === "reset") {
                if (!queryToken) {
                    throw new Error("The reset link is missing its token.");
                }

                if (newPassword.length < 8 || newPassword.length > 128) {
                    throw new Error(
                        "Your password must contain between 8 and 128 characters."
                    );
                }

                if (newPassword !== confirmPassword) {
                    throw new Error("The passwords do not match.");
                }

                const response = await api.post("/api/auth/reset-password", {
                    token: queryToken,
                    newPassword,
                });

                setMessage(
                    response.data?.message ||
                    "Password reset successfully. You can now log in."
                );
                setNewPassword("");
                setConfirmPassword("");
                return;
            }

            const endpoint =
                mode === "username"
                    ? "/api/auth/forgot-username"
                    : "/api/auth/forgot-password";

            const response = await api.post(endpoint, { email });

            setMessage(
                response.data?.message ||
                "If an account matches that email address, instructions will be sent shortly."
            );
            setEmail("");
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message ||
                "The request could not be completed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const heading =
        mode === "username"
            ? "Forgot Username"
            : mode === "password"
              ? "Forgot Password"
              : "Reset Password";

    return (
        <main className="login-container">
            <section className="login-card">
                <h1>{heading}</h1>

                <p className="login-subtitle">
                    {mode === "username"
                        ? "Enter your registered email to receive your username."
                        : mode === "password"
                          ? "Enter your registered email to receive a password reset link."
                          : "Choose a new password for your account."}
                </p>

                <form onSubmit={handleSubmit}>
                    {mode !== "reset" ? (
                        <div className="form-group">
                            <label htmlFor="recovery-email">
                                Registered email address
                            </label>
                            <input
                                id="recovery-email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Enter your registered email"
                                required
                            />
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label htmlFor="new-password">
                                    New password
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    maxLength={128}
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm-password">
                                    Confirm new password
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    maxLength={128}
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    required
                                />
                            </div>
                        </>
                    )}

                    {message && (
                        <p role="status" className="success-message">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p role="alert" className="error-message">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Please wait..."
                            : mode === "username"
                              ? "Recover Username"
                              : mode === "password"
                                ? "Send Reset Link"
                                : "Reset Password"}
                    </button>
                </form>

                <p>
                    <Link to="/login">Back to Login</Link>
                </p>

                {mode !== "reset" && (
                    <p>
                        {mode === "username" ? (
                            <Link to="/forgot-password">
                                Forgot your password?
                            </Link>
                        ) : (
                            <Link to="/forgot-username">
                                Forgot your username?
                            </Link>
                        )}
                    </p>
                )}

                {mode === "reset" && message && (
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Return to Login
                    </button>
                )}
            </section>
        </main>
    );
}
