import { useEffect, useState } from "react";
import {
  createFee,
  deleteFee,
  getFees,
  updateFee,
} from "../../api/feeApi";

import type{
  Fee,
  FeeRequest,
} from "../../api/feeApi";

export default function Fees() {
  const [fees, setFees] = useState<Fee[]>([]);

  const [form, setForm] = useState<FeeRequest>({
    studentId: 0,
    semesterId: 0,
    feeType: "",
    amount: 0,
    dueDate: "",
    status: "PENDING",
  });

  const [editingId, setEditingId] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadFees = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getFees();
      setFees(data);
    } catch (error: any) {
      console.error("Failed to load fees:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to load fees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "studentId" ||
        name === "semesterId"
          ? Number(value)
          : name === "amount"
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
        await updateFee(editingId, form);
        setMessage("Fee updated successfully.");
      } else {
        await createFee(form);
        setMessage("Fee created successfully.");
      }

      resetForm();
      await loadFees();
    } catch (error: any) {
      console.error("Fee operation failed:", error);

      setMessage(
        error?.response?.data?.message ||
          "Fee operation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fee: Fee) => {
    setEditingId(fee.feeId);

    setForm({
      studentId: fee.studentId,
      semesterId: fee.semesterId,
      feeType: fee.feeType,
      amount: fee.amount,
      dueDate: fee.dueDate,
      status: fee.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (feeId: number) => {
    if (!window.confirm("Delete this fee record?")) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await deleteFee(feeId);

      setMessage("Fee deleted successfully.");

      await loadFees();
    } catch (error: any) {
      console.error("Delete fee failed:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to delete fee."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      studentId: 0,
      semesterId: 0,
      feeType: "",
      amount: 0,
      dueDate: "",
      status: "PENDING",
    });
  };

  return (
    <div>
      <h1>Fees</h1>

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
          ? "Edit Fee"
          : "Create Fee"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Student ID</label>
          <br />

          <input
            type="number"
            name="studentId"
            value={form.studentId || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Semester ID</label>
          <br />

          <input
            type="number"
            name="semesterId"
            value={form.semesterId || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Fee Type</label>
          <br />

          <input
            type="text"
            name="feeType"
            value={form.feeType}
            onChange={handleChange}
            placeholder="Example: TUITION"
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Amount</label>
          <br />

          <input
            type="number"
            name="amount"
            value={form.amount || ""}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Due Date</label>
          <br />

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Status</label>
          <br />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="OVERDUE">OVERDUE</option>
            <option value="PARTIAL">PARTIAL</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {editingId !== null
            ? "Update Fee"
            : "Create Fee"}
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

      <h2>Fee Records</h2>

      {loading && <p>Loading...</p>}

      {!loading && fees.length === 0 && (
        <p>No fee records found.</p>
      )}

      {fees.length > 0 && (
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
              <th>Student</th>
              <th>Semester</th>
              <th>Fee Type</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {fees.map((fee) => (
              <tr key={fee.feeId}>
                <td>{fee.feeId}</td>
                <td>{fee.studentId}</td>
                <td>{fee.semesterId}</td>
                <td>{fee.feeType}</td>
                <td>{fee.amount}</td>
                <td>{fee.dueDate}</td>
                <td>{fee.status}</td>

                <td>
                  <button
                    onClick={() => handleEdit(fee)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(fee.feeId)
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