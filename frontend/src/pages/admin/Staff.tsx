import { useEffect, useState } from "react";

import {
    createStaff,
    deleteStaff,
    getAvailableStaffAccounts,
    getStaff,
    updateStaff,
    
} from "../../api/staffApi";

import type{
    Department,
} from "../../api/departmentApi";

import{
     getDepartments,
} from "../../api/departmentApi";

import type{
    Staff,
    StaffAccountOption,
    StaffRequest,
} from "../../api/staffApi";


const initialForm: StaffRequest = {
    userId: 0,
    employeeNumber: "",
    firstName: "",
    lastName: "",
    phone: "",
    designation: "",
    departmentId: null,
    joiningDate: "",
    staffStatus: "ACTIVE",
};

function StaffPage() {

    const [staff, setStaff] = useState<Staff[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [staffAccounts, setStaffAccounts] =
        useState<StaffAccountOption[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingFormData, setLoadingFormData] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingStaffId, setEditingStaffId] =
        useState<number | null>(null);

    const [formData, setFormData] =
        useState<StaffRequest>(initialForm);

    const loadStaff = async () => {

        try {
            setLoading(true);
            setError("");

            const data = await getStaff();

            setStaff(data);

        } catch (err: any) {

            setError(
                err?.response?.data?.message ||
                "Failed to load staff"
            );

        } finally {
            setLoading(false);
        }
    };

    const loadFormData = async (
        includeUserId?: number
    ) => {

        try {
            setLoadingFormData(true);
            setError("");

            const [
                departmentData,
                accountData,
            ] = await Promise.all([
                getDepartments(),
                getAvailableStaffAccounts(includeUserId),
            ]);

            setDepartments(departmentData);
            setStaffAccounts(accountData);

        } catch (err: any) {

            setError(
                err?.response?.data?.message ||
                "Failed to load form data"
            );

        } finally {
            setLoadingFormData(false);
        }
    };

    useEffect(() => {
        loadStaff();
    }, []);

    const openAddForm = async () => {

        setEditingStaffId(null);
        setFormData(initialForm);
        setSuccess("");
        setError("");
        setShowForm(true);

        await loadFormData();
    };

    const openEditForm = async (item: Staff) => {

        setEditingStaffId(item.staffId);

        setFormData({
            userId: item.userId,
            employeeNumber: item.employeeNumber,
            firstName: item.firstName,
            lastName: item.lastName || "",
            phone: item.phone || "",
            designation: item.designation || "",
            departmentId: item.departmentId,
            joiningDate: item.joiningDate || "",
            staffStatus: item.staffStatus,
        });

        setSuccess("");
        setError("");
        setShowForm(true);

        await loadFormData(item.userId);
    };

    const closeForm = () => {

        setShowForm(false);
        setEditingStaffId(null);
        setFormData(initialForm);
        setStaffAccounts([]);
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
                name === "userId"
                    ? Number(value)
                    : name === "departmentId"
                        ? value === ""
                            ? null
                            : Number(value)
                        : value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.userId) {
            setError("Please select a staff user account.");
            return;
        }

        if (!formData.employeeNumber.trim()) {
            setError("Employee number is required.");
            return;
        }

        if (!formData.firstName.trim()) {
            setError("First name is required.");
            return;
        }

        if (!formData.staffStatus) {
            setError("Staff status is required.");
            return;
        }

        try {

            setSaving(true);

            if (editingStaffId === null) {

                await createStaff(formData);

                setSuccess(
                    "Staff member created successfully."
                );

            } else {

                await updateStaff(
                    editingStaffId,
                    formData
                );

                setSuccess(
                    "Staff member updated successfully."
                );
            }

            await loadStaff();

            closeForm();

        } catch (err: any) {

            setError(
                err?.response?.data?.message ||
                "Failed to save staff"
            );

        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (staffId: number) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this staff member?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await deleteStaff(staffId);

            setSuccess(
                "Staff member deleted successfully."
            );

            await loadStaff();

        } catch (err: any) {

            setError(
                err?.response?.data?.message ||
                "Failed to delete staff"
            );
        }
    };

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
                <h1>Staff Management</h1>

                {!showForm && (
                    <button onClick={openAddForm}>
                        Add Staff
                    </button>
                )}
            </div>

            {error && (
                <div
                    style={{
                        color: "red",
                        marginBottom: "15px",
                    }}
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    style={{
                        color: "green",
                        marginBottom: "15px",
                    }}
                >
                    {success}
                </div>
            )}

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        marginBottom: "25px",
                    }}
                >

                    <h2>
                        {editingStaffId === null
                            ? "Add Staff"
                            : "Edit Staff"}
                    </h2>

                    <div>
                        <label>Staff User Account</label>

                        <br />

                        <select
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            disabled={loadingFormData}
                        >
                            <option value={0}>
                                Select staff account
                            </option>

                            {staffAccounts.map((account) => (
                                <option
                                    key={account.userId}
                                    value={account.userId}
                                >
                                    {account.username} - {account.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <br />

                    <div>
                        <label>Employee Number</label>

                        <br />

                        <input
                            name="employeeNumber"
                            value={formData.employeeNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <br />

                    <div>
                        <label>First Name</label>

                        <br />

                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>

                    <br />

                    <div>
                        <label>Last Name</label>

                        <br />

                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>

                    <br />

                    <div>
                        <label>Phone</label>

                        <br />

                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <br />

                    <div>
                        <label>Designation</label>

                        <br />

                        <input
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                        />
                    </div>

                    <br />

                    <div>
                        <label>Department</label>

                        <br />

                        <select
                            name="departmentId"
                            value={
                                formData.departmentId ?? ""
                            }
                            onChange={handleChange}
                        >
                            <option value="">
                                No Department
                            </option>

                            {departments.map((department) => (
                                <option
                                    key={department.departmentId}
                                    value={department.departmentId}
                                >
                                    {department.departmentCode} -{" "}
                                    {department.departmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <br />

                    <div>
                        <label>Joining Date</label>

                        <br />

                        <input
                            type="date"
                            name="joiningDate"
                            value={formData.joiningDate}
                            onChange={handleChange}
                        />
                    </div>

                    <br />

                    <div>
                        <label>Staff Status</label>

                        <br />

                        <select
                            name="staffStatus"
                            value={formData.staffStatus}
                            onChange={handleChange}
                        >
                            <option value="ACTIVE">
                                ACTIVE
                            </option>

                            <option value="INACTIVE">
                                INACTIVE
                            </option>

                            <option value="ON_LEAVE">
                                ON_LEAVE
                            </option>
                        </select>
                    </div>

                    <br />

                    <button
                        type="submit"
                        disabled={
                            saving ||
                            loadingFormData
                        }
                    >
                        {saving
                            ? "Saving..."
                            : editingStaffId === null
                                ? "Create Staff"
                                : "Update Staff"}
                    </button>

                    {" "}

                    <button
                        type="button"
                        onClick={closeForm}
                    >
                        Cancel
                    </button>

                </form>
            )}

            {loading ? (
                <p>Loading staff...</p>
            ) : staff.length === 0 ? (
                <p>No staff records found.</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Employee Number</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {staff.map((item) => {

                            const department =
                                departments.find(
                                    (d) =>
                                        d.departmentId ===
                                        item.departmentId
                                );

                            return (
                                <tr key={item.staffId}>

                                    <td>
                                        {item.staffId}
                                    </td>

                                    <td>
                                        {item.userId}
                                    </td>

                                    <td>
                                        {item.employeeNumber}
                                    </td>

                                    <td>
                                        {item.firstName}{" "}
                                        {item.lastName}
                                    </td>

                                    <td>
                                        {item.designation}
                                    </td>

                                    <td>
                                        {department
                                            ? department.departmentName
                                            : "-"}
                                    </td>

                                    <td>
                                        {item.staffStatus}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                openEditForm(item)
                                            }
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    item.staffId
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default StaffPage;