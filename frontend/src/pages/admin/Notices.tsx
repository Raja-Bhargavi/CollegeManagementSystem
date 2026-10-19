
import { useEffect, useState } from "react";

import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getPublicDepartments,
} from "../../api/noticeApi";

import type {
  Notice,
  NoticeRequest,
  DepartmentOption,
  ProgramLevel,
  DepartmentScope,
} from "../../api/noticeApi";

const emptyForm = {
  title: "",
  content: "",
  createdBy: "",
  publishedAt: "",
  expiryDate: "",
  visibility: "ALL",
  status: "DRAFT",
  category: "ACADEMIC",
  programLevel: "ALL" as ProgramLevel,
  departmentScope: "ALL" as DepartmentScope,
  targetDepartmentIds: [] as number[],
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [noticeData, departmentData] = await Promise.all([
        getNotices(),
        getPublicDepartments(),
      ]);
      setNotices(noticeData);
      setDepartments(departmentData);
    } catch (error: any) {
      console.error("Failed to load notices/departments:", error);
      setMessage(
        error?.response?.data?.message ||
          "Failed to load notices or departments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const setField = <K extends keyof typeof emptyForm>(
    key: K,
    value: (typeof emptyForm)[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDepartmentToggle = (departmentId: number) => {
    setForm((current) => {
      const exists = current.targetDepartmentIds.includes(departmentId);
      return {
        ...current,
        targetDepartmentIds: exists
          ? current.targetDepartmentIds.filter((id) => id !== departmentId)
          : [...current.targetDepartmentIds, departmentId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim() || !form.content.trim() || !form.createdBy) {
      setMessage("Title, content, and creator user ID are required.");
      return;
    }

    if (
      form.expiryDate &&
      form.publishedAt &&
      new Date(form.expiryDate) < new Date(form.publishedAt)
    ) {
      setMessage("Expiry date cannot be before the publication date.");
      return;
    }

    if (
      form.departmentScope === "SELECTED" &&
      form.targetDepartmentIds.length === 0
    ) {
      setMessage("Select at least one department, or choose All departments.");
      return;
    }

    const payload: NoticeRequest = {
      title: form.title.trim(),
      content: form.content.trim(),
      createdBy: Number(form.createdBy),
      publishedAt: form.publishedAt || null,
      expiryDate: form.expiryDate || null,
      visibility: form.visibility,
      status: form.status,
      category: form.category,
      programLevel: form.programLevel,
      departmentScope: form.departmentScope,
      targetDepartmentIds:
        form.departmentScope === "ALL" ? [] : form.targetDepartmentIds,
    };

    try {
      setSaving(true);

      if (editingId !== null) {
        await updateNotice(editingId, payload);
        setMessage("Notice updated successfully.");
      } else {
        await createNotice(payload);
        setMessage("Notice created successfully.");
      }

      resetForm();
      await loadData();
    } catch (error: any) {
      console.error("Notice operation failed:", error);
      setMessage(
        error?.response?.data?.message ||
          (typeof error?.response?.data === "string"
            ? error.response.data
            : "Notice operation failed.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingId(notice.noticeId);

    const legacyScope: DepartmentScope =
      notice.departmentScope ??
      (notice.departmentId == null ? "ALL" : "SELECTED");

    setForm({
      title: notice.title,
      content: notice.content,
      createdBy: String(notice.createdBy),
      publishedAt: notice.publishedAt?.substring(0, 16) ?? "",
      expiryDate: notice.expiryDate?.substring(0, 16) ?? "",
      visibility: notice.visibility,
      status: notice.status,
      category: notice.category ?? "GENERAL",
      programLevel: notice.programLevel ?? "ALL",
      departmentScope: legacyScope,
      targetDepartmentIds:
        notice.targetDepartmentIds ??
        (notice.departmentId == null ? [] : [notice.departmentId]),
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (noticeId: number) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      await deleteNotice(noticeId);
      setMessage("Notice deleted successfully.");
      await loadData();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Failed to delete notice."
      );
    }
  };

  const departmentLabel = (notice: Notice) => {
    if (notice.departmentScope === "ALL" || notice.departmentId == null) {
      return "All departments";
    }

    const ids =
      notice.targetDepartmentIds ??
      (notice.departmentId ? [notice.departmentId] : []);

    const names = ids
      .map((id) => departments.find((d) => d.departmentId === id)?.departmentCode)
      .filter(Boolean);

    return names.length ? names.join(", ") : "Selected departments";
  };

  if (loading) {
    return <p>Loading notices...</p>;
  }

  return (
    <div>
      <h1>Notices</h1>

      {message && (
        <div
          role="status"
          style={{
            marginBottom: 20,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 30,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2>{editingId !== null ? "Update Notice" : "Create Notice"}</h2>

        <div style={fieldStyle}>
          <label htmlFor="notice-title">Title</label>
          <input
            id="notice-title"
            required
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Mid Semester Examination Schedule"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="notice-content">Content</label>
          <textarea
            id="notice-content"
            required
            rows={5}
            value={form.content}
            onChange={(e) => setField("content", e.target.value)}
            placeholder="Enter notice details"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="notice-creator">Created By (User ID)</label>
          <input
            id="notice-creator"
            type="number"
            required
            min="1"
            value={form.createdBy}
            onChange={(e) => setField("createdBy", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="notice-category">Category</label>
          <select
            id="notice-category"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            style={inputStyle}
          >
            <option value="ACADEMIC">Academic</option>
            <option value="EXAMINATION">Examination</option>
            <option value="ADMISSION">Admission</option>
            <option value="GENERAL">General</option>
            <option value="ADMINISTRATIVE">Administrative</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label htmlFor="notice-program">Applicable programme</label>
          <select
            id="notice-program"
            value={form.programLevel}
            onChange={(e) =>
              setField("programLevel", e.target.value as ProgramLevel)
            }
            style={inputStyle}
          >
            <option value="ALL">All programmes (B.Tech and M.Tech)</option>
            <option value="BTECH">B.Tech only</option>
            <option value="MTECH">M.Tech only</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label htmlFor="notice-department-scope">Applicable departments</label>
          <select
            id="notice-department-scope"
            value={form.departmentScope}
            onChange={(e) => {
              const scope = e.target.value as DepartmentScope;
              setForm((current) => ({
                ...current,
                departmentScope: scope,
                targetDepartmentIds:
                  scope === "ALL" ? [] : current.targetDepartmentIds,
              }));
            }}
            style={inputStyle}
          >
            <option value="ALL">All departments</option>
            <option value="SELECTED">Select specific departments</option>
          </select>
        </div>

        {form.departmentScope === "SELECTED" && (
          <fieldset style={fieldStyle}>
            <legend>Select applicable departments</legend>
            {departments.length === 0 ? (
              <p>No departments were loaded. Check the public departments API.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 10,
                }}
              >
                {departments.map((department) => (
                  <label
                    key={department.departmentId}
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      checked={form.targetDepartmentIds.includes(
                        department.departmentId
                      )}
                      onChange={() =>
                        handleDepartmentToggle(department.departmentId)
                      }
                    />
                    {department.departmentCode} — {department.departmentName}
                  </label>
                ))}
              </div>
            )}
            <p>
              Selected: {form.targetDepartmentIds.length} department(s)
            </p>
          </fieldset>
        )}

        <div style={fieldStyle}>
          <label htmlFor="notice-published">Published at</label>
          <input
            id="notice-published"
            type="datetime-local"
            value={form.publishedAt}
            onChange={(e) => setField("publishedAt", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="notice-expiry">Available until</label>
          <input
            id="notice-expiry"
            type="datetime-local"
            value={form.expiryDate}
            onChange={(e) => setField("expiryDate", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="notice-visibility">Visibility</label>
          <select
            id="notice-visibility"
            value={form.visibility}
            onChange={(e) => setField("visibility", e.target.value)}
            style={inputStyle}
          >
            <option value="ALL">ALL</option>
            <option value="STUDENT">STUDENT</option>
            <option value="FACULTY">FACULTY</option>
            <option value="STAFF">STAFF</option>
            <option value="MANAGEMENT">MANAGEMENT</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label htmlFor="notice-status">Status</label>
          <select
            id="notice-status"
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            style={inputStyle}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </div>

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingId !== null
              ? "Update Notice"
              : "Create Notice"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Notice Records</h2>

      {notices.length === 0 ? (
        <p>No notices found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "ID",
                  "Title",
                  "Category",
                  "Programme",
                  "Departments",
                  "Published",
                  "Expires",
                  "Visibility",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} style={cellStyle}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.noticeId}>
                  <td style={cellStyle}>{notice.noticeId}</td>
                  <td style={cellStyle}>{notice.title}</td>
                  <td style={cellStyle}>{notice.category ?? "GENERAL"}</td>
                  <td style={cellStyle}>
                    {notice.programLevel === "BTECH"
                      ? "B.Tech"
                      : notice.programLevel === "MTECH"
                        ? "M.Tech"
                        : "All programmes"}
                  </td>
                  <td style={cellStyle}>{departmentLabel(notice)}</td>
                  <td style={cellStyle}>{notice.publishedAt || "-"}</td>
                  <td style={cellStyle}>{notice.expiryDate || "-"}</td>
                  <td style={cellStyle}>{notice.visibility}</td>
                  <td style={cellStyle}>{notice.status}</td>
                  <td style={cellStyle}>
                    <button
                      type="button"
                      onClick={() => handleEdit(notice)}
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(notice.noticeId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const fieldStyle = { marginBottom: 15 };
const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 5,
  boxSizing: "border-box" as const,
};
const cellStyle = {
  border: "1px solid #ddd",
  padding: 10,
  textAlign: "left" as const,
  verticalAlign: "top" as const,
};
