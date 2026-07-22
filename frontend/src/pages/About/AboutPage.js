import React from "react";
import AboutSDA from "../../components/About/AboutSDAPage";
import AboutKebena from "../../components/About/AboutKebenaPage";
import PurposeSection from "../../components/About/PurposeSection";
import Footer from "../../components/Contact/Footer";

const AboutPage = () => {
  return (
    <main>
      {/* Full About SDA Section */}
      <section id="about-sda">
        <AboutSDA showReadMore={false} />
      </section>

      {/* Full About Kebena Section */}
      <section id="about-kebena">
        <AboutKebena showReadMore={false} />
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
