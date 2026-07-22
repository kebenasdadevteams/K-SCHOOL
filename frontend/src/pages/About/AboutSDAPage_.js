import { useState } from "react";
import { sdaBeliefs } from "../../data/churchInfo";
import "./About.css";
import { BookOpen } from "lucide-react";
// import { useLanguage } from "../../context/LanguageContext"; 

const AboutSDAPage = () => {
  // const {isAmharic, isOromo} = useLanguage()
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleCategory = (categoryName) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(
        expandedCategories.filter((name) => name !== categoryName)
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  const getText = (amharic) => {
    return amharic;

    // Future language switching logic:
    // if (isOromo) return oromo;
    // if (isAmharic) return amharic;
    // return english;
  };

  return (
    <section id="about-sda-section" className="about-sda-section">
      <div className="about-sda-container">
        {/* Header */}
        <div className="about-sda-header">
          <div className="about-sda-badge">
            <BookOpen />{" "}
            {getText(
              // "Our Biblical Foundation",
              "መጽሐፍ ቅዱሳዊ መሠረቶቻችን"
              // "Bu'uura Macaafa Qulqulluu Keenya"
            )}
          </div>
          <h1>
            {getText(
              // "Seventh-day Adventist Beliefs",
              "የሰባተኛ ቀን አድቬንቲስት እምነቶች"
              // "Amantaawwan Adventistii Guyyaa Torbaffaa"
            )}
          </h1>
          <p className="about-sda-subtitle">
            {getText(sdaBeliefs.introduction)}
          </p>
        </div>

        {/* Beliefs Categories */}
        <div className="beliefs-list">
          {sdaBeliefs.categories.map((category, idx) => {
            const isExpanded = expandedCategories.includes(category.category);

            return (
              <div key={idx} className="belief-category">
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="category-button"
                >
                  <div className="category-info">
                    <h3>{category.category}</h3>
                    <p>
                      {category.beliefs.length}{" "}
                      {getText(
                        // "Beliefs",
                        "እምነቶች"
                        // "Amantaawwan"
                      )}
                    </p>
                  </div>
                  <span className="expand-icon">{isExpanded ? "−" : "+"}</span>
                </button>

                {isExpanded && (
                  <div className="category-content">
                    {category.beliefs.map((belief) => (
                      <div key={belief.number} className="belief-item">
                        <div className="belief-number">{belief.number}</div>
                        <div className="belief-details">
                          <h4>{getText(belief.title)}</h4>
                          <p>{getText(belief.summary)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h3>
            {getText(
              // "Want to Learn More?"
              "የበለጠ መማር ይፈልጋሉ?"
              // "Caalaatti barachuu feeta?"
            )}
          </h3>
          <p>
            {getText(
              // "These fundamental beliefs represent the core teachings of the Seventh-day Adventist Church. We invite you to study the Bible with us.",
              "እነዚህ መሠረታዊ እምነቶች የሰባተኛ ቀን አድቬንቲስት ቤተክርስቲያን ዋና ዋና ትምህርቶችን ይወክላሉ። መጽሐፍ ቅዱስን ከእኛ ጋር እንዲያጠኑ እንጋብዝዎታለን።"
              // "Amantaawwan bu'uuraa kun barnoota ijoo Bataskaanicha Adventistii Guyyaa Torbaffaa agarsiisu. Macaafa Qulqulluu nu waliin akka qorattu/qorattan (you singular m/f) isin afeerra."
            )}
          </p>
          <div className="sda cta-buttons">
            <a
              href="https://m.egwwritings.org/en/book/14102.9/toc"
              target="_blank" // Optional: Opens the link in a new tab first
              rel="noopener noreferrer" // Recommended for security when using target="_blank"
            >
              <button className="primary-btn">
                {getText(
                  // "Download Full Statement",
                  "ሙሉ መግለጫውን ያግኙ"
                  // "Ibsa Guutuu Buufadhaa"
                )}
              </button>
            </a>
            <a
              href="tel:+251912345678"
              target="_blank" // Optional: Opens the link in a new tab first
              rel="noopener noreferrer" // Recommended for security when using target="_blank"
            >
              <button className="secondary-btn">
                {getText(
                  // "Contact Us for Bible Study",
                  "ለመጽሐፍ ቅዱስ ጥናት ያግኙን"
                  // "Qo'annaa Macaafa Qulqulluutiif Nu Qunnamaa"
                )}
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSDAPage;
