import { useEffect, useState } from "react";
import {
  getMyFacultyExaminations,
} from "../../api/facultyPortalApi";

import type{
  FacultyExamination,
} from "../../api/facultyPortalApi";

export default function FacultyExaminations() {

  const [examinations, setExaminations] = useState<FacultyExamination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExaminations();
  }, []);

  const loadExaminations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyFacultyExaminations();

      setExaminations(data);
    } catch (err) {
      console.error("Failed to load examinations:", err);
      setError("Failed to load examinations.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading examinations...</h2>;
  }

  return (
    <div>

      <h1 style={{ marginBottom: "20px" }}>
        My Examinations
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

      {examinations.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          No examinations found for your courses.
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
                <th style={thStyle}>Exam ID</th>
                <th style={thStyle}>Exam Type</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Maximum Marks</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {examinations.map((exam) => (
                <tr key={exam.examId}>
                  <td style={tdStyle}>{exam.examId}</td>
                  <td style={tdStyle}>{exam.examType}</td>
                  <td style={tdStyle}>{exam.examDate}</td>
                  <td style={tdStyle}>{exam.maximumMarks}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        backgroundColor:
                          exam.status === "SCHEDULED"
                            ? "#dcfce7"
                            : "#e5e7eb",
                        color:
                          exam.status === "SCHEDULED"
                            ? "#166534"
                            : "#374151",
                        padding: "5px 10px",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      {exam.status}
                    </span>
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