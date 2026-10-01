import { useEffect, useState } from "react";
import {
    getMyStudentProfile,

} from "../../api/studentPortalApi";

import type{
    StudentProfileData,
} from "../../api/studentPortalApi";

export default function StudentProfile() {
    const [profile, setProfile] =
        useState<StudentProfileData | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyStudentProfile();
            setProfile(data);
        } catch (error: any) {
            console.error("Failed to load student profile:", error);

            setError(
                error?.response?.data?.message ||
                "Failed to load student profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return (
            <div>
                <h1>My Profile</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div>
                <h1>My Profile</h1>
                <p>No student profile found.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>My Profile</h1>

            <table
                border={1}
                cellPadding={10}
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    maxWidth: "700px",
                }}
            >
                <tbody>
                    <tr>
                        <th>Student ID</th>
                        <td>{profile.studentId}</td>
                    </tr>

                    <tr>
                        <th>Roll Number</th>
                        <td>{profile.rollNumber}</td>
                    </tr>

                    <tr>
                        <th>Name</th>
                        <td>
                            {profile.firstName} {profile.lastName}
                        </td>
                    </tr>

                    <tr>
                        <th>Date of Birth</th>
                        <td>{profile.dateOfBirth || "-"}</td>
                    </tr>

                    <tr>
                        <th>Gender</th>
                        <td>{profile.gender || "-"}</td>
                    </tr>

                    <tr>
                        <th>Phone</th>
                        <td>{profile.phone || "-"}</td>
                    </tr>

                    <tr>
                        <th>Program ID</th>
                        <td>{profile.programId}</td>
                    </tr>

                    <tr>
                        <th>Admission Year</th>
                        <td>{profile.admissionYear}</td>
                    </tr>

                    <tr>
                        <th>Current Semester</th>
                        <td>{profile.currentSemester}</td>
                    </tr>

                    <tr>
                        <th>Status</th>
                        <td>{profile.studentStatus}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}