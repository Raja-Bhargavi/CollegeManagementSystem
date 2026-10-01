import { useEffect, useState } from "react";
import { getMyResults } from "../../api/studentPortalApi";

export default function StudentResults() {

    const [results, setResults] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadResults = async () => {

            try {

                const data =
                    await getMyResults();

                setResults(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error: any) {

                console.error(
                    "Failed to load results:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load results."
                );

            } finally {

                setLoading(false);
            }
        };

        loadResults();

    }, []);

    if (loading) {
        return <p>Loading results...</p>;
    }

    return (
        <div>

            <h1>My Results</h1>

            {error && <p>{error}</p>}

            {!error && results.length === 0 && (
                <p>No results available.</p>
            )}

            {results.length > 0 && (

                <table
                    border={1}
                    cellPadding={10}
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                    }}
                >

                    <thead>

                        <tr>

                            {Object.keys(
                                results[0]
                            ).map(key => (

                                <th key={key}>
                                    {key}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {results.map(
                            (result, index) => (

                                <tr key={index}>

                                    {Object.keys(
                                        results[0]
                                    ).map(key => (

                                        <td key={key}>

                                            {result[key] !==
                                            null
                                                ? String(
                                                      result[
                                                          key
                                                      ]
                                                  )
                                                : "-"}

                                        </td>

                                    ))}

                                </tr>

                            )
                        )}

                    </tbody>

                </table>
            )}

        </div>
    );
}