import "./About.css";
import { sdaBeliefs } from "../../data/churchInfo";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import AboutSDAPage from "../../pages/About/AboutSDAPage";

const AboutSDA = () => {
  const { language, isAmharic, isOromo } = useLanguage();
  const navigate = useNavigate();

  // Helper function to get text in current language
  const getText = (english, amharic, oromo) => {
    if (isOromo) return oromo;
    if (isAmharic) return amharic;
    return english;
  };

  // Complete translated beliefs data
  const translatedBeliefs = [
    {
      number: 1,
      title: "The Holy Scriptures",
      titleAmharic: "መቅደስ ቅዱስ",
      titleOromo: "Kitaaba Qulqulluu",
      summary:
        "The Holy Scriptures, Old and New Testaments, are the written Word of God, given by divine inspiration through holy men of God who spoke and wrote as they were moved by the Holy Spirit.",
      summaryAmharic:
        "መቅደስ ቅዱስ፣ የብሉይ እና የአዲሱ ኪዳን፣ የተጻፈ የአምላክ ቃል ነው፣ በመንፈስ ቅዱስ ተነክተው የተናገሩትና የጻፉት የአምላክ ቅዱሳን ሰዎች በአምላክ ስለ ተፈጥሮ በተሰጠ ራእይ ተሰጥቷል...",
      summaryOromo:
        "Kitaaba Qulqulluu, Qajjablii Durii fi Haaraa, Jecha Waaqayyoo barreeffamaa, kan kenname ifa galuu Waaqayyoofi, namoota qulqulluu Waaqayyoo kan dubbatanii fi barreessan yeroo Afaanii Qulqulluu itti dhiyeessee...",
    },
    {
      number: 2,
      title: "The Trinity",
      titleAmharic: "ሥላሴ",
      titleOromo: "Siree",
      summary:
        "There is one God: Father, Son, and Holy Spirit, a unity of three coeternal Persons. God is immortal, all-powerful, all-knowing, above all, and ever present.",
      summaryAmharic:
        "አንድ አምላክ አለ፡ አብ፣ ወልድ እና መንፈስ ቅዱስ፣ የሦስት ዘላለማዊ ግለሰቦች አንድነት። አምላክ ዘላለማዊ፣ ኃያል፣ ሁሉን ዐዋቂ፣ ከሁሉ በላይ እና በመላ ቦታ የሚገኝ ነው።",
      summaryOromo:
        "Waaqayyo tokko jira: Abbaa, Ilma fi Afaanii Qulqulluu, walitti dhufeenya namoota sadi kan yeroo hunda waliin jiraatan. Waaqayyo kan hin duunee, humna hunda qabu, beekumsa hunda qabu, hunda caalaa fi yeroo hunda teessoo jira.",
    },
    {
      number: 3,
      title: "God the Father",
      titleAmharic: "አብ አምላክ",
      titleOromo: "Waaqayyo Abbaa",
      summary:
        "God the eternal Father is the Creator, Source, Sustainer, and Sovereign of all creation. He is just and holy, merciful and gracious, slow to anger, and abounding in steadfast love and faithfulness.",
      summaryAmharic:
        "ዘላለማዊው አብ አምላክ ፈጣሪ፣ ምንጭ፣ አቆመ ያለ እና የሁሉም ፍጥረት ጌታ ነው። ፍትሃዊ እና ቅዱስ፣ ርኅራኄ እና ጸጋ ያለው፣ ለቁጣ ቀርፋፋ፣ በትዕግስት ፍቅር እና ታማኝነት የበለጸገ ነው።",
      summaryOromo:
        "Waaqayyo Abbaa kan yeroo hunda jiraatu uumaa, kan ka'e, kan qabu fi mootummaa uumamaa hundaati. Sirna qabu fi qulqulluu, rahmataa fi graasii, ariifataa aarii keessatti fi jaalalaa fi amanamaa guddaa qabu.",
    },
    {
      number: 4,
      title: "God the Son",
      titleAmharic: "ወልድ አምላክ",
      titleOromo: "Waaqayyo Ilma",
      summary:
        "God the eternal Son became incarnate in Jesus Christ. Through Him all things were created, the character of God is revealed, the salvation of humanity is accomplished, and the world is judged.",
      summaryAmharic:
        "ዘላለማዊው ወልድ አምላክ በኢየሱስ ክርስቶስ ሥጋ አገኘ። በእርሱ ሁሉም ነገር ተፈጥሯል፣ የአምላክ ባህሪ ተገልጧል፣ የሰብአዊነት መዳን ተፈጽሟል፣ እና ዓለም ተፈርዷል።",
      summaryOromo:
        "Waaqayyo Ilma kan yeroo hunda jiraatu Yesus Kiristos keessatti fakkii qabu ta'e. Isaaniin waan hunda uumame, amala Waaqayyoo ifa galamte, fayyaa namummaa hojjatame, fi addunyaan murtiifatte.",
    },
    {
      number: 5,
      title: "God the Holy Spirit",
      titleAmharic: "መንፈስ ቅዱስ አምላክ",
      titleOromo: "Waaqayyo Afaanii Qulqulluu",
      summary:
        "God the eternal Spirit was active with the Father and the Son in Creation, incarnation, and redemption. He is the one who inspired the writers of Scripture.",
      summaryAmharic:
        "ዘላለማዊው መንፈስ ቅዱስ ከአብ እና ከወልድ ጋር በፍጥረት፣ በሥጋ መምጣት እና በቤዛ ሥራ ተግባራዊ ነበር። እርሱ የመጽሐፍ ቅዱስ ጸሐፍትን ያነቃቃ ነው።",
      summaryOromo:
        "Waaqayyo Afaanii kan yeroo hunda jiraatu hojii qabu Abbaa fi Ilma waliin Uumaa, Fakkii qabu, fi Bittaa keessatti. Inni barreessitoota Kitaaba Qulqulluu dhiyeessee.",
    },
    {
      number: 6,
      title: "Salvation",
      titleAmharic: "መዳን",
      titleOromo: "Fayyaa",
      summary:
        "In infinite love and mercy God made Christ, who knew no sin, to be sin for us, so that in Him we might be made the righteousness of God.",
      summaryAmharic:
        "በማያልቅ ፍቅር እና ርኅራኄ አምላክ ኃጢአት የማያውቀውን ክርስቶስ ለእኛ ኃጢአት አደረገው፣ በእርሱ ውስጥ የአምላክ ጽድቅ እንድንሆን ነው።",
      summaryOromo:
        "Jaalalaa fi rahmataa hin dhumneen Waaqayyo Kiristos, kan dhalaa hin beekne, dhalaa nuuf taasise, akka Isa keessatti nuti sirna Waaqayyoo ta'anii.",
    },
  ];

  // Use our translated beliefs instead of the data file
  const beliefs = translatedBeliefs;

  // Multilingual content
  const content = {
    badge: getText("📖 Our Faith", "📖 እምነታችን", "📖 Iimaana Keenya"),
    title: getText(
      "About Seventh-day Adventists",
      "ስለ ሰባተኛ ቀን አድቬንቲስቶች",
      "Waa'ee Saba SDA"
    ),
    subtitle: getText(
      "A worldwide Christian church committed to helping people understand the Bible to find freedom, healing, and hope in Jesus.",
      "አለም አቀፍ ክርስቲያን ቤተክርስቲያን ሰዎች መጽሐፍ ቅዱስን እንዲረዱ ነፃነት፣ ፈውስ እና ተስፋ በኢየሱስ ውስጥ እንዲገኝ በመርዳት ላይ ትገኛለች።",
      "Manaa Kiristaanaa addunyaa waan guddaa kan namoota Kitaaba Qulqulluu hubachuuf, bilisummaa, fayyaa fi tumsa Yesus keessatti argachuuf kennite."
    ),
    foundationTitle: getText("Our Foundation", "መሠረታችን", "Hundee Keenya"),
    foundationText1: getText(
      "The Seventh-day Adventist Church is a Protestant Christian denomination distinguished by its observance of Saturday as the Sabbath and its emphasis on the imminent Second Coming of Jesus Christ.",
      "የሰባተኛ ቀን አድቬንቲስት ቤተክርስቲያን ቅዱስ ቀን በሰንበት እንደምትጠብቅ እና በኢየሱስ ክርስቶስ መልክተኛ መምጣት ላይ ትፅዕን በምትል ፕሮቴስታንት ክርስቲያን ነች።",
      "Manaa SDA kan Protestantii Kiristaanaa ta'ee, Sanbata guyyaa Samaaniitiin kabajuufi Deebi'i Yesus dhihoo ta'ee irratti dhiibbaa kennituudhaan mul'attu."
    ),
    foundationText2: getText(
      "We are a movement of more than 22 million people across the globe who are discovering joy and transformation in Jesus.",
      "ከ22 ሚሊዮን በላይ ሰዎች በሙሉ ዓለም ውስጥ ደስታ እና ለውጥ በኢየሱስ ውስጥ የሚያገኙ እንቅስቃሴ ነን።",
      "Nama miliyoona 22 ol kan addunyaa hunda keessatti gammadaafi jijjiirama Yesus keessatti argatanii jiranu."
    ),
    beliefsTitle: getText(
      "Fundamental Beliefs",
      "መሠረታዊ እምነቶች",
      "Amantiiwwan Muraasa"
    ),
    missionTitle: getText("Our Mission", "ተልዕኮችን", "Misiinii Keenya"),
    missionText: getText(
      "To uplift Jesus Christ, preach the gospel, and make disciples who will reflect Christ’s character in all aspects of life.",
      "የኢየሱስ ክርስቶስ ደቀ መዛሙርት እንዲሆኑ እና ለሁሉም ሰው የዘላለም ወንጌል እንዲሰብኩ የሚያደርጉ ወዳጃዊ ምስክሮች እንዲሆኑ ለማድረግ።",
      "Hirmaatota Yesus Kiristos kan dammaqinaa jaalalaa ta'anii fi namoota hundaaf goodaa kan hafa oduu gaarii dhaamsu ta'anii uumuuf."
    ),
    impactTitle: getText(
      "Worldwide Impact",
      "ዓለም አቀፍ ተጽዕኖ",
      "Dhiibbaa Addunyaa"
    ),
    ctaText: getText(
      "Discover all 28 fundamental beliefs that guide our faith and practice",
      "እምነታችንን እና ተግባራችንን የሚመሩትን ሁሉንም 28 መሠረታዊ እምነቶች ይወቁ",
      "Amantiiwwan muraasa 28 guutu iimaanaa fi hojii keenya qajeelchan hunda qorannaa"
    ),
    readMore: getText(
      "Read More About Our Beliefs",
      "ስለ እምነቶቻችን ተጨማሪ አንብብ",
      "Waa'ee Amantiiwwan Keenya Dabalataa Dubbisii"
    ),
    stats: {
      members: getText(
        "Members Worldwide",
        "ዓለም አቀፍ አባላት",
        "Miseensota Addunyaa"
      ),
      countries: getText(
        "Countries & Territories",
        "ሀገሮች እና ግዛቶች",
        "Birootaa fi Naannoo"
      ),
      years: getText("Years of Ministry", "የአገልግሎት ዓመታት", "Waggaa Ministeeraa"),
      beliefs: getText(
        "Fundamental Beliefs",
        "መሠረታዊ እምነቶች",
        "Amantiiwwan Muraasa"
      ),
      categories: getText(
        "Doctrine Categories",
        "የትምህርት ምድቦች",
        "Gareewwan Amantii"
      ),
      bibleBased: getText(
        "Bible-Based",
        "በመጽሐፍ ቅዱስ ላይ የተመሠረተ",
        "Kitaaba Qulqulluu Irratti Hundaa'e"
      ),
    },
  };

  // Get belief text in current language
  const getBeliefText = (belief) => {
    const title = getText(belief.title, belief.titleAmharic, belief.titleOromo);

    const summary = getText(
      belief.summary,
      belief.summaryAmharic,
      belief.summaryOromo
    );

    return { title, summary };
  };

  const handleClick = () => {
    navigate('/about/#about-sda');
  }

  return (
    <section id="about-sda" className="about-sda">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="badge">{content.badge}</div>
          <h2>{content.title}</h2>
          <p className="section-subtitle">{content.subtitle}</p>
        </div>

        <div className="about-grid">
          <div className="about-main">
            {/* Foundation Card */}
            <div className="intro-card">
              <h3>{content.foundationTitle}</h3>
              <p>{content.foundationText1}</p>
              <p>{content.foundationText2}</p>
            </div>

            {/* Beliefs Section */}
            <div className="beliefs-section">
              <h3>{content.beliefsTitle}</h3>
              <div className="belief-grid">
                {beliefs.map((belief) => {
                  const beliefText = getBeliefText(belief);
                  return (
                    <div key={belief.number} className="belief-card">
                      <div className="belief-number">{belief.number}</div>
                      <h4>{beliefText.title}</h4>
                      <p>
                        {beliefText.summary.substring(
                          0,
                          isAmharic ? 100 : isOromo ? 120 : 150
                        )}
                        ...
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="about-sidebar">
            <div className="highlight-card">
              <h4>{content.missionTitle}</h4>
              <p>{content.missionText}</p>
            </div>

            <div className="stats-card">
              <h4>{content.impactTitle}</h4>
              <div className="stat-item">
                <span className="stat-number">22M+</span>
                <span className="stat-label">{content.stats.members}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">{content.stats.countries}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">160+</span>
                <span className="stat-label">{content.stats.years}</span>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="beliefs-stats">
              <div className="stat-item">
                <div className="stat-number">28</div>
                <div className="stat-label">{content.stats.beliefs}</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">6</div>
                <div className="stat-label">{content.stats.categories}</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">{content.stats.bibleBased}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta">
          <p className="cta-text">{content.ctaText}</p>
          <button className="read-more-btn" onClick={handleClick}>
            {content.readMore}
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSDAPage;
