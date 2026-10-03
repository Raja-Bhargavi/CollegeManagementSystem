import { useEffect, useState } from "react";

import {
    getFaculty,
} from "../../api/facultyApi";

import type {
    Faculty,
} from "../../api/facultyApi";

import {
    getDepartments,
} from "../../api/departmentApi";

import type {
    Department,
} from "../../api/departmentApi";


export default function StaffFaculty() {

    const [faculty, setFaculty] =
        useState<Faculty[]>([]);

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD FACULTY
    // =====================================================

    const loadFaculty = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getFaculty();

            setFaculty(data);

        } catch (error: any) {

            console.error(
                "Failed to load faculty:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to load faculty."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD DEPARTMENTS
    // =====================================================

    const loadDepartments = async () => {

        try {

            const data =
                await getDepartments();

            setDepartments(data);

        } catch (error: any) {

            console.error(
                "Failed to load departments:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to load departments."
            );
        }
    };


    useEffect(() => {

        loadFaculty();
        loadDepartments();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div>
                <h1>Faculty</h1>
                <p>Loading faculty records...</p>
            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <div>

            <div
                style={{
                    marginBottom: "25px",
                }}
            >

                <h1>
                    Faculty
                </h1>

                <p
                    style={{
                        color: "#6b7280",
                        marginTop: "5px",
                    }}
                >
                    View faculty information for
                    administrative reference.
                </p>

            </div>


            {error && (
                <div
                    style={{
                        padding: "12px",
                        marginBottom: "15px",
                        border:
                            "1px solid #fca5a5",
                        backgroundColor:
                            "#fef2f2",
                        color: "#991b1b",
                        borderRadius: "6px",
                    }}
                >
                    {error}
                </div>
            )}


            {faculty.length === 0 ? (

                <p>
                    No faculty records found.
                </p>

            ) : (

                <div
                    style={{
                        overflowX: "auto",
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={cellStyle}>
                                    ID
                                </th>

                                <th style={cellStyle}>
                                    Employee Number
                                </th>

                                <th style={cellStyle}>
                                    Name
                                </th>

                                <th style={cellStyle}>
                                    Phone
                                </th>

                                <th style={cellStyle}>
                                    Designation
                                </th>

                                <th style={cellStyle}>
                                    Department
                                </th>

                                <th style={cellStyle}>
                                    Joining Date
                                </th>

                                <th style={cellStyle}>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {faculty.map(
                                (member) => {

                                    const department =
                                        departments.find(
                                            (item) =>
                                                item.departmentId ===
                                                member.departmentId
                                        );

                                    return (

                                        <tr
                                            key={
                                                member.facultyId
                                            }
                                        >

                                            <td style={cellStyle}>
                                                {
                                                    member.facultyId
                                                }
                                            </td>

                                            <td style={cellStyle}>
                                                {
                                                    member.employeeNumber
                                                }
                                            </td>

                                            <td style={cellStyle}>
                                                {
                                                    member.firstName
                                                }{" "}
                                                {
                                                    member.lastName
                                                }
                                            </td>

                                            <td style={cellStyle}>
                                                {
                                                    member.phone ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={cellStyle}>
                                                {
                                                    member.designation ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={cellStyle}>

                                                {department
                                                    ? `${department.departmentCode} - ${department.departmentName}`
                                                    : member.departmentId}

                                            </td>

                                            <td style={cellStyle}>
                                                {
                                                    member.joiningDate ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={cellStyle}>
                                                {
                                                    member.facultyStatus
                                                }
                                            </td>

                                        </tr>

                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}


const cellStyle:
    React.CSSProperties = {

    border:
        "1px solid #ddd",

    padding:
        "10px",

    textAlign:
        "left",
};
