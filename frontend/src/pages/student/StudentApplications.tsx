import { useEffect, useState } from "react";
import { getMyApplications } from "../../api/studentPortalApi";

export default function StudentApplications() {

    const [applications, setApplications] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadApplications = async () => {

            try {

                const data =
                    await getMyApplications();

                setApplications(
                    Array.isArray(data)
                        ? data
                        : []
                );

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

        loadApplications();

    }, []);

    if (loading) {
        return <p>Loading applications...</p>;
    }

    return (
        <div>

            <h1>My Applications</h1>

            {error && <p>{error}</p>}

            {!error && applications.length === 0 && (
                <p>No applications found.</p>
            )}

            {applications.length > 0 && (

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
                                applications[0]
                            ).map(key => (

                                <th key={key}>
                                    {key}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {applications.map(
                            (application, index) => (

                                <tr key={index}>

                                    {Object.keys(
                                        applications[0]
                                    ).map(key => (

                                        <td key={key}>

                                            {application[key] !==
                                            null
                                                ? String(
                                                      application[
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