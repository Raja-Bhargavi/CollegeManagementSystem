import {
    useEffect,
    useState,
    type CSSProperties,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    getNotices,
    createNotice,
    updateNotice,
    type Notice,
    type NoticeRequest,
} from "../../api/noticeApi";

const emptyForm: NoticeRequest = {
    title: "",
    content: "",
    createdBy: 0,
    publishedAt: null,
    expiryDate: null,
    visibility: "ALL",
    status: "DRAFT",
};

export default function StaffNotices() {
    const [notices, setNotices] =
        useState<Notice[]>([]);

    const [formData, setFormData] =
        useState<NoticeRequest>(emptyForm);

    const [editingNoticeId, setEditingNoticeId] =
        useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getNotices();
            setNotices(data);
        } catch (err: any) {
            console.error(
                "Failed to load staff notices:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "Failed to load notices."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingNoticeId(null);
        setMessage("");
        setError("");
    };

    const handleChange = (
        event: ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "createdBy"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (
            !formData.title.trim() ||
            !formData.content.trim() ||
            !formData.createdBy ||
            !formData.visibility.trim() ||
            !formData.status.trim()
        ) {
            setError(
                "Please fill in all required notice fields."
            );
            return;
        }

        try {
            setSaving(true);

            if (editingNoticeId === null) {
                await createNotice(formData);

                setMessage(
                    "Notice created successfully."
                );
            } else {
                await updateNotice(
                    editingNoticeId,
                    formData
                );

                setMessage(
                    "Notice updated successfully."
                );
            }

            resetForm();
            await loadNotices();
        } catch (err: any) {
            console.error(
                "Failed to save notice:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "Failed to save notice."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (notice: Notice) => {
        setEditingNoticeId(notice.noticeId);

        setFormData({
            title: notice.title,
            content: notice.content,
            createdBy: notice.createdBy,
            publishedAt:
                notice.publishedAt || null,
            expiryDate:
                notice.expiryDate || null,
            visibility: notice.visibility,
            status: notice.status,
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const getStatusStyle = (
        status: string
    ): CSSProperties => {
        const normalizedStatus =
            status.toUpperCase();

        if (
            normalizedStatus === "PUBLISHED"
        ) {
            return {
                backgroundColor: "#dcfce7",
                color: "#166534",
            };
        }

        if (
            normalizedStatus === "DRAFT"
        ) {
            return {
                backgroundColor: "#e5e7eb",
                color: "#374151",
            };
        }

        if (
            normalizedStatus === "EXPIRED"
        ) {
            return {
                backgroundColor: "#fee2e2",
                color: "#991b1b",
            };
        }

        return {
            backgroundColor: "#fef3c7",
            color: "#92400e",
        };
    };

    if (loading) {
        return (
            <div>
                <h1 style={{ color: "#111827" }}>
                    Notices
                </h1>

                <p style={{ color: "#6b7280" }}>
                    Loading notices...
                </p>
            </div>
        );
    }

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            color: "#111827",
                        }}
                    >
                        Notices
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#6b7280",
                        }}
                    >
                        Manage college notices
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadNotices}
                    style={buttonStyle}
                >
                    Refresh
                </button>
            </div>

            {message && (
                <div style={successStyle}>
                    {message}
                </div>
            )}

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}

            <div style={formContainerStyle}>
                <h2 style={{ marginTop: 0 }}>
                    {editingNoticeId === null
                        ? "Create Notice"
                        : "Edit Notice"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={formGridStyle}>
                        <div>
                            <label style={labelStyle}>
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                maxLength={200}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Created By User ID
                            </label>

                            <input
                                type="number"
                                name="createdBy"
                                value={
                                    formData.createdBy ||
                                    ""
                                }
                                onChange={handleChange}
                                min="1"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Visibility
                            </label>

                            <select
                                name="visibility"
                                value={
                                    formData.visibility
                                }
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="ALL">
                                    ALL
                                </option>

                                <option value="STUDENT">
                                    STUDENT
                                </option>

                                <option value="FACULTY">
                                    FACULTY
                                </option>

                                <option value="STAFF">
                                    STAFF
                                </option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="DRAFT">
                                    DRAFT
                                </option>

                                <option value="PUBLISHED">
                                    PUBLISHED
                                </option>

                                <option value="EXPIRED">
                                    EXPIRED
                                </option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Published At
                            </label>

                            <input
                                type="datetime-local"
                                name="publishedAt"
                                value={
                                    formData.publishedAt
                                        ? formData.publishedAt.slice(
                                              0,
                                              16
                                          )
                                        : ""
                                }
                                onChange={(event) =>
                                    setFormData(
                                        (previous) => ({
                                            ...previous,
                                            publishedAt:
                                                event
                                                    .target
                                                    .value ||
                                                null,
                                        })
                                    )
                                }
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Expiry Date
                            </label>

                            <input
                                type="datetime-local"
                                name="expiryDate"
                                value={
                                    formData.expiryDate
                                        ? formData.expiryDate.slice(
                                              0,
                                              16
                                          )
                                        : ""
                                }
                                onChange={(event) =>
                                    setFormData(
                                        (previous) => ({
                                            ...previous,
                                            expiryDate:
                                                event
                                                    .target
                                                    .value ||
                                                null,
                                        })
                                    )
                                }
                                style={inputStyle}
                            />
                        </div>

                        <div
                            style={{
                                gridColumn:
                                    "1 / -1",
                            }}
                        >
                            <label style={labelStyle}>
                                Content
                            </label>

                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows={6}
                                style={{
                                    ...inputStyle,
                                    resize: "vertical",
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "20px",
                        }}
                    >
                        <button
                            type="submit"
                            disabled={saving}
                            style={buttonStyle}
                        >
                            {saving
                                ? "Saving..."
                                : editingNoticeId === null
                                ? "Create Notice"
                                : "Update Notice"}
                        </button>

                        {editingNoticeId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={
                                    secondaryButtonStyle
                                }
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div style={tableContainerStyle}>
                {notices.length === 0 ? (
                    <div style={emptyStyle}>
                        No notices found.
                    </div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr
                                style={{
                                    backgroundColor:
                                        "#f9fafb",
                                }}
                            >
                                <th style={headerStyle}>
                                    Notice ID
                                </th>

                                <th style={headerStyle}>
                                    Title
                                </th>

                                <th style={headerStyle}>
                                    Content
                                </th>

                                <th style={headerStyle}>
                                    Created By
                                </th>

                                <th style={headerStyle}>
                                    Published At
                                </th>

                                <th style={headerStyle}>
                                    Expiry Date
                                </th>

                                <th style={headerStyle}>
                                    Visibility
                                </th>

                                <th style={headerStyle}>
                                    Status
                                </th>

                                <th style={headerStyle}>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {notices.map((notice) => (
                                <tr
                                    key={
                                        notice.noticeId
                                    }
                                >
                                    <td style={cellStyle}>
                                        {
                                            notice.noticeId
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {notice.title}
                                    </td>

                                    <td style={cellStyle}>
                                        {notice.content}
                                    </td>

                                    <td style={cellStyle}>
                                        {
                                            notice.createdBy
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {notice.publishedAt
                                            ? new Date(
                                                  notice.publishedAt
                                              ).toLocaleString()
                                            : "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {notice.expiryDate
                                            ? new Date(
                                                  notice.expiryDate
                                              ).toLocaleString()
                                            : "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {notice.visibility}
                                    </td>

                                    <td style={cellStyle}>
                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    notice.status
                                                ),
                                                display:
                                                    "inline-block",
                                                padding:
                                                    "5px 10px",
                                                borderRadius:
                                                    "999px",
                                                fontSize:
                                                    "12px",
                                                fontWeight:
                                                    "600",
                                            }}
                                        >
                                            {notice.status}
                                        </span>
                                    </td>

                                    <td style={cellStyle}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    notice
                                                )
                                            }
                                            style={
                                                editButtonStyle
                                            }
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const formContainerStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "25px",
};

const formGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
};

const labelStyle: CSSProperties = {
    display: "block",
    marginBottom: "6px",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
};

const inputStyle: CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
};

const buttonStyle: CSSProperties = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
};

const secondaryButtonStyle: CSSProperties = {
    padding: "10px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    fontWeight: "600",
};

const editButtonStyle: CSSProperties = {
    padding: "7px 12px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#374151",
    color: "#ffffff",
    cursor: "pointer",
};

const successStyle: CSSProperties = {
    marginBottom: "20px",
    padding: "12px",
    border: "1px solid #86efac",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    borderRadius: "6px",
};

const errorStyle: CSSProperties = {
    marginBottom: "20px",
    padding: "12px",
    border: "1px solid #fca5a5",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    borderRadius: "6px",
};

const tableContainerStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflowX: "auto",
};

const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1200px",
};

const headerStyle: CSSProperties = {
    textAlign: "left",
    padding: "14px 16px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
};

const cellStyle: CSSProperties = {
    padding: "14px 16px",
    borderBottom: "1px solid #f3f4f6",
    color: "#374151",
    fontSize: "14px",
    verticalAlign: "top",
};

const emptyStyle: CSSProperties = {
    padding: "30px",
    textAlign: "center",
    color: "#6b7280",
};