import React, { useState, useEffect } from "react";
import "./HeroSlider.css";
import { useLanguage } from "../../context/LanguageContext";
import kebenaChurch from "../../assets/kebena_church.jpg";
import jesusWalking from "../../assets/jesus_walking.jpg";
import openBible from "../../assets/open_bible.jpg";

const slides = [
  {
    image: kebenaChurch,
    title: {
      en: "Welcome to the Kebena Seventh Day Adventist church, where Christ is Preached",
      am: "እንኳን ወደ ቀበና ሰባተኛ ቀን አድቬንቲስት ቤተክርስቲያን በደህና መጡ",
      or: "Gara Waldaa Adventistii Guyyaa Torbaffaa Qabbannaattiitti Iddo yesus lallabamutti Baga Nagaan Dhuftan",
    },
    subtitle: {
      en: "Come worship with us and experience the kindness and love of God our savior. ",
      am: `"...ነገር ግን የመድኃኒታችን የእግዚአብሔር ቸርነትና ሰውን መውደዱ በተገለጠ ጊዜ፥ እንደ ምሕረቱ መጠን ለአዲስ ልደት 
      በሚሆነው መታጠብና በመንፈስ ቅዱስ በመታደስ አዳነን እንጂ፥ እኛ ስላደረግነው በጽድቅ ስለ ነበረው ሥራ አይደለም፤" ቲቶ 3:4-5`,
      or: "Kottaa nu waliin waaqeffadhaa, jaalalaaf garramummaa waaqayyo fayyisaa keenyaas dhandhamadhaa",
    },
    btnPrimary: { en: "Join Us", am: "ይቀላቀሉን", or: "Nu Daawwadhaa" },
  },
  {
    image: jesusWalking,
    title: {
      en: "Growing Together in Faith",
      am: "በእምነትና በህብረት ማደግ",
      or: "Amantiidhaan Waliin Guddachuu",
    },
    subtitle: {
      en: "A community devoted to God's word",
      am: "ህይወትዎ የሚለወጥበት በተከታታይ የሚማሩት ሲጨርሱም የምስክር ወረቀት የሚቀበሉበት ትምህርት እንደተዘጋጀ ያውቃሉ?",
      or: "Hawaasa Sagalee Waaqaatiif of kenne",
    },
    btnPrimary: { en: "Join Us", am: "ይቀላቀሉን", or: "Nu Daawwadhaa" },
  },
  {
    image: openBible,
    title: {
      en: "Experience God's Love",
      am: "የእግዚአብሔርን ፍቅር ይለማመዱ",
      or: "Jaalala Waaqayyoo Dhandhamadhaa",
    },
    subtitle: {
      en: "Everyone is welcome here",
      am: "ሁሉም እዚህ እንኳን ደህና መጡ",
      or: "Namni hundumtuu asitti Afeeeramaadha",
    },
    btnPrimary: { en: "Join Us", am: "ይቀላቀሉን", or: "Nu Daawwadhaa" },
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === currentSlide ? "active" : ""}`}
        >
          <img
            src={slide.image}
            alt={slide.title[language]}
            className="hero-image"
          />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">{slide.title[language]}</h1>
              <p className="hero-subtitle">{slide.subtitle[language]}</p>
              <div className="hero-buttons">
                <a
                  href="https://t.me/+c0aL2WBX7L5iNWI0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  <button className="btn-hero-primary">
                    {slide.btnPrimary[language]}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="hero-nav-btn hero-prev"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="hero-nav-btn hero-next"
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`hero-dot ${index === currentSlide ? "active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="scroll-indicator">
        <div className="scroll-arrow">↓</div>
        <span>Scroll to explore</span>
      </div>
    </div>
  );
};

export default HeroSlider;
