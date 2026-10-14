
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/visitor-information.css";

interface Notice {
    noticeId: number;
    title: string;
    content: string;
    publishedAt: string | null;
    expiryDate: string | null;
}

const VisitorNotices = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadNotices = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get<Notice[]>(
                    "http://localhost:8080/api/public/notices",
                    { signal: controller.signal }
                );

                setNotices(response.data);
            } catch (err) {
                if (
                    axios.isCancel(err) ||
                    (axios.isAxiosError(err) &&
                        err.code === "ERR_CANCELED")
                ) {
                    return;
                }

                console.error("Failed to load notices:", err);
                setError("Unable to load notice information.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadNotices();

        return () => controller.abort();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="visitor-information-page">
            <section className="visitor-information-hero">
                <div className="visitor-information-container">
                    <p className="visitor-information-eyebrow">
                        ANNOUNCEMENTS
                    </p>

                    <h1>Notices</h1>

                    <p className="visitor-information-intro">
                        Read the latest publicly available college announcements.
                    </p>
                </div>
            </section>

            <section className="visitor-information-section">
                <div className="visitor-information-container">
                    <span className="visitor-information-section-label">
                        OFFICIAL INFORMATION
                    </span>

                    <h2>Latest Notices</h2>

                    <p className="visitor-information-description">
                        Stay informed about examination schedules, academic
                        announcements, and other official college updates.
                    </p>

                    {loading && (
                        <div className="visitor-information-state">
                            Loading notices...
                        </div>
                    )}

                    {!loading && error && (
                        <div
                            className="visitor-information-state visitor-information-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {!loading && !error && notices.length === 0 && (
                        <div className="visitor-information-state">
                            No public notices are currently available.
                        </div>
                    )}

                    {!loading && !error && notices.length > 0 && (
                        <div className="visitor-information-list">
                            {notices.map((notice) => (
                                <article
                                    key={notice.noticeId}
                                    className="visitor-information-card"
                                >
                                    <h3>{notice.title}</h3>

                                    {notice.publishedAt && (
                                        <div className="visitor-information-meta">
                                            Published:{" "}
                                            {formatDate(notice.publishedAt)}
                                        </div>
                                    )}

                                    <p>{notice.content}</p>

                                    {notice.expiryDate && (
                                        <div className="visitor-information-meta">
                                            Available until:{" "}
                                            {formatDate(notice.expiryDate)}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default VisitorNotices;
