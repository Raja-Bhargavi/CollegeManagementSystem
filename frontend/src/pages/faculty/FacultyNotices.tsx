import { useEffect, useState } from "react";

import type {
    FacultyNotice,
} from "../../api/facultyPortalApi";

import {
    getMyFacultyNotices,
} from "../../api/facultyPortalApi";

export default function FacultyNotices() {

    const [notices, setNotices] =
        useState<FacultyNotice[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadNotices();

    }, []);

    const loadNotices = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getMyFacultyNotices();

            setNotices(data);

        } catch (err) {

            console.error(
                "Failed to load faculty notices:",
                err
            );

            setError(
                "Failed to load notices."
            );

        } finally {

            setLoading(false);
        }
    };

    if (loading) {

        return (
            <h2>
                Loading notices...
            </h2>
        );
    }

    return (
        <div>

            <h1
                style={{
                    marginBottom: "20px",
                }}
            >
                Notices
            </h1>

            {error && (

                <div
                    style={{
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        padding: "12px",
                        borderRadius: "6px",
                        marginBottom: "20px",
                    }}
                >
                    {error}
                </div>

            )}

            {notices.length === 0 ? (

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    No notices available.
                </div>

            ) : (

                <div>

                    {notices.map((notice) => (

                        <div
                            key={notice.noticeId}
                            style={{
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                marginBottom: "16px",
                                boxShadow:
                                    "0 1px 4px rgba(0,0,0,0.1)",
                            }}
                        >

                            <h2
                                style={{
                                    marginTop: 0,
                                    marginBottom: "10px",
                                }}
                            >
                                {notice.title}
                            </h2>

                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    marginBottom: "15px",
                                }}
                            >
                                Published:{" "}
                                {notice.publishedAt
                                    ? new Date(
                                        notice.publishedAt
                                    ).toLocaleString()
                                    : "-"
                                }
                            </div>

                            <p
                                style={{
                                    lineHeight: "1.6",
                                    whiteSpace: "pre-wrap",
                                    marginBottom: "15px",
                                }}
                            >
                                {notice.content}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                    fontSize: "13px",
                                }}
                            >

                                <span
                                    style={{
                                        backgroundColor:
                                            "#dcfce7",
                                        color: "#166534",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                    }}
                                >
                                    {notice.status}
                                </span>

                                <span
                                    style={{
                                        backgroundColor:
                                            "#e0e7ff",
                                        color: "#3730a3",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                    }}
                                >
                                    {notice.visibility}
                                </span>

                                {notice.expiryDate && (

                                    <span
                                        style={{
                                            backgroundColor:
                                                "#f3f4f6",
                                            color: "#374151",
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        Expires:{" "}
                                        {new Date(
                                            notice.expiryDate
                                        ).toLocaleString()}
                                    </span>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}