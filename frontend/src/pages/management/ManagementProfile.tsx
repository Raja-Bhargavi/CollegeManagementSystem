import React, { useEffect, useState } from "react";
import axios from "axios";

interface ManagementProfileData {
    managementId?: number;
    userId?: number;
    employeeNumber?: string;
    firstName?: string;
    lastName?: string;
    designation?: string;
}

const ManagementProfile: React.FC = () => {
    const [profile, setProfile] =
        useState<ManagementProfileData>({});

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] =
        useState<ManagementProfileData>({});

    const getConfig = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem(
                "token"
            )}`,
        },
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/management/me",
                    getConfig()
                );

                setProfile(response.data);
                setForm(response.data);
            } catch (err) {
                console.error(
                    "Failed to load management profile:",
                    err
                );

                setError(
                    "Unable to load your management profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement
        >
    ) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const response = await axios.put(
                "http://localhost:8080/api/management/me",
                {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    designation: form.designation,
                },
                getConfig()
            );

            setProfile(response.data);
            setForm(response.data);

            setMessage(
                "Profile updated successfully."
            );
        } catch (err) {
            console.error(
                "Failed to update management profile:",
                err
            );

            setError(
                "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center",
                }}
            >
                Loading profile...
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "24px",
                backgroundColor: "#f5f7fb",
                minHeight: "calc(100vh - 64px)",
            }}
        >
            <h1
                style={{
                    marginTop: 0,
                    color: "#1f2937",
                }}
            >
                My Profile
            </h1>

            <p
                style={{
                    color: "#6b7280",
                }}
            >
                View and update your management profile.
            </p>

            {message && (
                <div
                    style={{
                        padding: "12px 15px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                    }}
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: "12px 15px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                    }}
                >
                    {error}
                </div>
            )}

            <div
                style={{
                    maxWidth: "700px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "25px",
                    border: "1px solid #e5e7eb",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "18px",
                        marginBottom: "20px",
                    }}
                >
                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#374151",
                            }}
                        >
                            Employee Number
                        </label>

                        <input
                            value={
                                profile.employeeNumber ??
                                ""
                            }
                            disabled
                            style={{
                                width: "100%",
                                boxSizing:
                                    "border-box",
                                padding: "11px",
                                border:
                                    "1px solid #d1d5db",
                                borderRadius: "7px",
                                backgroundColor:
                                    "#f3f4f6",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#374151",
                            }}
                        >
                            User ID
                        </label>

                        <input
                            value={
                                profile.userId ?? ""
                            }
                            disabled
                            style={{
                                width: "100%",
                                boxSizing:
                                    "border-box",
                                padding: "11px",
                                border:
                                    "1px solid #d1d5db",
                                borderRadius: "7px",
                                backgroundColor:
                                    "#f3f4f6",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#374151",
                            }}
                        >
                            First Name
                        </label>

                        <input
                            name="firstName"
                            value={
                                form.firstName ?? ""
                            }
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                boxSizing:
                                    "border-box",
                                padding: "11px",
                                border:
                                    "1px solid #d1d5db",
                                borderRadius: "7px",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#374151",
                            }}
                        >
                            Last Name
                        </label>

                        <input
                            name="lastName"
                            value={
                                form.lastName ?? ""
                            }
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                boxSizing:
                                    "border-box",
                                padding: "11px",
                                border:
                                    "1px solid #d1d5db",
                                borderRadius: "7px",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            gridColumn:
                                "1 / -1",
                        }}
                    >
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#374151",
                            }}
                        >
                            Designation
                        </label>

                        <input
                            name="designation"
                            value={
                                form.designation ??
                                ""
                            }
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                boxSizing:
                                    "border-box",
                                padding: "11px",
                                border:
                                    "1px solid #d1d5db",
                                borderRadius: "7px",
                            }}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                        padding: "11px 22px",
                        border: "none",
                        borderRadius: "7px",
                        backgroundColor:
                            saving
                                ? "#9ca3af"
                                : "#2563eb",
                        color: "#ffffff",
                        cursor: saving
                            ? "not-allowed"
                            : "pointer",
                        fontWeight: 600,
                    }}
                >
                    {saving
                        ? "Saving..."
                        : "Update Profile"}
                </button>
            </div>
        </div>
    );
};

export default ManagementProfile;