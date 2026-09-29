import { useEffect, useState } from "react";

import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../../api/noticeApi";

import type{
  Notice,
  NoticeRequest,
} from "../../api/noticeApi";

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [visibility, setVisibility] =
    useState("ALL");
  const [status, setStatus] = useState("DRAFT");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const loadNotices = async () => {
    try {
      setLoading(true);

      const data = await getNotices();
      setNotices(data);
    } catch (error: any) {
      console.error(
        "Failed to load notices:",
        error
      );

      setMessage(
        error?.response?.data?.message ||
          "Failed to load notices."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCreatedBy("");
    setPublishedAt("");
    setExpiryDate("");
    setVisibility("ALL");
    setStatus("DRAFT");
    setEditingId(null);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");

    if (
      !title ||
      !content ||
      !createdBy ||
      !visibility ||
      !status
    ) {
      setMessage(
        "Please fill all required fields."
      );
      return;
    }

    const data: NoticeRequest = {
      title,
      content,
      createdBy: Number(createdBy),
      publishedAt: publishedAt
        ? publishedAt
        : null,
      expiryDate: expiryDate
        ? expiryDate
        : null,
      visibility,
      status,
    };

    try {
      if (editingId !== null) {
        await updateNotice(editingId, data);

        setMessage(
          "Notice updated successfully."
        );
      } else {
        await createNotice(data);

        setMessage(
          "Notice created successfully."
        );
      }

      resetForm();
      await loadNotices();
    } catch (error: any) {
      console.error(
        "Notice operation failed:",
        error
      );

      setMessage(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Notice operation failed."
      );
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingId(notice.noticeId);

    setTitle(notice.title);
    setContent(notice.content);
    setCreatedBy(String(notice.createdBy));

    setPublishedAt(
      notice.publishedAt
        ? notice.publishedAt.substring(0, 16)
        : ""
    );

    setExpiryDate(
      notice.expiryDate
        ? notice.expiryDate.substring(0, 16)
        : ""
    );

    setVisibility(notice.visibility);
    setStatus(notice.status);

    setMessage("");
  };

  const handleDelete = async (
    noticeId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteNotice(noticeId);

      setMessage(
        "Notice deleted successfully."
      );

      await loadNotices();
    } catch (error: any) {
      console.error(
        "Failed to delete notice:",
        error
      );

      setMessage(
        error?.response?.data?.message ||
          "Failed to delete notice."
      );
    }
  };

  if (loading) {
    return <p>Loading notices...</p>;
  }

  return (
    <div>
      <h1>Notices</h1>

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
            ? "Update Notice"
            : "Create Notice"}
        </h2>

        <div style={fieldStyle}>
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Notice title"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Content</label>

          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Notice content"
            rows={5}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Created By (User ID)</label>

          <input
            type="number"
            value={createdBy}
            onChange={(e) =>
              setCreatedBy(e.target.value)
            }
            placeholder="Enter user ID"
            min="1"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Published At</label>

          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) =>
              setPublishedAt(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Expiry Date</label>

          <input
            type="datetime-local"
            value={expiryDate}
            onChange={(e) =>
              setExpiryDate(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Visibility</label>

          <select
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value)
            }
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

            <option value="MANAGEMENT">
              MANAGEMENT
            </option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
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

        <button type="submit">
          {editingId !== null
            ? "Update Notice"
            : "Create Notice"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}

      <h2>Notice Records</h2>

      {notices.length === 0 ? (
        <p>No notices found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={cellStyle}>
                ID
              </th>

              <th style={cellStyle}>
                Title
              </th>

              <th style={cellStyle}>
                Content
              </th>

              <th style={cellStyle}>
                Created By
              </th>

              <th style={cellStyle}>
                Published At
              </th>

              <th style={cellStyle}>
                Expiry Date
              </th>

              <th style={cellStyle}>
                Visibility
              </th>

              <th style={cellStyle}>
                Status
              </th>

              <th style={cellStyle}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {notices.map((notice) => (
              <tr key={notice.noticeId}>
                <td style={cellStyle}>
                  {notice.noticeId}
                </td>

                <td style={cellStyle}>
                  {notice.title}
                </td>

                <td style={cellStyle}>
                  {notice.content}
                </td>

                <td style={cellStyle}>
                  {notice.createdBy}
                </td>

                <td style={cellStyle}>
                  {notice.publishedAt || "-"}
                </td>

                <td style={cellStyle}>
                  {notice.expiryDate || "-"}
                </td>

                <td style={cellStyle}>
                  {notice.visibility}
                </td>

                <td style={cellStyle}>
                  {notice.status}
                </td>

                <td style={cellStyle}>
                  <button
                    onClick={() =>
                      handleEdit(notice)
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
                        notice.noticeId
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

const fieldStyle = {
  marginBottom: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  boxSizing: "border-box" as const,
};

const cellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};