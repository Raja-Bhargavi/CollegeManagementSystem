import { useEffect, useState } from "react";
import axios from "axios";

interface Application {
    applicationId: number;
    applicantUserId: number;
    applicationType: string;
    subject: string;
    description: string;
    submittedAt: string;
    status: string;
}

interface ApplicationForm {
    applicantUserId: string;
    applicationType: string;
    subject: string;
    description: string;
}

const API_URL = "http://localhost:8080/api/applications";

function Applications() {

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState<ApplicationForm>({
        applicantUserId: "",
        applicationType: "",
        subject: "",
        description: "",
    });

    const [statusFilter, setStatusFilter] = useState("");

    const loadApplications = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(API_URL);

            setApplications(response.data);

        } catch (err: any) {

            console.error("Failed to load applications:", err);

            if (err.response?.status === 403) {
                setError("You are not authorized to view applications.");
            } else if (err.response?.status === 401) {
                setError("Your session has expired. Please login again.");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Failed to load applications."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const resetForm = () => {

        setForm({
            applicantUserId: "",
            applicationType: "",
            subject: "",
            description: "",
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setError("");

            const payload = {
                applicantUserId: Number(form.applicantUserId),
                applicationType: form.applicationType,
                subject: form.subject,
                description: form.description,
            };

            if (editingId !== null) {

                await axios.put(
                    `${API_URL}/${editingId}`,
                    payload
                );

            } else {

                await axios.post(
                    API_URL,
                    payload
                );
            }

            resetForm();
            await loadApplications();

        } catch (err: any) {

            console.error("Failed to save application:", err);

            setError(
                err.response?.data?.message ||
                "Failed to save application."
            );
        }
    };

    const handleEdit = (
        application: Application
    ) => {

        setEditingId(application.applicationId);

        setForm({
            applicantUserId: String(
                application.applicantUserId
            ),
            applicationType:
                application.applicationType,
            subject:
                application.subject,
            description:
                application.description || "",
        });

        setShowForm(true);
    };

    const handleStatusChange = async (
        applicationId: number,
        status: string
    ) => {

        try {

            await axios.put(
                `${API_URL}/${applicationId}/status`,
                {
                    status,
                }
            );

            await loadApplications();

        } catch (err: any) {

            console.error(
                "Failed to update application status:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update application status."
            );
        }
    };

    const handleDelete = async (
        applicationId: number
    ) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await axios.delete(
                `${API_URL}/${applicationId}`
            );

            await loadApplications();

        } catch (err: any) {

            console.error(
                "Failed to delete application:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete application."
            );
        }
    };

    const filteredApplications =
        statusFilter === ""
            ? applications
            : applications.filter(
                application =>
                    application.status === statusFilter
            );

    return (

        <div style={styles.container}>

            <div style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        Applications Management
                    </h1>

                    <p style={styles.subtitle}>
                        Manage student and user applications
                    </p>
                </div>

                <button
                    style={styles.primaryButton}
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    + Add Application
                </button>

            </div>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            <div style={styles.toolbar}>

                <label>
                    Filter by status:
                </label>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    style={styles.select}
                >
                    <option value="">
                        All
                    </option>

                    <option value="PENDING">
                        Pending
                    </option>

                    <option value="APPROVED">
                        Approved
                    </option>

                    <option value="REJECTED">
                        Rejected
                    </option>
                </select>

            </div>

            {showForm && (

                <div style={styles.formCard}>

                    <h2>
                        {editingId !== null
                            ? "Edit Application"
                            : "Create Application"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div style={styles.formGrid}>

                            <div>
                                <label>
                                    Applicant User ID
                                </label>

                                <input
                                    type="number"
                                    name="applicantUserId"
                                    value={
                                        form.applicantUserId
                                    }
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label>
                                    Application Type
                                </label>

                                <input
                                    type="text"
                                    name="applicationType"
                                    value={
                                        form.applicationType
                                    }
                                    onChange={handleChange}
                                    required
                                    maxLength={50}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.fullWidth}>
                                <label>
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={
                                        form.subject
                                    }
                                    onChange={handleChange}
                                    required
                                    maxLength={200}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.fullWidth}>
                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={handleChange}
                                    rows={4}
                                    style={styles.textarea}
                                />
                            </div>

                        </div>

                        <div style={styles.formActions}>

                            <button
                                type="submit"
                                style={styles.primaryButton}
                            >
                                {editingId !== null
                                    ? "Update"
                                    : "Create"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                style={styles.secondaryButton}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            <div style={styles.card}>

                {loading ? (

                    <p>Loading applications...</p>

                ) : filteredApplications.length === 0 ? (

                    <p>
                        No applications found.
                    </p>

                ) : (

                    <div style={styles.tableWrapper}>

                        <table style={styles.table}>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Applicant</th>
                                    <th>Type</th>
                                    <th>Subject</th>
                                    <th>Submitted</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredApplications.map(
                                    application => (

                                        <tr
                                            key={
                                                application.applicationId
                                            }
                                        >

                                            <td>
                                                {
                                                    application.applicationId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    application.applicantUserId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    application.applicationType
                                                }
                                            </td>

                                            <td>
                                                {
                                                    application.subject
                                                }
                                            </td>

                                            <td>
                                                {application.submittedAt
                                                    ? new Date(
                                                        application.submittedAt
                                                    ).toLocaleString()
                                                    : "-"}
                                            </td>

                                            <td>

                                                <select
                                                    value={
                                                        application.status
                                                    }
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            application.applicationId,
                                                            e.target.value
                                                        )
                                                    }
                                                    style={
                                                        styles.statusSelect
                                                    }
                                                >

                                                    <option value="PENDING">
                                                        PENDING
                                                    </option>

                                                    <option value="APPROVED">
                                                        APPROVED
                                                    </option>

                                                    <option value="REJECTED">
                                                        REJECTED
                                                    </option>

                                                </select>

                                            </td>

                                            <td>

                                                <div
                                                    style={
                                                        styles.actionButtons
                                                    }
                                                >

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                application
                                                            )
                                                        }
                                                        style={
                                                            styles.editButton
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                application.applicationId
                                                            )
                                                        }
                                                        style={
                                                            styles.deleteButton
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

const styles: {
    [key: string]: React.CSSProperties;
} = {

    container: {
        padding: "30px",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
    },

    title: {
        margin: 0,
        fontSize: "28px",
    },

    subtitle: {
        color: "#666",
        marginTop: "6px",
    },

    primaryButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
    },

    secondaryButton: {
        padding: "10px 18px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "white",
        cursor: "pointer",
    },

    error: {
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "6px",
        background: "#fee2e2",
        color: "#991b1b",
    },

    toolbar: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px",
    },

    select: {
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },

    formCard: {
        background: "white",
        padding: "25px",
        borderRadius: "8px",
        marginBottom: "25px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
        gap: "18px",
    },

    fullWidth: {
        gridColumn: "1 / -1",
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "10px",
        marginTop: "6px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "10px",
        marginTop: "6px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        resize: "vertical",
    },

    formActions: {
        display: "flex",
        gap: "10px",
        marginTop: "20px",
    },

    card: {
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    tableWrapper: {
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
    },

    statusSelect: {
        padding: "6px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },

    actionButtons: {
        display: "flex",
        gap: "8px",
    },

    editButton: {
        padding: "6px 10px",
        border: "none",
        borderRadius: "5px",
        background: "#f59e0b",
        color: "white",
        cursor: "pointer",
    },

    deleteButton: {
        padding: "6px 10px",
        border: "none",
        borderRadius: "5px",
        background: "#dc2626",
        color: "white",
        cursor: "pointer",
    },
};

export default Applications;