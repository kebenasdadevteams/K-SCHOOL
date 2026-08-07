import React, { useState, useEffect } from "react";
import "./Layout.css";
import { useLanguage } from "../../contexts/LanguageContext";
import api from "../../services/api";

const AdBanner = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language, isAmharic, isOromo } = useLanguage();

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/promotions/homepage');
      setPromotions(response.data?.data || []);
    } catch (err) {
      console.error('Failed to load promotions:', err);
      setError('Failed to load promotions');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isOromo) return "Beeksisa";
    if (isAmharic) return "ማስታወቂያዎች";
    return "Announcements";
  };

  const getTranslatedText = (promotion, field) => {
    // Since promotions are currently only in English/Amharic,
    // we'll use the default text for now.
    // You can extend this to support multiple languages.
    if (isAmharic && promotion.amharic_title) {
      return promotion[field + '_am'] || promotion[field];
    }
    if (isOromo && promotion.oromo_title) {
      return promotion[field + '_or'] || promotion[field];
    }
    return promotion[field];
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString("en", { month: "short" }),
    };
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <section className="ad-banner">
        <div className="ad-container">
          <div className="ad-header">
            <div className="ad-icon-placeholder"></div>
            <h2 className="ad-main-title">{getTitle()}</h2>
          </div>
          <div className="announcements-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="announcement-card animate-pulse">
                <div className="announcement-image bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="announcement-content p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
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
          <div className="text-center py-8">
            <p className="text-[#865014]/60">{error}</p>
            <button
              onClick={loadPromotions}
              className="mt-4 px-4 py-2 bg-[#865014] text-white rounded-lg hover:bg-[#865014]/90"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
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
          <div className="text-center py-8">
            <p className="text-[#865014]/60">
              {isAmharic
                ? "ምንም ማስታወቂያዎች የሉም"
                : isOromo
                ? "Beeksisa hin jiru"
                : "No promotions available"}
            </p>
          </div>
        </div>
      </section>
    );
  }

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
          {promotions.slice(0, 6).map((promotion) => {
            const dateInfo = promotion.event_date ? formatDate(promotion.event_date) : null;
            
            return (
              <div key={promotion.id} className="announcement-card">
                {/* Image Section */}
                <div className="announcement-image">
                  {promotion.media_type === 'video' && promotion.video_url ? (
                    <div className="relative w-full h-full bg-black">
                      <video className="w-full h-full object-cover" muted>
                        <source src={promotion.video_url} />
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <svg
                          className="w-12 h-12 text-white/80"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={promotion.image_url || promotion.thumbnail_url || '/placeholder-image.jpg'}
                      alt={
                        isAmharic
                          ? promotion.amharic_title || promotion.title
                          : isOromo
                          ? promotion.oromo_title || promotion.title
                          : promotion.title
                      }
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  )}
                  
                  {dateInfo && (
                    <div className="announcement-date-overlay">
                      <span className="date-day">{dateInfo.day}</span>
                      <span className="date-month">{dateInfo.month}</span>
                    </div>
                  )}
                  
                  {promotion.is_featured && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="announcement-content">
                  <div className="announcement-header">
                    <h3 className="announcement-title">
                      {isAmharic
                        ? promotion.amharic_title || promotion.title
                        : isOromo
                        ? promotion.oromo_title || promotion.title
                        : promotion.title}
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
                      {promotion.start_time ? formatTime(promotion.start_time) : 'TBD'}
                      {promotion.end_time && ` - ${formatTime(promotion.end_time)}`}
                    </div>
                  </div>

                  <p className="announcement-description">
                    {isAmharic
                      ? promotion.amharic_description || promotion.description || promotion.header
                      : isOromo
                      ? promotion.oromo_description || promotion.description || promotion.header
                      : promotion.description || promotion.header}
                  </p>

                  {promotion.location && (
                    <div className="announcement-location text-sm text-[#865014]/60 mt-1">
                      <svg
                        className="inline-block w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {promotion.location}
                    </div>
                  )}

                  <div className="announcement-footer">
                    <a
                      href={`/promotions/${promotion.slug}`}
                      className="read-more-btn"
                    >
                      {isOromo
                        ? "Dabalataa"
                        : isAmharic
                        ? "ተጨማሪ አንብብ"
                        : "Read More"}
                    </a>
                    <div className="announcement-category">
                      {promotion.category || "Event"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {promotions.length > 6 && (
          <div className="text-center mt-8">
            <a
              href="/promotions"
              className="inline-block px-6 py-2 bg-[#865014] text-white rounded-lg hover:bg-[#865014]/90 transition-colors"
            >
              {isOromo
                ? "Hunduu Ilaali"
                : isAmharic
                ? "ሁሉንም ይመልከቱ"
                : "View All"}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdBanner;