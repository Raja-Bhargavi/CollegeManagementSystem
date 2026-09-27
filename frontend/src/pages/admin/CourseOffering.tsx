import { useEffect, useState } from "react";

import {
    createCourseOffering,
    deleteCourseOffering,
    getCourseOfferings,
    updateCourseOffering,
} from "../../api/courseOfferingApi";


import type{
    Course,
} from "../../api/courseApi";

import{
    getCourses,
}from "../../api/courseApi";

import type{
    Faculty,
} from "../../api/facultyApi";

import{
    getFaculty,
} from "../../api/facultyApi";

import type{
    CourseOffering,
    CourseOfferingRequest,
} from "../../api/courseOfferingApi";

function CourseOfferingPage() {

    const [offerings, setOfferings] =
        useState<CourseOffering[]>([]);

    const [courses, setCourses] =
        useState<Course[]>([]);

    const [faculty, setFaculty] =
        useState<Faculty[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [form, setForm] =
        useState<CourseOfferingRequest>({
            courseId: 0,
            sectionId: 0,
            facultyId: 0,
            offeringStatus: "ACTIVE",
        });

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                offeringData,
                courseData,
                facultyData,
            ] = await Promise.all([
                getCourseOfferings(),
                getCourses(),
                getFaculty(),
            ]);

            setOfferings(offeringData);
            setCourses(courseData);
            setFaculty(facultyData);

        } catch (err: any) {

            setError(
                err?.response?.data?.message ||
                "Failed to load course offerings"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                name === "courseId"
                || name === "sectionId"
                || name === "facultyId"
                    ? Number(value)
                    : value,
        }));
    };

    const resetForm = () => {

        setForm({
            courseId: 0,
            sectionId: 0,
            facultyId: 0,
            offeringStatus: "ACTIVE",
        });

        setEditingId(null);
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (form.courseId <= 0) {
            setError("Please select a course");
            return;
        }

        if (form.sectionId <= 0) {
            setError("Please enter a valid section ID");
            return;
        }

        if (form.facultyId <= 0) {
            setError("Please select a faculty member");
            return;
        }

        try {

            setSaving(true);
            setError("");

            if (editingId === null) {

                await createCourseOffering(form);

            } else {

                await updateCourseOffering(
                    editingId,
                    form
                );
            }

            resetForm();

            await loadData();

        } catch (err: any) {

            setError(
                err?.response?.data?.message ||
                "Failed to save course offering"
            );

        } finally {

            setSaving(false);
        }
    };

    const handleEdit = (
        offering: CourseOffering
    ) => {

        setEditingId(
            offering.offeringId
        );

        setForm({
            courseId: offering.courseId,
            sectionId: offering.sectionId,
            facultyId: offering.facultyId,
            offeringStatus:
                offering.offeringStatus,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (
        offeringId: number
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this course offering?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await deleteCourseOffering(
                offeringId
            );

            await loadData();

        } catch (err: any) {

            setError(
                err?.response?.data?.message ||
                "Failed to delete course offering"
            );
        }
    };

    const getCourseName = (
        courseId: number
    ) => {

        const course = courses.find(
            (item) =>
                item.courseId === courseId
        );

        return course
            ? `${course.courseCode} - ${course.courseName}`
            : `Course ID: ${courseId}`;
    };

    const getFacultyName = (
        facultyId: number
    ) => {

        const member = faculty.find(
            (item) =>
                item.facultyId === facultyId
        );

        return member
            ? `${member.firstName} ${member.lastName}`
            : `Faculty ID: ${facultyId}`;
    };

    return (
        <div style={{ padding: "24px" }}>

            <h1>
                Course Offering Management
            </h1>

            {error && (
                <div
                    style={{
                        marginBottom: "16px",
                        padding: "10px",
                        color: "red",
                    }}
                >
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    marginBottom: "30px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                }}
            >

                <h2>
                    {editingId === null
                        ? "Add Course Offering"
                        : "Edit Course Offering"}
                </h2>

                <div style={{ marginBottom: "12px" }}>

                    <label>
                        Course
                    </label>

                    <br />

                    <select
                        name="courseId"
                        value={form.courseId}
                        onChange={handleChange}
                        required
                    >

                        <option value={0}>
                            Select Course
                        </option>

                        {courses.map((course) => (

                            <option
                                key={course.courseId}
                                value={course.courseId}
                            >
                                {course.courseCode}
                                {" - "}
                                {course.courseName}
                            </option>

                        ))}

                    </select>

                </div>

                <div style={{ marginBottom: "12px" }}>

                    <label>
                        Section ID
                    </label>

                    <br />

                    <input
                        type="number"
                        name="sectionId"
                        value={
                            form.sectionId === 0
                                ? ""
                                : form.sectionId
                        }
                        onChange={handleChange}
                        min="1"
                        step="1"
                        required
                    />

                    <small
                        style={{
                            display: "block",
                            marginTop: "4px",
                        }}
                    >
                        Enter the existing section ID.
                    </small>

                </div>

                <div style={{ marginBottom: "12px" }}>

                    <label>
                        Faculty
                    </label>

                    <br />

                    <select
                        name="facultyId"
                        value={form.facultyId}
                        onChange={handleChange}
                        required
                    >

                        <option value={0}>
                            Select Faculty
                        </option>

                        {faculty.map((member) => (

                            <option
                                key={member.facultyId}
                                value={member.facultyId}
                            >
                                {member.firstName}
                                {" "}
                                {member.lastName}
                                {" - "}
                                {member.employeeNumber}
                            </option>

                        ))}

                    </select>

                </div>

                <div style={{ marginBottom: "12px" }}>

                    <label>
                        Offering Status
                    </label>

                    <br />

                    <select
                        name="offeringStatus"
                        value={form.offeringStatus}
                        onChange={handleChange}
                        required
                    >

                        <option value="ACTIVE">
                            ACTIVE
                        </option>

                        <option value="INACTIVE">
                            INACTIVE
                        </option>

                    </select>

                </div>

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : editingId === null
                            ? "Add Offering"
                            : "Update Offering"}
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

            <h2>
                Course Offerings
            </h2>

            {loading ? (

                <p>
                    Loading course offerings...
                </p>

            ) : offerings.length === 0 ? (

                <p>
                    No course offerings found.
                </p>

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
                            <th>Course</th>
                            <th>Section ID</th>
                            <th>Faculty</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {offerings.map(
                            (offering) => (

                                <tr
                                    key={
                                        offering.offeringId
                                    }
                                >

                                    <td>
                                        {
                                            offering.offeringId
                                        }
                                    </td>

                                    <td>
                                        {getCourseName(
                                            offering.courseId
                                        )}
                                    </td>

                                    <td>
                                        {
                                            offering.sectionId
                                        }
                                    </td>

                                    <td>
                                        {getFacultyName(
                                            offering.facultyId
                                        )}
                                    </td>

                                    <td>
                                        {
                                            offering.offeringStatus
                                        }
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    offering
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    offering
                                                        .offeringId
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

                            )
                        )}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default CourseOfferingPage;