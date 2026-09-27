import { useEffect, useState } from "react";

import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../../api/departmentApi";


import type {
    Department,
    DepartmentRequest,
} from "../../api/departmentApi";


const emptyForm: DepartmentRequest = {
    departmentCode: "",
    departmentName: "",
    description: "",
};

const DepartmentPage = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingDepartmentId, setEditingDepartmentId] =
        useState<number | null>(null);

    const [formData, setFormData] =
        useState<DepartmentRequest>(emptyForm);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getDepartments();
            setDepartments(data);
        } catch (err: any) {
            console.error("Failed to load departments:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to load departments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingDepartmentId(null);
        setShowForm(false);
    };

    const handleAdd = () => {
        setError("");
        setSuccess("");
        setFormData(emptyForm);
        setEditingDepartmentId(null);
        setShowForm(true);
    };

    const handleEdit = (department: Department) => {
        setError("");
        setSuccess("");

        setFormData({
            departmentCode: department.departmentCode,
            departmentName: department.departmentName,
            description: department.description || "",
        });

        setEditingDepartmentId(department.departmentId);
        setShowForm(true);
    };

    const validateForm = (): boolean => {
        if (!formData.departmentCode.trim()) {
            setError("Department code is required.");
            return false;
        }

        if (!formData.departmentName.trim()) {
            setError("Department name is required.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            if (editingDepartmentId !== null) {
                await updateDepartment(
                    editingDepartmentId,
                    formData
                );

                setSuccess(
                    "Department updated successfully."
                );
            } else {
                await createDepartment(formData);

                setSuccess(
                    "Department created successfully."
                );
            }

            resetForm();
            await loadDepartments();
        } catch (err: any) {
            console.error(
                "Failed to save department:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Failed to save department.";

            if (
                typeof message === "string" &&
                message.toLowerCase().includes("code")
            ) {
                setError(
                    "Department code already exists."
                );
            } else if (
                typeof message === "string" &&
                message.toLowerCase().includes("name")
            ) {
                setError(
                    "Department name already exists."
                );
            } else {
                setError(
                    typeof message === "string"
                        ? message
                        : "Failed to save department."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        departmentId: number
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this department?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await deleteDepartment(departmentId);

            setSuccess(
                "Department deleted successfully."
            );

            await loadDepartments();
        } catch (err: any) {
            console.error(
                "Failed to delete department:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to delete department. It may be referenced by other records."
            );
        }
    };

    if (loading) {
        return <div>Loading departments...</div>;
    }

    return (
        <div style={{ padding: "24px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h1>Departments</h1>

                {!showForm && (
                    <button onClick={handleAdd}>
                        Add Department
                    </button>
                )}
            </div>

            {error && (
                <div
                    style={{
                        marginBottom: "15px",
                        padding: "10px",
                        background: "#ffe5e5",
                    }}
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    style={{
                        marginBottom: "15px",
                        padding: "10px",
                        background: "#e5ffe5",
                    }}
                >
                    {success}
                </div>
            )}

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        marginBottom: "30px",
                        padding: "20px",
                        border: "1px solid #ddd",
                    }}
                >
                    <h2>
                        {editingDepartmentId !== null
                            ? "Edit Department"
                            : "Add Department"}
                    </h2>

                    <div style={{ marginBottom: "15px" }}>
                        <label>
                            Department Code
                        </label>

                        <input
                            type="text"
                            name="departmentCode"
                            value={formData.departmentCode}
                            onChange={handleInputChange}
                            required
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>
                            Department Name
                        </label>

                        <input
                            type="text"
                            name="departmentName"
                            value={formData.departmentName}
                            onChange={handleInputChange}
                            required
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : editingDepartmentId !== null
                            ? "Update Department"
                            : "Create Department"}
                    </button>

                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={saving}
                        style={{ marginLeft: "10px" }}
                    >
                        Cancel
                    </button>
                </form>
            )}

            {departments.length === 0 ? (
                <p>No departments found.</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "10px",
                                }}
                            >
                                ID
                            </th>

                            <th
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "10px",
                                }}
                            >
                                Code
                            </th>

                            <th
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "10px",
                                }}
                            >
                                Name
                            </th>

                            <th
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "10px",
                                }}
                            >
                                Description
                            </th>

                            <th
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "10px",
                                }}
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {departments.map((department) => (
                            <tr
                                key={
                                    department.departmentId
                                }
                            >
                                <td
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "10px",
                                    }}
                                >
                                    {
                                        department.departmentId
                                    }
                                </td>

                                <td
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "10px",
                                    }}
                                >
                                    {
                                        department.departmentCode
                                    }
                                </td>

                                <td
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "10px",
                                    }}
                                >
                                    {
                                        department.departmentName
                                    }
                                </td>

                                <td
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "10px",
                                    }}
                                >
                                    {
                                        department.description ||
                                        "-"
                                    }
                                </td>

                                <td
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "10px",
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                department
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                department.departmentId
                                            )
                                        }
                                        style={{
                                            marginLeft: "8px",
                                        }}
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
};

export default DepartmentPage;
