import { useEffect, useState } from "react";
import {
  createPayment,
  deletePayment,
  getPayments,
  updatePayment,
} from "../../api/paymentApi";

import type{
  Payment,
  PaymentRequest,
} from "../../api/paymentApi";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);

  const [form, setForm] = useState<PaymentRequest>({
    feeId: 0,
    amount: 0,
    paymentMethod: "",
    transactionReference: "",
    paymentStatus: "SUCCESS",
  });

  const [editingId, setEditingId] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getPayments();
      setPayments(data);
    } catch (error: any) {
      console.error("Failed to load payments:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
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
        name === "feeId"
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
        await updatePayment(editingId, form);
        setMessage("Payment updated successfully.");
      } else {
        await createPayment(form);
        setMessage("Payment created successfully.");
      }

      resetForm();
      await loadPayments();
    } catch (error: any) {
      console.error("Payment operation failed:", error);

      setMessage(
        error?.response?.data?.message ||
          "Payment operation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingId(payment.paymentId);

    setForm({
      feeId: payment.feeId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionReference:
        payment.transactionReference,
      paymentStatus: payment.paymentStatus,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (paymentId: number) => {
    if (!window.confirm("Delete this payment?")) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await deletePayment(paymentId);

      setMessage("Payment deleted successfully.");

      await loadPayments();
    } catch (error: any) {
      console.error("Delete payment failed:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to delete payment."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      feeId: 0,
      amount: 0,
      paymentMethod: "",
      transactionReference: "",
      paymentStatus: "SUCCESS",
    });
  };

  return (
    <div>
      <h1>Payments</h1>

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
          ? "Edit Payment"
          : "Create Payment"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Fee ID</label>
          <br />

          <input
            type="number"
            name="feeId"
            value={form.feeId || ""}
            onChange={handleChange}
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
          <label>Payment Method</label>
          <br />

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Payment Method
            </option>
            <option value="CASH">CASH</option>
            <option value="CARD">CARD</option>
            <option value="UPI">UPI</option>
            <option value="BANK_TRANSFER">
              BANK_TRANSFER
            </option>
            <option value="ONLINE">ONLINE</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Transaction Reference</label>
          <br />

          <input
            type="text"
            name="transactionReference"
            value={form.transactionReference}
            onChange={handleChange}
            placeholder="Example: TXN-10001"
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Payment Status</label>
          <br />

          <select
            name="paymentStatus"
            value={form.paymentStatus}
            onChange={handleChange}
            required
          >
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {editingId !== null
            ? "Update Payment"
            : "Create Payment"}
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

      <h2>Payment Records</h2>

      {loading && <p>Loading...</p>}

      {!loading && payments.length === 0 && (
        <p>No payment records found.</p>
      )}

      {payments.length > 0 && (
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
              <th>Fee ID</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
              <th>Transaction Reference</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{payment.paymentId}</td>
                <td>{payment.feeId}</td>
                <td>{payment.amount}</td>

                <td>
                  {payment.paymentDate
                    ? new Date(
                        payment.paymentDate
                      ).toLocaleString()
                    : "-"}
                </td>

                <td>{payment.paymentMethod}</td>

                <td>
                  {payment.transactionReference}
                </td>

                <td>{payment.paymentStatus}</td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(payment)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        payment.paymentId
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