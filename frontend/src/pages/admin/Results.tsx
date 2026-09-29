import { useEffect, useState } from "react";

import {
  getResults,
  publishResult,
  updateResult,
  deleteResult,
} from "../../api/resultApi";

import type{
  Result,
  ResultRequest,
} from "../../api/resultApi";

import { getStudents, } from "../../api/studentApi";

import type{ Student,} from "../../api/studentApi";

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [studentId, setStudentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [sgpa, setSgpa] = useState("");
  const [cgpa, setCgpa] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const [resultData, studentData] = await Promise.all([
        getResults(),
        getStudents(),
      ]);

      setResults(resultData);
      setStudents(studentData);
    } catch (error: any) {
      console.error("Failed to load results:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to load results."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setStudentId("");
    setSemesterId("");
    setSgpa("");
    setCgpa("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    if (!studentId || !semesterId || !sgpa || !cgpa) {
      setMessage("Please fill all fields.");
      return;
    }

    const sgpaValue = Number(sgpa);
    const cgpaValue = Number(cgpa);

    if (sgpaValue < 0 || sgpaValue > 10) {
      setMessage("SGPA must be between 0 and 10.");
      return;
    }

    if (cgpaValue < 0 || cgpaValue > 10) {
      setMessage("CGPA must be between 0 and 10.");
      return;
    }

    const data: ResultRequest = {
      studentId: Number(studentId),
      semesterId: Number(semesterId),
      sgpa: sgpaValue,
      cgpa: cgpaValue,
    };

    try {
      if (editingId !== null) {
        await updateResult(editingId, data);
        setMessage("Result updated successfully.");
      } else {
        await publishResult(data);
        setMessage("Result published successfully.");
      }

      resetForm();
      await loadData();
    } catch (error: any) {
      console.error("Result operation failed:", error);

      setMessage(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Result operation failed."
      );
    }
  };

  const handleEdit = (result: Result) => {
    setEditingId(result.resultId);
    setStudentId(String(result.studentId));
    setSemesterId(String(result.semesterId));
    setSgpa(String(result.sgpa));
    setCgpa(String(result.cgpa));

    setMessage("");
  };

  const handleDelete = async (resultId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this result?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteResult(resultId);

      setMessage("Result deleted successfully.");

      await loadData();
    } catch (error: any) {
      console.error("Delete failed:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to delete result."
      );
    }
  };

  const getStudentName = (studentId: number) => {
    const student = students.find(
      (student) => student.studentId === studentId
    );

    if (!student) {
      return `Student #${studentId}`;
    }

    return `${student.firstName} ${student.lastName}`;
  };

  if (loading) {
    return <p>Loading results...</p>;
  }

  return (
    <div>
      <h1>Results</h1>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>
          {editingId !== null
            ? "Update Result"
            : "Publish Result"}
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <label>Student</label>
          <br />

          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option
                key={student.studentId}
                value={student.studentId}
              >
                {student.studentId} - {student.firstName}{" "}
                {student.lastName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Semester ID</label>
          <br />

          <input
            type="number"
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            placeholder="Enter semester ID"
            min="1"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>SGPA</label>
          <br />

          <input
            type="number"
            value={sgpa}
            onChange={(e) => setSgpa(e.target.value)}
            placeholder="0 - 10"
            min="0"
            max="10"
            step="0.01"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>CGPA</label>
          <br />

          <input
            type="number"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            placeholder="0 - 10"
            min="0"
            max="10"
            step="0.01"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <button type="submit">
          {editingId !== null
            ? "Update Result"
            : "Publish Result"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Result Records</h2>

      {results.length === 0 ? (
        <p>No result records found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                ID
              </th>

              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Student
              </th>

              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Semester
              </th>

              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                SGPA
              </th>

              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                CGPA
              </th>

              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Status
              </th>

              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Published At
              </th>

              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <tr key={result.resultId}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {result.resultId}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {getStudentName(result.studentId)}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {result.semesterId}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {result.sgpa}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {result.cgpa}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {result.resultStatus}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {result.publishedAt || "-"}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  <button
                    onClick={() => handleEdit(result)}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(result.resultId)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}