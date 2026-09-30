import { useEffect, useState } from "react";
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
  updateApplicationStatus,
} from "../../api/applicationApi";

import type{
  Application,
  ApplicationRequest,
} from "../../api/applicationApi";

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);

  const [form, setForm] = useState<ApplicationRequest>({
    applicantUserId: 0,
    applicationType: "",
    subject: "",
    description: "",
  });

  const [statusForm, setStatusForm] = useState({
    applicationId: 0,
    status: "PENDING",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getApplications();
      setApplications(data);
    } catch (error: any) {
      console.error("Failed to load applications:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "applicantUserId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      if (editingId !== null) {
        await updateApplication(editingId, form);
        setMessage("Application updated successfully.");
      } else {
        await createApplication(form);
        setMessage("Application created successfully.");
      }

      resetForm();
      await loadApplications();
    } catch (error: any) {
      console.error("Application operation failed:", error);

      setMessage(
        error?.response?.data?.message ||
          "Application operation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (application: Application) => {
    setEditingId(application.applicationId);

    setForm({
      applicantUserId: application.applicantUserId,
      applicationType: application.applicationType,
      subject: application.subject,
      description: application.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (applicationId: number) => {
    if (!window.confirm("Delete this application?")) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await deleteApplication(applicationId);

      setMessage("Application deleted successfully.");

      await loadApplications();
    } catch (error: any) {
      console.error("Delete application failed:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to delete application."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (statusForm.applicationId === 0) {
      setMessage("Select an application first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await updateApplicationStatus(
        statusForm.applicationId,
        {
          status: statusForm.status,
        }
      );

      setMessage(
        "Application status updated successfully."
      );

      setStatusForm({
        applicationId: 0,
        status: "PENDING",
      });

      await loadApplications();
    } catch (error: any) {
      console.error(
        "Application status update failed:",
        error
      );

      setMessage(
        error?.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      applicantUserId: 0,
      applicationType: "",
      subject: "",
      description: "",
    });
  };

  return (
    <div>
      <h1>Applications</h1>

      {message && (
        <p
          style={{
            padding: "10px",
            background: "#f1f1f1",
            borderRadius: "5px",
          }}
        >
          {message}
        </p>
      )}

      <h2>
        {editingId !== null
          ? "Edit Application"
          : "Create Application"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Applicant User ID</label>
          <br />

          <input
            type="number"
            name="applicantUserId"
            value={form.applicantUserId || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Application Type</label>
          <br />

          <input
            type="text"
            name="applicationType"
            value={form.applicationType}
            onChange={handleChange}
            placeholder="Example: LEAVE"
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Subject</label>
          <br />

          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description</label>
          <br />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {editingId !== null
            ? "Update Application"
            : "Create Application"}
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

      <hr />

      <h2>Update Application Status</h2>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={statusForm.applicationId}
          onChange={(e) =>
            setStatusForm((prev) => ({
              ...prev,
              applicationId: Number(e.target.value),
            }))
          }
        >
          <option value={0}>
            Select Application
          </option>

          {applications.map((application) => (
            <option
              key={application.applicationId}
              value={application.applicationId}
            >
              #{application.applicationId} -{" "}
              {application.subject}
            </option>
          ))}
        </select>

        <select
          value={statusForm.status}
          onChange={(e) =>
            setStatusForm((prev) => ({
              ...prev,
              status: e.target.value,
            }))
          }
          style={{ marginLeft: "10px" }}
        >
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        <button
          type="button"
          onClick={handleStatusUpdate}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          Update Status
        </button>
      </div>

      <hr />

      <h2>Application Records</h2>

      {loading && <p>Loading...</p>}

      {!loading && applications.length === 0 && (
        <p>No application records found.</p>
      )}

      {applications.length > 0 && (
        <table
          border={1}
          cellPadding={8}
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Applicant User</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Submitted At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr key={application.applicationId}>
                <td>{application.applicationId}</td>

                <td>
                  {application.applicantUserId}
                </td>

                <td>
                  {application.applicationType}
                </td>

                <td>{application.subject}</td>

                <td>{application.description}</td>

                <td>
                  {application.submittedAt
                    ? new Date(
                        application.submittedAt
                      ).toLocaleString()
                    : "-"}
                </td>

                <td>{application.status}</td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(application)
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
                    style={{ marginLeft: "5px" }}
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