const VisitorAbout = () => {
  return (
    <div className="visitor-page">
      <section className="visitor-page-banner">
        <span>ABOUT US</span>
        <h1>About Our College</h1>
        <p>
          Learn more about the institution, its academic environment and its
          commitment to education.
        </p>
      </section>

      <section className="visitor-section">
        <div className="visitor-content-container">
          <div className="visitor-content-block">
            <span className="visitor-content-label">OUR INSTITUTION</span>

            <h2>College Management System</h2>

            <p>
              The College Management System provides a centralized digital
              platform for academic and administrative activities.
            </p>

            <p>
              The public portal provides visitors and prospective students
              with access to general institutional information including
              departments, courses, faculty, events, notices and admission
              information.
            </p>

            <p>
              Secure academic and administrative information remains available
              only to authorized users through their respective portals.
            </p>
          </div>

          <div className="visitor-about-box">
            <h3>Our Focus</h3>

            <ul>
              <li>Academic excellence</li>
              <li>Accessible educational information</li>
              <li>Efficient academic administration</li>
              <li>Student-focused services</li>
              <li>Transparent institutional communication</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisitorAbout;