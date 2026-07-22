import React from 'react';
import HeroSlider from '../components/Hero/HeroSlider';
import DailyQuote from '../components/Quotes/DailyQuote';
import AdBanner from '../components/Shared/AdBanner';
import AboutSDA from '../components/About/AboutSDAPage';
import AboutKebena from '../components/About/AboutKebenaPage';
import BookSection from '../components/Books/BookSection';
import WeeklyPrograms from '../components/Programs/WeeklyPrograms';
import PurposeSection from '../components/About/PurposeSection';
import Footer from '../components/Contact/Footer';  

const HomePage = () => {
  return (
    <main>
      {/* Hero Section with Slider */}
      <section id="home">
        <HeroSlider />
      </section>

      {/* Daily Quote Section */}
      <DailyQuote />

      {/* Advertisement/Announcements Section */}
      <AdBanner />

      {/* About SDA Section - Preview */}
      <section id="about">
        <AboutSDA showReadMore={true} />
      </section>

      {/* About Kebena SDA Section - Preview */}
      <AboutKebena showReadMore={true} />

      {/* Book Reading Section - Preview */}
      <section id="reading">
        <BookSection showMoreResources={true} />
      </section>

      {/* Weekly Programs Section */}
      <section id="programs">
        <WeeklyPrograms />
      </section>

      {/* Purpose of Site Section */}
      <PurposeSection />

      {/* Contact/Footer Section */}
      <section id="contact">
        <Footer />
      </section>
    </main>
  );
};

export default HomePage;
