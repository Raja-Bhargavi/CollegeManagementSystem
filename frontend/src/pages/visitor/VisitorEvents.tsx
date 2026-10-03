import { useEffect, useState } from "react";
import axios from "axios";

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
    const loadEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/public/events"
        );

        setEvents(response.data);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError("Unable to load event information.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="visitor-page">
      <section className="visitor-page-banner">
        <span>COLLEGE ACTIVITIES</span>
        <h1>Events</h1>
        <p>
          Stay updated with upcoming college events and activities.
        </p>
      </section>

      <section className="visitor-section">
        {loading && (
          <div className="visitor-state">
            Loading events...
          </div>
        )}

        {error && (
          <div className="visitor-error">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="visitor-state">
            No upcoming events are currently available.
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="visitor-list">
            {events.map((event) => (
              <article
                key={event.eventId}
                className="visitor-event-card"
              >
                <div className="visitor-event-date">
                  {new Date(event.eventDate).toLocaleDateString()}
                </div>

                <div className="visitor-event-content">
                  <h2>{event.title}</h2>

                  <p>
                    {event.description ||
                      "No additional description is available."}
                  </p>

                  <div className="visitor-event-meta">
                    <span>
                      Date: {formatDate(event.eventDate)}
                    </span>

                    {event.location && (
                      <span>
                        Location: {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VisitorEvents;