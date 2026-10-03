import { useEffect, useState } from "react";
import axios from "axios";

import {
    getStudents,
    createStudent,
    updateStudent,
    getAvailableStudentAccounts,
} from "../../api/studentApi";

import type {
    Student,
    StudentRequest,
    UserAccountOption,
} from "../../api/studentApi";

export default function StaffStudents() {

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

    const [students, setStudents] =
        useState<Student[]>([]);

    const [studentAccounts, setStudentAccounts] =
        useState<UserAccountOption[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [loadingAccounts, setLoadingAccounts] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingStudentId, setEditingStudentId] =
        useState<number | null>(null);

    const [formData, setFormData] =
        useState<StudentRequest>(emptyForm);

    // =====================================================
    // LOAD STUDENTS
    // =====================================================

    const loadStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getStudents();

            setStudents(data);

        } catch (error) {

            console.error(
                "Failed to load students:",
                error
            );

            setError(
                getStudentErrorMessage(
                    error,
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
    // LOAD AVAILABLE STUDENT ACCOUNTS
    //
    // USED ONLY FOR ADDING A NEW STUDENT
    // =====================================================

    const loadStudentAccounts = async () => {

        try {

            setLoadingAccounts(true);
            setError("");

            const data =
                await getAvailableStudentAccounts();

            setStudentAccounts(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load student accounts:",
                error
            );

            setStudentAccounts([]);

            setError(
                getStudentErrorMessage(
                    error,
                    "Unable to load student user accounts."
                )
            );

        } finally {

            setLoadingAccounts(false);
        }
    };

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement
        >
    ) => {

        const {
            name,
            value,
        } = e.target;

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
    // VALIDATION
    // =====================================================

    const validateForm = (): string | null => {

        /*
         * IMPORTANT:
         *
         * userId is required ONLY when creating
         * a new student.
         *
         * During EDIT, the existing userId is already
         * stored on the student record and must not
         * be selected again.
         */

        if (editingStudentId === null) {

            if (
                !Number.isInteger(
                    formData.userId
                ) ||
                formData.userId <= 0
            ) {

                return (
                    "Please select a student user account."
                );
            }
        }

        if (
            !formData.rollNumber.trim()
        ) {

            return "Roll Number is required.";
        }

        if (
            !/^[A-Za-z ]+$/.test(
                formData.firstName.trim()
            )
        ) {

            return (
                "First Name can contain only letters and spaces."
            );
        }

        if (
            formData.lastName.trim() &&

            !/^[A-Za-z ]+$/.test(
                formData.lastName.trim()
            )
        ) {

            return (
                "Last Name can contain only letters and spaces."
            );
        }

        if (!formData.dateOfBirth) {

            return (
                "Date of Birth is required."
            );
        }

        if (!formData.gender) {

            return (
                "Please select a gender."
            );
        }

        if (
            !/^[6-9]\d{9}$/.test(
                formData.phone.trim()
            )
        ) {

            return (
                "Enter a valid 10-digit Indian mobile number."
            );
        }

        if (
            !Number.isInteger(
                formData.programId
            ) ||

            formData.programId <= 0
        ) {

            return (
                "Program ID must be a valid positive number."
            );
        }

        const currentYear =
            new Date().getFullYear();

        if (
            !Number.isInteger(
                formData.admissionYear
            ) ||

            formData.admissionYear < 2000 ||

            formData.admissionYear > currentYear
        ) {

            return (
                `Admission year must be between 2000 and ${currentYear}.`
            );
        }

        if (
            !Number.isInteger(
                formData.currentSemester
            ) ||

            formData.currentSemester < 1 ||

            formData.currentSemester > 8
        ) {

            return (
                "Semester must be between 1 and 8."
            );
        }

        if (!formData.studentStatus) {

            return (
                "Student status is required."
            );
        }

        return null;
    };

    // =====================================================
    // ADD STUDENT
    // =====================================================

    const handleAdd = async () => {

        setError("");
        setSuccess("");

        setEditingStudentId(null);

        setFormData({
            ...emptyForm,
        });

        setStudentAccounts([]);

        setShowForm(true);

        await loadStudentAccounts();
    };

    // =====================================================
    // EDIT STUDENT
    // =====================================================

    const handleEdit = (
        student: Student
    ) => {

        setError("");
        setSuccess("");

        setEditingStudentId(
            student.studentId
        );

        /*
         * Preserve the existing userId.
         *
         * No account API call is made.
         * No account dropdown is shown.
         */

        setFormData({
            userId: student.userId,
            rollNumber: student.rollNumber,
            firstName: student.firstName,
            lastName:
                student.lastName || "",
            dateOfBirth:
                student.dateOfBirth || "",
            gender:
                student.gender || "",
            phone:
                student.phone || "",
            programId:
                student.programId,
            admissionYear:
                student.admissionYear,
            currentSemester:
                student.currentSemester,
            studentStatus:
                student.studentStatus,
        });

        setStudentAccounts([]);

        setShowForm(true);
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {

            setError(
                validationError
            );

            return;
        }

        try {

            setSaving(true);

            // =============================================
            // CREATE
            // =============================================

            if (
                editingStudentId === null
            ) {

                await createStudent(
                    formData
                );

                setSuccess(
                    "Student added successfully."
                );

            }

            // =============================================
            // UPDATE
            // =============================================

            else {

                await updateStudent(
                    editingStudentId,
                    formData
                );

                setSuccess(
                    "Student updated successfully."
                );
            }

            closeForm();

            await loadStudents();

        } catch (error) {

            console.error(
                "Student operation failed:",
                error
            );

            setError(
                getStudentErrorMessage(
                    error,
                    "Unable to complete the student operation."
                )
            );

        } finally {

            setSaving(false);
        }
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {

        setShowForm(false);

        setEditingStudentId(null);

        setFormData({
            ...emptyForm,
        });

        setStudentAccounts([]);

        setError("");
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div>

                <h1>
                    Students
                </h1>

                <p>
                    Loading students...
                </p>

            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div>

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    marginBottom:
                        "20px",
                }}
            >

                <div>

                    <h1>
                        Students
                    </h1>

                    <p
                        style={{
                            color:
                                "#6b7280",
                            marginTop:
                                "5px",
                        }}
                    >
                        Manage student administrative records.
                    </p>

                </div>

                {!showForm && (

                    <button
                        onClick={
                            handleAdd
                        }
                    >
                        + Add Student
                    </button>

                )}

            </div>

            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div
                    style={{
                        padding:
                            "12px",
                        marginBottom:
                            "15px",
                        border:
                            "1px solid #86efac",
                        backgroundColor:
                            "#f0fdf4",
                        color:
                            "#166534",
                        borderRadius:
                            "6px",
                    }}
                >
                    {success}
                </div>

            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    style={{
                        padding:
                            "12px",
                        marginBottom:
                            "15px",
                        border:
                            "1px solid #fca5a5",
                        backgroundColor:
                            "#fef2f2",
                        color:
                            "#991b1b",
                        borderRadius:
                            "6px",
                    }}
                >
                    {error}
                </div>

            )}

            {/* =================================================
                FORM
            ================================================= */}

            {showForm && (

                <form
                    onSubmit={
                        handleSubmit
                    }
                    style={{
                        border:
                            "1px solid #e5e7eb",
                        padding:
                            "20px",
                        marginBottom:
                            "30px",
                        borderRadius:
                            "8px",
                        backgroundColor:
                            "#fafafa",
                    }}
                >

                    <h2>

                        {editingStudentId === null
                            ? "Add Student"
                            : "Edit Student"}

                    </h2>

                    {/* =================================================
                        USER ACCOUNT
                    ================================================= */}

                    {editingStudentId === null ? (

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
                                    formData.userId ||
                                    ""
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                                disabled={
                                    loadingAccounts
                                }
                            >

                                <option value="">

                                    {loadingAccounts
                                        ? "Loading accounts..."
                                        : "Select student account"}

                                </option>

                                {studentAccounts.length === 0 &&
                                    !loadingAccounts && (

                                        <option
                                            value=""
                                            disabled
                                        >
                                            No available student accounts
                                        </option>

                                    )}

                                {studentAccounts.map(
                                    (
                                        account
                                    ) => (

                                        <option
                                            key={
                                                account.userId
                                            }
                                            value={
                                                account.userId
                                            }
                                        >

                                            {
                                                account.username
                                            }

                                            {" — "}

                                            {
                                                account.email
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    ) : (

                        <div
                            style={{
                                ...formGroupStyle,

                                padding:
                                    "12px",

                                border:
                                    "1px solid #d1d5db",

                                borderRadius:
                                    "6px",

                                backgroundColor:
                                    "#f3f4f6",
                            }}
                        >

                            <label
                                style={{
                                    fontWeight:
                                        "600",
                                }}
                            >
                                Student User Account
                            </label>

                            <div
                                style={{
                                    color:
                                        "#374151",
                                }}
                            >

                                User ID:{" "}

                                <strong>
                                    {
                                        formData.userId
                                    }
                                </strong>

                            </div>

                            <div
                                style={{
                                    color:
                                        "#6b7280",

                                    fontSize:
                                        "14px",
                                }}
                            >
                                This student is already
                                linked to this user account.
                                The account is preserved
                                automatically while editing
                                the student details.
                            </div>

                        </div>

                    )}

                    {/* =================================================
                        ROLL NUMBER
                    ================================================= */}

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

                    {/* =================================================
                        FIRST NAME
                    ================================================= */}

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

                    {/* =================================================
                        LAST NAME
                    ================================================= */}

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
                    />

                    {/* =================================================
                        DATE OF BIRTH
                    ================================================= */}

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

                    {/* =================================================
                        GENDER
                    ================================================= */}

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

                    {/* =================================================
                        PHONE
                    ================================================= */}

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

                    {/* =================================================
                        PROGRAM ID
                    ================================================= */}

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

                    {/* =================================================
                        ADMISSION YEAR
                    ================================================= */}

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

                    {/* =================================================
                        CURRENT SEMESTER
                    ================================================= */}

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

                    {/* =================================================
                        STUDENT STATUS
                    ================================================= */}

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
                                ACTIVE
                            </option>

                            <option value="INACTIVE">
                                INACTIVE
                            </option>

                            <option value="GRADUATED">
                                GRADUATED
                            </option>

                            <option value="DROPPED">
                                DROPPED
                            </option>

                        </select>

                    </div>

                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div>

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                (
                                    editingStudentId ===
                                        null &&
                                    loadingAccounts
                                )
                            }
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
                                closeForm
                            }
                            disabled={
                                saving
                            }
                            style={{
                                marginLeft:
                                    "10px",
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            )}

            {/* =================================================
                STUDENT TABLE
            ================================================= */}

            {students.length === 0 ? (

                <p>
                    No students found.
                </p>

            ) : (

                <table
                    style={{
                        width:
                            "100%",
                        borderCollapse:
                            "collapse",
                    }}
                >

                    <thead>

                        <tr>

                            <th
                                style={
                                    cellStyle
                                }
                            >
                                ID
                            </th>

                            <th
                                style={
                                    cellStyle
                                }
                            >
                                Roll Number
                            </th>

                            <th
                                style={
                                    cellStyle
                                }
                            >
                                Name
                            </th>

                            <th
                                style={
                                    cellStyle
                                }
                            >
                                Semester
                            </th>

                            <th
                                style={
                                    cellStyle
                                }
                            >
                                Admission Year
                            </th>

                            <th
                                style={
                                    cellStyle
                                }
                            >
                                Status
                            </th>

                            <th
                                style={
                                    cellStyle
                                }
                            >
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {students.map(
                            (
                                student
                            ) => (

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
                                        }

                                        {" "}

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
// FORM FIELD
// =====================================================

interface FormFieldProps {

    label: string;

    name: string;

    type: string;

    value:
        | string
        | number;

    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement
        >
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
// ERROR HANDLING
// =====================================================

function getStudentErrorMessage(
    error: unknown,
    fallbackMessage: string
): string {

    if (
        !axios.isAxiosError(
            error
        )
    ) {

        return fallbackMessage;
    }

    const status =
        error.response?.status;

    const data =
        error.response?.data;

    if (
        typeof data === "string" &&
        data.trim()
    ) {

        return data;
    }

    if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        data.message
    ) {

        return String(
            data.message
        );
    }

    if (
        data &&
        typeof data === "object" &&
        "error" in data &&
        data.error
    ) {

        return String(
            data.error
        );
    }

    if (status === 400) {

        return (
            "Invalid student details. Please check the fields."
        );
    }

    if (status === 401) {

        return (
            "Session expired. Please login again."
        );
    }

    if (status === 403) {

        return (
            "You are not authorized to perform this operation."
        );
    }

    if (status === 404) {

        return (
            "Student or related record was not found."
        );
    }

    if (status === 409) {

        return (
            "Duplicate student data. Check the User Account or Roll Number."
        );
    }

    return fallbackMessage;
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
