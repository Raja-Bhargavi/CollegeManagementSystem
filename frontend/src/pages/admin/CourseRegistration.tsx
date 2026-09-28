import { useEffect, useState } from "react";

import {
    getStudents,
    
} from "../../api/studentApi";

import type {
    Student,
}from "../../api/studentApi";

import {
    getCourseOfferings,
} from "../../api/courseOfferingApi";

import type{
    CourseOffering,
} from "../../api/courseOfferingApi";


import {
    getCourseRegistrations,
    createCourseRegistration,
    updateCourseRegistration,
    deleteCourseRegistration,
} from "../../api/courseRegistrationApi";

import type{
    CourseRegistration,
} from "../../api/courseRegistrationApi";

import {
    getCourses,
} from "../../api/courseApi";

import type{
    Course,
} from "../../api/courseApi";

function CourseRegistrationPage() {

    const [registrations, setRegistrations] =
        useState<CourseRegistration[]>([]);

    const [students, setStudents] =
        useState<Student[]>([]);

    const [offerings, setOfferings] =
        useState<CourseOffering[]>([]);

    const [courses, setCourses] =
        useState<Course[]>([]);

    const [studentId, setStudentId] =
        useState<number | "">("");

    const [offeringId, setOfferingId] =
        useState<number | "">("");

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                registrationData,
                studentData,
                offeringData,
                courseData,
            ] = await Promise.all([
                getCourseRegistrations(),
                getStudents(),
                getCourseOfferings(),
                getCourses(),
            ]);

            setRegistrations(registrationData);
            setStudents(studentData);
            setOfferings(offeringData);
            setCourses(courseData);

        } catch (error) {

            console.error(
                "Course Registration loading failed:",
                error
            );

            setError(
                "Unable to load course registration data."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const resetForm = () => {

        setStudentId("");
        setOfferingId("");
        setEditingId(null);
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (studentId === "" || offeringId === "") {

            setError(
                "Please select a student and course offering."
            );

            return;
        }

        try {

            setSaving(true);

            const request = {
                studentId: Number(studentId),
                offeringId: Number(offeringId),
            };

            if (editingId !== null) {

                await updateCourseRegistration(
                    editingId,
                    request
                );

                setSuccess(
                    "Course registration updated successfully."
                );

            } else {

                await createCourseRegistration(
                    request
                );

                setSuccess(
                    "Student registered for course successfully."
                );
            }

            resetForm();

            await loadData();

        } catch (error: any) {

            console.error(
                "Course Registration save failed:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to save course registration.";

            setError(message);

        } finally {

            setSaving(false);
        }
    };

    const handleEdit = (
        registration: CourseRegistration
    ) => {

        setStudentId(registration.studentId);
        setOfferingId(registration.offeringId);
        setEditingId(registration.registrationId);

        setError("");
        setSuccess("");
    };

    const handleDelete = async (
        registrationId: number
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this registration?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await deleteCourseRegistration(
                registrationId
            );

            setSuccess(
                "Course registration deleted successfully."
            );

            if (editingId === registrationId) {
                resetForm();
            }

            await loadData();

        } catch (error: any) {

            console.error(
                "Course Registration delete failed:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to delete course registration.";

            setError(message);
        }
    };

    const getStudentName = (
        studentId: number
    ) => {

        const student =
            students.find(
                (item) =>
                    item.studentId === studentId
            );

        if (!student) {
            return `Student #${studentId}`;
        }

        return `${student.firstName} ${student.lastName}`;
    };

    const getOfferingDetails = (
        offering: CourseOffering
    ) => {

        const course =
            courses.find(
                (item) =>
                    item.courseId === offering.courseId
            );

        if (!course) {
            return `Offering #${offering.offeringId}`;
        }

        return `${course.courseCode} - ${course.courseName}`;
    };

    return (
        <div>

            <h1>Course Registration</h1>

            <p>
                Register students for active course offerings.
            </p>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {success && (
                <p style={{ color: "green" }}>
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>
                        Student
                    </label>

                    <br />

                    <select
                        value={studentId}
                        onChange={(event) =>
                            setStudentId(
                                event.target.value === ""
                                    ? ""
                                    : Number(event.target.value)
                            )
                        }
                    >
                        <option value="">
                            Select Student
                        </option>

                        {students
                            .filter(
                                (student) =>
                                    student.studentStatus === "ACTIVE"
                            )
                            .map((student) => (
                                <option
                                    key={student.studentId}
                                    value={student.studentId}
                                >
                                    {student.rollNumber} -{" "}
                                    {student.firstName}{" "}
                                    {student.lastName}
                                </option>
                            ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>
                        Course Offering
                    </label>

                    <br />

                    <select
                        value={offeringId}
                        onChange={(event) =>
                            setOfferingId(
                                event.target.value === ""
                                    ? ""
                                    : Number(event.target.value)
                            )
                        }
                    >
                        <option value="">
                            Select Course Offering
                        </option>

                        {offerings
                            .filter(
                                (offering) =>
                                    offering.offeringStatus === "ACTIVE"
                            )
                            .map((offering) => (
                                <option
                                    key={offering.offeringId}
                                    value={offering.offeringId}
                                >
                                    {getOfferingDetails(offering)}
                                    {" "}(
                                    Offering #{offering.offeringId}
                                    )
                                </option>
                            ))}
                    </select>
                </div>

                <br />

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : editingId !== null
                            ? "Update Registration"
                            : "Register Student"}
                </button>

                {editingId !== null && (
                    <button
                        type="button"
                        onClick={resetForm}
                        style={{
                            marginLeft: "10px",
                        }}
                    >
                        Cancel
                    </button>
                )}

            </form>

            <hr />

            <h2>
                Registered Students
            </h2>

            {loading ? (
                <p>
                    Loading registrations...
                </p>
            ) : registrations.length === 0 ? (
                <p>
                    No course registrations found.
                </p>
            ) : (
                <table
                    border={1}
                    cellPadding={8}
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                    }}
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Course</th>
                            <th>Offering ID</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {registrations.map(
                            (registration) => {

                                const offering =
                                    offerings.find(
                                        (item) =>
                                            item.offeringId ===
                                            registration.offeringId
                                    );

                                return (
                                    <tr
                                        key={
                                            registration.registrationId
                                        }
                                    >
                                        <td>
                                            {
                                                registration.registrationId
                                            }
                                        </td>

                                        <td>
                                            {getStudentName(
                                                registration.studentId
                                            )}
                                        </td>

                                        <td>
                                            {offering
                                                ? getOfferingDetails(
                                                    offering
                                                )
                                                : `Offering #${registration.offeringId}`}
                                        </td>

                                        <td>
                                            {
                                                registration.offeringId
                                            }
                                        </td>

                                        <td>
                                            {new Date(
                                                registration.registrationDate
                                            ).toLocaleString()}
                                        </td>

                                        <td>
                                            {registration.status}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        registration
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        registration.registrationId
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
                                );
                            }
                        )}

                    </tbody>
                </table>
            )}

        </div>
    );
}

export default CourseRegistrationPage;
