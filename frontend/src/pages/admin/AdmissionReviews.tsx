
import { useCallback, useEffect, useState } from "react";
import {
    decideAdmission,
    getAdmissionApplication,
    getAdmissionApplications,
} from "../../api/admissionReviewApi";

import type {
    AdmissionApplication,
    AdmissionDecision,
} from "../../api/admissionReviewApi";

import "../../styles/admission-reviews.css";

type FilterStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function AdmissionReviews() {
    const [applications, setApplications] =
        useState<AdmissionApplication[]>([]);

    const [filter, setFilter] =
        useState<FilterStatus>("PENDING");

    const [selected, setSelected] =
        useState<AdmissionApplication | null>(null);

    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(false);
    const [decisionLoading, setDecisionLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadApplications = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAdmissionApplications(filter);
            setApplications(data);
        } catch (err: any) {
            console.error("Failed to load admission applications:", err);
            setError(
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Unable to load admission applications. Check your login and backend."
            );
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        void loadApplications();
    }, [loadApplications]);

    async function openDetails(id: number) {
        setError("");
        setMessage("");

        try {
            const data = await getAdmissionApplication(id);
            setSelected(data);
            setRemarks(data.adminRemarks ?? "");
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Unable to load application details."
            );
        }
    }

    async function handleDecision(
        decision: AdmissionDecision["decision"]
    ) {
        if (!selected) return;

        if (
            decision === "REJECT" &&
            !remarks.trim()
        ) {
            setError("Please provide a reason before rejecting the application.");
            return;
        }

        const action = decision === "APPROVE" ? "approve" : "reject";

        if (
            !window.confirm(
                `Are you sure you want to ${action} application ${selected.applicationNumber}?`
            )
        ) {
            return;
        }

        setDecisionLoading(true);
        setError("");
        setMessage("");

        try {
            const result = await decideAdmission(
                selected.admissionRequestId,
                {
                    decision,
                    remarks: remarks.trim(),
                }
            );

            setMessage(
                `${result.applicationNumber}: ${result.message}`
            );

            setSelected(null);
            setRemarks("");

            await loadApplications();
        } catch (err: any) {
            console.error("Admission decision failed:", err);

            setError(
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "The decision could not be saved. Refresh the application and try again."
            );
        } finally {
            setDecisionLoading(false);
        }
    }

    return (
        <main className="admission-reviews-page">
            <header className="admission-reviews-header">
                <div>
                    <h1>Admission Applications</h1>
                    <p>
                        Review student registrations and record
                        an admission decision.
                    </p>
                </div>

                <button
                    type="button"
                    className="admission-review-secondary"
                    onClick={() => void loadApplications()}
                    disabled={loading || decisionLoading}
                >
                    Refresh
                </button>
            </header>

            {error && (
                <div className="admission-review-message admission-review-error"
                     role="alert">
                    {error}
                </div>
            )}

            {message && (
                <div className="admission-review-message"
                     role="status">
                    {message}
                </div>
            )}

            <div className="admission-review-toolbar">
                <label>
                    Application status
                    <select
                        value={filter}
                        onChange={(event) => {
                            setFilter(event.target.value as FilterStatus);
                            setSelected(null);
                            setMessage("");
                            setError("");
                        }}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </label>

                <span>
                    {applications.length} application(s)
                </span>
            </div>

            <div className="admission-review-table-wrapper">
                <table className="admission-review-table">
                    <thead>
                        <tr>
                            <th>Application</th>
                            <th>Applicant</th>
                            <th>Program</th>
                            <th>Department</th>
                            <th>Submitted</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7}>
                                    Loading applications...
                                </td>
                            </tr>
                        ) : applications.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    No {filter.toLowerCase()} applications found.
                                </td>
                            </tr>
                        ) : (
                            applications.map((application) => (
                                <tr key={application.admissionRequestId}>
                                    <td>{application.applicationNumber}</td>

                                    <td>
                                        <strong>
                                            {application.firstName}{" "}
                                            {application.lastName}
                                        </strong>
                                        <small>{application.email}</small>
                                        <small>{application.phone}</small>
                                    </td>

                                    <td>{application.programName}</td>
                                    <td>{application.departmentName}</td>

                                    <td>
                                        {application.createdAt
                                            ? new Date(
                                                application.createdAt
                                              ).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td>{application.status}</td>

                                    <td>
                                        <button
                                            type="button"
                                            className="admission-review-secondary"
                                            onClick={() =>
                                                void openDetails(
                                                    application.admissionRequestId
                                                )
                                            }
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selected && (
                <section className="admission-review-detail">
                    <div className="admission-review-detail-header">
                        <div>
                            <h2>Application details</h2>
                            <p>{selected.applicationNumber}</p>
                        </div>

                        <button
                            type="button"
                            className="admission-review-secondary"
                            onClick={() => setSelected(null)}
                        >
                            Close
                        </button>
                    </div>

                    <dl className="admission-review-detail-grid">
                        <div>
                            <dt>Applicant name</dt>
                            <dd>
                                {selected.firstName} {selected.lastName}
                            </dd>
                        </div>

                        <div>
                            <dt>Email</dt>
                            <dd>{selected.email}</dd>
                        </div>

                        <div>
                            <dt>Phone</dt>
                            <dd>{selected.phone}</dd>
                        </div>

                        <div>
                            <dt>Date of birth</dt>
                            <dd>{selected.dateOfBirth}</dd>
                        </div>

                        <div>
                            <dt>Program</dt>
                            <dd>{selected.programName}</dd>
                        </div>

                        <div>
                            <dt>Degree</dt>
                            <dd>{selected.degreeType}</dd>
                        </div>

                        <div>
                            <dt>Department</dt>
                            <dd>{selected.departmentName}</dd>
                        </div>

                        <div>
                            <dt>Admission year</dt>
                            <dd>{selected.admissionYear}</dd>
                        </div>

                        <div>
                            <dt>Previous qualification</dt>
                            <dd>{selected.previousQualification || "—"}</dd>
                        </div>

                        <div>
                            <dt>Current status</dt>
                            <dd>{selected.status}</dd>
                        </div>
                    </dl>

                    <label className="admission-review-remarks">
                        Admin remarks
                        <textarea
                            value={remarks}
                            onChange={(event) => setRemarks(event.target.value)}
                            maxLength={1000}
                            rows={4}
                            placeholder="Enter remarks or a reason for rejection"
                            disabled={
                                decisionLoading ||
                                selected.status !== "PENDING"
                            }
                        />
                    </label>

                    {selected.status === "PENDING" && (
                        <div className="admission-review-actions">
                            <button
                                type="button"
                                onClick={() => void handleDecision("APPROVE")}
                                disabled={decisionLoading}
                            >
                                {decisionLoading
                                    ? "Processing..."
                                    : "Approve application"}
                            </button>

                            <button
                                type="button"
                                className="admission-review-secondary"
                                onClick={() => void handleDecision("REJECT")}
                                disabled={decisionLoading}
                            >
                                Reject application
                            </button>
                        </div>
                    )}

                    {selected.status !== "PENDING" && (
                        <p>
                            This application has already been reviewed.
                        </p>
                    )}
                </section>
            )}
        </main>
    );
}
