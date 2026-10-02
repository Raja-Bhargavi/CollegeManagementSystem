import { useEffect, useState } from "react";
import api from "../../api/axios";

interface FacultyProfileData {
    facultyId: number;
    userId: number;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    designation?: string | null;
    departmentId?: number | null;
    joiningDate?: string | null;
    facultyStatus?: string | null;
}

export default function FacultyProfile() {

    const [profile, setProfile] =
        useState<FacultyProfileData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [editing, setEditing] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    // =========================================================
    // LOAD PROFILE
    // =========================================================

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/api/faculty/me");

            const data =
                response.data;

            setProfile(data);

            setForm({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                phone: data.phone || "",
            });

        } catch (err) {

            console.error(
                "Failed to load faculty profile:",
                err
            );

            setError(
                "Failed to load faculty profile."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        loadProfile();

    }, []);

    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } =
            event.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = () => {

        if (!profile) {
            return;
        }

        setForm({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            email: profile.email || "",
            phone: profile.phone || "",
        });

        setSuccess("");
        setError("");
        setEditing(true);
    };

    // =========================================================
    // CANCEL
    // =========================================================

    const handleCancel = () => {

        if (profile) {

            setForm({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || "",
                phone: profile.phone || "",
            });
        }

        setError("");
        setSuccess("");
        setEditing(false);
    };

    // =========================================================
    // SAVE PROFILE
    // =========================================================

    const handleSave = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const response =
                await api.put(
                    "/api/faculty/me",
                    {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email,
                        phone: form.phone,
                    }
                );

            setProfile(response.data);

            setForm({
                firstName:
                    response.data.firstName || "",

                lastName:
                    response.data.lastName || "",

                email:
                    response.data.email || "",

                phone:
                    response.data.phone || "",
            });

            setEditing(false);

            setSuccess(
                "Profile updated successfully."
            );

        } catch (err: any) {

            console.error(
                "Failed to update faculty profile:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Failed to update profile.";

            setError(message);

        } finally {

            setSaving(false);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <p>
                Loading profile...
            </p>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error && !profile) {

        return (
            <div>

                <h1>
                    My Profile
                </h1>

                <p
                    style={{
                        color: "red",
                        backgroundColor: "#fee2e2",
                        padding: "12px",
                        borderRadius: "6px",
                    }}
                >
                    {error}
                </p>

            </div>
        );
    }

    if (!profile) {
        return (
            <p>
                No profile found.
            </p>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >

                <h1>
                    My Profile
                </h1>

                {!editing && (
                    <button
                        type="button"
                        onClick={handleEdit}
                        style={{
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#1f2937",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Edit Profile
                    </button>
                )}

            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {success && (
                <div
                    style={{
                        marginTop: "15px",
                        padding: "12px",
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        borderRadius: "6px",
                    }}
                >
                    {success}
                </div>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
                <div
                    style={{
                        marginTop: "15px",
                        padding: "12px",
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        borderRadius: "6px",
                    }}
                >
                    {error}
                </div>
            )}

            <div
                style={{
                    backgroundColor: "white",
                    padding: "25px",
                    borderRadius: "8px",
                    marginTop: "20px",
                    boxShadow:
                        "0 1px 4px rgba(0,0,0,0.08)",
                }}
            >

                {!editing ? (

                    // =================================================
                    // VIEW MODE
                    // =================================================

                    <div>

                        <ProfileRow
                            label="Faculty ID"
                            value={profile.facultyId}
                        />

                        <ProfileRow
                            label="Employee Number"
                            value={profile.employeeNumber}
                        />

                        <ProfileRow
                            label="First Name"
                            value={profile.firstName}
                        />

                        <ProfileRow
                            label="Last Name"
                            value={
                                profile.lastName || "N/A"
                            }
                        />

                        <ProfileRow
                            label="Email"
                            value={
                                profile.email || "N/A"
                            }
                        />

                        <ProfileRow
                            label="Phone"
                            value={
                                profile.phone || "N/A"
                            }
                        />

                        <ProfileRow
                            label="Department ID"
                            value={
                                profile.departmentId ??
                                "N/A"
                            }
                        />

                        <ProfileRow
                            label="Designation"
                            value={
                                profile.designation ||
                                "N/A"
                            }
                        />

                        <ProfileRow
                            label="Joining Date"
                            value={
                                profile.joiningDate ||
                                "N/A"
                            }
                        />

                        <ProfileRow
                            label="Status"
                            value={
                                profile.facultyStatus ||
                                "N/A"
                            }
                        />

                    </div>

                ) : (

                    // =================================================
                    // EDIT MODE
                    // =================================================

                    <form
                        onSubmit={handleSave}
                    >

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                gap: "20px",
                            }}
                        >

                            <FormField
                                label="First Name"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />

                            <FormField
                                label="Last Name"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                            />

                            <FormField
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                            <FormField
                                label="Phone"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                            />

                        </div>

                        {/* =================================================
                            READ ONLY INFORMATION
                        ================================================= */}

                        <div
                            style={{
                                marginTop: "25px",
                                padding: "15px",
                                backgroundColor: "#f8fafc",
                                borderRadius: "6px",
                            }}
                        >

                            <p
                                style={{
                                    fontWeight: "bold",
                                    marginBottom: "12px",
                                }}
                            >
                                Administrative Information
                            </p>

                            <p>
                                <strong>
                                    Faculty ID:
                                </strong>{" "}
                                {profile.facultyId}
                            </p>

                            <p>
                                <strong>
                                    Employee Number:
                                </strong>{" "}
                                {profile.employeeNumber}
                            </p>

                            <p>
                                <strong>
                                    Department ID:
                                </strong>{" "}
                                {profile.departmentId ??
                                    "N/A"}
                            </p>

                            <p>
                                <strong>
                                    Designation:
                                </strong>{" "}
                                {profile.designation ||
                                    "N/A"}
                            </p>

                            <p>
                                <strong>
                                    Joining Date:
                                </strong>{" "}
                                {profile.joiningDate ||
                                    "N/A"}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}
                                {profile.facultyStatus ||
                                    "N/A"}
                            </p>

                        </div>

                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                marginTop: "25px",
                            }}
                        >

                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding:
                                        "10px 20px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor:
                                        "#16a34a",
                                    color: "white",
                                    cursor:
                                        saving
                                            ? "not-allowed"
                                            : "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                style={{
                                    padding:
                                        "10px 20px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor:
                                        "#6b7280",
                                    color: "white",
                                    cursor:
                                        saving
                                            ? "not-allowed"
                                            : "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
}

// =============================================================
// PROFILE ROW
// =============================================================

interface ProfileRowProps {
    label: string;
    value: string | number;
}

function ProfileRow({
    label,
    value,
}: ProfileRowProps) {

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "200px 1fr",
                padding: "12px 0",
                borderBottom:
                    "1px solid #e5e7eb",
            }}
        >

            <strong>
                {label}:
            </strong>

            <span>
                {value}
            </span>

        </div>
    );
}

// =============================================================
// FORM FIELD
// =============================================================

interface FormFieldProps {
    label: string;
    name: string;
    value: string;
    type?: string;
    required?: boolean;
    onChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
}

function FormField({
    label,
    name,
    value,
    type = "text",
    required = false,
    onChange,
}: FormFieldProps) {

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
            }}
        >

            <label
                htmlFor={name}
                style={{
                    fontWeight: "bold",
                }}
            >
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                style={{
                    padding: "10px",
                    border:
                        "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                }}
            />

        </div>
    );
}