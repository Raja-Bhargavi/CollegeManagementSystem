
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

export default function ActivateStudent() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setMessage("");

        if (!token) {
            setMessage("The activation link is missing its token.");
            return;
        }

        if (password.length < 12 || password.length > 72) {
            setMessage("Password must contain 12–72 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/api/auth/student-activation",
                { token, password }
            );

            setMessage(
                response.data.message ??
                "Password set successfully. You can now log in."
            );

            setTimeout(() => navigate("/login"), 1500);
        } catch (error: any) {
            setMessage(
                error.response?.data?.message ??
                "Activation failed. The link may have expired or already been used."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            maxWidth: "420px",
            margin: "60px auto",
            padding: "24px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px"
        }}>
            <h1>Activate Student Account</h1>
            <p>Set a password to access your student account.</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="password">New password</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        display: "block",
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px",
                        margin: "8px 0 16px"
                    }}
                />

                <label htmlFor="confirmPassword">
                    Confirm password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                        display: "block",
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px",
                        margin: "8px 0 16px"
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "11px",
                        cursor: loading ? "wait" : "pointer"
                    }}
                >
                    {loading ? "Activating..." : "Set Password"}
                </button>
            </form>

            {message && <p role="status">{message}</p>}
        </main>
    );
}
