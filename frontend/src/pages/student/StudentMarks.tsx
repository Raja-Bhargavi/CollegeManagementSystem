import { useEffect, useState } from "react";
import { getMyMarks } from "../../api/studentPortalApi";

export default function StudentMarks() {

    const [marks, setMarks] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadMarks = async () => {

            try {

                const data =
                    await getMyMarks();

                setMarks(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error: any) {

                console.error(
                    "Failed to load marks:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load marks."
                );

            } finally {

                setLoading(false);
            }
        };

        loadMarks();

    }, []);

    if (loading) {
        return <p>Loading marks...</p>;
    }

    return (
        <div>

            <h1>My Marks</h1>

            {error && <p>{error}</p>}

            {!error && marks.length === 0 && (
                <p>No marks available.</p>
            )}

            {marks.length > 0 && (

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
                            <th>Mark ID</th>
                            <th>Examination ID</th>
                            <th>Marks Obtained</th>
                            <th>Remarks</th>
                        </tr>

                    </thead>

                    <tbody>

                        {marks.map(mark => (

                            <tr
                                key={mark.markId}
                            >

                                <td>
                                    {mark.markId}
                                </td>

                                <td>
                                    {mark.examId}
                                </td>

                                <td>
                                    {mark.marksObtained}
                                </td>

                                <td>
                                    {mark.remarks || "-"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

        </div>
    );
}