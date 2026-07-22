import React from "react";
import "./WeeklyPrograms.css";
import { weeklyPrograms } from "../../data/programsData";
import { useLanguage } from "../../contexts/LanguageContext";

const WeeklyPrograms = () => {
  const { isAmharic, isOromo } = useLanguage();

  const getTitle = () => {
    if (isOromo) return "Sagantaalee Torban Keenya";
    if (isAmharic) return "ሳምንታዊ ፕሮግራሞቻችን";
    return "Our Weekly Programs";
  };

  const getSubtitle = () => {
    if (isOromo)
      return "Waaqeffannaa, waliigaltee fi guddinaa hafuuraatiif torban guutuu nu waliin ta'aa";
    if (isAmharic) return "ለአምልኮ፣ ለመተሳሰብ እና ለመንፈሳዊ እድገት በየሳምንቱ ይቀላቀሉን";
    return "Join us throughout the week for worship, fellowship, and spiritual growth";
  };

  return (
    <section className="programs-section">
      <div className="programs-container">
        {/* Header */}
        <div className="programs-header">
          <svg
            className="programs-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="section-title">{getTitle()}</h2>
          <p className="programs-subtitle">{getSubtitle()}</p>
        </div>

        {/* Programs Grid */}
        <div className="programs-grid">
          {(weeklyPrograms || []).map((daySchedule, index) => (
            <div key={index} className="program-card">
              <div className="program-day-header">
                <h3 className="program-day">
                  {isOromo
                    ? daySchedule.dayOromo
                    : isAmharic
                    ? daySchedule.dayAmharic
                    : daySchedule.day}
                </h3>
              </div>

              <div className="program-items">
                {(daySchedule.programs || []).map((program, pIndex) => (
                  <div key={pIndex} className="program-item">
                    <h4 className="program-name">
                      {isOromo
                        ? program.nameOromo
                        : isAmharic
                        ? program.nameAmharic
                        : program.name}
                    </h4>

                    <div className="program-time">
                      <svg
                        className="time-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{program.time}</span>
                    </div>

                    <p className="program-desc">{program.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyPrograms;
