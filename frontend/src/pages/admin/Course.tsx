import { useEffect, useState } from "react";

import {
    
    createCourse,
    deleteCourse,
    getCourses,
    updateCourse,
} from "../../api/courseApi";

import type{
    Course,
    CourseRequest,
} from "../../api/courseApi";

function CoursePage() {

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState<CourseRequest>({
        courseCode: "",
        courseName: "",
        credits: 3,
        description: "",
    });

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCourses();

            setCourses(data);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "Failed to load courses"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        if (name === "credits") {
            setForm((previous) => ({
                ...previous,
                credits: value === "" ? 0 : Number(value),
            }));

            return;
        }

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm({
            courseCode: "",
            courseName: "",
            credits: 3,
            description: "",
        });

        setEditingId(null);
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (form.credits <= 0) {
            setError("Credits must be greater than 0");
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (editingId === null) {
                await createCourse(form);
            } else {
                await updateCourse(
                    editingId,
                    form
                );
            }

            resetForm();

            await loadCourses();

        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "Failed to save course"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (course: Course) => {
        setEditingId(course.courseId);

        setForm({
            courseCode: course.courseCode,
            courseName: course.courseName,
            credits: course.credits,
            description: course.description || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (
        courseId: number
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteCourse(courseId);

            await loadCourses();

        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "Failed to delete course"
            );
        }
    };

    return (
        <div style={{ padding: "24px" }}>

            <h1>
                Course Management
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
                        ? "Add Course"
                        : "Edit Course"}
                </h2>

                <div style={{ marginBottom: "12px" }}>

                    <label>
                        Course Code
                    </label>

                    <br />

                    <input
                        type="text"
                        name="courseCode"
                        value={form.courseCode}
                        onChange={handleChange}
                        required
                        maxLength={20}
                        placeholder="CS101"
                    />

                </div>

                <div style={{ marginBottom: "12px" }}>

                    <label>
                        Course Name
                    </label>

                    <br />

                    <input
                        type="text"
                        name="courseName"
                        value={form.courseName}
                        onChange={handleChange}
                        required
                        maxLength={150}
                        placeholder="Data Structures"
                    />

                </div>

                <div style={{ marginBottom: "12px" }}>

                    <label>
                        Credits
                    </label>

                    <br />

                    <input
                        type="number"
                        name="credits"
                        value={form.credits}
                        onChange={handleChange}
                        required
                        min="1"
                        step="1"
                    />

                </div>

                <div style={{ marginBottom: "12px" }}>

                    <label>
                        Description
                    </label>

                    <br />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Course description"
                    />

                </div>

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : editingId === null
                            ? "Add Course"
                            : "Update Course"}
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
                Courses
            </h2>

            {loading ? (
                <p>
                    Loading courses...
                </p>
            ) : courses.length === 0 ? (
                <p>
                    No courses found.
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
                            <th>Code</th>
                            <th>Name</th>
                            <th>Credits</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {courses.map((course) => (

                            <tr key={course.courseId}>

                                <td>
                                    {course.courseId}
                                </td>

                                <td>
                                    {course.courseCode}
                                </td>

                                <td>
                                    {course.courseName}
                                </td>

                                <td>
                                    {course.credits}
                                </td>

                                <td>
                                    {course.description || "-"}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            handleEdit(course)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                course.courseId
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
}

export default CoursePage;
