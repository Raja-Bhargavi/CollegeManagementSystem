import { useEffect, useState } from "react";

import {
    getApplications,
    updateApplicationStatus,
} from "../../api/applicationApi";

import type {
    Application,
} from "../../api/applicationApi";


const STATUS_OPTIONS = [
    "PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
];


export default function StaffApplications() {

    const [applications, setApplications] =
        useState<Application[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [updatingId, setUpdatingId] =
        useState<number | null>(null);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [selectedStatus, setSelectedStatus] =
        useState<Record<number, string>>({});


    // =====================================================
    // LOAD APPLICATIONS
    // =====================================================

    const loadApplications = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getApplications();

            setApplications(data);

            const statuses:
                Record<number, string> = {};

            data.forEach(
                (application) => {

                    statuses[
                        application.applicationId
                    ] = application.status;

                }
            );

            setSelectedStatus(statuses);

        } catch (error: any) {

            console.error(
                "Failed to load applications:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to load applications."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadApplications();
    }, []);


    // =====================================================
    // STATUS CHANGE
    // =====================================================

    const handleStatusChange = (
        applicationId: number,
        status: string
    ) => {

        setSelectedStatus(
            (previous) => ({
                ...previous,
                [applicationId]: status,
            })
        );

        setError("");
        setSuccess("");
    };


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const handleUpdateStatus = async (
        applicationId: number
    ) => {

        const status =
            selectedStatus[applicationId];

        if (!status) {

            setError(
                "Please select an application status."
            );

            return;
        }

        try {

            setUpdatingId(applicationId);

            setError("");
            setSuccess("");

            await updateApplicationStatus(
                applicationId,
                {
                    status,
                }
            );

            setSuccess(
                `Application #${applicationId} status updated successfully.`
            );

            await loadApplications();

        } catch (error: any) {

            console.error(
                "Failed to update application status:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to update application status."
            );

        } finally {

            setUpdatingId(null);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div>

                <h1>
                    Applications
                </h1>

                <p>
                    Loading applications...
                </p>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <div>

            <div
                style={{
                    marginBottom: "25px",
                }}
            >

                <h1>
                    Applications
                </h1>

                <p
                    style={{
                        color: "#6b7280",
                        marginTop: "5px",
                    }}
                >
                    Review submitted applications and
                    process their administrative status.
                </p>

            </div>


            {success && (
                <div
                    style={{
                        padding: "12px",
                        marginBottom: "15px",
                        border:
                            "1px solid #86efac",
                        backgroundColor:
                            "#f0fdf4",
                        color:
                            "#166534",
                        borderRadius:
                            "6px",
                    }}
                >
                    {success}
                </div>
            )}


            {error && (
                <div
                    style={{
                        padding: "12px",
                        marginBottom: "15px",
                        border:
                            "1px solid #fca5a5",
                        backgroundColor:
                            "#fef2f2",
                        color:
                            "#991b1b",
                        borderRadius:
                            "6px",
                    }}
                >
                    {error}
                </div>
            )}


            {applications.length === 0 ? (

                <p>
                    No application records found.
                </p>

            ) : (

                <div
                    style={{
                        overflowX: "auto",
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={cellStyle}>
                                    ID
                                </th>

                                <th style={cellStyle}>
                                    Applicant
                                </th>

                                <th style={cellStyle}>
                                    Type
                                </th>

                                <th style={cellStyle}>
                                    Subject
                                </th>

                                <th style={cellStyle}>
                                    Description
                                </th>

                                <th style={cellStyle}>
                                    Submitted At
                                </th>

                                <th style={cellStyle}>
                                    Current Status
                                </th>

                                <th style={cellStyle}>
                                    Process
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

                                        <td style={cellStyle}>
                                            {
                                                application.applicationId
                                            }
                                        </td>

                                        <td style={cellStyle}>
                                            {
                                                application.applicantUserId
                                            }
                                        </td>

                                        <td style={cellStyle}>
                                            {
                                                application.applicationType
                                            }
                                        </td>

                                        <td style={cellStyle}>
                                            {
                                                application.subject
                                            }
                                        </td>

                                        <td style={cellStyle}>
                                            {
                                                application.description ||
                                                "-"
                                            }
                                        </td>

                                        <td style={cellStyle}>
                                            {
                                                application.submittedAt
                                                    ? new Date(
                                                        application.submittedAt
                                                    ).toLocaleString()
                                                    : "-"
                                            }
                                        </td>

                                        <td style={cellStyle}>
                                            {
                                                application.status
                                            }
                                        </td>

                                        <td style={cellStyle}>

                                            <select
                                                value={
                                                    selectedStatus[
                                                        application
                                                            .applicationId
                                                    ] ||
                                                    application.status
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleStatusChange(
                                                        application.applicationId,
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    updatingId ===
                                                    application.applicationId
                                                }
                                            >

                                                {STATUS_OPTIONS.map(
                                                    (status) => (

                                                        <option
                                                            key={
                                                                status
                                                            }
                                                            value={
                                                                status
                                                            }
                                                        >
                                                            {
                                                                status
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>


                                            <button
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        application.applicationId
                                                    )
                                                }
                                                disabled={
                                                    updatingId ===
                                                    application.applicationId
                                                }
                                                style={{
                                                    marginLeft:
                                                        "8px",
                                                }}
                                            >
                                                {updatingId ===
                                                application.applicationId
                                                    ? "Updating..."
                                                    : "Update Status"}
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}


const cellStyle:
    React.CSSProperties = {

    border:
        "1px solid #ddd",

    padding:
        "10px",

    textAlign:
        "left",

    verticalAlign:
        "top",
};
