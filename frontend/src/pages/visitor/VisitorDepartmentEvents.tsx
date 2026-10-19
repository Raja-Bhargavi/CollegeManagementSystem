
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/visitor-information.css";

interface Department {
    departmentId: number;
    departmentName: string;
    departmentCode: string;
}

interface CollegeEvent {
    eventId: number;
    title: string;
    description: string | null;
    eventDate: string;
    location: string | null;
    category: string | null;
    departmentId: number | null;
}

const API_BASE_URL = "http://localhost:8080/api/public";

const formatDateTime = (value: string) => {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString();
};

export default function VisitorDepartmentEvents() {
    const { departmentId: idParam } = useParams();
    const departmentId = Number(idParam);

    const [department, setDepartment] = useState<Department | null>(null);
    const [events, setEvents] = useState<CollegeEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadData() {
            if (!Number.isInteger(departmentId) || departmentId <= 0) {
                setError("Invalid department ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const options = { signal: controller.signal };

                const [departmentResponse, eventsResponse] =
                    await Promise.all([
                        axios.get<Department>(
                            `${API_BASE_URL}/departments/${departmentId}`,
                            options
                        ),
                        axios.get<CollegeEvent[]>(
                            `${API_BASE_URL}/departments/${departmentId}/events`,
                            options
                        ),
                    ]);

                setDepartment(departmentResponse.data);
                setEvents(eventsResponse.data);
            } catch (err) {
                if (controller.signal.aborted) return;

                console.error("Unable to load department events:", err);
                setError(
                    "Unable to load department events. Please try again later."
                );
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadData();
        return () => controller.abort();
    }, [departmentId]);

    return (
        <main className="visitor-information-page">
            <div className="visitor-information-container">
                <header className="visitor-information-hero">
                    <span className="visitor-information-eyebrow">
                        DEPARTMENT ACTIVITIES
                    </span>
                    <h1>
                        {department
                            ? `${department.departmentName} Events`
                            : "Department Events"}
                    </h1>
                    <p>
                        Upcoming workshops, seminars and activities assigned
                        to this department.
                    </p>
                </header>

                <section className="visitor-information-section">
                    {loading && (
                        <p className="visitor-information-loading" role="status">
                            Loading events...
                        </p>
                    )}

                    {!loading && error && (
                        <p className="visitor-information-error" role="alert">
                            {error}
                        </p>
                    )}

                    {!loading && !error && events.length === 0 && (
                        <p>
                            There are currently no upcoming public events
                            for this department.
                        </p>
                    )}

                    {!loading && !error && events.length > 0 && (
                        <div className="visitor-information-list">
                            {events.map((event) => (
                                <article
                                    className="visitor-information-card"
                                    key={event.eventId}
                                >
                                    <div className="visitor-information-meta">
                                        <span>
                                            Category: {event.category || "GENERAL"}
                                        </span>
                                        <span>
                                            {formatDateTime(event.eventDate)}
                                        </span>
                                    </div>

                                    <h3>{event.title}</h3>

                                    {event.description && (
                                        <p>{event.description}</p>
                                    )}

                                    {event.location && (
                                        <div className="visitor-information-meta">
                                            Location: {event.location}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <p>
                    <Link to={`/academics/departments/${departmentId}`}>
                        ← Back to Department
                    </Link>
                </p>
            </div>
        </main>
    );
}
