import { Link } from "react-router-dom";

const VisitorAcademics = () => {
  return (
    <div className="visitor-page">

      <section className="visitor-page-header">
        <div className="visitor-container">

          <p className="visitor-breadcrumb">
            Home / Academics
          </p>

          <h1>Academics</h1>

          <p>
            Explore the academic structure of the institution through
            departments, programs, courses, faculty, notices and events.
          </p>

        </div>
      </section>

      <section className="visitor-section">

        <div className="visitor-container">

          <div className="visitor-section-heading">

            <span>ACADEMIC INFORMATION</span>

            <h2>Explore Academics</h2>

            <p>
              Select an academic section below to explore the institution's
              academic structure and related information.
            </p>

          </div>

          <div className="academic-section-list">

            <Link
              to="/departments"
              className="academic-section-row"
            >
              <div className="academic-section-main">

                <span className="academic-section-number">
                  01
                </span>

                <div className="academic-section-content">

                  <h3>
                    Departments
                  </h3>

                  <p>
                    Explore the academic departments of the institution
                    and view their programs, courses, faculty and
                    department information.
                  </p>

                </div>

              </div>

              <span className="academic-section-arrow">
                →
              </span>

            </Link>


            <Link
              to="/departments"
              className="academic-section-row"
            >
              <div className="academic-section-main">

                <span className="academic-section-number">
                  02
                </span>

                <div className="academic-section-content">

                  <h3>
                    Programs
                  </h3>

                  <p>
                    Explore academic programs such as B.Tech and M.Tech
                    through their respective departments.
                  </p>

                </div>

              </div>

              <span className="academic-section-arrow">
                →
              </span>

            </Link>


            <Link
              to="/departments"
              className="academic-section-row"
            >
              <div className="academic-section-main">

                <span className="academic-section-number">
                  03
                </span>

                <div className="academic-section-content">

                  <h3>
                    Courses
                  </h3>

                  <p>
                    Browse courses through their respective academic
                    departments and programs.
                  </p>

                </div>

              </div>

              <span className="academic-section-arrow">
                →
              </span>

            </Link>


            <Link
              to="/faculty-info"
              className="academic-section-row"
            >
              <div className="academic-section-main">

                <span className="academic-section-number">
                  04
                </span>

                <div className="academic-section-content">

                  <h3>
                    Faculty
                  </h3>

                  <p>
                    Explore faculty members by department and academic
                    designation, including professors, associate professors
                    and assistant professors.
                  </p>

                </div>

              </div>

              <span className="academic-section-arrow">
                →
              </span>

            </Link>


            <Link
              to="/notices"
              className="academic-section-row"
            >
              <div className="academic-section-main">

                <span className="academic-section-number">
                  05
                </span>

                <div className="academic-section-content">

                  <h3>
                    Academic Notices
                  </h3>

                  <p>
                    View publicly available notices and important
                    academic announcements published by the institution.
                  </p>

                </div>

              </div>

              <span className="academic-section-arrow">
                →
              </span>

            </Link>


            <Link
              to="/events"
              className="academic-section-row"
            >
              <div className="academic-section-main">

                <span className="academic-section-number">
                  06
                </span>

                <div className="academic-section-content">

                  <h3>
                    Academic Events
                  </h3>

                  <p>
                    Explore upcoming institutional and academic events
                    available to visitors.
                  </p>

                </div>

              </div>

              <span className="academic-section-arrow">
                →
              </span>

            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default VisitorAcademics;