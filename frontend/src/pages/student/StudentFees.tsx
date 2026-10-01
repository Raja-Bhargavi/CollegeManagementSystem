import { useEffect, useState } from "react";
import { getMyFees } from "../../api/studentPortalApi";

export default function StudentFees() {

    const [fees, setFees] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadFees = async () => {

            try {

                const data =
                    await getMyFees();

                setFees(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error: any) {

                console.error(
                    "Failed to load fees:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load fees."
                );

            } finally {

                setLoading(false);
            }
        };

        loadFees();

    }, []);

    if (loading) {
        return <p>Loading fees...</p>;
    }

    return (
        <div>

            <h1>My Fees</h1>

            {error && <p>{error}</p>}

            {!error && fees.length === 0 && (
                <p>No fee records found.</p>
            )}

            {fees.length > 0 && (

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
                                fees[0]
                            ).map(key => (

                                <th key={key}>
                                    {key}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {fees.map(
                            (fee, index) => (

                                <tr key={index}>

                                    {Object.keys(
                                        fees[0]
                                    ).map(key => (

                                        <td key={key}>

                                            {fee[key] !==
                                            null
                                                ? String(
                                                      fee[
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