
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/visitor-information.css";

interface EventItem {
    eventId: number;
    title: string;
    description: string | null;
    eventDate: string;
    location: string | null;
}

const VisitorEvents = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadEvents = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get<EventItem[]>(
                    "http://localhost:8080/api/public/events",
                    { signal: controller.signal }
                );

                setEvents(response.data);
            } catch (err) {
                if (
                    axios.isCancel(err) ||
                    (axios.isAxiosError(err) &&
                        err.code === "ERR_CANCELED")
                ) {
                    return;
                }

                console.error("Failed to load events:", err);
                setError("Unable to load event information.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadEvents();

        return () => controller.abort();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    return (
        <div className="visitor-information-page">
            <section className="visitor-information-hero">
                <div className="visitor-information-container">
                    <p className="visitor-information-eyebrow">
                        COLLEGE ACTIVITIES
                    </p>

                    <h1>Events</h1>

                    <p className="visitor-information-intro">
                        Stay updated with upcoming college events and activities.
                    </p>
                </div>
            </section>

            <section className="visitor-information-section">
                <div className="visitor-information-container">
                    <span className="visitor-information-section-label">
                        CAMPUS LIFE
                    </span>

                    <h2>Upcoming Events</h2>

                    <p className="visitor-information-description">
                        Explore upcoming academic, cultural, and institutional
                        activities published by the college.
                    </p>

                    {loading && (
                        <div className="visitor-information-state">
                            Loading events...
                        </div>
                    )}

                    {!loading && error && (
                        <div
                            className="visitor-information-state visitor-information-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {!loading && !error && events.length === 0 && (
                        <div className="visitor-information-state">
                            No upcoming events are currently available.
                        </div>
                    )}

                    {!loading && !error && events.length > 0 && (
                        <div className="visitor-information-list">
                            {events.map((event) => (
                                <article
                                    key={event.eventId}
                                    className="visitor-information-card"
                                >
                                    <div className="visitor-information-meta">
                                        {new Date(
                                            event.eventDate
                                        ).toLocaleDateString()}
                                    </div>

                                    <h3>{event.title}</h3>

                                    <p>
                                        {event.description ||
                                            "No additional description is available."}
                                    </p>

                                    <div className="visitor-information-meta">
                                        <p>
                                            <strong>Date and time:</strong>{" "}
                                            {formatDate(event.eventDate)}
                                        </p>

                                        {event.location && (
                                            <p>
                                                <strong>Location:</strong>{" "}
                                                {event.location}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default VisitorEvents;
