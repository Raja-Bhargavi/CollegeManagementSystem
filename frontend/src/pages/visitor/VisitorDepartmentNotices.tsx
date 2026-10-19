
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/visitor-information.css";

interface Department {
    departmentId: number;
    departmentName: string;
    departmentCode: string;
}

interface Notice {
    noticeId: number;
    title: string;
    content: string;
    publishedAt: string | null;
    expiryDate: string | null;
    category: string | null;
    departmentId: number | null;
    programLevel: string | null;
    departmentScope?: string | null;
}

const API_BASE_URL = "http://localhost:8080/api/public";

const formatDate = (value: string | null) => {
    if (!value) return "Date not specified";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString();
};

export default function VisitorDepartmentNotices() {
    const { departmentId: idParam } = useParams();
    const departmentId = Number(idParam);

    const [department, setDepartment] = useState<Department | null>(null);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadData() {
            if (!Number.isInteger(departmentId) || departmentId <= 0) {
                setError("Invalid department ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const options = { signal: controller.signal };

                const [departmentResponse, noticesResponse] =
                    await Promise.all([
                        axios.get<Department>(
                            `${API_BASE_URL}/departments/${departmentId}`,
                            options
                        ),
                        axios.get<Notice[]>(
                            `${API_BASE_URL}/departments/${departmentId}/notices`,
                            options
                        ),
                    ]);

                setDepartment(departmentResponse.data);
                setNotices(noticesResponse.data);
            } catch (err) {
                if (controller.signal.aborted) return;

                console.error("Unable to load department notices:", err);
                setError(
                    "Unable to load department notices. Please try again later."
                );
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadData();
        return () => controller.abort();
    }, [departmentId]);

    return (
        <main className="visitor-information-page">
            <div className="visitor-information-container">
                <header className="visitor-information-hero">
                    <span className="visitor-information-eyebrow">
                        ACADEMIC UPDATES
                    </span>
                    <h1>
                        {department
                            ? `${department.departmentName} Notices`
                            : "Department Notices"}
                    </h1>
                    <p>
                        Public announcements and academic updates for this
                        department.
                    </p>
                </header>

                <section className="visitor-information-section">
                    {loading && (
                        <p className="visitor-information-loading" role="status">
                            Loading notices...
                        </p>
                    )}

                    {!loading && error && (
                        <p className="visitor-information-error" role="alert">
                            {error}
                        </p>
                    )}

                    {!loading && !error && notices.length === 0 && (
                        <p>
                            There are currently no published public notices
                            for this department.
                        </p>
                    )}

                    {!loading && !error && notices.length > 0 && (
                        <div className="visitor-information-list">
                            {notices.map((notice) => (
                                
<article
    className="visitor-information-card"
    key={notice.noticeId}
>
    <div className="visitor-information-meta notice-meta-row">
        <span className="notice-meta-item">
            Category: {notice.category || "GENERAL"}
        </span>

        <span className="notice-meta-item">
            Programme: {
                notice.programLevel?.toUpperCase() === "BTECH"
                    ? "B.Tech"
                    : notice.programLevel?.toUpperCase() === "MTECH"
                        ? "M.Tech"
                        : "All programmes"
            }
        </span>

        <span className="notice-meta-item">
            Published: {formatDate(notice.publishedAt)}
        </span>
    </div>

    <h3>{notice.title}</h3>

    <p>{notice.content}</p>

    {notice.expiryDate && (
        <div className="visitor-information-meta notice-expiry">
            Available until: {formatDate(notice.expiryDate)}
        </div>
    )}
</article>

                            ))}
                        </div>
                    )}
                </section>

                <p>
                    <Link to={`/academics/departments/${departmentId}`}>
                        ← Back to Department
                    </Link>
                </p>
            </div>
        </main>
    );
}
