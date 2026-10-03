import { useEffect, useState } from "react";
import axios from "axios";

interface Notice {
  noticeId: number;
  title: string;
  content: string;
  publishedAt: string | null;
  expiryDate: string | null;
}

const VisitorNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/public/notices"
        );

        setNotices(response.data);
      } catch (err) {
        console.error("Failed to load notices:", err);
        setError("Unable to load notice information.");
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  return (
    <div className="visitor-page">
      <section className="visitor-page-banner">
        <span>ANNOUNCEMENTS</span>
        <h1>Notices</h1>
        <p>
          Read the latest publicly available college announcements.
        </p>
      </section>

      <section className="visitor-section">
        {loading && (
          <div className="visitor-state">
            Loading notices...
          </div>
        )}

        {error && (
          <div className="visitor-error">
            {error}
          </div>
        )}

        {!loading && !error && notices.length === 0 && (
          <div className="visitor-state">
            No public notices are currently available.
          </div>
        )}

        {!loading && !error && notices.length > 0 && (
          <div className="visitor-list">
            {notices.map((notice) => (
              <article
                key={notice.noticeId}
                className="visitor-notice-card"
              >
                <div className="visitor-notice-header">
                  <h2>{notice.title}</h2>

                  {notice.publishedAt && (
                    <span>
                      {new Date(
                        notice.publishedAt
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <p>{notice.content}</p>

                {notice.expiryDate && (
                  <div className="visitor-notice-expiry">
                    Available until:{" "}
                    {new Date(
                      notice.expiryDate
                    ).toLocaleDateString()}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VisitorNotices;