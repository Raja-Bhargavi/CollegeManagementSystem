import { useEffect, useState } from "react";
import axios from "axios";

import {
    getStudents,
    deleteStudent,
    createStudent,
    updateStudent,
    getAvailableStudentAccounts,
} from "../../api/studentApi";

import type {
    Student,
    StudentRequest,
    UserAccountOption,
} from "../../api/studentApi";

export default function Students() {

    const [students, setStudents] = useState<Student[]>([]);

    const [studentAccounts, setStudentAccounts] =
        useState<UserAccountOption[]>([]);

    const [loading, setLoading] = useState(true);

    const [loadingStudentAccounts, setLoadingStudentAccounts] =
        useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingStudentId, setEditingStudentId] =
        useState<number | null>(null);

    const [saving, setSaving] = useState(false);

    const emptyForm: StudentRequest = {
        userId: 0,
        rollNumber: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        programId: 0,
        admissionYear: new Date().getFullYear(),
        currentSemester: 1,
        studentStatus: "ACTIVE",
    };

    const [formData, setFormData] =
        useState<StudentRequest>(emptyForm);

    // =====================================================
    // LOAD STUDENTS
    // =====================================================

    const loadStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getStudents();

            setStudents(data);

        } catch (err) {

            console.error(
                "Failed to load students:",
                err
            );

            setError(
                getBackendErrorMessage(
                    err,
                    "Unable to load students."
                )
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // =====================================================
    // LOAD AVAILABLE STUDENT USER ACCOUNTS
    // =====================================================

    const loadStudentAccounts = async (
        includeUserId?: number
    ) => {

        try {

            setLoadingStudentAccounts(true);

            const data =
                await getAvailableStudentAccounts(
                    includeUserId
                );

            setStudentAccounts(data);

        } catch (err) {

            console.error(
                "Failed to load student accounts:",
                err
            );

            setError(
                getBackendErrorMessage(
                    err,
                    "Unable to load student user accounts."
                )
            );

        } finally {

            setLoadingStudentAccounts(false);
        }
    };

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setError("");
        setSuccess("");

        setFormData((previous) => ({
            ...previous,

            [name]:
                name === "userId" ||
                name === "programId" ||
                name === "admissionYear" ||
                name === "currentSemester"
                    ? Number(value)
                    : value,
        }));
    };

    // =====================================================
    // FRONTEND VALIDATION
    // =====================================================

    const validateForm = (): string | null => {

        // User account
        if (
            !Number.isInteger(formData.userId) ||
            formData.userId <= 0
        ) {
            return "Please select a student user account.";
        }

        // Roll number
        if (!formData.rollNumber.trim()) {
            return "Invalid Roll Number. Roll Number cannot be empty.";
        }

        // First name
        if (
            !/^[A-Za-z ]+$/.test(
                formData.firstName.trim()
            )
        ) {
            return "Invalid first name. Only letters and spaces are allowed.";
        }

        // Last name
        if (
            !/^[A-Za-z ]+$/.test(
                formData.lastName.trim()
            )
        ) {
            return "Invalid last name. Only letters and spaces are allowed.";
        }

        // Date of birth
        if (!formData.dateOfBirth) {
            return "Invalid date of birth. Please select a date.";
        }

        // Gender
        if (!formData.gender) {
            return "Invalid gender. Please select a gender.";
        }

        // Phone
        if (
            !/^[6-9]\d{9}$/.test(
                formData.phone.trim()
            )
        ) {
            return "Invalid phone number. Enter a valid 10-digit Indian mobile number.";
        }

        // Program
        if (
            !Number.isInteger(formData.programId) ||
            formData.programId <= 0
        ) {
            return "Invalid Program ID. Enter a valid positive Program ID.";
        }

        // Admission year
        const currentYear =
            new Date().getFullYear();

        if (
            !Number.isInteger(
                formData.admissionYear
            ) ||
            formData.admissionYear < 2000 ||
            formData.admissionYear > currentYear
        ) {
            return `Invalid admission year. Enter a year between 2000 and ${currentYear}.`;
        }

        // Semester
        if (
            !Number.isInteger(
                formData.currentSemester
            ) ||
            formData.currentSemester < 1 ||
            formData.currentSemester > 8
        ) {
            return "Invalid semester. Semester must be between 1 and 8.";
        }

        // Status
        if (!formData.studentStatus) {
            return "Invalid student status. Please select a status.";
        }

        return null;
    };

    // =====================================================
    // ADD STUDENT
    // =====================================================

    const handleAddStudent = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {

            setSaving(true);

            await createStudent(formData);

            setSuccess(
                "Student added successfully."
            );

            setFormData(emptyForm);

            setStudentAccounts([]);

            setShowForm(false);

            await loadStudents();

        } catch (err) {

            console.error(
                "Failed to create student:",
                err
            );

            setError(
                getStudentErrorMessage(err)
            );

        } finally {

            setSaving(false);
        }
    };

    // =====================================================
    // EDIT STUDENT
    // =====================================================

    const handleEdit = async (
        student: Student
    ) => {

        setEditingStudentId(
            student.studentId
        );

        setFormData({
            userId: student.userId,
            rollNumber: student.rollNumber,
            firstName: student.firstName,
            lastName: student.lastName,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            phone: student.phone,
            programId: student.programId,
            admissionYear: student.admissionYear,
            currentSemester: student.currentSemester,
            studentStatus: student.studentStatus,
        });

        setError("");
        setSuccess("");

        await loadStudentAccounts(
            student.userId
        );

        setShowForm(true);
    };

    // =====================================================
    // UPDATE STUDENT
    // =====================================================

    const handleUpdateStudent = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        if (editingStudentId === null) {

            setError(
                "No student selected for editing."
            );

            return;
        }

        try {

            setSaving(true);

            await updateStudent(
                editingStudentId,
                formData
            );

            setSuccess(
                "Student updated successfully."
            );

            setEditingStudentId(null);

            setFormData(emptyForm);

            setStudentAccounts([]);

            setShowForm(false);

            await loadStudents();

        } catch (err) {

            console.error(
                "Failed to update student:",
                err
            );

            setError(
                getStudentErrorMessage(err)
            );

        } finally {

            setSaving(false);
        }
    };

    // =====================================================
    // DELETE STUDENT
    // =====================================================

    const handleDelete = async (
        studentId: number
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this student?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await deleteStudent(
                studentId
            );

            setSuccess(
                "Student deleted successfully."
            );

            await loadStudents();

        } catch (err) {

            console.error(
                "Failed to delete student:",
                err
            );

            setError(
                getStudentErrorMessage(err)
            );
        }
    };

    // =====================================================
    // CANCEL FORM
    // =====================================================

    const handleCancelForm = () => {

        setShowForm(false);

        setEditingStudentId(null);

        setFormData(emptyForm);

        setStudentAccounts([]);

        setError("");
        setSuccess("");
    };

    // =====================================================
    // OPEN ADD STUDENT FORM
    // =====================================================

    const handleOpenAddForm = async () => {

        setEditingStudentId(null);

        setFormData(emptyForm);

        setError("");
        setSuccess("");

        await loadStudentAccounts();

        setShowForm(true);
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return <h2>Loading students...</h2>;
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div>

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >

                <h1>Students</h1>

                {!showForm && (
                    <button
                        onClick={
                            handleOpenAddForm
                        }
                    >
                        + Add Student
                    </button>
                )}

            </div>

            {/* SUCCESS */}

            {success && (
                <div
                    style={{
                        padding: "12px",
                        marginBottom: "15px",
                        border: "1px solid #28a745",
                        backgroundColor: "#e9f7ef",
                        color: "#1e7e34",
                        borderRadius: "5px",
                    }}
                >
                    {success}
                </div>
            )}

            {/* ERROR */}

            {error && (
                <div
                    style={{
                        padding: "12px",
                        marginBottom: "15px",
                        border: "1px solid #dc3545",
                        backgroundColor: "#fdecea",
                        color: "#b02a37",
                        borderRadius: "5px",
                        fontWeight: "500",
                    }}
                >
                    {error}
                </div>
            )}

            {/* FORM */}

            {showForm && (

                <form
                    onSubmit={
                        editingStudentId === null
                            ? handleAddStudent
                            : handleUpdateStudent
                    }
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        marginBottom: "30px",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                    }}
                >

                    <h2>
                        {editingStudentId === null
                            ? "Add Student"
                            : "Edit Student"}
                    </h2>

                    {/* STUDENT USER ACCOUNT */}

                    <div
                        style={
                            formGroupStyle
                        }
                    >

                        <label>
                            Student User Account
                        </label>

                        <select
                            name="userId"
                            value={
                                formData.userId
                            }
                            onChange={
                                handleInputChange
                            }
                            required
                            disabled={
                                loadingStudentAccounts
                            }
                        >

                            <option value={0}>
                                {loadingStudentAccounts
                                    ? "Loading student accounts..."
                                    : "Select student account"}
                            </option>

                            {studentAccounts.map(
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
                                        {" — "}
                                        {account.email}
                                    </option>

                                )
                            )}

                        </select>

                        {!loadingStudentAccounts &&
                            studentAccounts.length === 0 && (
                                <small
                                    style={{
                                        color: "#b02a37",
                                    }}
                                >
                                    No available student
                                    user accounts.
                                    Create a STUDENT
                                    user account first.
                                </small>
                            )}

                    </div>

                    {/* ROLL NUMBER */}

                    <FormField
                        label="Roll Number"
                        name="rollNumber"
                        type="text"
                        value={
                            formData.rollNumber
                        }
                        onChange={
                            handleInputChange
                        }
                        required
                    />

                    {/* FIRST NAME */}

                    <FormField
                        label="First Name"
                        name="firstName"
                        type="text"
                        value={
                            formData.firstName
                        }
                        onChange={
                            handleInputChange
                        }
                        required
                    />

                    {/* LAST NAME */}

                    <FormField
                        label="Last Name"
                        name="lastName"
                        type="text"
                        value={
                            formData.lastName
                        }
                        onChange={
                            handleInputChange
                        }
                        required
                    />

                    {/* DATE OF BIRTH */}

                    <FormField
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={
                            formData.dateOfBirth
                        }
                        onChange={
                            handleInputChange
                        }
                        required
                    />

                    {/* GENDER */}

                    <div
                        style={
                            formGroupStyle
                        }
                    >

                        <label>
                            Gender
                        </label>

                        <select
                            name="gender"
                            value={
                                formData.gender
                            }
                            onChange={
                                handleInputChange
                            }
                            required
                        >

                            <option value="">
                                Select Gender
                            </option>

                            <option value="MALE">
                                Male
                            </option>

                            <option value="FEMALE">
                                Female
                            </option>

                            <option value="OTHER">
                                Other
                            </option>

                        </select>

                    </div>

                    {/* PHONE */}

                    <FormField
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={
                            formData.phone
                        }
                        onChange={
                            handleInputChange
                        }
                        required
                    />

                    {/* PROGRAM */}

                    <FormField
                        label="Program ID"
                        name="programId"
                        type="number"
                        value={
                            formData.programId
                        }
                        onChange={
                            handleInputChange
                        }
                        required
                        min="1"
                    />

                    {/* ADMISSION YEAR */}

                    <FormField
                        label="Admission Year"
                        name="admissionYear"
                        type="number"
                        value={
                            formData.admissionYear
                        }
                        onChange={
                            handleInputChange
                        }
                        required
                    />

                    {/* CURRENT SEMESTER */}

                    <FormField
                        label="Current Semester"
                        name="currentSemester"
                        type="number"
                        value={
                            formData.currentSemester
                        }
                        onChange={
                            handleInputChange
                        }
                        required
                        min="1"
                        max="8"
                    />

                    {/* STUDENT STATUS */}

                    <div
                        style={
                            formGroupStyle
                        }
                    >

                        <label>
                            Student Status
                        </label>

                        <select
                            name="studentStatus"
                            value={
                                formData.studentStatus
                            }
                            onChange={
                                handleInputChange
                            }
                            required
                        >

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="INACTIVE">
                                Inactive
                            </option>

                            <option value="GRADUATED">
                                Graduated
                            </option>

                            <option value="DROPPED">
                                Dropped
                            </option>

                        </select>

                    </div>

                    {/* BUTTONS */}

                    <div
                        style={{
                            marginTop: "15px",
                        }}
                    >

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                loadingStudentAccounts ||
                                studentAccounts.length === 0
                            }
                            style={{
                                padding:
                                    "10px 20px",
                                marginRight:
                                    "10px",
                            }}
                        >
                            {saving
                                ? "Saving..."
                                : editingStudentId === null
                                    ? "Add Student"
                                    : "Update Student"}
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleCancelForm
                            }
                            disabled={saving}
                            style={{
                                padding:
                                    "10px 20px",
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            )}

            {/* TABLE */}

            {students.length === 0 ? (

                <p>No students found.</p>

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

                            <th style={cellStyle}>
                                ID
                            </th>

                            <th style={cellStyle}>
                                Roll Number
                            </th>

                            <th style={cellStyle}>
                                Name
                            </th>

                            <th style={cellStyle}>
                                Semester
                            </th>

                            <th style={cellStyle}>
                                Admission Year
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

                        {students.map(
                            (student) => (

                                <tr
                                    key={
                                        student.studentId
                                    }
                                >

                                    <td
                                        style={
                                            cellStyle
                                        }
                                    >
                                        {
                                            student.studentId
                                        }
                                    </td>

                                    <td
                                        style={
                                            cellStyle
                                        }
                                    >
                                        {
                                            student.rollNumber
                                        }
                                    </td>

                                    <td
                                        style={
                                            cellStyle
                                        }
                                    >
                                        {
                                            student.firstName
                                        }{" "}
                                        {
                                            student.lastName
                                        }
                                    </td>

                                    <td
                                        style={
                                            cellStyle
                                        }
                                    >
                                        {
                                            student.currentSemester
                                        }
                                    </td>

                                    <td
                                        style={
                                            cellStyle
                                        }
                                    >
                                        {
                                            student.admissionYear
                                        }
                                    </td>

                                    <td
                                        style={
                                            cellStyle
                                        }
                                    >
                                        {
                                            student.studentStatus
                                        }
                                    </td>

                                    <td
                                        style={
                                            cellStyle
                                        }
                                    >

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    student
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    student.studentId
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>
            )}

        </div>
    );
}


// =====================================================
// FORM FIELD COMPONENT
// =====================================================

interface FormFieldProps {

    label: string;

    name: string;

    type: string;

    value: string | number;

    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;

    required?: boolean;

    min?: string;

    max?: string;
}

function FormField({
    label,
    name,
    type,
    value,
    onChange,
    required,
    min,
    max,
}: FormFieldProps) {

    return (

        <div
            style={
                formGroupStyle
            }
        >

            <label>
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                max={max}
            />

        </div>
    );
}


// =====================================================
// STUDENT ERROR HANDLER
// =====================================================

function getStudentErrorMessage(
    error: unknown
): string {

    if (!axios.isAxiosError(error)) {

        return "Something went wrong. Please try again.";
    }

    const status =
        error.response?.status;

    const data =
        error.response?.data;

    // -------------------------------------------------
    // Backend simple string
    // -------------------------------------------------

    if (
        typeof data === "string" &&
        data.trim()
    ) {

        return translateBackendMessage(
            data
        );
    }

    // -------------------------------------------------
    // Backend message
    // -------------------------------------------------

    if (data?.message) {

        return translateBackendMessage(
            String(data.message)
        );
    }

    // -------------------------------------------------
    // Backend error
    // -------------------------------------------------

    if (data?.error) {

        return translateBackendMessage(
            String(data.error)
        );
    }

    // -------------------------------------------------
    // Validation errors
    // -------------------------------------------------

    if (data?.errors) {

        if (Array.isArray(data.errors)) {

            return data.errors
                .map((item: any) => {

                    if (
                        item.defaultMessage
                    ) {
                        return item.defaultMessage;
                    }

                    return String(item);
                })
                .join(" | ");
        }

        if (
            typeof data.errors ===
            "object"
        ) {

            return Object.entries(
                data.errors
            )
                .map(
                    ([field, message]) =>
                        `${formatFieldName(
                            field
                        )}: ${message}`
                )
                .join(" | ");
        }
    }

    // -------------------------------------------------
    // HTTP status
    // -------------------------------------------------

    if (status === 400) {

        return "Invalid student details. Please check the fields.";
    }

    if (status === 401) {

        return "Session expired. Please login again.";
    }

    if (status === 403) {

        return "You are not authorized to perform this operation.";
    }

    if (status === 404) {

        return "Student or related record was not found.";
    }

    if (status === 409) {

        return "Duplicate student data. User account or Roll Number may already be used.";
    }

    if (status === 500) {

        return "Server error. Please check the entered student details.";
    }

    return "Unable to complete the operation. Please try again.";
}


// =====================================================
// BACKEND MESSAGE TRANSLATOR
// =====================================================

function translateBackendMessage(
    message: string
): string {

    const lower =
        message.toLowerCase();

    // User ID
    if (
        lower.includes("userid") ||
        lower.includes("user_id") ||
        lower.includes("user id")
    ) {

        if (
            lower.includes("duplicate") ||
            lower.includes("unique") ||
            lower.includes("already")
        ) {

            return "User account is already linked to a student.";
        }

        return `User account error: ${message}`;
    }

    // Roll number
    if (
        lower.includes("rollnumber") ||
        lower.includes("roll_number") ||
        lower.includes("roll number")
    ) {

        if (
            lower.includes("duplicate") ||
            lower.includes("unique") ||
            lower.includes("already")
        ) {

            return "Roll Number is already used. Enter a different Roll Number.";
        }

        return `Roll Number error: ${message}`;
    }

    // First name
    if (
        lower.includes("firstname") ||
        lower.includes("first_name") ||
        lower.includes("first name")
    ) {

        return `First Name error: ${message}`;
    }

    // Last name
    if (
        lower.includes("lastname") ||
        lower.includes("last_name") ||
        lower.includes("last name")
    ) {

        return `Last Name error: ${message}`;
    }

    // Phone
    if (
        lower.includes("phone") ||
        lower.includes("mobile")
    ) {

        return `Phone Number error: ${message}`;
    }

    // Program
    if (
        lower.includes("programid") ||
        lower.includes("program_id") ||
        lower.includes("program id")
    ) {

        return `Program ID error: ${message}`;
    }

    // Date
    if (
        lower.includes("dateofbirth") ||
        lower.includes("date_of_birth") ||
        lower.includes("date of birth")
    ) {

        return `Date of Birth error: ${message}`;
    }

    // Semester
    if (
        lower.includes("semester")
    ) {

        return `Semester error: ${message}`;
    }

    // Status
    if (
        lower.includes("studentstatus") ||
        lower.includes("student_status") ||
        lower.includes("status")
    ) {

        return `Student Status error: ${message}`;
    }

    // Foreign key / database
    if (
        lower.includes("foreign key") ||
        lower.includes("constraint")
    ) {

        return `Database constraint error: ${message}`;
    }

    return message;
}


// =====================================================
// GENERAL BACKEND ERROR
// =====================================================

function getBackendErrorMessage(
    error: unknown,
    fallback: string
): string {

    if (
        axios.isAxiosError(error)
    ) {

        const message =
            error.response?.data?.message ||
            error.response?.data?.error;

        if (message) {

            return String(message);
        }
    }

    return fallback;
}


// =====================================================
// FORMAT FIELD NAME
// =====================================================

function formatFieldName(
    field: string
): string {

    return field
        .replace(
            /([A-Z])/g,
            " $1"
        )
        .replace(
            /_/g,
            " "
        )
        .replace(
            /^./,
            (char) =>
                char.toUpperCase()
        );
}


// =====================================================
// STYLES
// =====================================================

const cellStyle:
    React.CSSProperties = {

    border:
        "1px solid #ddd",

    padding:
        "10px",

    textAlign:
        "left",
};

const formGroupStyle:
    React.CSSProperties = {

    display:
        "flex",

    flexDirection:
        "column",

    gap:
        "5px",

    marginBottom:
        "15px",

    maxWidth:
        "400px",
};
