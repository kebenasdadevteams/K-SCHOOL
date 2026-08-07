import React, { useState, useEffect } from "react";
import "./DailyQuote.css";
import { useLanguage } from "../../contexts/LanguageContext";
import api from "../../services/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const DailyQuote = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showHistory, setShowHistory] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [quote, setQuote] = useState(null);
  const [pastQuotes, setPastQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allDevotionals, setAllDevotionals] = useState([]);
  const { language, isAmharic, isOromo } = useLanguage();

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
      return `${BACKEND_URL}${imagePath}`;
    }
    if (imagePath.startsWith('uploads/')) {
      return `${BACKEND_URL}/${imagePath}`;
    }
    return `${BACKEND_URL}/${imagePath}`;
  };

  // Fetch devotionals from API
  useEffect(() => {
    fetchDevotionals();
  }, []);

  // Update quote when date changes or devotionals load
  useEffect(() => {
    if (allDevotionals.length > 0) {
      updateQuoteForDate(selectedDate);
    }
  }, [selectedDate, allDevotionals]);

  const fetchDevotionals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/public/devotionals');
      const data = response.data?.data || [];
      
      // Remove duplicates by id - ensure unique devotionals
      const uniqueData = data.filter((item, index, self) => 
        index === self.findIndex((t) => t.id === item.id)
      );
      
      const formattedDevotionals = uniqueData.map((item) => {
        const fullImageUrl = getFullImageUrl(item.featured_image);
        
        return {
          id: item.id,
          text: item.title,
          textAmharic: item.title,
          textOromo: item.title,
          reference: item.verse_reference || 'Scripture',
          category: item.category || 'Devotional',
          image: fullImageUrl || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800',
          featured_image: fullImageUrl || '',
          date: item.published_at ? new Date(item.published_at) : new Date(item.created_at),
          content: item.content || item.excerpt || item.title,
          excerpt: item.excerpt || item.content?.substring(0, 150) || item.title,
          verse_text: item.verse_text || '',
          slug: item.slug || '',
          is_featured_today: item.is_featured_today || false,
          author_name: item.author_name || 'Kebena SDA Church',
          title: item.title,
          subtitle: item.subtitle || '',
          header: item.header || '',
        };
      });

      setAllDevotionals(formattedDevotionals);
      
      // Set today's quote - this will only set ONE quote
      updateQuoteForDate(new Date(), formattedDevotionals);
      
      // Build past quotes list
      buildPastQuotes(formattedDevotionals);
      
    } catch (err) {
      console.error('Failed to fetch devotionals:', err);
      setError('Failed to load devotionals. Please try again.');
      setAllDevotionals(fallbackDevotionals);
      updateQuoteForDate(new Date(), fallbackDevotionals);
      buildPastQuotes(fallbackDevotionals);
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteForDate = (date, devotionals = allDevotionals) => {
    if (devotionals.length === 0) return;

    const dateStr = date.toDateString();
    
    // Priority 1: Find a devotional published on this specific date
    let foundQuote = devotionals.find(d => 
      d.date && new Date(d.date).toDateString() === dateStr
    );

    // Priority 2: If today, get the featured devotional (only if not already found)
    if (!foundQuote && dateStr === new Date().toDateString()) {
      const featured = devotionals.find(d => d.is_featured_today === true);
      if (featured) {
        foundQuote = featured;
      }
    }

    // Priority 3: Get the latest published devotional
    if (!foundQuote) {
      const sorted = [...devotionals]
        .filter(d => d.date && new Date(d.date) <= new Date())
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      foundQuote = sorted[0] || devotionals[0];
    }

    // Set ONLY ONE quote
    setQuote(foundQuote);
  };

  const buildPastQuotes = (devotionals = allDevotionals) => {
    // Get the featured devotional ID to exclude it
    const featuredId = devotionals.find(d => d.is_featured_today === true)?.id;
    
    // Get all published devotionals sorted by date (excluding the featured one)
    const sorted = [...devotionals]
      .filter(d => {
        // Exclude featured today's devotional
        if (d.id === featuredId) return false;
        // Exclude any devotional that hasn't been published yet
        if (!d.date) return false;
        return new Date(d.date) < new Date();
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    const formatted = sorted.map(d => ({
      ...d,
      date: new Date(d.date)
    }));

    setPastQuotes(formatted);
  };

  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);

    // Check if there's a devotional for this date
    const hasDevotional = allDevotionals.some(d => 
      d.date && new Date(d.date).toDateString() === newDate.toDateString()
    );

    if (!hasDevotional) {
      // Find the previous available date
      const availableDates = allDevotionals
        .filter(d => d.date && new Date(d.date) < new Date())
        .map(d => new Date(d.date))
        .sort((a, b) => b - a);

      const previousDate = availableDates.find(d => d < selectedDate);
      if (previousDate) {
        setSelectedDate(previousDate);
        return;
      }
    }

    const startDate = new Date("2025-01-01");
    if (newDate >= startDate) {
      setSelectedDate(newDate);
    }
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);

    const today = new Date();
    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const getShareText = () => {
    if (!quote) return '';
    
    const quoteText = isOromo
      ? quote.textOromo || quote.text
      : isAmharic
      ? quote.textAmharic || quote.text
      : quote.text;

    return `"${quoteText}" - ${quote.reference}\n\nFrom Kebena SDA Church`;
  };

  const getShareUrl = () => {
    return window.location.href;
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(getShareText() + "\n\n" + getShareUrl());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareOnTelegram = () => {
    const text = encodeURIComponent(getShareText() + "\n\n" + getShareUrl());
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        getShareUrl()
      )}&text=${encodeURIComponent(getShareText())}`,
      "_blank"
    );
  };

  const copyToClipboard = () => {
    const shareText = getShareText() + "\n\n" + getShareUrl();
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        const message = isOromo
          ? "Gara clipboarditti garagalameera!"
          : isAmharic
          ? "ወደ ቅዳ ቦርድ ተቀድቷል!"
          : "Copied to clipboard!";

        const button = document.querySelector(
          '.share-option[data-platform="copy"]'
        );
        const originalText = button?.querySelector(
          ".share-platform-name"
        )?.textContent;
        if (button) {
          const platformName = button.querySelector(".share-platform-name");
          if (platformName) {
            platformName.textContent = message;
            setTimeout(() => {
              platformName.textContent = originalText || "Copy Link";
            }, 2000);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Quote - Kebena SDA Church",
          text: getShareText(),
          url: getShareUrl(),
        });
      } catch (err) {
        console.log("Native share cancelled");
      }
    } else {
      copyToClipboard();
    }
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const canGoNext =
    new Date(selectedDate).setHours(0, 0, 0, 0) <
    new Date().setHours(0, 0, 0, 0);

  const titles = {
    en: "Daily Devotional",
    am: "የቀኑ መንፈሳዊ አስተሳሰብ",
    or: "Yaadannoo Guyyaa",
  };

  const shareLabel = { en: "Share", am: "አጋራ", or: "Qooda" };
  const todayLabel = { en: "Today", am: "ዛሬ", or: "Har'a" };
  const historyLabel = {
    en: "View History",
    am: "ታሪክ ይመልከቱ",
    or: "Seenaa Ilaali",
  };
  const closeLabel = { en: "Close", am: "ዝጋ", or: "Cufi" };
  const readMoreLabel = {
    en: "Read Full Devotional",
    am: "ሙሉውን አንብብ",
    or: "Guutuu Dubbisi",
  };

  const shareModalTitle = {
    en: "Share this devotional",
    am: "ይህን መንፈሳዊ አስተሳሰብ ያጋሩ",
    or: "Yaadannoo kana Qoodaa",
  };

  if (loading) {
    return (
      <section className="daily-quote">
        <div className="quote-container">
          <div className="quote-content">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading devotional...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="daily-quote">
        <div className="quote-container">
          <div className="quote-content">
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchDevotionals} className="retry-btn">
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no quote is found, don't render anything
  if (!quote) return null;

  const fullContent = quote.content || quote.text || '';
  const displayText = fullContent.length > 150 
    ? fullContent.substring(0, 150) + '...' 
    : fullContent;

  const imageUrl = quote.image || quote.featured_image || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800';

  return (
    <section className="daily-quote">
      <div className="quote-container">
        <div className="quote-image-wrapper">
          <img
            src={imageUrl}
            alt={quote.category || 'Devotional'}
            className="quote-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800';
            }}
          />
          <div className="quote-image-overlay"></div>
        </div>

        <div className="quote-content">
          <div className="quote-header-row">
            <div className="quote-header-left">
              <svg
                className="quote-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <h2 className="quote-heading">{titles[language]}</h2>
            </div>
            <div className="quote-category">{quote.category || 'Devotional'}</div>
          </div>

          <blockquote className="quote-text">"{displayText}"</blockquote>

          <cite className="quote-reference">— {quote.reference}</cite>

          {/* Read More Button - Opens Modal */}
          {fullContent.length > 150 && (
            <button
              className="quote-read-more-btn"
              onClick={() => setShowQuoteModal(true)}
            >
              {readMoreLabel[language]}
              <span className="arrow">→</span>
            </button>
          )}

          <div className="quote-actions">
            <div className="quote-navigation">
              <button
                onClick={handlePrevious}
                className="quote-nav-btn"
                aria-label="Previous quote"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {!isToday && (
                <button onClick={handleToday} className="quote-today-btn">
                  {todayLabel[language]}
                </button>
              )}

              <button
                onClick={handleNext}
                className="quote-nav-btn"
                disabled={!canGoNext}
                aria-label="Next quote"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="quote-action-buttons">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="quote-history-btn"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {showHistory ? closeLabel[language] : historyLabel[language]}
              </button>

              <button onClick={handleShareClick} className="quote-share-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                {shareLabel[language]}
              </button>
            </div>
          </div>

          {showHistory && (
            <div className="quote-history">
              <h3 className="history-title">
                {language === "or"
                  ? "Yaadannoo Darban"
                  : language === "am"
                  ? "ያለፉ መንፈሳዊ አስተሳሰቦች"
                  : "Past Devotionals"}
              </h3>
              <div className="history-list">
                {pastQuotes.length === 0 ? (
                  <div className="history-empty">
                    {language === "or"
                      ? "Yaadannoo darban hin jiru"
                      : language === "am"
                      ? "ምንም ያለፉ መንፈሳዊ አስተሳሰቦች የሉም"
                      : "No past devotionals available"}
                  </div>
                ) : (
                  pastQuotes.map((pastQuote, index) => (
                    <div
                      key={index}
                      className={`history-item ${
                        pastQuote.date.toDateString() ===
                        selectedDate.toDateString()
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedDate(pastQuote.date);
                        setShowHistory(false);
                      }}
                    >
                      <div className="history-date">
                        {pastQuote.date.toLocaleDateString(
                          language === "or"
                            ? "om-ET"
                            : language === "am"
                            ? "am-ET"
                            : "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </div>
                      <div className="history-preview">
                        {pastQuote.text?.substring(0, 60) || ''}...
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quote Modal Popup - Full Content */}
      {showQuoteModal && (
        <div
          className="quote-modal-overlay"
          onClick={() => setShowQuoteModal(false)}
        >
          <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowQuoteModal(false)}
              aria-label="Close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="modal-content">
              <div className="modal-image-section">
                <img
                  src={imageUrl}
                  alt={quote.category || 'Devotional'}
                  className="modal-image"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800';
                  }}
                />
                <div className="modal-image-overlay"></div>
                <div className="modal-category">{quote.category || 'Devotional'}</div>
              </div>

              <div className="modal-text-section">
                <div className="modal-header">
                  <svg
                    className="modal-quote-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <h2 className="modal-title">{quote.title || 'Devotional'}</h2>
                </div>

                {quote.subtitle && (
                  <p className="modal-subtitle">{quote.subtitle}</p>
                )}

                <div className="modal-content-text">
                  <p>{fullContent}</p>
                </div>

                {quote.verse_text && (
                  <div className="modal-scripture">
                    <p className="modal-scripture-text">{quote.verse_text}</p>
                    <p className="modal-scripture-ref">— {quote.reference}</p>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    onClick={() => {
                      setShowQuoteModal(false);
                      setTimeout(() => setShowShareModal(true), 100);
                    }}
                    className="modal-share-btn"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    {shareLabel[language]}
                  </button>

                  <button
                    className="modal-close-text-btn"
                    onClick={() => setShowQuoteModal(false)}
                  >
                    {closeLabel[language]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal Popup */}
      {showShareModal && (
        <div
          className="share-modal-overlay"
          onClick={() => setShowShareModal(false)}
        >
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="share-modal-close-btn"
              onClick={() => setShowShareModal(false)}
              aria-label="Close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="share-modal-content">
              <div className="share-modal-header">
                <svg
                  className="share-modal-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <h2 className="share-modal-title">
                  {shareModalTitle[language]}
                </h2>
                <p className="share-modal-subtitle">
                  {language === "or"
                    ? "Yaadannoo kana media hawaasaa kanatti qoodi"
                    : language === "am"
                    ? "ይህን መንፈሳዊ አስተሳሰብ በማህበራዊ ሚዲያ ያጋሩ"
                    : "Share this devotional on social media"}
                </p>
              </div>

              <div className="share-options-grid">
                {navigator.share && (
                  <button
                    className="share-option native-share"
                    onClick={shareViaNative}
                    data-platform="native"
                  >
                    <div className="share-platform-icon">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                      </svg>
                    </div>
                    <span className="share-platform-name">
                      {language === "or"
                        ? "Qooda"
                        : language === "am"
                        ? "አጋራ"
                        : "Share"}
                    </span>
                  </button>
                )}

                <button
                  className="share-option"
                  onClick={shareOnFacebook}
                  data-platform="facebook"
                >
                  <div className="share-platform-icon facebook">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="share-platform-name">Facebook</span>
                </button>

                <button
                  className="share-option"
                  onClick={shareOnWhatsApp}
                  data-platform="whatsapp"
                >
                  <div className="share-platform-icon whatsapp">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z" />
                    </svg>
                  </div>
                  <span className="share-platform-name">WhatsApp</span>
                </button>

                <button
                  className="share-option"
                  onClick={shareOnTelegram}
                  data-platform="telegram"
                >
                  <div className="share-platform-icon telegram">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.139c-.164-.386-.605-.526-.948-.398l-11.38 4.347c-.363.133-.557.495-.432.852.124.354.481.56.845.423l3.135-1.178 1.453 4.646c.126.401.607.625 1.02.433.414-.192.603-.663.479-1.062l-1.242-3.966 8.923-5.624c.326-.206.445-.636.235-.965z" />
                    </svg>
                  </div>
                  <span className="share-platform-name">Telegram</span>
                </button>

                <button
                  className="share-option"
                  onClick={shareOnTwitter}
                  data-platform="twitter"
                >
                  <div className="share-platform-icon twitter">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </div>
                  <span className="share-platform-name">Twitter</span>
                </button>

                <button
                  className="share-option"
                  onClick={copyToClipboard}
                  data-platform="copy"
                >
                  <div className="share-platform-icon copy">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                  </div>
                  <span className="share-platform-name">
                    {language === "or"
                      ? "Linkii Naqaasii"
                      : language === "am"
                      ? "ሊንክ ቅዳ"
                      : "Copy Link"}
                  </span>
                </button>
              </div>

              <div className="share-preview">
                <div className="share-preview-content">
                  <p className="share-preview-text">
                    "{displayText.substring(0, 80)}..."
                  </p>
                  <p className="share-preview-reference">— {quote.reference}</p>
                </div>
              </div>

              <div className="share-modal-actions">
                <button
                  className="share-modal-close-btn-secondary"
                  onClick={() => setShowShareModal(false)}
                >
                  {closeLabel[language]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Fallback devotionals in case API fails
const fallbackDevotionals = [
  {
    id: 1,
    text: "Walking in God's Grace",
    textAmharic: "በእግዚአብሔር ጸጋ መመላለስ",
    textOromo: "Ayyaana Waaqayyoon Deemuu",
    reference: "Ephesians 2:8",
    category: "Grace",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800",
    featured_image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800",
    date: new Date(),
    content: "Grace is not just a concept; it's the very foundation of our relationship with God. When we understand that we are saved by grace through faith, we begin to live in the freedom that Christ has given us. This devotional explores the depth of God's grace and how it transforms our daily walk with Him.",
    verse_text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—",
    is_featured_today: true,
    title: "Walking in God's Grace",
    subtitle: "Understanding the transformative power of God's grace",
    author_name: "Kebena SDA Church",
  },
  {
    id: 2,
    text: "The Power of Prayer",
    textAmharic: "የጸሎት ኃይል",
    textOromo: "Humna Kadhaa",
    reference: "Philippians 4:6",
    category: "Prayer",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    featured_image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    date: new Date(Date.now() - 86400000),
    content: "Prayer is our direct line of communication with God. It's not just about asking for things, but about building a relationship with our Heavenly Father. Through prayer, we find strength, guidance, and peace that surpasses all understanding.",
    verse_text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    is_featured_today: false,
    title: "The Power of Prayer",
    subtitle: "Discovering the transformative power of prayer",
    author_name: "Kebena SDA Church",
  },
];

export default DailyQuote;