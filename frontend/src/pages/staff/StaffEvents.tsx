import {
    useEffect,
    useState,
    type CSSProperties,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    getEvents,
    createEvent,
    updateEvent,
    type Event,
    type EventRequest,
} from "../../api/eventApi";

const emptyForm: EventRequest = {
    title: "",
    description: "",
    eventDate: "",
    location: "",
    createdBy: 0,
    status: "UPCOMING",
};

export default function StaffEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [formData, setFormData] =
        useState<EventRequest>(emptyForm);

    const [editingEventId, setEditingEventId] =
        useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getEvents();
            setEvents(data);
        } catch (err: any) {
            console.error(
                "Failed to load staff events:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "Failed to load events."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingEventId(null);
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
            !formData.eventDate ||
            !formData.createdBy ||
            !formData.status.trim()
        ) {
            setError(
                "Please fill in all required event fields."
            );
            return;
        }

        try {
            setSaving(true);

            if (editingEventId === null) {
                await createEvent(formData);

                setMessage(
                    "Event created successfully."
                );
            } else {
                await updateEvent(
                    editingEventId,
                    formData
                );

                setMessage(
                    "Event updated successfully."
                );
            }

            resetForm();
            await loadEvents();
        } catch (err: any) {
            console.error(
                "Failed to save event:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "Failed to save event."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEventId(event.eventId);

        setFormData({
            title: event.title,
            description: event.description || "",
            eventDate: event.eventDate
                ? event.eventDate.slice(0, 16)
                : "",
            location: event.location || "",
            createdBy: event.createdBy,
            status: event.status,
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
            normalizedStatus === "UPCOMING"
        ) {
            return {
                backgroundColor: "#dbeafe",
                color: "#1e40af",
            };
        }

        if (
            normalizedStatus === "ONGOING"
        ) {
            return {
                backgroundColor: "#dcfce7",
                color: "#166534",
            };
        }

        if (
            normalizedStatus === "COMPLETED"
        ) {
            return {
                backgroundColor: "#e5e7eb",
                color: "#374151",
            };
        }

        if (
            normalizedStatus === "CANCELLED"
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
                    Events
                </h1>

                <p style={{ color: "#6b7280" }}>
                    Loading events...
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
                        Events
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#6b7280",
                        }}
                    >
                        Manage college events
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadEvents}
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
                    {editingEventId === null
                        ? "Create Event"
                        : "Edit Event"}
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
                                Event Date
                            </label>

                            <input
                                type="datetime-local"
                                name="eventDate"
                                value={
                                    formData.eventDate
                                }
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={
                                    formData.location
                                }
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
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="UPCOMING">
                                    UPCOMING
                                </option>

                                <option value="ONGOING">
                                    ONGOING
                                </option>

                                <option value="COMPLETED">
                                    COMPLETED
                                </option>

                                <option value="CANCELLED">
                                    CANCELLED
                                </option>
                            </select>
                        </div>

                        <div
                            style={{
                                gridColumn:
                                    "1 / -1",
                            }}
                        >
                            <label style={labelStyle}>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                rows={4}
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
                                : editingEventId === null
                                ? "Create Event"
                                : "Update Event"}
                        </button>

                        {editingEventId !== null && (
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
                {events.length === 0 ? (
                    <div style={emptyStyle}>
                        No events found.
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
                                    Event ID
                                </th>

                                <th style={headerStyle}>
                                    Title
                                </th>

                                <th style={headerStyle}>
                                    Description
                                </th>

                                <th style={headerStyle}>
                                    Event Date
                                </th>

                                <th style={headerStyle}>
                                    Location
                                </th>

                                <th style={headerStyle}>
                                    Created By
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
                            {events.map((event) => (
                                <tr
                                    key={
                                        event.eventId
                                    }
                                >
                                    <td style={cellStyle}>
                                        {
                                            event.eventId
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {event.title}
                                    </td>

                                    <td style={cellStyle}>
                                        {event.description ||
                                            "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {event.eventDate
                                            ? new Date(
                                                  event.eventDate
                                              ).toLocaleString()
                                            : "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {event.location ||
                                            "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {
                                            event.createdBy
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    event.status
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
                                            {event.status}
                                        </span>
                                    </td>

                                    <td style={cellStyle}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    event
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
    minWidth: "1100px",
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
};

const emptyStyle: CSSProperties = {
    padding: "30px",
    textAlign: "center",
    color: "#6b7280",
};