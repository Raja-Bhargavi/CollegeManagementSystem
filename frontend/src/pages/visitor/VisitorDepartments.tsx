import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/visitor-departments.css";

interface Department {
  departmentId: number;
  departmentName: string;
}

const VisitorDepartments: React.FC = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8080/api/public/departments"
        );

        if (!response.ok) {
          throw new Error("Failed to load departments");
        }

        const data: Department[] = await response.json();

        setDepartments(data);
      } catch (err) {
        console.error("Failed to load departments:", err);
        setError("Unable to load departments.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  /*
   * The current project data does not have a separate department-category
   * field, so the existing department names are organized into the
   * institutional sections shown in the reference layout.
   */
  const groupedDepartments = useMemo(() => {
    const basicScienceKeywords = [
      "physics",
      "humanities",
      "social",
      "chemistry",
      "mathematics",
    ];

    const basicSciences: Department[] = [];
    const engineering: Department[] = [];

    departments.forEach((department) => {
      const name = department.departmentName.toLowerCase();

      const isBasicScience = basicScienceKeywords.some((keyword) =>
        name.includes(keyword)
      );

      if (isBasicScience) {
        basicSciences.push(department);
      } else {
        engineering.push(department);
      }
    });

    return {
      basicSciences,
      engineering,
    };
  }, [departments]);

  const handleDepartmentClick = (departmentId: number) => {
    navigate(`/departments/${departmentId}`);
  };

  const renderDepartmentList = (items: Department[]) => {
    return (
      <div className="visitor-department-list">
        {items.map((department) => (
          <button
            key={department.departmentId}
            type="button"
            className="visitor-department-row"
            onClick={() =>
              handleDepartmentClick(department.departmentId)
            }
          >
            <span className="visitor-department-name">
              {department.departmentName}
            </span>

            <span
              className="visitor-department-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <main className="visitor-departments-page">
        <div className="visitor-departments-container">
          <div className="visitor-departments-header">
            <h1>Departments</h1>
          </div>

          <div className="visitor-departments-message">
            Loading departments...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="visitor-departments-page">
        <div className="visitor-departments-container">
          <div className="visitor-departments-header">
            <h1>Departments</h1>
          </div>

          <div className="visitor-departments-message visitor-departments-error">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="visitor-departments-page">
      <div className="visitor-departments-container">

        {/* Page heading */}
        <header className="visitor-departments-header">
          <h1>Departments</h1>
        </header>

        {/* Basic Sciences */}
        {groupedDepartments.basicSciences.length > 0 && (
          <section className="visitor-department-section">
            <h2>Basic Sciences</h2>

            {renderDepartmentList(groupedDepartments.basicSciences)}
          </section>
        )}

        {/* Engineering */}
        {groupedDepartments.engineering.length > 0 && (
          <section className="visitor-department-section">
            <h2>Engineering</h2>

            {renderDepartmentList(groupedDepartments.engineering)}
          </section>
        )}

        {/* No departments */}
        {departments.length === 0 && (
          <div className="visitor-departments-message">
            No departments are currently available.
          </div>
        )}
      </div>
    </main>
  );
};

export default VisitorDepartments;