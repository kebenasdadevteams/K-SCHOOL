import React from 'react';
import './PurposeSection.css';
import { useLanguage } from '../../contexts/LanguageContext';

const purposes = [
  {
    title: "Connect & Fellowship",
    titleAmharic: "ተገናኝቶ መተሳሰብ",
    titleOromo: "Walitti Dhufuu fi Waliigaluu",
    description: "Building a community of believers who support and encourage one another in faith",
    descriptionAmharic: "በእምነት እርስ በርስ የሚደጋገፉ እና የሚያበረታቱ የምዕመናን ማህበረሰብ መገንባት",
    descriptionOromo: "Hawaasa amantootaa amantiidhaan wal jajjabeessanii fi wal deggeranii ijaaruu"
  },
  {
    title: "Learn & Grow",
    titleAmharic: "መማር እና ማደግ",
    titleOromo: "Barachuu fi Guddachuu",
    description: "Providing resources and opportunities for spiritual education and personal growth",
    descriptionAmharic: "ለመንፈሳዊ ትምህርት እና ለግል እድገት ግብዓቶችን እና እድሎችን ማቅረብ",
    descriptionOromo: "Barnoota hafuuraa fi guddinaa dhuunfaatiif qabeenyaa fi carraa kennuu"
  },
  {
    title: "Serve & Share",
    titleAmharic: "ማገልገል እና ማጋራት",
    titleOromo: "Tajaajiluu fi Qooduu",
    description: "Sharing God's love through service to our community and beyond",
    descriptionAmharic: "የእግዚአብሔርን ፍቅር ለማህበረሰባችን እና ከዚያም በላይ በአገልግሎት ማካፈል",
    descriptionOromo: "Jaalala Waaqaa tajaajila hawaasa keenyaa fi isaa alaatiin qooduu"
  },
  {
    title: "Worship & Praise",
    titleAmharic: "አምልኮ እና ምስጋና",
    titleOromo: "Waaqeffannaa fi Galata",
    description: "Creating opportunities to worship God together and celebrate His goodness",
    descriptionAmharic: "እግዚአብሔርን አብረን ለማመልኮት እና መልካሙን ለማክበር እድሎችን መፍጠር",
    descriptionOromo: "Carraa Waaqaaf waliin waaqeffannuu fi gaarummaa isaa kabajuuf uumuu"
  }
];

const PurposeSection = () => {
  const { isAmharic, isOromo } = useLanguage();

  const getTitle = () => {
    if (isOromo) return 'Kaayyoo Marsariitii Kanaa';
    if (isAmharic) return 'የዚህ ድረ-ገጽ አላማ';
    return 'Purpose of This Site';
  };

  const getDescription = () => {
    if (isOromo) return 'Marsariitiin kun akka mana dijitaalaa Mana Amantii SDA Kebenaa tajaajila, hawaasa keenya walitti dhufuuf, odeeffannoo argachuuf fi kaleessa argachuuf qophaa\'ame. Miseensa, daawwataa yookaan waa\'ee amantii keenyaa barachuu barbaaddu yoo taate iyyuu, waltajjiin kun imala hafuuraa keessanitti akka isin gargaaru abdanna.';
    if (isAmharic) return 'ይህ ድረ-ገጽ ለቀበና ሰባተኛ ቀን አድቬንቲስት ቤተ ክርስቲያን እንደ ዲጂታል ቤት ሆኖ ያገለግላል፣ ማህበረሰባችን እንዲገናኝ፣ እንዲያውቅ እና እንዲነሳሳ ተደርጎ የተዘጋጀ ነው። አባል፣ ጎብኝ ወይም ስለ እምነታችን የበለጠ ለማወቅ የሚፈልግ ሰው ቢሆኑም፣ ይህ መድረክ በመንፈሳዊ ጉዞዎ እንዲረዳዎት ተስፋ እናደርጋለን።';
    return 'This website serves as a digital home for Kebena SDA Church, designed to keep our community connected, informed, and inspired. Whether you\'re a member, visitor, or someone seeking to learn more about our faith, we hope this platform helps you on your spiritual journey.';
  };

  return (
    <section className="purpose-section">
      <div className="purpose-container">
        <div className="purpose-header">
          <h2 className="section-title">{getTitle()}</h2>
          <p className="purpose-description">
            {getDescription()}
          </p>
        </div>

        <div className="purpose-grid">
          {purposes.map((purpose, index) => (
            <div key={index} className="purpose-card">
              <div className="purpose-icon-wrapper">
                <svg className="purpose-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {index === 0 && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  )}
                  {index === 1 && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  )}
                  {index === 2 && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  )}
                  {index === 3 && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  )}
                </svg>
              </div>
              <h3 className="purpose-title">{isOromo ? purpose.titleOromo : isAmharic ? purpose.titleAmharic : purpose.title}</h3>
              <p className="purpose-desc">{isOromo ? purpose.descriptionOromo : isAmharic ? purpose.descriptionAmharic : purpose.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;
