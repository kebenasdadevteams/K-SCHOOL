import React from "react";
import "./Footer.css";
import { churchInfo } from "../../data/churchInfo";
import logo from "../../assets/logo.png";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { isAmharic, isOromo } = useLanguage();

  const social = churchInfo?.contact?.socialMedia || {};

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Map Section */}
        <div className="footer-map-section">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.755734724083!2d38.76194957500702!3d9.008622291061297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85e2f7c8559d%3A0xea54d4cce8d534f1!2sKebena%20SDA%20Church!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kebena SDA Church Location"
              className="footer-map"
            ></iframe>
          </div>
        </div>

        <div className="footer-content">
          {/* Logo and About */}
          <div className="footer-col">
            <div className="footer-logo">
              <img
                src={logo}
                alt="Kebena SDA Church Logo"
                className="footer-logo-img"
              />
              <div>
                <h3 className="footer-title">
                  {isOromo
                    ? "Kebena SDA"
                    : isAmharic
                    ? "ቀበና ሰ/ቀ/አ"
                    : "Kebena SDA"}
                </h3>
              </div>
            </div>
            <p className="footer-desc">
              {isOromo
                ? "Hawaasa amantii, abdii fi jaalala kan Waaqaa fi ollaa keenya tajaajiluuf of kenne."
                : isAmharic
                ? "እግዚአብሔርን እና ጎረቤቶቻችንን ለማገልገል የተሰጠች የእምነት፣ ተስፋ እና ፍቅር ማህበረሰብ።"
                : "A community of faith, hope, and love, dedicated to serving God and our neighbors."}
            </p>
          </div>

          {/* Contact Information */}
          <div className="footer-col">
            <h3 className="footer-heading">
              {isOromo ? "Nu Quunnamaa" : isAmharic ? "ያግኙን" : "Contact Us"}
            </h3>
            <div className="contact-items">
              <div className="contact-item">
                <svg
                  className="contact-icon"
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
                <div>
                  <p>
                    {churchInfo?.contact?.address ||
                      `Kebena SDA Church,
                        Next to Menelik II Hospital,
                        Addis Ababa, Ethiopia`}
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <svg
                  className="contact-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <p>{churchInfo?.contact?.phone || "Phone not available"}</p>
              </div>
              <div className="contact-item">
                <svg
                  className="contact-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p>{churchInfo?.contact?.email || "Email not available"}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">
              {isOromo
                ? "Linkii Saffisaa"
                : isAmharic
                ? "አገናኞች"
                : "Quick Links"}
            </h3>
            <ul className="footer-links">
              <li>
                <a href="#about">
                  {isOromo ? "Waa'ee Keenya" : isAmharic ? "ስለ እኛ" : "About Us"}
                </a>
              </li>
              <li>
                <a href="#programs">
                  {isOromo
                    ? "Sagantaalee Torban"
                    : isAmharic
                    ? "ሳምንታዊ ፕሮግራሞች"
                    : "Weekly Programs"}
                </a>
              </li>
              <li>
                <a href="#contact">
                  {isOromo ? "Quunnamtii" : isAmharic ? "አግኙን" : "Contact"}
                </a>
              </li>
              <li>
                <a href="#donate">
                  {isOromo
                    ? "Sararaan Kenni"
                    : isAmharic
                    ? "በመስመር ላይ ስጡ"
                    : "Give Online"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media, Pastor, Copyright */}
        <div className="footer-bottom">
          <div className="social-links">
            {social?.facebook && (
              <a
                href={social.facebook}
                className="social-icon"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            {social?.twitter && (
              <a
                href={social.twitter}
                className="social-icon"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.94 9.94 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.918 4.918 0 00-8.38 4.482A13.945 13.945 0 011.671 3.15 4.917 4.917 0 003.195 9.723a4.903 4.903 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.918 4.918 0 004.593 3.417A9.867 9.867 0 010 19.54a13.945 13.945 0 007.548 2.212c9.058 0 14.01-7.514 14.01-14.01 0-.213-.004-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
                </svg>
              </a>
            )}
            {social?.youtube && (
              <a
                href={social.youtube}
                className="social-icon"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
            {social?.instagram && (
              <a
                href={social.instagram}
                className="social-icon"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {social?.tiktok && (
              <a
                href={
                  social.tiktok.startsWith("http")
                    ? social.tiktok
                    : `https://tiktok.com/${social.tiktok.replace("@", "")}`
                }
                className="social-icon"
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            )}
          </div>

          {/* Pastor Name */}
          {churchInfo?.pastor?.name && (
            <div className="pastor-name">
              <p>
                {isOromo
                  ? `Paaster: ${churchInfo.pastor.name}`
                  : isAmharic
                  ? `የቤተክርስቲያን ፐስተር: ${churchInfo.pastor.name}`
                  : `Pastor: ${churchInfo.pastor.name}`}
              </p>
            </div>
          )}

          <p className="copyright">
            {isOromo
              ? "© 2025 Mana Amantii SDA Kebena. Mirga hunduu eegameera."
              : isAmharic
              ? "© 2025 ቀበና ሰ/ቀ/አ ቤተ ክርስቲያን። ሁሉም መብቶች የተጠበቁ ናቸው።"
              : "© 2025 Kebena SDA Church. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
