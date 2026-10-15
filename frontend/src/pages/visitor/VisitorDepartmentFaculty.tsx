import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/visitor-department-details.css";

interface Department {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
}

interface Faculty {
    facultyId: number;
    firstName: string;
    lastName: string | null;
    designation: string;
    departmentId: number | null;
}

const API_BASE_URL = "http://localhost:8080/api/public";

const VisitorDepartmentFaculty = () => {
    const { departmentId: departmentIdParam } = useParams<{
        departmentId: string;
    }>();

    const departmentId = Number(departmentIdParam);

    const [department, setDepartment] = useState<Department | null>(null);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadFaculty = async () => {
            if (!Number.isInteger(departmentId) || departmentId <= 0) {
                setError("Invalid department ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const options = { signal: controller.signal };

                const [departmentResponse, facultyResponse] =
                    await Promise.all([
                        axios.get<Department>(
                            `${API_BASE_URL}/departments/${departmentId}`,
                            options
                        ),
                        axios.get<Faculty[]>(
                            `${API_BASE_URL}/departments/${departmentId}/faculty`,
                            options
                        ),
                    ]);

                setDepartment(departmentResponse.data);
                setFaculty(facultyResponse.data);
            } catch (err) {
                if (
                    axios.isCancel(err) ||
                    (axios.isAxiosError(err) &&
                        err.code === "ERR_CANCELED")
                ) {
                    return;
                }

                console.error("Failed to load department faculty:", err);
                setError(
                    axios.isAxiosError(err) && err.response?.status === 403
                        ? "Access forbidden. Please check the public faculty API authorization."
                        : "Unable to load faculty for this department."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadFaculty();

        return () => controller.abort();
    }, [departmentId]);

    const groupedFaculty = useMemo(() => {
        const groups: Record<string, Faculty[]> = {
            Professors: [],
            "Associate Professors": [],
            "Assistant Professors": [],
            "Other Faculty": [],
        };

        faculty.forEach((member) => {
            const designation = (member.designation || "")
                .trim()
                .toLowerCase();

            if (designation.includes("associate professor")) {
                groups["Associate Professors"].push(member);
            } else if (designation.includes("assistant professor")) {
                groups["Assistant Professors"].push(member);
            } else if (designation.includes("professor")) {
                groups.Professors.push(member);
            } else {
                groups["Other Faculty"].push(member);
            }
        });

        return Object.entries(groups).filter(
            ([, members]) => members.length > 0
        );
    }, [faculty]);

    if (loading) {
        return (
            <main className="visitor-department-page">
                <div className="visitor-department-container">
                    <p
                        className="visitor-department-state"
                        role="status"
                    >
                        Loading faculty...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !department) {
        return (
            <main className="visitor-department-page">
                <div className="visitor-department-container">
                    <p
                        className="visitor-department-state visitor-department-error"
                        role="alert"
                    >
                        {error || "Department not found."}
                    </p>

                    <Link
                        to="/academics/departments"
                        className="visitor-department-back-link"
                    >
                        ← Back to Departments
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="visitor-department-page">
            <div className="visitor-department-container">
                <header className="visitor-department-header">
                    <span className="visitor-department-eyebrow">
                        {department.departmentCode}
                    </span>

                    <h1>{department.departmentName} Faculty</h1>

                    <p>
                        Faculty members in the Department of{" "}
                        {department.departmentName}.
                    </p>
                </header>

                <section className="visitor-department-section">
                    <div className="visitor-department-section-heading">
                        <span>FACULTY DIRECTORY</span>
                        <h2>Faculty</h2>
                        <p>
                            Select a faculty member to view their individual
                            profile and available academic information.
                        </p>
                    </div>

                    {faculty.length === 0 ? (
                        <p className="visitor-department-state">
                            No active faculty members are currently available
                            for this department.
                        </p>
                    ) : (
                        <div className="visitor-program-list">
                            {groupedFaculty.map(([designation, members]) => (
                                <div
                                    className="visitor-faculty-group"
                                    key={designation}
                                >
                                    <h3>{designation}</h3>

                                    {members.map((member) => (
                                        <Link
                                            key={member.facultyId}
                                            to={`/academics/faculty-info/${member.facultyId}`}
                                            className="visitor-program-row"
                                        >
                                            <div>
                                                <strong>
                                                    {`${member.firstName} ${member.lastName || ""}`.trim()}
                                                </strong>
                                                <span>
                                                    {member.designation}
                                                </span>
                                            </div>

                                            <span aria-hidden="true">→</span>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="visitor-department-footer-link">
                    <Link
                        to={`/academics/departments/${department.departmentId}`}
                        className="visitor-department-back-link"
                    >
                        ← Back to Department
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default VisitorDepartmentFaculty;
