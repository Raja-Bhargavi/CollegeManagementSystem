import { useEffect, useState, type CSSProperties } from "react";
import {
    getFees,
    createFee,
    updateFee,
    type Fee,
    type FeeRequest,
} from "../../api/feeApi";

const emptyForm: FeeRequest = {
    studentId: 0,
    semesterId: 0,
    feeType: "",
    amount: 0,
    dueDate: "",
    status: "PENDING",
};

export default function StaffFees() {
    const [fees, setFees] = useState<Fee[]>([]);
    const [formData, setFormData] = useState<FeeRequest>(
        emptyForm
    );

    const [editingFeeId, setEditingFeeId] =
        useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadFees();
    }, []);

    const loadFees = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getFees();
            setFees(data);
        } catch (err: any) {
            console.error("Failed to load fees:", err);

            setError(
                err?.response?.data?.message ||
                    "Failed to load fees."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingFeeId(null);
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
                name === "studentId" ||
                name === "semesterId" ||
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
            !formData.studentId ||
            !formData.semesterId ||
            !formData.feeType ||
            !formData.amount ||
            !formData.dueDate ||
            !formData.status
        ) {
            setError("Please fill in all fee fields.");
            return;
        }

        try {
            setSaving(true);

            if (editingFeeId === null) {
                await createFee(formData);
                setMessage("Fee created successfully.");
            } else {
                await updateFee(editingFeeId, formData);
                setMessage("Fee updated successfully.");
            }

            resetForm();
            await loadFees();
        } catch (err: any) {
            console.error("Failed to save fee:", err);

            setError(
                err?.response?.data?.message ||
                    "Failed to save fee."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (fee: Fee) => {
        setEditingFeeId(fee.feeId);

        setFormData({
            studentId: fee.studentId,
            semesterId: fee.semesterId,
            feeType: fee.feeType,
            amount: fee.amount,
            dueDate: fee.dueDate,
            status: fee.status,
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const getStatusStyle = (status: string) => {
        const normalizedStatus = status.toUpperCase();

        if (
            normalizedStatus === "PAID" ||
            normalizedStatus === "COMPLETED"
        ) {
            return {
                backgroundColor: "#dcfce7",
                color: "#166534",
            };
        }

        if (
            normalizedStatus === "PENDING" ||
            normalizedStatus === "UNPAID"
        ) {
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
            };
        }

        if (
            normalizedStatus === "OVERDUE"
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
                    Fees
                </h1>
                <p style={{ color: "#6b7280" }}>
                    Loading fees...
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ color: "#111827" }}>
                Fees
            </h1>

            <p
                style={{
                    color: "#6b7280",
                    marginBottom: "25px",
                }}
            >
                Manage student fee records
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
                    {editingFeeId === null
                        ? "Create Fee"
                        : "Edit Fee"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={formGridStyle}>
                        <div>
                            <label style={labelStyle}>
                                Student ID
                            </label>

                            <input
                                type="number"
                                name="studentId"
                                value={
                                    formData.studentId || ""
                                }
                                onChange={handleChange}
                                min="1"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Semester ID
                            </label>

                            <input
                                type="number"
                                name="semesterId"
                                value={
                                    formData.semesterId || ""
                                }
                                onChange={handleChange}
                                min="1"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Fee Type
                            </label>

                            <input
                                type="text"
                                name="feeType"
                                value={formData.feeType}
                                onChange={handleChange}
                                placeholder="Tuition Fee"
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
                                Due Date
                            </label>

                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
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
                                <option value="PENDING">
                                    PENDING
                                </option>
                                <option value="PAID">
                                    PAID
                                </option>
                                <option value="OVERDUE">
                                    OVERDUE
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
                                : editingFeeId === null
                                ? "Create Fee"
                                : "Update Fee"}
                        </button>

                        {editingFeeId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={secondaryButtonStyle}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div style={tableContainerStyle}>
                {fees.length === 0 ? (
                    <div style={emptyStyle}>
                        No fee records found.
                    </div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={{ backgroundColor: "#f9fafb" }}>
                                <th style={headerStyle}>
                                    Fee ID
                                </th>
                                <th style={headerStyle}>
                                    Student ID
                                </th>
                                <th style={headerStyle}>
                                    Semester ID
                                </th>
                                <th style={headerStyle}>
                                    Fee Type
                                </th>
                                <th style={headerStyle}>
                                    Amount
                                </th>
                                <th style={headerStyle}>
                                    Due Date
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
                            {fees.map((fee) => (
                                <tr key={fee.feeId}>
                                    <td style={cellStyle}>
                                        {fee.feeId}
                                    </td>
                                    <td style={cellStyle}>
                                        {fee.studentId}
                                    </td>
                                    <td style={cellStyle}>
                                        {fee.semesterId}
                                    </td>
                                    <td style={cellStyle}>
                                        {fee.feeType}
                                    </td>
                                    <td style={cellStyle}>
                                        {fee.amount}
                                    </td>
                                    <td style={cellStyle}>
                                        {fee.dueDate}
                                    </td>
                                    <td style={cellStyle}>
                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    fee.status
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
                                            {fee.status}
                                        </span>
                                    </td>
                                    <td style={cellStyle}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(fee)
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
    minWidth: "1000px",
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