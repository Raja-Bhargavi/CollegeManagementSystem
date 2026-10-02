import {
    useEffect,
    useState,
} from "react";

import type {
    Staff,
    StaffProfileUpdateRequest,
} from "../../api/staffApi";

import {
    getMyStaffProfile,
    updateMyStaffProfile,
} from "../../api/staffApi";

export default function StaffProfile() {

    const [profile, setProfile] =
        useState<Staff | null>(null);

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

    const [form, setForm] =
        useState<StaffProfileUpdateRequest>({
            firstName: "",
            lastName: "",
            phone: "",
            designation: "",
        });


    // =========================================================
    // LOAD PROFILE
    // =========================================================

    useEffect(() => {

        loadProfile();

    }, []);


    const loadProfile = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getMyStaffProfile();

            setProfile(data);

            setForm({
                firstName:
                    data.firstName || "",

                lastName:
                    data.lastName || "",

                phone:
                    data.phone || "",

                designation:
                    data.designation || "",
            });

        } catch (err: any) {

            console.error(
                "Failed to load staff profile:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to load profile."
                )
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // START EDIT
    // =========================================================

    const startEditing = () => {

        if (!profile) {
            return;
        }

        setForm({
            firstName:
                profile.firstName || "",

            lastName:
                profile.lastName || "",

            phone:
                profile.phone || "",

            designation:
                profile.designation || "",
        });

        setError("");

        setSuccess("");

        setEditing(true);
    };


    // =========================================================
    // CANCEL
    // =========================================================

    const cancelEditing = () => {

        if (profile) {

            setForm({
                firstName:
                    profile.firstName || "",

                lastName:
                    profile.lastName || "",

                phone:
                    profile.phone || "",

                designation:
                    profile.designation || "",
            });
        }

        setEditing(false);

        setError("");

        setSuccess("");
    };


    // =========================================================
    // SAVE
    // =========================================================

    const saveProfile = async () => {

        try {

            setSaving(true);

            setError("");

            setSuccess("");

            if (
                !form.firstName.trim()
            ) {

                setError(
                    "First name is required."
                );

                return;
            }

            const updated =
                await updateMyStaffProfile({
                    firstName:
                        form.firstName.trim(),

                    lastName:
                        form.lastName.trim(),

                    phone:
                        form.phone.trim(),

                    designation:
                        form.designation.trim(),
                });

            setProfile(updated);

            setForm({
                firstName:
                    updated.firstName || "",

                lastName:
                    updated.lastName || "",

                phone:
                    updated.phone || "",

                designation:
                    updated.designation || "",
            });

            setEditing(false);

            setSuccess(
                "Profile updated successfully."
            );

        } catch (err: any) {

            console.error(
                "Failed to update staff profile:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to update profile."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div
                style={{
                    padding: "20px",
                }}
            >
                <h2>
                    Loading profile...
                </h2>
            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (
        <div>

            <div
                style={{
                    display:
                        "flex",

                    justifyContent:
                        "space-between",

                    alignItems:
                        "center",

                    marginBottom:
                        "20px",
                }}
            >

                <h1
                    style={{
                        margin: 0,
                    }}
                >
                    My Profile
                </h1>

                {!editing && (

                    <button
                        type="button"
                        onClick={
                            startEditing
                        }
                        style={
                            editButtonStyle
                        }
                    >
                        Edit Profile
                    </button>

                )}

            </div>


            {error && (

                <div
                    style={{
                        backgroundColor:
                            "#fee2e2",

                        color:
                            "#991b1b",

                        padding:
                            "12px 15px",

                        borderRadius:
                            "6px",

                        marginBottom:
                            "20px",
                    }}
                >
                    {error}
                </div>

            )}


            {success && (

                <div
                    style={{
                        backgroundColor:
                            "#dcfce7",

                        color:
                            "#166534",

                        padding:
                            "12px 15px",

                        borderRadius:
                            "6px",

                        marginBottom:
                            "20px",
                    }}
                >
                    {success}
                </div>

            )}


            {!profile ? (

                <div
                    style={
                        cardStyle
                    }
                >
                    Staff profile not found.
                </div>

            ) : (

                <div
                    style={
                        cardStyle
                    }
                >

                    <div
                        style={{
                            display:
                                "grid",

                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",

                            gap:
                                "20px",
                        }}
                    >

                        {/* STAFF ID */}

                        <ReadOnlyField
                            label="Staff ID"
                            value={
                                profile.staffId
                            }
                        />


                        {/* USER ID */}

                        <ReadOnlyField
                            label="User ID"
                            value={
                                profile.userId
                            }
                        />


                        {/* EMPLOYEE NUMBER */}

                        <ReadOnlyField
                            label="Employee Number"
                            value={
                                profile.employeeNumber
                            }
                        />


                        {/* FIRST NAME */}

                        {editing ? (

                            <EditableField
                                label="First Name"
                                value={
                                    form.firstName
                                }
                                onChange={
                                    (value) =>
                                        setForm({
                                            ...form,
                                            firstName:
                                                value,
                                        })
                                }
                            />

                        ) : (

                            <ReadOnlyField
                                label="First Name"
                                value={
                                    profile.firstName
                                }
                            />

                        )}


                        {/* LAST NAME */}

                        {editing ? (

                            <EditableField
                                label="Last Name"
                                value={
                                    form.lastName
                                }
                                onChange={
                                    (value) =>
                                        setForm({
                                            ...form,
                                            lastName:
                                                value,
                                        })
                                }
                            />

                        ) : (

                            <ReadOnlyField
                                label="Last Name"
                                value={
                                    profile.lastName ||
                                    "-"
                                }
                            />

                        )}


                        {/* PHONE */}

                        {editing ? (

                            <EditableField
                                label="Phone"
                                value={
                                    form.phone
                                }
                                onChange={
                                    (value) =>
                                        setForm({
                                            ...form,
                                            phone:
                                                value,
                                        })
                                }
                            />

                        ) : (

                            <ReadOnlyField
                                label="Phone"
                                value={
                                    profile.phone ||
                                    "-"
                                }
                            />

                        )}


                        {/* DESIGNATION */}

                        {editing ? (

                            <EditableField
                                label="Designation"
                                value={
                                    form.designation
                                }
                                onChange={
                                    (value) =>
                                        setForm({
                                            ...form,
                                            designation:
                                                value,
                                        })
                                }
                            />

                        ) : (

                            <ReadOnlyField
                                label="Designation"
                                value={
                                    profile.designation ||
                                    "-"
                                }
                            />

                        )}


                        {/* DEPARTMENT */}

                        <ReadOnlyField
                            label="Department ID"
                            value={
                                profile.departmentId ??
                                "-"
                            }
                        />


                        {/* JOINING DATE */}

                        <ReadOnlyField
                            label="Joining Date"
                            value={
                                profile.joiningDate
                                    ? formatDate(
                                        profile.joiningDate
                                    )
                                    : "-"
                            }
                        />


                        {/* STATUS */}

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Staff Status
                            </label>

                            <div
                                style={{
                                    marginTop:
                                        "7px",
                                }}
                            >
                                <span
                                    style={
                                        getStatusStyle(
                                            profile.staffStatus
                                        )
                                    }
                                >
                                    {
                                        profile.staffStatus
                                    }
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* ACTIONS */}

                    {editing && (

                        <div
                            style={{
                                marginTop:
                                    "25px",

                                display:
                                    "flex",

                                gap:
                                    "10px",
                            }}
                        >

                            <button
                                type="button"
                                onClick={
                                    saveProfile
                                }
                                disabled={
                                    saving
                                }
                                style={
                                    saveButtonStyle
                                }
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={
                                    cancelEditing
                                }
                                disabled={
                                    saving
                                }
                                style={
                                    cancelButtonStyle
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}


// =========================================================
// READ ONLY FIELD
// =========================================================

function ReadOnlyField({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {

    return (
        <div>

            <label
                style={
                    labelStyle
                }
            >
                {label}
            </label>

            <div
                style={{
                    marginTop:
                        "7px",

                    padding:
                        "10px 12px",

                    backgroundColor:
                        "#f3f4f6",

                    border:
                        "1px solid #e5e7eb",

                    borderRadius:
                        "6px",

                    color:
                        "#374151",

                    minHeight:
                        "20px",
                }}
            >
                {value}
            </div>

        </div>
    );
}


// =========================================================
// EDITABLE FIELD
// =========================================================

function EditableField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (
        value: string
    ) => void;
}) {

    return (
        <div>

            <label
                style={
                    labelStyle
                }
            >
                {label}
            </label>

            <input
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                style={
                    inputStyle
                }
            />

        </div>
    );
}


// =========================================================
// ERROR MESSAGE
// =========================================================

function getErrorMessage(
    err: any,
    fallback: string
): string {

    const responseData =
        err?.response?.data;

    if (responseData?.fields) {

        const messages =
            Object.values(
                responseData.fields
            ) as string[];

        return messages.join(", ");
    }

    if (
        typeof responseData?.message ===
        "string"
    ) {

        return responseData.message;
    }

    if (
        typeof responseData?.error ===
        "string"
    ) {

        return responseData.error;
    }

    if (
        typeof responseData ===
        "string"
    ) {

        return responseData;
    }

    return fallback;
}


// =========================================================
// DATE
// =========================================================

function formatDate(
    date: string
): string {

    const parsed =
        new Date(date);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return date;
    }

    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}


// =========================================================
// STYLES
// =========================================================

const cardStyle:
    React.CSSProperties = {

    backgroundColor:
        "white",

    padding:
        "25px",

    borderRadius:
        "8px",

    boxShadow:
        "0 1px 4px rgba(0,0,0,0.1)",
};


const labelStyle:
    React.CSSProperties = {

    display:
        "block",

    fontSize:
        "13px",

    fontWeight:
        "600",

    color:
        "#374151",
};


const inputStyle:
    React.CSSProperties = {

    width:
        "100%",

    boxSizing:
        "border-box",

    marginTop:
        "7px",

    padding:
        "10px 12px",

    border:
        "1px solid #d1d5db",

    borderRadius:
        "6px",

    fontSize:
        "14px",

    outline:
        "none",
};


const editButtonStyle:
    React.CSSProperties = {

    backgroundColor:
        "#1f2937",

    color:
        "white",

    border:
        "none",

    borderRadius:
        "6px",

    padding:
        "10px 16px",

    cursor:
        "pointer",

    fontWeight:
        "600",
};


const saveButtonStyle:
    React.CSSProperties = {

    backgroundColor:
        "#166534",

    color:
        "white",

    border:
        "none",

    borderRadius:
        "6px",

    padding:
        "10px 16px",

    cursor:
        "pointer",

    fontWeight:
        "600",
};


const cancelButtonStyle:
    React.CSSProperties = {

    backgroundColor:
        "#6b7280",

    color:
        "white",

    border:
        "none",

    borderRadius:
        "6px",

    padding:
        "10px 16px",

    cursor:
        "pointer",

    fontWeight:
        "600",
};


function getStatusStyle(
    status: string
): React.CSSProperties {

    if (
        status?.toUpperCase() ===
        "ACTIVE"
    ) {

        return {
            display:
                "inline-block",

            backgroundColor:
                "#dcfce7",

            color:
                "#166534",

            padding:
                "5px 10px",

            borderRadius:
                "12px",

            fontSize:
                "13px",

            fontWeight:
                "600",
        };
    }

    return {
        display:
            "inline-block",

        backgroundColor:
            "#f3f4f6",

        color:
            "#374151",

        padding:
            "5px 10px",

        borderRadius:
            "12px",

        fontSize:
            "13px",

        fontWeight:
            "600",
    };
}