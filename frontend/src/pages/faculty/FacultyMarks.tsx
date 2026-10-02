import { useEffect, useState } from "react";

import type{
  FacultyMark,
} from "../../api/facultyPortalApi";

import {
  getMyFacultyMarks,
} from "../../api/facultyPortalApi";

export default function FacultyMarks() {

  const [marks, setMarks] = useState<FacultyMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMarks();
  }, []);

  const loadMarks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyFacultyMarks();

      setMarks(data);

    } catch (err) {
      console.error("Failed to load faculty marks:", err);
      setError("Failed to load marks.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading marks...</h2>;
  }

  return (
    <div>

      <h1 style={{ marginBottom: "20px" }}>
        My Marks
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

      {marks.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          No marks found for your courses.
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >

            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={thStyle}>
                  Mark ID
                </th>

                <th style={thStyle}>
                  Exam 
                </th>

                <th style={thStyle}>
                  Student ID
                </th>

                <th style={thStyle}>
                  Student Name
              </th>

                <th style={thStyle}>
                  Marks Obtained
                </th>

                <th style={thStyle}>
                  Remarks
                </th>
              </tr>
            </thead>

            <tbody>

              {marks.map((mark) => (
                <tr key={mark.markId}>

                  <td style={tdStyle}>
                    {mark.markId}
                  </td>

                  <td style={tdStyle}>
                    {mark.examType}
                  </td>

                  <td style={tdStyle}>
                    {mark.studentId}
                  </td>
                  
                  <td style={tdStyle}>
                      {mark.studentName}
                  </td>

                  <td style={tdStyle}>
                    {mark.marksObtained}
                  </td>

                  <td style={tdStyle}>
                    {mark.remarks || "-"}
                  </td>

                </tr>
              ))}

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
  borderBottom: "1px solid #ddd",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};