import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AboutSDAPage from './About/AboutSDAPage'
import AboutKebenaPage from './About/AboutKebenaPage'
import PurposeSection from '../components/About/PurposeSection';
import Footer from '../components/Contact/Footer';

const AboutPage = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollWithOffset = () => {
      if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) {
          const header = document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 0;
          const elementTop =
            target.getBoundingClientRect().top + window.pageYOffset;
          const offsetTop = Math.max(elementTop - headerHeight - 16, 0);

          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    scrollWithOffset();
  }, [location]);

  return (
    <main>
      {/* Full About SDA Section */}
      <section id="about-sda">
        <AboutSDAPage showReadMore={false} />
      </section>

      {/* Full About Kebena Section */}
      <section id="about-kebena">
        <AboutKebenaPage showReadMore={false} />
      </section>

      {/* Purpose Section */}
      <PurposeSection />

      {/* Footer */}
      <section id="contact">
        <Footer />
      </section>
    </main>
  );
};

export default AboutPage;
