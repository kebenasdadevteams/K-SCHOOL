import React from "react";
import { Church, Heart, Star, Target } from "lucide-react";
import { churchInfo } from "../../data/churchInfo";
import "./About.css";
// import { useLanguage } from "../../context/LanguageContext";

const AboutKebenaPage = () => {
  // const {isAmharic, isOromo} = useLanguage()

  const getText = (amharic) => {
    return amharic;

    // Future language switching logic:
    // if (isOromo) return oromo;
    // if (isAmharic) return amharic;
    // return english;
  };
  return (
    <div className="kebena-section">
      <div className="kebena-container">
        {/* Hero */}
        <div className="kebena-hero">
          <h1>{churchInfo.name}</h1>
          <p className="subtitle">
            {getText(
              // "Serving the community since",
              `ከ${churchInfo.history.founded} ጀምሮ ማህበረሰቡን እያገለገልን እንገኛለን`
              // "Tajaajilaa hawaasaa eegalu ",
            )}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mission-vision">
          <div className="mission-card">
            <div className="card-icon">
              <Target />
            </div>
            <h2>
              {getText(
                // "Our Mission",
                "ተልዕኮችን"
                // "Misinoo Keenya"
              )}
            </h2>
            <p>{getText(churchInfo.mission.statement)}</p>
          </div>
          <div className="vision-card">
            <div className="card-icon">
              <Star />
            </div>
            <h2>
              {getText(
                // "Our Vision", // English - commented for future use
                "ራእይ"
                // "Ilaalcha Keenya" // Oromo - commented for future use
              )}
            </h2>
            <p>{getText(churchInfo.mission.vision)}</p>
          </div>
        </div>

        {/* Core Values */}
        <div className="values-section">
          <h2 className="section-title">
            {getText(
              // "Our Core Values",
              "መሠረታዊ እሴቶቻችን"
              // "Qindoomina Keenya"
            )}
          </h2>
          <div className="values-grid">
            {churchInfo.mission.values.map((value, idx) => (
              <div key={idx} className="value-card">
                <div className="value-icon">
                  <Heart />
                </div>
                <h3>{getText(value.title)}</h3>
                <p>{getText(value.description)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="history-section">
          <div className="section-header">
            <div className="section-badge">
              📜{" "}
              {getText(
                // "Our Journey",
                "ጉዞአችን"
                // "Imala Keenya",
              )}
            </div>
            <h2>
              {getText(
                // "Church History",
                "የቤተ ክርስቲያን ታሪክ"
                // "Seenaa Salaata"
              )}
            </h2>
            <p className="history-story">{getText(churchInfo.history.story)}</p>
          </div>

          {/* Timeline */}
          <div className="timeline">
            {churchInfo.history.milestones.map((milestone, idx) => (
              <div
                key={idx}
                className={`timeline-item ${idx % 2 === 0 ? "left" : "right"}`}
              >
                <div className="timeline-content">
                  <div className="year-badge">{milestone.year}</div>
                  <p>{getText(milestone.event)}</p>
                </div>
                <div className="timeline-dot"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Ministries */}
        <div className="ministries-section">
          <h2 className="section-title">
            {getText(
              // "Our Ministries",
              "አገልግሎቶቻችን"
              // "Tajaajilawwan Keenya"
            )}
          </h2>
          <p className="section-subtitle">
            {getText(
              // "We offer various ministries to serve our church family and community",
              "የቤተክርስቲያናችንን ምዕመናንና እና ማህበረሰብ በተለያዩ አገልግሎቶች እናገለግላለን"
              // "Maatii keenya bataskaanichaa fi hawaasa tajaajiluuf tajaajilawwan adda addaa dhiheessina"
            )}
          </p>
          <div className="ministries-grid">
            {churchInfo.ministries.map((ministry, idx) => (
              <div key={idx} className="ministry-card">
                <div className="ministry-icon">
                  <Church />
                </div>
                <h3>{getText(ministry.name)}</h3>
                <p>{getText(ministry.description)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="kebena-cta">
          <h2>
            {getText(
              // "Visit Us This Sabbath",
              "በዚህ ሰንበት ይጎብኙን"
              // "Sanbata kana nu daawwadhaa"
            )}
          </h2>
          <p>
            {getText(
              // "Experience the warmth of Christian fellowship and the joy of worshiping together",
              "የክርስቲያንን ህብረት እና አብሮ የማምለክን ደስታ ይለማመዱ"
              // "Ho'a tokkummaa Kiristaanaa fi gammachuu waliin waaqeffachuu argadhaa"
            )}
          </p>
          <div className="kebena cta-buttons">
            <a
              href="https://maps.app.goo.gl/qmiEk4TAH47FgowZ9"
              target="_blank"
              rel="noopener noreferrer"
              className="primary-btn"
            >
              {getText(
                // "Get Directions",
                "አቅጣጫ ያግኙ"
                // "Karaa gaafadhu"
              )}
            </a>
            <a
              href="tel:+251911234567"
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-btn"
            >
              {getText(
                // "Get Directions",
                "ያግኙን"
                // "Karaa gaafadhu"
              )}
            </a>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutKebenaPage;
