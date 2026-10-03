import { useEffect, useState } from "react";
import axios from "axios";

interface Faculty {
  facultyId: number;
  firstName: string;
  lastName: string | null;
  designation: string;
  departmentId: number | null;
}

const VisitorFaculty = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/public/faculty"
        );

        setFaculty(response.data);
      } catch (err) {
        console.error("Failed to load faculty:", err);
        setError("Unable to load faculty information.");
      } finally {
        setLoading(false);
      }
    };

    loadFaculty();
  }, []);

  return (
    <div className="visitor-page">
      <section className="visitor-page-banner">
        <span>ACADEMICS</span>
        <h1>Faculty</h1>
        <p>
          Meet the faculty members and explore their academic designations.
        </p>
      </section>

      <section className="visitor-section">
        {loading && (
          <div className="visitor-state">
            Loading faculty information...
          </div>
        )}

        {error && (
          <div className="visitor-error">
            {error}
          </div>
        )}

        {!loading && !error && faculty.length === 0 && (
          <div className="visitor-state">
            No faculty information is currently available.
          </div>
        )}

        {!loading && !error && faculty.length > 0 && (
          <div className="visitor-card-grid">
            {faculty.map((member) => (
              <article
                key={member.facultyId}
                className="visitor-data-card visitor-faculty-card"
              >
                <div className="visitor-faculty-avatar">
                  {member.firstName.charAt(0)}
                </div>

                <h2>
                  {member.firstName}{" "}
                  {member.lastName || ""}
                </h2>

                <div className="visitor-faculty-designation">
                  {member.designation}
                </div>

                {member.departmentId !== null && (
                  <p>
                    Department ID: {member.departmentId}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VisitorFaculty;