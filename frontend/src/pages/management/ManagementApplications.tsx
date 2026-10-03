import React, { useEffect, useState } from "react";
import axios from "axios";

interface Application {
    applicationId: number;
    applicantUserId: number;
    applicationType: string;
    subject: string;
    description: string;
    submittedAt: string;
    status: string;
    processedBy?: number | null;
    processedAt?: string | null;
    managementRemarks?: string | null;
    forwardedTo?: number | null;
}

const ManagementApplications: React.FC = () => {
    const [applications, setApplications] =
        useState<Application[]>([]);

    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);

    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const [forwardedTo, setForwardedTo] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const getConfig = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem(
                "token"
            )}`,
        },
    });

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:8080/api/applications",
                getConfig()
            );

            if (Array.isArray(response.data)) {
                setApplications(response.data);
            } else if (
                Array.isArray(response.data?.content)
            ) {
                setApplications(
                    response.data.content
                );
            } else {
                setApplications([]);
            }
        } catch (err) {
            console.error(
                "Failed to load applications:",
                err
            );

            setError(
                "Unable to load applications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const openApplication = (
        application: Application
    ) => {
        setSelectedApplication(application);

        setStatus(
            application.status || "PENDING"
        );

        setRemarks(
            application.managementRemarks || ""
        );

        setForwardedTo(
            application.forwardedTo
                ? String(application.forwardedTo)
                : ""
        );

        setMessage("");
        setError("");
    };

    const closeApplication = () => {
        setSelectedApplication(null);
        setStatus("");
        setRemarks("");
        setForwardedTo("");
        setMessage("");
        setError("");
    };

    const processApplication = async () => {
        if (!selectedApplication) {
            return;
        }

        if (!status) {
            setError("Please select an application status.");
            return;
        }

        try {
            setProcessing(true);
            setMessage("");
            setError("");

            const payload = {
                status: status,
                managementRemarks:
                    remarks.trim() || null,
                forwardedTo:
                    forwardedTo.trim()
                        ? Number(forwardedTo)
                        : null,
            };

            const response = await axios.put(
                `http://localhost:8080/api/applications/${selectedApplication.applicationId}/status`,
                payload,
                getConfig()
            );

            const updatedApplication =
                response.data;

            setApplications((previous) =>
                previous.map((application) =>
                    application.applicationId ===
                    updatedApplication.applicationId
                        ? updatedApplication
                        : application
                )
            );

            setSelectedApplication(
                updatedApplication
            );

            setStatus(
                updatedApplication.status || status
            );

            setRemarks(
                updatedApplication.managementRemarks ||
                    ""
            );

            setForwardedTo(
                updatedApplication.forwardedTo
                    ? String(
                          updatedApplication.forwardedTo
                      )
                    : ""
            );

            setMessage(
                "Application processed successfully."
            );
        } catch (err) {
            console.error(
                "Failed to process application:",
                err
            );

            if (
                axios.isAxiosError(err) &&
                err.response?.data?.message
            ) {
                setError(
                    err.response.data.message
                );
            } else {
                setError(
                    "Unable to process the application."
                );
            }
        } finally {
            setProcessing(false);
        }
    };

    const getStatusStyle = (
        applicationStatus: string
    ): React.CSSProperties => {
        const normalized =
            applicationStatus?.toUpperCase();

        if (normalized === "APPROVED") {
            return {
                backgroundColor: "#dcfce7",
                color: "#166534",
            };
        }

        if (normalized === "REJECTED") {
            return {
                backgroundColor: "#fee2e2",
                color: "#991b1b",
            };
        }

        if (normalized === "FORWARDED") {
            return {
                backgroundColor: "#dbeafe",
                color: "#1e40af",
            };
        }

        if (normalized === "UNDER_REVIEW") {
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
            };
        }

        return {
            backgroundColor: "#f3f4f6",
            color: "#374151",
        };
    };

    return (
        <div
            style={{
                padding: "24px",
                backgroundColor: "#f5f7fb",
                minHeight: "calc(100vh - 64px)",
            }}
        >
            <div
                style={{
                    marginBottom: "22px",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: "26px",
                        color: "#1f2937",
                    }}
                >
                    Applications
                </h1>

                <p
                    style={{
                        marginTop: "7px",
                        color: "#6b7280",
                    }}
                >
                    Review, process, approve, reject, or
                    forward submitted applications.
                </p>
            </div>

            {message && !selectedApplication && (
                <div
                    style={{
                        padding: "13px 16px",
                        marginBottom: "18px",
                        borderRadius: "8px",
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                    }}
                >
                    {message}
                </div>
            )}

            {error && !selectedApplication && (
                <div
                    style={{
                        padding: "13px 16px",
                        marginBottom: "18px",
                        borderRadius: "8px",
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                    }}
                >
                    {error}
                </div>
            )}

            {loading ? (
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        padding: "40px",
                        textAlign: "center",
                        color: "#6b7280",
                    }}
                >
                    Loading applications...
                </div>
            ) : (
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        overflow: "auto",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <div
                        style={{
                            padding: "16px 20px",
                            borderBottom:
                                "1px solid #e5e7eb",
                            color: "#6b7280",
                            fontSize: "14px",
                        }}
                    >
                        Total applications:{" "}
                        <strong>
                            {applications.length}
                        </strong>
                    </div>

                    {applications.length === 0 ? (
                        <div
                            style={{
                                padding: "45px",
                                textAlign: "center",
                                color: "#6b7280",
                            }}
                        >
                            No applications found.
                        </div>
                    ) : (
                        <table
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse",
                                minWidth: "950px",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            padding:
                                                "13px 16px",
                                            textAlign:
                                                "left",
                                            backgroundColor:
                                                "#f9fafb",
                                            borderBottom:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        ID
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "13px 16px",
                                            textAlign:
                                                "left",
                                            backgroundColor:
                                                "#f9fafb",
                                            borderBottom:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        Applicant
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "13px 16px",
                                            textAlign:
                                                "left",
                                            backgroundColor:
                                                "#f9fafb",
                                            borderBottom:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        Type
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "13px 16px",
                                            textAlign:
                                                "left",
                                            backgroundColor:
                                                "#f9fafb",
                                            borderBottom:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        Subject
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "13px 16px",
                                            textAlign:
                                                "left",
                                            backgroundColor:
                                                "#f9fafb",
                                            borderBottom:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        Submitted
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "13px 16px",
                                            textAlign:
                                                "left",
                                            backgroundColor:
                                                "#f9fafb",
                                            borderBottom:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        Status
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "13px 16px",
                                            textAlign:
                                                "left",
                                            backgroundColor:
                                                "#f9fafb",
                                            borderBottom:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {applications.map(
                                    (application) => (
                                        <tr
                                            key={
                                                application.applicationId
                                            }
                                        >
                                            <td
                                                style={{
                                                    padding:
                                                        "13px 16px",
                                                    borderBottom:
                                                        "1px solid #f0f0f0",
                                                }}
                                            >
                                                {
                                                    application.applicationId
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "13px 16px",
                                                    borderBottom:
                                                        "1px solid #f0f0f0",
                                                }}
                                            >
                                                {
                                                    application.applicantUserId
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "13px 16px",
                                                    borderBottom:
                                                        "1px solid #f0f0f0",
                                                }}
                                            >
                                                {
                                                    application.applicationType
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "13px 16px",
                                                    borderBottom:
                                                        "1px solid #f0f0f0",
                                                }}
                                            >
                                                {
                                                    application.subject
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "13px 16px",
                                                    borderBottom:
                                                        "1px solid #f0f0f0",
                                                }}
                                            >
                                                {application.submittedAt
                                                    ? new Date(
                                                          application.submittedAt
                                                      ).toLocaleString()
                                                    : "-"}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "13px 16px",
                                                    borderBottom:
                                                        "1px solid #f0f0f0",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display:
                                                            "inline-block",
                                                        padding:
                                                            "5px 9px",
                                                        borderRadius:
                                                            "999px",
                                                        fontSize:
                                                            "12px",
                                                        fontWeight:
                                                            600,
                                                        ...getStatusStyle(
                                                            application.status
                                                        ),
                                                    }}
                                                >
                                                    {
                                                        application.status
                                                    }
                                                </span>
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "13px 16px",
                                                    borderBottom:
                                                        "1px solid #f0f0f0",
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        openApplication(
                                                            application
                                                        )
                                                    }
                                                    style={{
                                                        padding:
                                                            "8px 14px",
                                                        border:
                                                            "none",
                                                        borderRadius:
                                                            "6px",
                                                        backgroundColor:
                                                            "#2563eb",
                                                        color:
                                                            "#ffffff",
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {selectedApplication && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor:
                            "rgba(0,0,0,0.45)",
                        display: "flex",
                        justifyContent:
                            "center",
                        alignItems: "center",
                        padding: "20px",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "750px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            backgroundColor:
                                "#ffffff",
                            borderRadius: "12px",
                            padding: "25px",
                            boxSizing:
                                "border-box",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                marginBottom:
                                    "20px",
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#1f2937",
                                    }}
                                >
                                    Application #
                                    {
                                        selectedApplication.applicationId
                                    }
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            "6px 0 0",
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    {
                                        selectedApplication.applicationType
                                    }
                                </p>
                            </div>

                            <button
                                onClick={
                                    closeApplication
                                }
                                style={{
                                    border: "none",
                                    background:
                                        "transparent",
                                    fontSize: "24px",
                                    cursor:
                                        "pointer",
                                    color:
                                        "#6b7280",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div
                            style={{
                                backgroundColor:
                                    "#f9fafb",
                                borderRadius:
                                    "8px",
                                padding: "18px",
                                marginBottom:
                                    "20px",
                            }}
                        >
                            <p>
                                <strong>
                                    Applicant User ID:
                                </strong>{" "}
                                {
                                    selectedApplication.applicantUserId
                                }
                            </p>

                            <p>
                                <strong>
                                    Application Type:
                                </strong>{" "}
                                {
                                    selectedApplication.applicationType
                                }
                            </p>

                            <p>
                                <strong>
                                    Subject:
                                </strong>{" "}
                                {
                                    selectedApplication.subject
                                }
                            </p>

                            <p>
                                <strong>
                                    Submitted:
                                </strong>{" "}
                                {selectedApplication.submittedAt
                                    ? new Date(
                                          selectedApplication.submittedAt
                                      ).toLocaleString()
                                    : "-"}
                            </p>

                            <div>
                                <strong>
                                    Description:
                                </strong>

                                <div
                                    style={{
                                        marginTop:
                                            "8px",
                                        padding:
                                            "12px",
                                        backgroundColor:
                                            "#ffffff",
                                        border:
                                            "1px solid #e5e7eb",
                                        borderRadius:
                                            "6px",
                                        whiteSpace:
                                            "pre-wrap",
                                        lineHeight:
                                            1.5,
                                    }}
                                >
                                    {
                                        selectedApplication.description
                                    }
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div
                                style={{
                                    padding:
                                        "12px 15px",
                                    marginBottom:
                                        "15px",
                                    borderRadius:
                                        "7px",
                                    backgroundColor:
                                        "#dcfce7",
                                    color:
                                        "#166534",
                                }}
                            >
                                {message}
                            </div>
                        )}

                        {error && (
                            <div
                                style={{
                                    padding:
                                        "12px 15px",
                                    marginBottom:
                                        "15px",
                                    borderRadius:
                                        "7px",
                                    backgroundColor:
                                        "#fee2e2",
                                    color:
                                        "#991b1b",
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <div
                            style={{
                                marginBottom:
                                    "18px",
                            }}
                        >
                            <label
                                style={{
                                    display:
                                        "block",
                                    marginBottom:
                                        "7px",
                                    fontWeight:
                                        600,
                                    color:
                                        "#374151",
                                }}
                            >
                                Application Status
                            </label>

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                style={{
                                    width: "100%",
                                    padding:
                                        "11px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius:
                                        "7px",
                                    backgroundColor:
                                        "#ffffff",
                                }}
                            >
                                <option value="PENDING">
                                    PENDING
                                </option>

                                <option value="UNDER_REVIEW">
                                    UNDER_REVIEW
                                </option>

                                <option value="FORWARDED">
                                    FORWARDED
                                </option>

                                <option value="APPROVED">
                                    APPROVED
                                </option>

                                <option value="REJECTED">
                                    REJECTED
                                </option>
                            </select>
                        </div>

                        <div
                            style={{
                                marginBottom:
                                    "18px",
                            }}
                        >
                            <label
                                style={{
                                    display:
                                        "block",
                                    marginBottom:
                                        "7px",
                                    fontWeight:
                                        600,
                                    color:
                                        "#374151",
                                }}
                            >
                                Management Remarks
                            </label>

                            <textarea
                                value={remarks}
                                onChange={(event) =>
                                    setRemarks(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                rows={5}
                                maxLength={1000}
                                placeholder="Enter remarks for this application..."
                                style={{
                                    width: "100%",
                                    boxSizing:
                                        "border-box",
                                    padding:
                                        "11px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius:
                                        "7px",
                                    resize:
                                        "vertical",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                marginBottom:
                                    "22px",
                            }}
                        >
                            <label
                                style={{
                                    display:
                                        "block",
                                    marginBottom:
                                        "7px",
                                    fontWeight:
                                        600,
                                    color:
                                        "#374151",
                                }}
                            >
                                Forward To User ID
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={
                                    forwardedTo
                                }
                                onChange={(event) =>
                                    setForwardedTo(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Optional user ID"
                                style={{
                                    width: "100%",
                                    boxSizing:
                                        "border-box",
                                    padding:
                                        "11px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius:
                                        "7px",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "flex-end",
                                gap: "10px",
                            }}
                        >
                            <button
                                onClick={
                                    closeApplication
                                }
                                style={{
                                    padding:
                                        "10px 18px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius:
                                        "7px",
                                    backgroundColor:
                                        "#ffffff",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                Close
                            </button>

                            <button
                                onClick={
                                    processApplication
                                }
                                disabled={
                                    processing
                                }
                                style={{
                                    padding:
                                        "10px 18px",
                                    border:
                                        "none",
                                    borderRadius:
                                        "7px",
                                    backgroundColor:
                                        processing
                                            ? "#9ca3af"
                                            : "#2563eb",
                                    color:
                                        "#ffffff",
                                    cursor:
                                        processing
                                            ? "not-allowed"
                                            : "pointer",
                                    fontWeight:
                                        600,
                                }}
                            >
                                {processing
                                    ? "Processing..."
                                    : "Update Application"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagementApplications;