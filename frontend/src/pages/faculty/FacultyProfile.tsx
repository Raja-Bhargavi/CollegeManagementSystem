import { useEffect, useState } from "react";
import api from "../../api/axios";

interface FacultyProfileData {
    facultyId: number;
    employeeId: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    departmentId?: number | null;
    designation?: string | null;
    facultyStatus?: string | null;
}

export default function FacultyProfile() {

    const [profile, setProfile] =
        useState<FacultyProfileData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const response =
                    await api.get("/api/faculty/me");

                setProfile(response.data);

            } catch (err) {

                console.error(
                    "Failed to load faculty profile:",
                    err
                );

                setError(
                    "Failed to load faculty profile."
                );

            } finally {

                setLoading(false);
            }
        };

        loadProfile();

    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return (
            <p style={{ color: "red" }}>
                {error}
            </p>
        );
    }

    if (!profile) {
        return <p>No profile found.</p>;
    }

    return (
        <div>

            <h1>My Profile</h1>

            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    marginTop: "20px",
                }}
            >

                <p>
                    <strong>Faculty ID:</strong>{" "}
                    {profile.facultyId}
                </p>

                <p>
                    <strong>Employee ID:</strong>{" "}
                    {profile.employeeId}
                </p>

                <p>
                    <strong>First Name:</strong>{" "}
                    {profile.firstName}
                </p>

                <p>
                    <strong>Last Name:</strong>{" "}
                    {profile.lastName}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {profile.email || "N/A"}
                </p>

                <p>
                    <strong>Phone:</strong>{" "}
                    {profile.phone || "N/A"}
                </p>

                <p>
                    <strong>Department ID:</strong>{" "}
                    {profile.departmentId ?? "N/A"}
                </p>

                <p>
                    <strong>Designation:</strong>{" "}
                    {profile.designation || "N/A"}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {profile.facultyStatus || "N/A"}
                </p>

            </div>

        </div>
    );
}