import { useEffect, useState } from "react";

import {
    getFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getAvailableFacultyAccounts,
} from "../../api/facultyApi";

import type {
    Faculty,
    FacultyRequest,
    FacultyAccountOption,
} from "../../api/facultyApi";

import {
    getDepartments,
} from "../../api/departmentApi";

import type {
    Department,
} from "../../api/departmentApi";


const emptyForm: FacultyRequest = {
    userId: 0,
    employeeNumber: "",
    firstName: "",
    lastName: "",
    phone: "",
    designation: "",
    departmentId: 0,
    joiningDate: "",
    facultyStatus: "ACTIVE",
};


const FacultyPage = () => {

    const [faculty, setFaculty] = useState<Faculty[]>([]);

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [facultyAccounts, setFacultyAccounts] =
        useState<FacultyAccountOption[]>([]);

    const [loading, setLoading] = useState(true);

    const [loadingDepartments, setLoadingDepartments] =
        useState(false);

    const [loadingFacultyAccounts, setLoadingFacultyAccounts] =
        useState(false);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingFacultyId, setEditingFacultyId] =
        useState<number | null>(null);

    const [formData, setFormData] =
        useState<FacultyRequest>(emptyForm);


    const loadFaculty = async () => {

        try {
            setLoading(true);
            setError("");

            const data = await getFaculty();

            setFaculty(data);

        } catch (err: any) {

            console.error(
                "Failed to load faculty:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load faculty."
            );

        } finally {
            setLoading(false);
        }
    };


    const loadDepartments = async () => {

        try {

            setLoadingDepartments(true);

            const data = await getDepartments();

            setDepartments(data);

        } catch (err: any) {

            console.error(
                "Failed to load departments:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load departments."
            );

        } finally {

            setLoadingDepartments(false);
        }
    };


    const loadFacultyAccounts = async (
        includeUserId?: number
    ) => {

        try {

            setLoadingFacultyAccounts(true);

            const data =
                await getAvailableFacultyAccounts(
                    includeUserId
                );

            setFacultyAccounts(data);

        } catch (err: any) {

            console.error(
                "Failed to load faculty accounts:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load faculty user accounts."
            );

        } finally {

            setLoadingFacultyAccounts(false);
        }
    };


    useEffect(() => {

        loadFaculty();
        loadDepartments();

    }, []);


    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,

            [name]:
                name === "userId" ||
                name === "departmentId"
                    ? Number(value)
                    : value,
        }));
    };


    const resetForm = () => {

        setFormData(emptyForm);

        setEditingFacultyId(null);

        setFacultyAccounts([]);

        setShowForm(false);
    };


    const handleAdd = async () => {

        setError("");
        setSuccess("");

        setFormData(emptyForm);

        setEditingFacultyId(null);

        setShowForm(true);

        await Promise.all([
            loadDepartments(),
            loadFacultyAccounts(),
        ]);
    };


    const handleEdit = async (
        member: Faculty
    ) => {

        setError("");
        setSuccess("");

        setFormData({
            userId: member.userId,
            employeeNumber:
                member.employeeNumber,
            firstName:
                member.firstName,
            lastName:
                member.lastName || "",
            phone:
                member.phone || "",
            designation:
                member.designation || "",
            departmentId:
                member.departmentId,
            joiningDate:
                member.joiningDate || "",
            facultyStatus:
                member.facultyStatus,
        });

        setEditingFacultyId(
            member.facultyId
        );

        setShowForm(true);

        await Promise.all([
            loadDepartments(),
            loadFacultyAccounts(member.userId),
        ]);
    };


    const validateForm = (): boolean => {

        if (
            !formData.userId ||
            formData.userId <= 0
        ) {

            setError(
                "Please select a faculty user account."
            );

            return false;
        }


        if (!formData.employeeNumber.trim()) {

            setError(
                "Employee number is required."
            );

            return false;
        }


        if (!formData.firstName.trim()) {

            setError(
                "First name is required."
            );

            return false;
        }


        if (
            !formData.departmentId ||
            formData.departmentId <= 0
        ) {

            setError(
                "Please select a department."
            );

            return false;
        }


        if (!formData.facultyStatus.trim()) {

            setError(
                "Faculty status is required."
            );

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


            if (
                editingFacultyId !== null
            ) {

                await updateFaculty(
                    editingFacultyId,
                    formData
                );

                setSuccess(
                    "Faculty updated successfully."
                );

            } else {

                await createFaculty(
                    formData
                );

                setSuccess(
                    "Faculty created successfully."
                );
            }


            resetForm();

            await loadFaculty();

        } catch (err: any) {

            console.error(
                "Failed to save faculty:",
                err
            );


            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Failed to save faculty.";


            setError(
                typeof message === "string"
                    ? message
                    : "Failed to save faculty."
            );

        } finally {

            setSaving(false);
        }
    };


    const handleDelete = async (
        facultyId: number
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this faculty member?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setSuccess("");

            await deleteFaculty(
                facultyId
            );

            setSuccess(
                "Faculty deleted successfully."
            );

            await loadFaculty();

        } catch (err: any) {

            console.error(
                "Failed to delete faculty:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to delete faculty."
            );
        }
    };


    if (loading) {
        return (
            <div>
                Loading faculty...
            </div>
        );
    }


    return (
        <div style={{ padding: "24px" }}>

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >

                <h1>Faculty</h1>

                {!showForm && (
                    <button
                        onClick={handleAdd}
                    >
                        Add Faculty
                    </button>
                )}

            </div>


            {error && (
                <div
                    style={{
                        marginBottom: "15px",
                        padding: "10px",
                        background:
                            "#ffe5e5",
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
                        background:
                            "#e5ffe5",
                    }}
                >
                    {success}
                </div>
            )}


            {showForm && (

                <form
                    onSubmit={
                        handleSubmit
                    }

                    style={{
                        marginBottom:
                            "30px",
                        padding: "20px",
                        border:
                            "1px solid #ddd",
                    }}
                >

                    <h2>
                        {
                            editingFacultyId !==
                            null
                                ? "Edit Faculty"
                                : "Add Faculty"
                        }
                    </h2>


                    {/* Faculty User Account */}

                    <div
                        style={{
                            marginBottom:
                                "15px",
                        }}
                    >

                        <label>
                            Faculty User Account
                        </label>


                        <select
                            name="userId"
                            value={
                                formData.userId ||
                                ""
                            }
                            onChange={
                                handleInputChange
                            }
                            required
                            disabled={
                                loadingFacultyAccounts
                            }

                            style={{
                                display:
                                    "block",
                                width:
                                    "100%",
                                padding:
                                    "8px",
                                marginTop:
                                    "5px",
                            }}
                        >

                            <option value="">
                                {loadingFacultyAccounts
                                    ? "Loading faculty accounts..."
                                    : "Select Faculty User"}
                            </option>


                            {facultyAccounts.map(
                                (account) => (

                                    <option
                                        key={
                                            account.userId
                                        }
                                        value={
                                            account.userId
                                        }
                                    >
                                        {account.username}
                                        {" - "}
                                        {account.email}
                                    </option>

                                )
                            )}

                        </select>


                        {!loadingFacultyAccounts &&
                            facultyAccounts.length ===
                                0 && (

                                <small>
                                    No available FACULTY
                                    user accounts found.
                                </small>
                            )}

                    </div>


                    {/* Employee Number */}

                    <div
                        style={{
                            marginBottom:
                                "15px",
                        }}
                    >

                        <label>
                            Employee Number
                        </label>

                        <input
                            type="text"
                            name="employeeNumber"
                            value={
                                formData.employeeNumber
                            }
                            onChange={
                                handleInputChange
                            }
                            required

                            style={{
                                display:
                                    "block",
                                width:
                                    "100%",
                                padding:
                                    "8px",
                                marginTop:
                                    "5px",
                            }}
                        />

                    </div>


                    {/* First Name */}

                    <div
                        style={{
                            marginBottom:
                                "15px",
                        }}
                    >

                        <label>
                            First Name
                        </label>

                        <input
                            type="text"
                            name="firstName"
                            value={
                                formData.firstName
                            }
                            onChange={
                                handleInputChange
                            }
                            required

                            style={{
                                display:
                                    "block",
                                width:
                                    "100%",
                                padding:
                                    "8px",
                                marginTop:
                                    "5px",
                            }}
                        />

                    </div>


                    {/* Last Name */}

                    <div
                        style={{
                            marginBottom:
                                "15px",
                        }}
                    >

                        <label>
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="lastName"
                            value={
                                formData.lastName
                            }
                            onChange={
                                handleInputChange
                            }

                            style={{
                                display:
                                    "block",
                                width:
                                    "100%",
                                padding:
                                    "8px",
                                marginTop:
                                    "5px",
                            }}
                        />

                    </div>


                    {/* Phone */}

                    <div
                        style={{
                            marginBottom:
                                "15px",
                        }}
                    >

                        <label>
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleInputChange
                            }

                            style={{
                                display:
                                    "block",
                                width:
                                    "100%",
                                padding:
                                    "8px",
                                marginTop:
                                    "5px",
                            }}
                        />

                    </div>


                    {/* Designation */}

                    <div
                        style={{
                            marginBottom:
                                "15px",
                        }}
                    >

                        <label>
                            Designation
                        </label>

                        <input
                            type="text"
                            name="designation"
                            value={
                                formData.designation
                            }
                            onChange={
                                handleInputChange
                            }

                            style={{
                                display:
                                    "block",
                                width:
                                    "100%",
                                padding:
                                    "8px",
                                marginTop:
                                    "5px",
                            }}
                        />

                    </div>


                    {/* Department */}

                    <div
                        style={{
                            marginBottom:
                                "15px",
                        }}
                    >

                        <label>
                            Department
                        </label>


                        <select
                            name="departmentId"
                            value={
                                formData.departmentId ||
                                ""
                            }
                            onChange={
                                handleInputChange
                            }
                            required
                            disabled={
                                loadingDepartments
                            }

                            style={{
                                display:
                                    "block",
                                width:
                                    "100%",
                                padding:
                                    "8px",
                                marginTop:
                                    "5px",
                            }}
                        >

                            <option value="">
                                {loadingDepartments
                                    ? "Loading departments..."
                                    : "Select Department"}
                            </option>


                            {departments.map(
                                (department) => (

                                    <option
                                        key={
                                            department.departmentId
                                        }
                                        value={
                                            department.departmentId
                                        }
                                    >
                                        {
                                            department.departmentCode
                                        }
                                        {" - "}
                                        {
                                            department.departmentName
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* Joining Date */}

                    <div
                        style={{
                            marginBottom:
                                "15px",
                        }}
                    >

                        <label>
                            Joining Date
                        </label>

                        <input
                            type="date"
                            name="joiningDate"
                            value={
                                formData.joiningDate
                            }
                            onChange={
                                handleInputChange
                            }

                            style={{
                                display:
                                    "block",
                                width:
                                    "100%",
                                padding:
                                    "8px",
                                marginTop:
                                    "5px",
                            }}
                        />

                    </div>


                    {/* Faculty Status */}

                    <div
                        style={{
                            marginBottom:
                                "15px",
                        }}
                    >

                        <label>
                            Faculty Status
                        </label>


                        <select
                            name="facultyStatus"
                            value={
                                formData.facultyStatus
                            }
                            onChange={
                                handleInputChange
                            }
                            required

                            style={{
                                display:
                                    "block",
                                width:
                                    "100%",
                                padding:
                                    "8px",
                                marginTop:
                                    "5px",
                            }}
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


                    <button
                        type="submit"
                        disabled={
                            saving ||
                            loadingFacultyAccounts ||
                            loadingDepartments
                        }
                    >
                        {saving
                            ? "Saving..."
                            : editingFacultyId !==
                              null
                            ? "Update Faculty"
                            : "Create Faculty"}
                    </button>


                    <button
                        type="button"
                        onClick={
                            resetForm
                        }
                        disabled={saving}

                        style={{
                            marginLeft:
                                "10px",
                        }}
                    >
                        Cancel
                    </button>

                </form>
            )}


            {faculty.length === 0 ? (

                <p>
                    No faculty records found.
                </p>

            ) : (

                <table
                    style={{
                        width: "100%",
                        borderCollapse:
                            "collapse",
                    }}
                >

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>User</th>

                            <th>
                                Employee Number
                            </th>

                            <th>Name</th>

                            <th>
                                Designation
                            </th>

                            <th>
                                Department
                            </th>

                            <th>Status</th>

                            <th>Actions</th>

                        </tr>

                    </thead>


                    <tbody>

                        {faculty.map(
                            (member) => {

                                const department =
                                    departments.find(
                                        (d) =>
                                            d.departmentId ===
                                            member.departmentId
                                    );


                                return (

                                    <tr
                                        key={
                                            member.facultyId
                                        }
                                    >

                                        <td>
                                            {
                                                member.facultyId
                                            }
                                        </td>

                                        <td>
                                            {
                                                member.userId
                                            }
                                        </td>

                                        <td>
                                            {
                                                member.employeeNumber
                                            }
                                        </td>

                                        <td>
                                            {
                                                member.firstName
                                            }{" "}
                                            {
                                                member.lastName
                                            }
                                        </td>

                                        <td>
                                            {
                                                member.designation ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {department
                                                ? `${department.departmentCode} - ${department.departmentName}`
                                                : member.departmentId}
                                        </td>

                                        <td>
                                            {
                                                member.facultyStatus
                                            }
                                        </td>

                                        <td>

                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        member
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        member.facultyId
                                                    )
                                                }

                                                style={{
                                                    marginLeft:
                                                        "8px",
                                                }}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                );
                            }
                        )}

                    </tbody>

                </table>
            )}

        </div>
    );
};


export default FacultyPage;
