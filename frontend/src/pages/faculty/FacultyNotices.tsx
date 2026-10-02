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

    // =========================================================
    // LOAD NOTICES
    // =========================================================

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

        } catch (err: any) {

            console.error(
                "Failed to load faculty notices:",
                err
            );

            const responseData =
                err?.response?.data;

            if (responseData?.fields) {

                const fieldMessages =
                    Object.values(
                        responseData.fields
                    ) as string[];

                setError(
                    fieldMessages.join(", ")
                );

            } else if (
                typeof responseData?.message ===
                "string"
            ) {

                setError(
                    responseData.message
                );

            } else if (
                typeof responseData?.error ===
                "string"
            ) {

                setError(
                    responseData.error
                );

            } else if (
                typeof responseData ===
                "string"
            ) {

                setError(
                    responseData
                );

            } else {

                setError(
                    "Failed to load notices."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div
                style={{
                    padding: "20px",
                }}
            >
                <h2>
                    Loading notices...
                </h2>
            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div
            style={{
                paddingBottom: "20px",
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            marginBottom: "6px",
                        }}
                    >
                        Notices
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#6b7280",
                            fontSize: "14px",
                        }}
                    >
                        Important announcements and
                        communications for faculty.
                    </p>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    style={{
                        backgroundColor:
                            "#fee2e2",

                        color:
                            "#991b1b",

                        padding:
                            "12px 15px",

                        borderRadius:
                            "6px",

                        marginBottom:
                            "20px",

                        border:
                            "1px solid #fecaca",
                    }}
                >
                    {error}
                </div>

            )}


            {/* =================================================
                NO NOTICES
            ================================================= */}

            {notices.length === 0 ? (

                <div
                    style={{
                        backgroundColor:
                            "white",

                        padding:
                            "30px 20px",

                        borderRadius:
                            "8px",

                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.1)",

                        textAlign:
                            "center",
                    }}
                >

                    <h3
                        style={{
                            marginTop: 0,
                            color: "#374151",
                        }}
                    >
                        No notices available
                    </h3>

                    <p
                        style={{
                            marginBottom: 0,
                            color: "#6b7280",
                        }}
                    >
                        There are currently no published
                        notices for faculty.
                    </p>

                </div>

            ) : (

                /* =================================================
                   NOTICE LIST
                ================================================= */

                <div>

                    {notices.map(
                        (notice) => (

                            <div
                                key={
                                    notice.noticeId
                                }
                                style={{
                                    backgroundColor:
                                        "white",

                                    padding:
                                        "22px",

                                    borderRadius:
                                        "8px",

                                    marginBottom:
                                        "16px",

                                    boxShadow:
                                        "0 1px 4px rgba(0,0,0,0.1)",

                                    borderLeft:
                                        "4px solid #1f2937",
                                }}
                            >

                                {/* =================================
                                    TITLE
                                ================================= */}

                                <h2
                                    style={{
                                        marginTop:
                                            0,

                                        marginBottom:
                                            "10px",

                                        color:
                                            "#111827",

                                        fontSize:
                                            "20px",
                                    }}
                                >
                                    {
                                        notice.title
                                    }
                                </h2>


                                {/* =================================
                                    PUBLISHED DATE
                                ================================= */}

                                <div
                                    style={{
                                        fontSize:
                                            "13px",

                                        color:
                                            "#6b7280",

                                        marginBottom:
                                            "16px",
                                    }}
                                >

                                    Published:{" "}

                                    {notice.publishedAt
                                        ? formatDateTime(
                                            notice.publishedAt
                                        )
                                        : "-"
                                    }

                                </div>


                                {/* =================================
                                    CONTENT
                                ================================= */}

                                <div
                                    style={{
                                        fontSize:
                                            "15px",

                                        color:
                                            "#374151",

                                        lineHeight:
                                            "1.7",

                                        whiteSpace:
                                            "pre-wrap",

                                        marginBottom:
                                            "18px",
                                    }}
                                >
                                    {
                                        notice.content
                                    }
                                </div>


                                {/* =================================
                                    NOTICE INFORMATION
                                ================================= */}

                                <div
                                    style={{
                                        display:
                                            "flex",

                                        gap:
                                            "10px",

                                        flexWrap:
                                            "wrap",

                                        alignItems:
                                            "center",
                                    }}
                                >

                                    {/* STATUS */}

                                    <span
                                        style={
                                            getStatusStyle(
                                                notice.status
                                            )
                                        }
                                    >
                                        {
                                            notice.status
                                        }
                                    </span>


                                    {/* VISIBILITY */}

                                    <span
                                        style={
                                            visibilityStyle
                                        }
                                    >
                                        Visibility:{" "}
                                        {
                                            notice.visibility
                                        }
                                    </span>


                                    {/* EXPIRY */}

                                    {notice.expiryDate && (

                                        <span
                                            style={
                                                expiryStyle
                                            }
                                        >
                                            Expires:{" "}
                                            {
                                                formatDateTime(
                                                    notice.expiryDate
                                                )
                                            }
                                        </span>

                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}


// =========================================================
// FORMAT DATE + TIME
// =========================================================

function formatDateTime(
    date: string
): string {

    if (!date) {

        return "-";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "-";
    }

    return parsedDate.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}


// =========================================================
// STATUS STYLE
// =========================================================

function getStatusStyle(
    status: string
): React.CSSProperties {

    const normalized =
        status?.toUpperCase();

    if (
        normalized ===
        "PUBLISHED"
    ) {

        return {
            backgroundColor:
                "#dcfce7",

            color:
                "#166534",

            padding:
                "5px 10px",

            borderRadius:
                "5px",

            fontSize:
                "13px",

            fontWeight:
                "600",
        };
    }

    if (
        normalized ===
        "EXPIRED"
    ) {

        return {
            backgroundColor:
                "#fee2e2",

            color:
                "#991b1b",

            padding:
                "5px 10px",

            borderRadius:
                "5px",

            fontSize:
                "13px",

            fontWeight:
                "600",
        };
    }

    return {
        backgroundColor:
            "#f3f4f6",

        color:
            "#374151",

        padding:
            "5px 10px",

        borderRadius:
            "5px",

        fontSize:
            "13px",

        fontWeight:
            "600",
    };
}


// =========================================================
// VISIBILITY STYLE
// =========================================================

const visibilityStyle:
    React.CSSProperties = {

    backgroundColor:
        "#e0e7ff",

    color:
        "#3730a3",

    padding:
        "5px 10px",

    borderRadius:
        "5px",

    fontSize:
        "13px",

    fontWeight:
        "600",
};


// =========================================================
// EXPIRY STYLE
// =========================================================

const expiryStyle:
    React.CSSProperties = {

    backgroundColor:
        "#f3f4f6",

    color:
        "#374151",

    padding:
        "5px 10px",

    borderRadius:
        "5px",

    fontSize:
        "13px",

    fontWeight:
        "600",
};