
import "../../styles/visitor-information.css";

function VisitorContact() {
    return (
        <div className="visitor-information-page">
            <section className="visitor-information-hero">
                <div className="visitor-information-container">
                    <p className="visitor-information-eyebrow">
                        GET IN TOUCH
                    </p>

                    <h1>Contact Us</h1>

                    <p className="visitor-information-intro">
                        Official contact information for general enquiries
                        and college information.
                    </p>
                </div>
            </section>

            <section className="visitor-information-section">
                <div className="visitor-information-container">
                    <span className="visitor-information-section-label">
                        CONTACT INFORMATION
                    </span>

                    <h2>How Can We Help You?</h2>

                    <p className="visitor-information-description">
                        Find information about the college address, general
                        enquiries, email communication, and office hours.
                    </p>

                    <div className="visitor-information-contact-grid">
                        <article className="visitor-information-contact-card">
                            <h3>College Address</h3>

                            <p>
                                College campus address can be displayed here.
                            </p>
                        </article>

                        <article className="visitor-information-contact-card">
                            <h3>General Enquiries</h3>

                            <p>
                                Official college telephone number and enquiry
                                information can be displayed here.
                            </p>
                        </article>

                        <article className="visitor-information-contact-card">
                            <h3>Email</h3>

                            <p>
                                Official college email address can be displayed
                                here.
                            </p>
                        </article>

                        <article className="visitor-information-contact-card">
                            <h3>Office Hours</h3>

                            <p>
                                Public office hours and general enquiry timings
                                can be displayed here.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default VisitorContact;
