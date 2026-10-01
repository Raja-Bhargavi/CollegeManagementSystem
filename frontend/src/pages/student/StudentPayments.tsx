import { useEffect, useState } from "react";
import { getMyPayments } from "../../api/studentPortalApi";

export default function StudentPayments() {

    const [payments, setPayments] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadPayments = async () => {

            try {

                const data =
                    await getMyPayments();

                setPayments(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error: any) {

                console.error(
                    "Failed to load payments:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load payments."
                );

            } finally {

                setLoading(false);
            }
        };

        loadPayments();

    }, []);

    if (loading) {
        return <p>Loading payments...</p>;
    }

    return (
        <div>

            <h1>My Payments</h1>

            {error && <p>{error}</p>}

            {!error && payments.length === 0 && (
                <p>No payment records found.</p>
            )}

            {payments.length > 0 && (

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
                                payments[0]
                            ).map(key => (

                                <th key={key}>
                                    {key}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {payments.map(
                            (payment, index) => (

                                <tr key={index}>

                                    {Object.keys(
                                        payments[0]
                                    ).map(key => (

                                        <td key={key}>

                                            {payment[key] !==
                                            null
                                                ? String(
                                                      payment[
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