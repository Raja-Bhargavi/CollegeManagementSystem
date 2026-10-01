import { useEffect, useState } from "react";
import { getMyNotices } from "../../api/studentPortalApi";

export default function StudentNotices() {

    const [notices, setNotices] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadNotices = async () => {

            try {

                const data =
                    await getMyNotices();

                setNotices(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error: any) {

                console.error(
                    "Failed to load notices:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load notices."
                );

            } finally {

                setLoading(false);
            }
        };

        loadNotices();

    }, []);

    if (loading) {
        return <p>Loading notices...</p>;
    }

    return (
        <div>

            <h1>Notices</h1>

            {error && <p>{error}</p>}

            {!error && notices.length === 0 && (
                <p>No notices available.</p>
            )}

            <div
                style={{
                    display: "grid",
                    gap: "20px",
                }}
            >

                {notices.map(
                    (notice, index) => (

                        <div
                            key={
                                notice.noticeId ||
                                index
                            }
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "20px",
                            }}
                        >

                            <h2>
                                {notice.title ||
                                    "Notice"}
                            </h2>

                            <p>
                                {notice.content}
                            </p>

                            <small>
                                Status:{" "}
                                {notice.status ||
                                    "-"}
                            </small>

                            {notice.publishedAt && (
                                <p>
                                    Published:{" "}
                                    {
                                        notice.publishedAt
                                    }
                                </p>
                            )}

                        </div>

                    )
                )}

            </div>

        </div>
    );
}