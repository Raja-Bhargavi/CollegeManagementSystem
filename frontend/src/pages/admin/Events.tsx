import { useEffect, useState } from "react";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../api/eventApi";

import type{
  Event,
  EventRequest,
} from "../../api/eventApi";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [status, setStatus] = useState("UPCOMING");

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const data = await getEvents();
      setEvents(data);
    } catch (error: any) {
      console.error("Failed to load events:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventDate("");
    setLocation("");
    setCreatedBy("");
    setStatus("UPCOMING");
    setEditingId(null);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");

    if (
      !title ||
      !description ||
      !eventDate ||
      !location ||
      !createdBy ||
      !status
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    const data: EventRequest = {
      title,
      description,
      eventDate,
      location,
      createdBy: Number(createdBy),
      status,
    };

    try {
      if (editingId !== null) {
        await updateEvent(editingId, data);
        setMessage("Event updated successfully.");
      } else {
        await createEvent(data);
        setMessage("Event created successfully.");
      }

      resetForm();
      await loadEvents();
    } catch (error: any) {
      console.error("Event operation failed:", error);

      setMessage(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Event operation failed."
      );
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.eventId);

    setTitle(event.title);
    setDescription(event.description);

    // Handles ISO/local datetime returned by backend.
    setEventDate(
      event.eventDate
        ? event.eventDate.substring(0, 16)
        : ""
    );

    setLocation(event.location);
    setCreatedBy(String(event.createdBy));
    setStatus(event.status);

    setMessage("");
  };

  const handleDelete = async (
    eventId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEvent(eventId);

      setMessage("Event deleted successfully.");

      await loadEvents();
    } catch (error: any) {
      console.error("Delete failed:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to delete event."
      );
    }
  };

  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <div>
      <h1>Events</h1>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          {message}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>
          {editingId !== null
            ? "Update Event"
            : "Create Event"}
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <label>Title</label>
          <br />

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Event title"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <br />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Event description"
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Event Date</label>
          <br />

          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) =>
              setEventDate(e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Location</label>
          <br />

          <input
            type="text"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            placeholder="Event location"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Created By (User ID)</label>
          <br />

          <input
            type="number"
            value={createdBy}
            onChange={(e) =>
              setCreatedBy(e.target.value)
            }
            placeholder="Enter user ID"
            min="1"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Status</label>
          <br />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
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

        <button type="submit">
          {editingId !== null
            ? "Update Event"
            : "Create Event"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}

      <h2>Event Records</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Title</th>
              <th style={cellStyle}>
                Description
              </th>
              <th style={cellStyle}>Date</th>
              <th style={cellStyle}>
                Location
              </th>
              <th style={cellStyle}>
                Created By
              </th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.eventId}>
                <td style={cellStyle}>
                  {event.eventId}
                </td>

                <td style={cellStyle}>
                  {event.title}
                </td>

                <td style={cellStyle}>
                  {event.description}
                </td>

                <td style={cellStyle}>
                  {event.eventDate}
                </td>

                <td style={cellStyle}>
                  {event.location}
                </td>

                <td style={cellStyle}>
                  {event.createdBy}
                </td>

                <td style={cellStyle}>
                  {event.status}
                </td>

                <td style={cellStyle}>
                  <button
                    onClick={() =>
                      handleEdit(event)
                    }
                    style={{
                      marginRight: "8px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        event.eventId
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};