import React from "react";
import "./Layout.css";
import { announcements } from "../../data/churchInfo";
import { useLanguage } from "../../contexts/LanguageContext";

const AdBanner = () => {
  const { language, isAmharic, isOromo } = useLanguage();

  const getTitle = () => {
    if (isOromo) return "Beeksisa";
    if (isAmharic) return "ማስታወቂያዎች";
    return "Announcements";
  };

  return (
    <section className="ad-banner">
      <div className="ad-container">
        <div className="ad-header">
          <svg
            className="ad-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <h2 className="ad-main-title">{getTitle()}</h2>
        </div>

        <div className="announcements-grid">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              {/* Image Section */}
              <div className="announcement-image">
                <img
                  src={announcement.image}
                  alt={
                    isOromo
                      ? announcement.titleOromo
                      : isAmharic
                      ? announcement.titleAmharic
                      : announcement.title
                  }
                />
                <div className="announcement-date-overlay">
                  <span className="date-day">
                    {new Date(announcement.date).getDate()}
                  </span>
                  <span className="date-month">
                    {new Date(announcement.date).toLocaleString("en", {
                      month: "short",
                    })}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="announcement-content">
                <div className="announcement-header">
                  <h3 className="announcement-title">
                    {isOromo
                      ? announcement.titleOromo
                      : isAmharic
                      ? announcement.titleAmharic
                      : announcement.title}
                  </h3>
                  <div className="announcement-time">
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                    </svg>
                    {announcement.time}
                  </div>
                </div>

                <p className="announcement-description">
                  {isOromo
                    ? announcement.descriptionOromo
                    : isAmharic
                    ? announcement.descriptionAmharic
                    : announcement.description}
                </p>

                <div className="announcement-footer">
                  <a
                    href={announcement.link} // <- link from your data
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more-btn"
                  >
                    {isOromo
                      ? "Dabalataa"
                      : isAmharic
                      ? "ተጨማሪ አንብብ"
                      : "Read More"}
                  </a>
                  <div className="announcement-category">
                    {announcement.category || "Event"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdBanner;
