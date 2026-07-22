import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css";
import logo from "../../assets/logo.png";
import { useLanguage } from "../../contexts/LanguageContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { language, setLanguage, isAmharic, isOromo, getLanguageName } =
    useLanguage();
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangDropdown = () => setIsLangDropdownOpen(!isLangDropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Phone number for giving
  const phoneNumber = "+251911123456"; // Replace with actual pastor's phone number

  // Navbar items - always in English
  const navItems = {
    home: "Home",
    about: "About",
    programs: "Programs",
    resources: "Resources",
    contact: "Contact",
    login: "Login",
    give: "Give",
  };

  const languages = [
    // { code: "en", name: "English", nativeName: "English" }, // Hidden for now
    { code: "am", name: "Amharic", nativeName: "አማርኛ" },
    // { code: "or", name: "Oromo", nativeName: "Afaan Oromoo" }, // Hidden for now
  ];

  const getChurchName = () => {
    if (isOromo) return "Mana Amantii SDA Kebena";
    if (isAmharic) return "ቀበና ሰ/ቀ/አ ቤተ ክርስቲያን";
    return "Kebena SDA Church";
  };

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setIsLangDropdownOpen(false);
  };

  // Function to handle Give button click - opens phone dialer
  const handleGiveClick = () => {
    // Open phone dialer
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo-section">
            <img
              src={logo}
              alt="Kebena SDA Church Logo"
              className="logo-image"
            />
            <div className="logo-text">
              <h1 className="church-name">{getChurchName()}</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/" className="nav-link">
              {navItems.home}
            </Link>
            <Link to="/about" className="nav-link">
              {navItems.about}
            </Link>
            <a
              href="#programs"
              className="nav-link"
              onClick={() =>
                location.pathname !== "/" &&
                (window.location.href = "/#programs")
              }
            >
              {navItems.programs}
            </a>
            <Link to="/resources" className="nav-link">
              {navItems.resources}
            </Link>
            <a
              href="#contact"
              className="nav-link"
              onClick={() =>
                location.pathname !== "/" &&
                (window.location.href = "/#contact")
              }
            >
              {navItems.contact}
            </a>

            {/* Language Dropdown */}
            <div className="language-dropdown" ref={dropdownRef}>
              <button
                className="language-toggle"
                onClick={toggleLangDropdown}
                aria-label="Select language"
              >
                {getLanguageName()}
                <svg
                  className={`dropdown-arrow ${
                    isLangDropdownOpen ? "open" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isLangDropdownOpen && (
                <div className="language-dropdown-menu">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`language-option ${
                        language === lang.code ? "active" : ""
                      }`}
                      onClick={() => handleLanguageSelect(lang.code)}
                    >
                      <span className="lang-native">{lang.nativeName}</span>
                      <span className="lang-name">({lang.name})</span>
                      {language === lang.code && (
                        <svg
                          className="check-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="auth-actions">
              <Link to="/login" className="auth-link auth-login">
                {navItems.login}
              </Link>
            </div>

            {/* Give Button - Calls pastor when clicked */}
            <button className="btn-primary" onClick={handleGiveClick}>
              {navItems.give} 📞
            </button>
          </nav>

          {/* Mobile Menu Controls */}
          <div className="mobile-controls">
            <button
              className="language-toggle mobile"
              onClick={toggleLangDropdown}
              aria-label="Select language"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={toggleMenu}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mobile-nav">
            <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>
              {navItems.home}
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={toggleMenu}>
              {navItems.about}
            </Link>
            <a
              href="#programs"
              className="mobile-nav-link"
              onClick={() => {
                toggleMenu();
                location.pathname !== "/" &&
                  (window.location.href = "/#programs");
              }}
            >
              {navItems.programs}
            </a>
            <Link
              to="/resources"
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              {navItems.resources}
            </Link>
            <a
              href="#contact"
              className="mobile-nav-link"
              onClick={() => {
                toggleMenu();
                location.pathname !== "/" &&
                  (window.location.href = "/#contact");
              }}
            >
              {navItems.contact}
            </a>

            {/* Mobile Language Selection */}
            <div className="mobile-lang-select">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`mobile-lang-option ${
                    language === lang.code ? "active" : ""
                  }`}
                  onClick={() => {
                    handleLanguageSelect(lang.code);
                    setIsMenuOpen(false);
                  }}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>

            <Link to="/login" className="mobile-nav-link" onClick={toggleMenu}>
              {navItems.login}
            </Link>
            {/* Mobile Give Button - Calls pastor when clicked */}
            <button
              className="btn-primary mobile-btn"
              onClick={handleGiveClick}
            >
              {navItems.give} 📞
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
