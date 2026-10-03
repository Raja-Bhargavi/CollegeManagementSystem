import { useEffect, useState, type CSSProperties } from "react";
import {
    getPayments,
    createPayment,
    updatePayment,
    type Payment,
    type PaymentRequest,
} from "../../api/paymentApi";

const emptyForm: PaymentRequest = {
    feeId: 0,
    amount: 0,
    paymentMethod: "",
    transactionReference: "",
    paymentStatus: "PENDING",
};

export default function StaffPayments() {
    const [payments, setPayments] =
        useState<Payment[]>([]);

    const [formData, setFormData] =
        useState<PaymentRequest>(emptyForm);

    const [editingPaymentId, setEditingPaymentId] =
        useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getPayments();
            setPayments(data);
        } catch (err: any) {
            console.error(
                "Failed to load payments:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "Failed to load payments."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingPaymentId(null);
        setMessage("");
        setError("");
    };

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "feeId" ||
                name === "amount"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (
            !formData.feeId ||
            !formData.amount ||
            !formData.paymentMethod ||
            !formData.paymentStatus
        ) {
            setError(
                "Please fill in all required payment fields."
            );
            return;
        }

        try {
            setSaving(true);

            if (editingPaymentId === null) {
                await createPayment(formData);
                setMessage(
                    "Payment created successfully."
                );
            } else {
                await updatePayment(
                    editingPaymentId,
                    formData
                );

                setMessage(
                    "Payment updated successfully."
                );
            }

            resetForm();
            await loadPayments();
        } catch (err: any) {
            console.error(
                "Failed to save payment:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "Failed to save payment."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (payment: Payment) => {
        setEditingPaymentId(payment.paymentId);

        setFormData({
            feeId: payment.feeId,
            amount: payment.amount,
            paymentMethod:
                payment.paymentMethod,
            transactionReference:
                payment.transactionReference || "",
            paymentStatus:
                payment.paymentStatus,
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const getStatusStyle = (status: string) => {
        const normalizedStatus =
            status.toUpperCase();

        if (
            normalizedStatus === "PAID" ||
            normalizedStatus === "SUCCESS" ||
            normalizedStatus === "COMPLETED"
        ) {
            return {
                backgroundColor: "#dcfce7",
                color: "#166534",
            };
        }

        if (
            normalizedStatus === "PENDING"
        ) {
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
            };
        }

        if (
            normalizedStatus === "FAILED" ||
            normalizedStatus === "CANCELLED"
        ) {
            return {
                backgroundColor: "#fee2e2",
                color: "#991b1b",
            };
        }

        return {
            backgroundColor: "#e5e7eb",
            color: "#374151",
        };
    };

    if (loading) {
        return (
            <div>
                <h1 style={{ color: "#111827" }}>
                    Payments
                </h1>

                <p style={{ color: "#6b7280" }}>
                    Loading payments...
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ color: "#111827" }}>
                Payments
            </h1>

            <p
                style={{
                    color: "#6b7280",
                    marginBottom: "25px",
                }}
            >
                Manage student fee payments
            </p>

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
                    {editingPaymentId === null
                        ? "Create Payment"
                        : "Edit Payment"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={formGridStyle}>
                        <div>
                            <label style={labelStyle}>
                                Fee ID
                            </label>

                            <input
                                type="number"
                                name="feeId"
                                value={
                                    formData.feeId || ""
                                }
                                onChange={handleChange}
                                min="1"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Amount
                            </label>

                            <input
                                type="number"
                                name="amount"
                                value={
                                    formData.amount || ""
                                }
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Payment Method
                            </label>

                            <select
                                name="paymentMethod"
                                value={
                                    formData.paymentMethod
                                }
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="">
                                    Select Method
                                </option>
                                <option value="CASH">
                                    CASH
                                </option>
                                <option value="CARD">
                                    CARD
                                </option>
                                <option value="UPI">
                                    UPI
                                </option>
                                <option value="BANK_TRANSFER">
                                    BANK TRANSFER
                                </option>
                                <option value="ONLINE">
                                    ONLINE
                                </option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Transaction Reference
                            </label>

                            <input
                                type="text"
                                name="transactionReference"
                                value={
                                    formData.transactionReference
                                }
                                onChange={handleChange}
                                placeholder="Transaction reference"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Payment Status
                            </label>

                            <select
                                name="paymentStatus"
                                value={
                                    formData.paymentStatus
                                }
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="PENDING">
                                    PENDING
                                </option>
                                <option value="SUCCESS">
                                    SUCCESS
                                </option>
                                <option value="PAID">
                                    PAID
                                </option>
                                <option value="FAILED">
                                    FAILED
                                </option>
                                <option value="CANCELLED">
                                    CANCELLED
                                </option>
                            </select>
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
                                : editingPaymentId ===
                                  null
                                ? "Create Payment"
                                : "Update Payment"}
                        </button>

                        {editingPaymentId !== null && (
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
                {payments.length === 0 ? (
                    <div style={emptyStyle}>
                        No payment records found.
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
                                    Payment ID
                                </th>

                                <th style={headerStyle}>
                                    Fee ID
                                </th>

                                <th style={headerStyle}>
                                    Amount
                                </th>

                                <th style={headerStyle}>
                                    Payment Date
                                </th>

                                <th style={headerStyle}>
                                    Payment Method
                                </th>

                                <th style={headerStyle}>
                                    Transaction Reference
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
                            {payments.map((payment) => (
                                <tr
                                    key={
                                        payment.paymentId
                                    }
                                >
                                    <td style={cellStyle}>
                                        {
                                            payment.paymentId
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {payment.feeId}
                                    </td>

                                    <td style={cellStyle}>
                                        {payment.amount}
                                    </td>

                                    <td style={cellStyle}>
                                        {payment.paymentDate
                                            ? new Date(
                                                  payment.paymentDate
                                              ).toLocaleString()
                                            : "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {
                                            payment.paymentMethod
                                        }
                                    </td>

                                    <td style={cellStyle}>
                                        {payment.transactionReference ||
                                            "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    payment.paymentStatus
                                                ),
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
                                            {
                                                payment.paymentStatus
                                            }
                                        </span>
                                    </td>

                                    <td style={cellStyle}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    payment
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