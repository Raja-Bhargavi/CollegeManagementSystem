import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/visitor-faculty-details.css";

interface FacultyDetails {
    facultyId: number;
    firstName: string;
    lastName: string | null;
    designation: string;
    departmentId: number | null;
    departmentName?: string | null;
    joiningDate?: string | null;
    profile?: string | null;
    briefBio?: string | null;
    researchAreas?: string[] | string | null;
    photoUrl?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    education?: {
        degree: string;
        year?: string | number | null;
        specialization?: string | null;
        university?: string | null;
    }[];
}

const VisitorFacultyDetails = () => {
    const { facultyId } = useParams<{ facultyId: string }>();

    const [faculty, setFaculty] = useState<FacultyDetails | null>(null);
    const [departmentName, setDepartmentName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadProfile = async () => {
            const id = Number(facultyId);

            if (!Number.isInteger(id) || id <= 0) {
                setError("Invalid faculty ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get<FacultyDetails>(
                    `http://localhost:8080/api/public/faculty/${id}`,
                    { signal: controller.signal }
                );

                const member = response.data;
                setFaculty(member);

                if (member.departmentName) {
                    setDepartmentName(member.departmentName);
                } else if (member.departmentId != null) {
                    try {
                        const departmentResponse = await axios.get(
                            `http://localhost:8080/api/public/departments/${member.departmentId}`,
                            { signal: controller.signal }
                        );

                        setDepartmentName(
                            departmentResponse.data.departmentName ??
                            departmentResponse.data.name ??
                            `Department ID: ${member.departmentId}`
                        );
                    } catch {
                        if (!controller.signal.aborted) {
                            setDepartmentName(
                                `Department ID: ${member.departmentId}`
                            );
                        }
                    }
                } else {
                    setDepartmentName("Not available");
                }
            } catch (err) {
                if (controller.signal.aborted) return;

                console.error("Failed to load faculty profile:", err);

                setError(
                    axios.isAxiosError(err) && err.response?.status === 404
                        ? "Faculty profile not found."
                        : "Unable to load faculty profile. Please check the backend API."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => controller.abort();
    }, [facultyId]);

    if (loading) {
        return (
            <main className="faculty-profile-page">
                <div className="faculty-profile-container faculty-profile-state">
                    Loading faculty profile...
                </div>
            </main>
        );
    }

    if (error || !faculty) {
        return (
            <main className="faculty-profile-page">
                <div className="faculty-profile-container faculty-profile-state">
                    <p className="faculty-profile-error">
                        {error || "Faculty profile not found."}
                    </p>

                    <Link
                        className="faculty-profile-link"
                        to="/academics/departments"
                    >
                        ← Back to Departments
                    </Link>
                </div>
            </main>
        );
    }

    const fullName =
        `${faculty.firstName} ${faculty.lastName ?? ""}`.trim();

    const researchAreas = Array.isArray(faculty.researchAreas)
        ? faculty.researchAreas
        : typeof faculty.researchAreas === "string"
          ? faculty.researchAreas
                .split(/\r?\n|,/)
                .map((item) => item.trim())
                .filter(Boolean)
          : [];

    const education = faculty.education ?? [];

    return (
        <main className="faculty-profile-page">
            <div className="faculty-profile-container">
                <header className="faculty-profile-header">
                    <p className="faculty-profile-eyebrow">
                        FACULTY PROFILE
                    </p>

                    <h1>{fullName}</h1>

                    <p className="faculty-profile-designation">
                        {faculty.designation}
                    </p>

                    <p className="faculty-profile-department">
                        {departmentName}
                    </p>
                </header>

                <div className="faculty-profile-grid">
                    <div className="faculty-profile-main-column">
                        {(faculty.briefBio || faculty.profile) && (
                            <section className="faculty-profile-section">
                                <h2>Brief Bio</h2>

                                <div className="faculty-profile-panel">
                                    <p>
                                        {faculty.briefBio || faculty.profile}
                                    </p>
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className="faculty-profile-section">
                                <h2>Education</h2>

                                <div className="faculty-profile-table-wrap">
                                    <table className="faculty-profile-table">
                                        <thead>
                                            <tr>
                                                <th>Sr. No.</th>
                                                <th>Degree</th>
                                                <th>Year</th>
                                                <th>Specialization</th>
                                                <th>University</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {education.map((item, index) => (
                                                <tr key={`${item.degree}-${index}`}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.degree}</td>
                                                    <td>{item.year || "—"}</td>
                                                    <td>{item.specialization || "—"}</td>
                                                    <td>{item.university || "—"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        <section className="faculty-profile-section">
                            <h2>Faculty Information</h2>

                            <dl className="faculty-profile-details">
                                <div>
                                    <dt>Designation</dt>
                                    <dd>
                                        {faculty.designation || "Not available"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Department</dt>
                                    <dd>{departmentName}</dd>
                                </div>

                                <div>
                                    <dt>Joining Date</dt>
                                    <dd>
                                        {faculty.joiningDate || "Not available"}
                                    </dd>
                                </div>
                            </dl>
                        </section>

                        {(faculty.phone || faculty.email || faculty.address) && (
                            <section className="faculty-profile-section">
                                <h2>Contact Details</h2>

                                <div className="faculty-profile-table-wrap">
                                    <table className="faculty-profile-table">
                                        <thead>
                                            <tr>
                                                {faculty.phone && <th>Phone</th>}
                                                {faculty.email && <th>Email</th>}
                                                {faculty.address && <th>Address</th>}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                {faculty.phone && (
                                                    <td>{faculty.phone}</td>
                                                )}
                                                {faculty.email && (
                                                    <td>{faculty.email}</td>
                                                )}
                                                {faculty.address && (
                                                    <td>{faculty.address}</td>
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="faculty-profile-sidebar">
                        {faculty.photoUrl && (
                            <div className="faculty-profile-photo">
                                <img
                                    src={faculty.photoUrl}
                                    alt={`Photo of ${fullName}`}
                                />
                            </div>
                        )}

                        {researchAreas.length > 0 && (
                            <section className="faculty-profile-section">
                                <h2>Research Interests</h2>

                                <ul className="faculty-profile-research-list">
                                    {researchAreas.map((area, index) => (
                                        <li key={`${area}-${index}`}>
                                            {area}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </aside>
                </div>

                <nav className="faculty-profile-navigation">
                    <Link
                        to={
                            faculty.departmentId != null
                                ? `/academics/departments/${faculty.departmentId}#faculty`
                                : "/academics/departments"
                        }
                        className="faculty-profile-link"
                    >
                        ← Back to Department
                    </Link>
                </nav>
            </div>
        </main>
    );
};

export default VisitorFacultyDetails;