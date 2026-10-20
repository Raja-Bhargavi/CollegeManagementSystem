
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/visitor-admissions.css";

import {
    getAdmissionPrograms,
    submitAdmission,
} from "../../api/admissionApi";

import type {
    AdmissionProgram,
    AdmissionSubmission,
} from "../../api/admissionApi";

const currentYear = new Date().getFullYear();

const initialForm: AdmissionSubmission = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    programId: 0,
    admissionYear: currentYear,
    previousQualification: "",
    previousPercentage: null,
};

export default function VisitorAdmissions() {
    const [programs, setPrograms] = useState<AdmissionProgram[]>([]);
    const [form, setForm] =
        useState<AdmissionSubmission>(initialForm);

    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let active = true;

        getAdmissionPrograms()
            .then((data) => {
                if (active) setPrograms(data);
            })
            .catch((err) => {
                console.error("Could not load programs:", err);

                if (active) {
                    setError(
                        "Programs could not be loaded. Please refresh the page or try again later."
                    );
                }
            })
            .finally(() => {
                if (active) setLoadingPrograms(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const selectedProgram = programs.find(
        (program) => program.programId === form.programId
    );

    function handleChange(
        event: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement |
            HTMLTextAreaElement
        >
    ) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                name === "programId"
                    ? Number(value)
                    : name === "previousPercentage"
                      ? value === "" ? null : Number(value)
                      : name === "admissionYear"
                        ? Number(value)
                        : value,
        }));

        setError("");
        setSuccess("");
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!form.programId || !selectedProgram) {
            setError("Please select a valid academic program.");
            return;
        }

        if (
            form.previousPercentage !== null &&
            (
                !Number.isFinite(form.previousPercentage) ||
                form.previousPercentage < 0 ||
                form.previousPercentage > 100
            )
        ) {
            setError("Previous percentage must be between 0 and 100.");
            return;
        }

        try {
            setSubmitting(true);

            const result = await submitAdmission(form);

            setSuccess(
                `${result.message} Application number: ${result.applicationNumber}. Status: ${result.status}.`
            );

            setForm(initialForm);
        } catch (err: any) {
            console.error("Registration failed:", err);

            const responseData = err?.response?.data;

            setError(
                responseData?.detail ||
                responseData?.message ||
                "Registration could not be submitted. Check your details and try again."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="visitor-admissions-page">
            <section className="visitor-admissions-hero">
                <div className="visitor-admissions-container">
                    <p className="visitor-admissions-eyebrow">
                        JOIN OUR INSTITUTION
                    </p>

                    <h1>Admissions</h1>

                    <p className="visitor-admissions-intro">
                        Explore our academic programs and submit your
                        admission application online. The college
                        administration will review your application
                        before admission is approved.
                    </p>
                </div>
            </section>

            <section className="visitor-admissions-section">
                <div className="visitor-admissions-container">
                    <div className="visitor-admissions-heading">
                        <span>ONLINE REGISTRATION</span>
                        <h2>Student Admission Form</h2>
                        <p>
                            Enter your details carefully. Fields marked
                            with * are required. Submitting this form
                            sends an application for review; it does not
                            guarantee admission.
                        </p>
                    </div>

                    <form
                        className="admission-registration-form"
                        onSubmit={handleSubmit}
                    >
                        <h3>Personal details</h3>

                        <div className="admission-form-grid">
                            <label>
                                First name *
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    maxLength={50}
                                    autoComplete="given-name"
                                    required
                                />
                            </label>

                            <label>
                                Last name *
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    maxLength={50}
                                    autoComplete="family-name"
                                    required
                                />
                            </label>

                            <label>
                                Date of birth *
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={form.dateOfBirth}
                                    onChange={handleChange}
                                    max={new Date().toISOString().slice(0, 10)}
                                    required
                                />
                            </label>

                            <label>
                                Gender
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">
                                        Prefer not to say
                                    </option>
                                </select>
                            </label>

                            <label>
                                Email address *
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    maxLength={100}
                                    autoComplete="email"
                                    required
                                />
                            </label>

                            <label>
                                Phone number *
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    maxLength={20}
                                    autoComplete="tel"
                                    required
                                />
                            </label>
                        </div>

                        <h3>Address details</h3>

                        <div className="admission-form-grid">
                            <label className="admission-form-full">
                                Address
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    maxLength={5000}
                                    rows={3}
                                />
                            </label>

                            <label>
                                City
                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    maxLength={100}
                                />
                            </label>

                            <label>
                                State
                                <input
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    maxLength={100}
                                />
                            </label>

                            <label>
                                Postal code
                                <input
                                    name="postalCode"
                                    value={form.postalCode}
                                    onChange={handleChange}
                                    maxLength={15}
                                    autoComplete="postal-code"
                                />
                            </label>
                        </div>

                        <h3>Academic details</h3>

                        <div className="admission-form-grid">
                            <label className="admission-form-full">
                                Academic program *
                                <select
                                    name="programId"
                                    value={form.programId || ""}
                                    onChange={handleChange}
                                    disabled={loadingPrograms}
                                    required
                                >
                                    <option value="">
                                        {loadingPrograms
                                            ? "Loading programs..."
                                            : "Select a program"}
                                    </option>

                                    {programs.map((program) => (
                                        <option
                                            key={program.programId}
                                            value={program.programId}
                                        >
                                            {program.programName}
                                            {" — "}
                                            {program.departmentName}
                                        </option>
                                    ))}
                                </select>

                                {programs.length === 0 &&
                                    !loadingPrograms && (
                                        <span className="admission-field-help">
                                            No programs are available.
                                            Please try again later.
                                        </span>
                                    )}
                            </label>

                            {selectedProgram && (
                                <div className="admission-program-summary admission-form-full">
                                    <strong>
                                        {selectedProgram.programName}
                                    </strong>
                                    <p>
                                        Degree: {selectedProgram.degreeType}
                                    </p>
                                    <p>
                                        Duration:{" "}
                                        {selectedProgram.durationYears} years
                                    </p>
                                    <p>
                                        Department:{" "}
                                        {selectedProgram.departmentName}
                                    </p>
                                </div>
                            )}

                            <label>
                                Admission year *
                                <input
                                    type="number"
                                    name="admissionYear"
                                    value={form.admissionYear}
                                    onChange={handleChange}
                                    min={currentYear}
                                    max={currentYear + 2}
                                    required
                                />
                            </label>

                            <label>
                                Previous qualification
                                <input
                                    name="previousQualification"
                                    value={form.previousQualification}
                                    onChange={handleChange}
                                    maxLength={100}
                                    placeholder="e.g. Intermediate"
                                />
                            </label>

                            <label>
                                Previous percentage
                                <input
                                    type="number"
                                    name="previousPercentage"
                                    value={form.previousPercentage ?? ""}
                                    onChange={handleChange}
                                    min={0}
                                    max={100}
                                    step={0.01}
                                />
                            </label>
                        </div>

                        {error && (
                            <div
                                className="admission-form-message admission-form-error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        {success && (
                            <div
                                className="admission-form-message admission-form-success"
                                role="status"
                            >
                                {success}
                            </div>
                        )}

                        <p className="admission-form-note">
                            By submitting this form, you confirm that
                            the information provided is accurate.
                        </p>

                        <button
                            type="submit"
                            className="visitor-admissions-button"
                            disabled={submitting || loadingPrograms}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Registration"}
                        </button>
                    </form>

                    <div className="visitor-admissions-contact">
                        <div>
                            <span>NEED MORE INFORMATION?</span>
                            <h2>Have Questions About Admissions?</h2>
                            <p>
                                Contact the institution for verified
                                information about admission requirements
                                and application procedures.
                            </p>
                        </div>

                        <Link
                            to="/contact"
                            className="visitor-admissions-button"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
