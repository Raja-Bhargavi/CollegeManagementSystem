import { useEffect, useState } from "react";
import { getMyAttendance } from "../../api/studentPortalApi";

export default function StudentAttendance() {

    const [attendance, setAttendance] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadAttendance = async () => {

            try {

                const data =
                    await getMyAttendance();

                setAttendance(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error: any) {

                console.error(
                    "Failed to load attendance:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load attendance."
                );

            } finally {

                setLoading(false);
            }
        };

        loadAttendance();

    }, []);

    if (loading) {
        return <p>Loading attendance...</p>;
    }

    return (
        <div>

            <h1>My Attendance</h1>

            {error && <p>{error}</p>}

            {!error && attendance.length === 0 && (
                <p>No attendance records found.</p>
            )}

            {attendance.length > 0 && (

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
                            <th>Attendance ID</th>
                            <th>Registration ID</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {attendance.map(record => (

                            <tr
                                key={
                                    record.attendanceId
                                }
                            >

                                <td>
                                    {
                                        record.attendanceId
                                    }
                                </td>

                                <td>
                                    {
                                        record.registrationId
                                    }
                                </td>

                                <td>
                                    {
                                        record.attendanceDate
                                    }
                                </td>

                                <td>
                                    {record.status}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

        </div>
    );
}