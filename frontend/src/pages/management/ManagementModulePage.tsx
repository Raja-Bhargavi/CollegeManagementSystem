import { useEffect, useMemo, useState } from "react";

interface ManagementModulePageProps {
    title: string;
    description: string;
    endpoint: string;
}

type RecordValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | object;

function formatColumnName(column: string): string {
    return column
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}

function formatValue(value: RecordValue): string {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (
        typeof value === "object"
    ) {
        try {
            return JSON.stringify(value);
        } catch {
            return "-";
        }
    }

    return String(value);
}

function extractRecords(responseData: any): any[] {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (
        responseData &&
        Array.isArray(responseData.content)
    ) {
        return responseData.content;
    }

    if (
        responseData &&
        Array.isArray(responseData.data)
    ) {
        return responseData.data;
    }

    if (
        responseData &&
        Array.isArray(responseData.results)
    ) {
        return responseData.results;
    }

    if (
        responseData &&
        typeof responseData === "object"
    ) {
        return [responseData];
    }

    return [];
}

function ManagementModulePage({
    title,
    description,
    endpoint,
}: ManagementModulePageProps) {
    const [records, setRecords] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const loadRecords = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "Authentication token not found."
                );
            }

            const response =
                await fetch(
                    `http://localhost:8080/api${endpoint}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `Failed to load ${title}.`
                );
            }

            const data =
                await response.json();

            const extractedRecords =
                extractRecords(data);

            setRecords(
                extractedRecords
            );

        } catch (err: any) {
            console.error(
                `Management ${title} error:`,
                err
            );

            setError(
                err?.message ||
                    `Unable to load ${title}.`
            );

            setRecords([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecords();
    }, [endpoint]);

    const columns = useMemo(() => {
        const columnSet =
            new Set<string>();

        records.forEach((record) => {
            if (
                record &&
                typeof record === "object" &&
                !Array.isArray(record)
            ) {
                Object.keys(record).forEach(
                    (key) =>
                        columnSet.add(key)
                );
            }
        });

        return Array.from(columnSet);
    }, [records]);

    const filteredRecords =
        useMemo(() => {
            const term =
                searchTerm
                    .trim()
                    .toLowerCase();

            if (!term) {
                return records;
            }

            return records.filter(
                (record) => {
                    try {
                        return JSON.stringify(
                            record
                        )
                            .toLowerCase()
                            .includes(term);
                    } catch {
                        return false;
                    }
                }
            );
        },
        [records, searchTerm]);

    return (
        <div className="management-module-page">

            {/* PAGE HEADER */}

            <div className="management-page-header">

                <h2>
                    {title}
                </h2>

                <p>
                    {description}
                </p>

            </div>

            {/* ERROR */}

            {error && (
                <div className="management-error">

                    {error}

                    <button
                        type="button"
                        className="management-retry-button"
                        onClick={loadRecords}
                    >
                        Retry
                    </button>

                </div>
            )}

            {/* MAIN CARD */}

            <div className="management-module-card">

                <div className="management-module-card-header">

                    <div>

                        <h2>
                            {title} Records
                        </h2>

                        <p>
                            {loading
                                ? "Loading records..."
                                : `${filteredRecords.length} record${
                                      filteredRecords.length ===
                                      1
                                          ? ""
                                          : "s"
                                  } available`}
                        </p>

                    </div>

                    <button
                        type="button"
                        className="management-refresh-button"
                        onClick={loadRecords}
                        disabled={loading}
                    >
                        Refresh
                    </button>

                </div>

                {/* SEARCH */}

                {!loading &&
                    records.length > 0 && (
                        <div className="management-module-toolbar">

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder={`Search ${title.toLowerCase()}...`}
                                className="management-search-input"
                            />

                            <span className="management-record-count">
                                Showing{" "}
                                {
                                    filteredRecords.length
                                }{" "}
                                of{" "}
                                {records.length}
                            </span>

                        </div>
                    )}

                {/* LOADING */}

                {loading && (
                    <div className="management-loading">
                        Loading {title.toLowerCase()}...
                    </div>
                )}

                {/* EMPTY */}

                {!loading &&
                    !error &&
                    records.length === 0 && (
                        <div className="management-empty">

                            No {title.toLowerCase()} records
                            are available.

                        </div>
                    )}

                {/* NO SEARCH RESULTS */}

                {!loading &&
                    records.length > 0 &&
                    filteredRecords.length === 0 && (
                        <div className="management-empty">

                            No records match your
                            search.

                        </div>
                    )}

                {/* TABLE */}

                {!loading &&
                    filteredRecords.length > 0 &&
                    columns.length > 0 && (
                        <div className="management-table-wrapper">

                            <table className="management-table">

                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        {columns.map(
                                            (column) => (
                                                <th
                                                    key={
                                                        column
                                                    }
                                                >
                                                    {formatColumnName(
                                                        column
                                                    )}
                                                </th>
                                            )
                                        )}

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredRecords.map(
                                        (
                                            record,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    record?.id ??
                                                    record?.studentId ??
                                                    record?.facultyId ??
                                                    record?.staffId ??
                                                    record?.courseId ??
                                                    record?.departmentId ??
                                                    record?.examinationId ??
                                                    record?.attendanceId ??
                                                    record?.markId ??
                                                    record?.resultId ??
                                                    record?.feeId ??
                                                    record?.paymentId ??
                                                    record?.eventId ??
                                                    record?.noticeId ??
                                                    record?.applicationId ??
                                                    index
                                                }
                                            >

                                                <td>
                                                    {index +
                                                        1}
                                                </td>

                                                {columns.map(
                                                    (
                                                        column
                                                    ) => (
                                                        <td
                                                            key={
                                                                column
                                                            }
                                                            title={formatValue(
                                                                record?.[
                                                                    column
                                                                ]
                                                            )}
                                                        >
                                                            {formatValue(
                                                                record?.[
                                                                    column
                                                                ]
                                                            )}
                                                        </td>
                                                    )
                                                )}

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

            </div>

        </div>
    );
}

export default ManagementModulePage;