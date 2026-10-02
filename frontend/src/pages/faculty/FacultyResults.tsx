import { useEffect, useState } from "react";

import type {
    FacultyResult,
} from "../../api/facultyPortalApi";

import {
    getMyFacultyResults,
} from "../../api/facultyPortalApi";

export default function FacultyResults() {

    const [results, setResults] =
        useState<FacultyResult[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadResults();

    }, []);

    const loadResults = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getMyFacultyResults();

            setResults(data);

        } catch (err) {

            console.error(
                "Failed to load faculty results:",
                err
            );

            setError(
                "Failed to load results."
            );

        } finally {

            setLoading(false);
        }
    };

    if (loading) {

        return (
            <h2>
                Loading results...
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
                My Results
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

            {results.length === 0 ? (

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    No results found for your students.
                </div>

            ) : (

                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    backgroundColor:
                                        "#f3f4f6",
                                }}
                            >

                                <th style={thStyle}>
                                    Result ID
                                </th>

                                <th style={thStyle}>
                                    Student ID
                                </th>

                                <th style={thStyle}>
                                    Student Name
                                </th>

                                <th style={thStyle}>
                                    Semester
                                </th>

                                <th style={thStyle}>
                                    SGPA
                                </th>

                                <th style={thStyle}>
                                    CGPA
                                </th>

                                <th style={thStyle}>
                                    Status
                                </th>

                                <th style={thStyle}>
                                    Published At
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {results.map(
                                (result) => (

                                    <tr
                                        key={
                                            result.resultId
                                        }
                                    >

                                        <td style={tdStyle}>
                                            {
                                                result.resultId
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                result.studentId
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                result.studentName
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                result.semesterId
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                result.sgpa
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                result.cgpa
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                result.resultStatus
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {
                                                result.publishedAt
                                                    ? new Date(
                                                        result.publishedAt
                                                    ).toLocaleString()
                                                    : "-"
                                            }
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

const thStyle: React.CSSProperties = {

    padding: "12px",

    textAlign: "left",

    borderBottom:
        "1px solid #ddd",
};

const tdStyle: React.CSSProperties = {

    padding: "12px",

    borderBottom:
        "1px solid #eee",
};